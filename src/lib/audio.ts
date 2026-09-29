// Copyright © 2022 Relay Inc.

import { open } from 'fs/promises'

export const REQUIRED_SAMPLE_RATE = 16000
export const REQUIRED_BITS_PER_SAMPLE = 16

const WAVE_FORMAT_PCM = 0x0001
const WAVE_FORMAT_IEEE_FLOAT = 0x0003
const WAVE_FORMAT_EXTENSIBLE = 0xFFFE

export type WavFormat = {
  formatTag: number,
  channels: number,
  sampleRate: number,
  bitsPerSample: number,
}

export class AudioFormatError extends Error {}

const encodingName = (formatTag: number): string => {
  switch (formatTag) {
    case WAVE_FORMAT_PCM: return `PCM`
    case WAVE_FORMAT_IEEE_FLOAT: return `IEEE float`
    default: return `format 0x${formatTag.toString(16).padStart(4, `0`)}`
  }
}

// Reads the RIFF header and `fmt ` chunk of a WAV file without loading the
// audio data. Throws AudioFormatError if the file is not a RIFF/WAVE file.
export const readWavFormat = async (filePath: string): Promise<WavFormat> => {
  const handle = await open(filePath, `r`)
  try {
    const { size } = await handle.stat()
    const read = async (position: number, length: number): Promise<Buffer> => {
      const buffer = Buffer.alloc(length)
      const { bytesRead } = await handle.read(buffer, 0, length, position)
      return buffer.subarray(0, bytesRead)
    }

    const header = await read(0, 12)
    if (header.length < 12 || header.toString(`ascii`, 0, 4) !== `RIFF` || header.toString(`ascii`, 8, 12) !== `WAVE`) {
      throw new AudioFormatError(`not a WAV file (missing RIFF/WAVE header)`)
    }

    let offset = 12
    while (offset + 8 <= size) {
      const chunk = await read(offset, 8)
      const id = chunk.toString(`ascii`, 0, 4)
      const length = chunk.readUInt32LE(4)
      if (id === `fmt `) {
        const fmt = await read(offset + 8, Math.min(length, 40))
        if (fmt.length < 16) {
          throw new AudioFormatError(`WAV file has a truncated fmt chunk`)
        }
        let formatTag = fmt.readUInt16LE(0)
        if (formatTag === WAVE_FORMAT_EXTENSIBLE && fmt.length >= 26) {
          // the first two bytes of the SubFormat GUID carry the actual encoding
          formatTag = fmt.readUInt16LE(24)
        }
        return {
          formatTag,
          channels: fmt.readUInt16LE(2),
          sampleRate: fmt.readUInt32LE(4),
          bitsPerSample: fmt.readUInt16LE(14),
        }
      }
      if (id === `data`) {
        break
      }
      // chunks are word aligned
      offset += 8 + length + (length % 2)
    }
    throw new AudioFormatError(`WAV file has no fmt chunk`)
  } finally {
    await handle.close()
  }
}

// Returns a list of reasons the WAV format cannot be played as custom audio,
// or an empty list if it is supported.
export const customAudioProblems = (format: WavFormat): string[] => {
  const problems: string[] = []
  if (format.formatTag !== WAVE_FORMAT_PCM) {
    problems.push(`encoding is ${encodingName(format.formatTag)} (expected PCM)`)
  }
  if (format.sampleRate !== REQUIRED_SAMPLE_RATE) {
    problems.push(`sample rate is ${format.sampleRate} Hz (expected ${REQUIRED_SAMPLE_RATE} Hz)`)
  }
  if (format.bitsPerSample !== REQUIRED_BITS_PER_SAMPLE) {
    problems.push(`bit depth is ${format.bitsPerSample}-bit (expected ${REQUIRED_BITS_PER_SAMPLE}-bit)`)
  }
  return problems
}

// Throws AudioFormatError describing every problem found if the file is not a
// 16kHz 16-bit PCM WAV file.
export const validateCustomAudio = async (filePath: string): Promise<WavFormat> => {
  const format = await readWavFormat(filePath)
  const problems = customAudioProblems(format)
  if (problems.length > 0) {
    throw new AudioFormatError(`${problems.join(`; `)}`)
  }
  return format
}
