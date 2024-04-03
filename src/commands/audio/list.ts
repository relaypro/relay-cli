// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'

import { isEmpty } from 'lodash-es'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'

const debug = debugFn(`audio`)

export default class AudioList extends Command {
  static description = `List custom audio`

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AudioList)

    try {
      const audioFiles = await this.relay.listAudio(flags[`subscriber-id`])

      debug(audioFiles)

      if (!isEmpty(audioFiles)) {
        ux.styledHeader(`Uploaded Audio Files`)
        ux.table(audioFiles, {
          id: {},
          short_name: {},
          audio_format: {},
        }, {
          ...flags,
        })
      } else {
        this.log(`No Custom Audio Files have been uploaded yet; use \`relay audio:create --help\` to get started`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
