// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'

import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'

const debug = debugFn(`audio`)

export default class AudioDelete extends Command {
  static description = `Delete custom audio`

  static flags = {
    ...flags.subscriber,
    id: flags.string({
      char: `i`,
      multiple: false,
      required: true,
      description: `file id to delete`
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AudioDelete)

    try {
      const subscriberId = flags[`subscriber-id`]
      const id = flags[`id`]

      debug(`Deleting file`, { subscriberId, id })

      await this.relay.deleteAudio(subscriberId, id)

      this.log(`Successfully deleted audio with id ${id}`)
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
