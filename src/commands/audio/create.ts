// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'

import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`audio`)

export default class AudioCreate extends Command {
  static description = `Create custom audio`

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
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AudioCreate)

    try {
      const subscriberId = flags[`subscriber-id`]
      const name = flags[`name`]
      const file = flags[`file`]

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
