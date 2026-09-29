import { mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export type WavOptions = {
  formatTag?: number,
  channels?: number,
  sampleRate?: number,
  bitsPerSample?: number,
  extensibleSubFormat?: number,
  leadingChunk?: { id: string, length: number },
}

const chunk = (id: string, body: Buffer): Buffer => {
  const header = Buffer.alloc(8)
  header.write(id, 0, `ascii`)
  header.writeUInt32LE(body.length, 4)
  const pad = body.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)
  return Buffer.concat([header, body, pad])
}

export const wav = (options: WavOptions = {}): Buffer => {
  const { formatTag = 1, channels = 1, sampleRate = 16000, bitsPerSample = 16, extensibleSubFormat, leadingChunk } = options
  const fmt = Buffer.alloc(extensibleSubFormat === undefined ? 16 : 40)
  fmt.writeUInt16LE(extensibleSubFormat === undefined ? formatTag : 0xFFFE, 0)
  fmt.writeUInt16LE(channels, 2)
  fmt.writeUInt32LE(sampleRate, 4)
  fmt.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 8)
  fmt.writeUInt16LE(channels * bitsPerSample / 8, 12)
  fmt.writeUInt16LE(bitsPerSample, 14)
  if (extensibleSubFormat !== undefined) {
    fmt.writeUInt16LE(22, 16)
    fmt.writeUInt16LE(bitsPerSample, 18)
    fmt.writeUInt16LE(extensibleSubFormat, 24)
  }
  const chunks = [
    ...(leadingChunk ? [chunk(leadingChunk.id, Buffer.alloc(leadingChunk.length))] : []),
    chunk(`fmt `, fmt),
    chunk(`data`, Buffer.alloc(channels * bitsPerSample / 8 * 4)),
  ]
  const body = Buffer.concat([Buffer.from(`WAVE`, `ascii`), ...chunks])
  return chunk(`RIFF`, body)
}

const dir = mkdtempSync(join(tmpdir(), `relay-audio-`))

export const writeTempFile = (name: string, contents: Buffer): string => {
  const path = join(dir, name)
  writeFileSync(path, contents)
  return path
}
