// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import debugFn from 'debug'
import { size } from 'lodash'
import { Command } from '../../lib/command'
import { saveSubscribers } from '../../lib/session'

const debug = debugFn(`subscriber`)

export default class SubscriberRefresh extends Command {
  static description = `refresh available subscribers`

  async run(): Promise<void> {
    CliUx.ux.action.start(`Retrieving authorized subscribers`)
    const subscribers = await this.relay.subscribers()
    debug(subscribers)
    CliUx.ux.action.stop()

    saveSubscribers(subscribers)

    CliUx.ux.styledHeader(`${size(subscribers)} Subscribers Refreshed`)
  }
}
