// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'

import * as flags from '../../lib/flags'
import { AudioFormatError, REQUIRED_BITS_PER_SAMPLE, REQUIRED_SAMPLE_RATE, validateCustomAudio } from '../../lib/audio'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`audio`)

export default class AudioCreate extends Command {
  static description = `Create custom audio

The file must be a ${REQUIRED_SAMPLE_RATE / 1000}kHz ${REQUIRED_BITS_PER_SAMPLE}-bit PCM WAV file. The format is checked before uploading.`

  static flags = {
    ...flags.subscriber,
    name: flags.string({
      char: `n`,
      multiple: false,
      required: true,
      description: `friendly name of the file to be used in workflows as \`relay-static://friendly-name-here\``
    }),
    file: flags.string({
      char: `f`,
      multiple: false,
      required: true,
      description: `file path to be uploaded`
    }),
    [`skip-validation`]: flags.boolean({
      default: false,
      description: `upload the file without checking that it is a ${REQUIRED_SAMPLE_RATE / 1000}kHz ${REQUIRED_BITS_PER_SAMPLE}-bit PCM WAV file`
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AudioCreate)

    try {
      const subscriberId = flags[`subscriber-id`]
      const name = flags[`name`]
      const file = flags[`file`]

      if (!flags[`skip-validation`]) {
        try {
          const format = await validateCustomAudio(file)
          debug(`format =>`, format)
        } catch (err) {
          if (err instanceof AudioFormatError) {
            this.error(`${file} is not a supported audio file: ${err.message}.
Custom audio must be a ${REQUIRED_SAMPLE_RATE / 1000}kHz ${REQUIRED_BITS_PER_SAMPLE}-bit PCM WAV file. For example, convert it with:
  ffmpeg -i ${file} -ar ${REQUIRED_SAMPLE_RATE} -acodec pcm_s${REQUIRED_BITS_PER_SAMPLE}le converted.wav
Use --skip-validation to upload it anyway.`)
          }
          throw err
        }
      }

      debug(`Uploading file`, { subscriberId, name, file })

      const id = await this.relay.uploadAudio(subscriberId, name, file)

      if (id !== undefined) {
        debug(`id =>`, id)
        this.log(`Uploaded '${name}' with ID '${id}'`)
        this.log(`  - Use this file in your workflows as 'relay-static://${name}'`)
        this.log(`  - This file can be deleted using the following command:`)
        this.log(`    relay audio:delete -i ${id}`)
      } else {
        const errorMsg = `Failed to upload ${name} file ${file}`
        this.error(errorMsg)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
