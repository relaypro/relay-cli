// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { Command } from '../../lib/command.js'

import { getDefaultSubscriber } from '../../lib/session.js'



export default class SubscriberGet extends Command {
  static description = `show default subscriber`

  async run(): Promise<void> {
    const subscriber = getDefaultSubscriber()
    ux.styledHeader(`Default Subscriber`)
    ux.styledObject(subscriber, [`id`, `name`])
  }
}
