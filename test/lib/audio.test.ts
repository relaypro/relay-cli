import { expect } from 'chai'

import { AudioFormatError, customAudioProblems, readWavFormat, validateCustomAudio } from '../../src/lib/audio'
import { wav, writeTempFile } from '../helpers/wav'

const rejection = async (promise: Promise<unknown>): Promise<Error> => {
  try {
    await promise
  } catch (err) {
    return err as Error
  }
  throw new Error(`expected promise to reject`)
}

describe(`lib/audio`, () => {
  describe(`readWavFormat`, () => {
    it(`reads the fmt chunk of a 16kHz 16-bit PCM file`, async () => {
      const file = writeTempFile(`pcm16.wav`, wav())
      expect(await readWavFormat(file)).to.deep.equal({ formatTag: 1, channels: 1, sampleRate: 16000, bitsPerSample: 16 })
    })

    it(`skips chunks that come before fmt, including odd-length ones`, async () => {
      const file = writeTempFile(`list.wav`, wav({ leadingChunk: { id: `LIST`, length: 27 }, sampleRate: 44100 }))
      expect(await readWavFormat(file)).to.include({ sampleRate: 44100, bitsPerSample: 16 })
    })

    it(`resolves the encoding of WAVE_FORMAT_EXTENSIBLE files`, async () => {
      const pcm = writeTempFile(`ext-pcm.wav`, wav({ extensibleSubFormat: 1 }))
      expect(await readWavFormat(pcm)).to.include({ formatTag: 1 })
      const float = writeTempFile(`ext-float.wav`, wav({ extensibleSubFormat: 3, bitsPerSample: 32 }))
      expect(await readWavFormat(float)).to.include({ formatTag: 3 })
    })

    it(`rejects files that are not WAV`, async () => {
      const file = writeTempFile(`song.mp3`, Buffer.from(`ID3\u0004\u0000\u0000\u0000\u0000\u0000\u0000`, `binary`))
      const err = await rejection(readWavFormat(file))
      expect(err).to.be.instanceOf(AudioFormatError)
      expect(err.message).to.contain(`not a WAV file`)
    })

    it(`rejects empty and truncated files`, async () => {
      const empty = writeTempFile(`empty.wav`, Buffer.alloc(0))
      expect(await rejection(readWavFormat(empty))).to.be.instanceOf(AudioFormatError)
      const truncated = writeTempFile(`truncated.wav`, wav().subarray(0, 24))
      expect(await rejection(readWavFormat(truncated))).to.be.instanceOf(AudioFormatError)
    })

    it(`rejects a WAV file whose data chunk comes before any fmt chunk`, async () => {
      const file = writeTempFile(`nofmt.wav`, Buffer.from(`RIFF\u000c\u0000\u0000\u0000WAVEdata\u0000\u0000\u0000\u0000`, `binary`))
      const err = await rejection(readWavFormat(file))
      expect(err).to.be.instanceOf(AudioFormatError)
      expect(err.message).to.contain(`no fmt chunk`)
    })

    it(`surfaces a missing file as a regular error`, async () => {
      const err = await rejection(readWavFormat(`/nonexistent/relay-audio.wav`))
      expect(err).not.to.be.instanceOf(AudioFormatError)
      expect(err.message).to.contain(`ENOENT`)
    })
  })

  describe(`customAudioProblems`, () => {
    it(`accepts 16kHz 16-bit PCM, mono or stereo`, () => {
      expect(customAudioProblems({ formatTag: 1, channels: 1, sampleRate: 16000, bitsPerSample: 16 })).to.deep.equal([])
      expect(customAudioProblems({ formatTag: 1, channels: 2, sampleRate: 16000, bitsPerSample: 16 })).to.deep.equal([])
    })

    it(`reports every mismatch at once`, () => {
      expect(customAudioProblems({ formatTag: 3, channels: 2, sampleRate: 44100, bitsPerSample: 32 })).to.deep.equal([
        `encoding is IEEE float (expected PCM)`,
        `sample rate is 44100 Hz (expected 16000 Hz)`,
        `bit depth is 32-bit (expected 16-bit)`,
      ])
    })

    it(`names unknown encodings by their format tag`, () => {
      expect(customAudioProblems({ formatTag: 0x55, channels: 1, sampleRate: 16000, bitsPerSample: 16 })).to.deep.equal([
        `encoding is format 0x0055 (expected PCM)`,
      ])
    })
  })

  describe(`validateCustomAudio`, () => {
    it(`resolves with the format of a supported file`, async () => {
      const file = writeTempFile(`ok.wav`, wav())
      expect(await validateCustomAudio(file)).to.include({ sampleRate: 16000, bitsPerSample: 16 })
    })

    it(`rejects an 8kHz 8-bit file`, async () => {
      const file = writeTempFile(`pcm8.wav`, wav({ sampleRate: 8000, bitsPerSample: 8 }))
      const err = await rejection(validateCustomAudio(file))
      expect(err).to.be.instanceOf(AudioFormatError)
      expect(err.message).to.equal(`sample rate is 8000 Hz (expected 16000 Hz); bit depth is 8-bit (expected 16-bit)`)
    })
  })
})
