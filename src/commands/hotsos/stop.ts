// Copyright © 2023 Relay Inc.

import { Command } from '../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../lib/flags'

const debug = debugFn(`hotsos:stop`)

export default class HotSOSStopCommand extends Command {
  static description = `Stop a running HotSOS poller task`
  static strict = false

  static flags = {
    ...flags.subscriber
  }

  static args = [
    {
      name: `name`,
      required: true,
      description: `Task name`,
      default: `hotsos_poller`
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(HotSOSStopCommand)
    const subscriberId = flags[`subscriber-id`]
    const name = argv[0] as string

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