import cli from 'cli-ux'

import { Command } from '../../lib/command'
import isEmpty from 'lodash/isEmpty'

import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`audio`)

export default class AudioList extends Command {
  static description = `List custom audio`

  static flags = {
    ...flags.subscriber,
    ...cli.table.flags(),
  }

  async run(): Promise<void> {
    const { flags } = this.parse(AudioList)

    try {
      const audioFiles = await this.relay.listAudio(flags[`subscriber-id`])

      debug(audioFiles)

      if (!isEmpty(audioFiles)) {
        cli.styledHeader(`Uploaded Audio Files`)
        cli.table(audioFiles, {
          id: {},
          short_name: {},
          audio_format: {},
        }, {
          printLine: this.log,
          ...flags,
        })
      } else {
        this.log(`No Custom Audio Files have been uploaded yet; use \`relay audio:create --help\` to get started`)
      }

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
