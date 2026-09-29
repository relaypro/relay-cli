import { expect, test } from '@oclif/test'

import { APIClient } from '../../../src/lib/api-client'
import { wav, writeTempFile } from '../../helpers/wav'

const SUBSCRIBER_ID = `423f93b9-439a-4ee7-814d-0c079fc27918`

const supported = writeTempFile(`chime.wav`, wav())
const float32 = writeTempFile(`chime-44k-float.wav`, wav({ formatTag: 3, sampleRate: 44100, bitsPerSample: 32 }))
const notWav = writeTempFile(`chime.mp3`, Buffer.from(`ID3\u0004\u0000\u0000\u0000\u0000\u0000\u0000`, `binary`))

describe(`audio:create`, function () {
  this.timeout(30000)

  let uploaded: string[] = []
  const uploadAudio = async (...args: string[]) => {
    uploaded.push(String(args[2]))
    return `audio-id`
  }
  const create = (file: string, ...extra: string[]) => test
    .do(() => { uploaded = [] })
    .stub(APIClient.prototype, `uploadAudio`, uploadAudio)
    .stdout()
    .stderr()
    .command([`audio:create`, `-s`, SUBSCRIBER_ID, `-n`, `chime`, `-f`, file, ...extra])

  create(supported)
    .it(`uploads a 16kHz 16-bit PCM WAV file`, ctx => {
      expect(uploaded).to.deep.equal([supported])
      expect(ctx.stdout).to.contain(`Uploaded 'chime' with ID 'audio-id'`)
    })

  create(float32)
    .catch(err => {
      expect(err.message).to.contain(`is not a supported audio file`)
      expect(err.message).to.contain(`encoding is IEEE float (expected PCM)`)
      expect(err.message).to.contain(`sample rate is 44100 Hz (expected 16000 Hz)`)
      expect(err.message).to.contain(`bit depth is 32-bit (expected 16-bit)`)
      expect(err.message).to.contain(`--skip-validation`)
    })
    .it(`refuses to upload a 44.1kHz 32-bit float WAV file`, () => {
      expect(uploaded).to.deep.equal([])
    })

  create(notWav)
    .catch(err => {
      expect(err.message).to.contain(`not a WAV file`)
    })
    .it(`refuses to upload a file that is not WAV`, () => {
      expect(uploaded).to.deep.equal([])
    })

  create(float32, `--skip-validation`)
    .it(`uploads an unsupported file when --skip-validation is passed`, () => {
      expect(uploaded).to.deep.equal([float32])
    })
})
