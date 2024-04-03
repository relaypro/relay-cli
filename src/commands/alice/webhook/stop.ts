// Copyright © 2023 Relay Inc.

import { Command } from '../../../lib/command.js'
import debugFn from 'debug'

import * as flags from '../../../lib/flags/index.js'
import { Args } from '@oclif/core'

const debug = debugFn(`alice:ticketer:stop`)

export default class AliceWebhookStopCommand extends Command {
  static description = `Stop a running Alice webhook task`
  static strict = false

  static flags = {
    ...flags.subscriber
  }

  static args = {
    name: Args.string({
      name: `name`,
      required: true,
      description: `Task name`,
      default: `alice_webhook`
    })
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(AliceWebhookStopCommand)
    const subscriberId = flags[`subscriber-id`]
    const name = args.name

    try {
      const success = await this.relay.sendTaskEvent(subscriberId, `/_alice/${name}.done`)
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
