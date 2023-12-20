// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'

import { getDefaultSubscriber } from '../../lib/session'



export default class SubscriberGet extends Command {
  static description = `Show default subscriber`

  async run(): Promise<void> {
    const subscriber = getDefaultSubscriber()
    CliUx.ux.styledHeader(`Default Subscriber`)
    CliUx.ux.styledObject(subscriber, [`id`, `name`])
  }
}
