// Copyright © 2023 Relay Inc.

import { Command } from '../../lib/command.js'
import debugFn from 'debug'

import * as flags from '../../lib/flags/index.js'
import { Args } from '@oclif/core'

const debug = debugFn(`hotsos:stop`)

export default class HotSOSStopCommand extends Command {
  static description = `Stop a running HotSOS poller task`
  static strict = false

  static flags = {
    ...flags.subscriber
  }

  static args = {
    name: Args.string({
      name: `name`,
      required: true,
      description: `Task name`,
      default: `hotsos_poller`
    })
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(HotSOSStopCommand)
    const subscriberId = flags[`subscriber-id`]
    const name = args.name

    try {
      const success = await this.relay.sendTaskEvent(subscriberId, `/_hotsos/${name}.done`)
      if (success) {
        this.log(`Successfully stopped task`)
      } else {
        this.log(`Could not stop task`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }


    debug(flags)
  }
}
