import { cli } from 'cli-ux'
import { Command } from '../../lib/command'

import { getDefaultSubscriber } from '../../lib/session'



export default class SubscriberGet extends Command {
  static description = `show default subscriber`

  async run(): Promise<void> {
    const subscriber = getDefaultSubscriber()
    cli.styledHeader(`Default Subscriber`)
    cli.styledObject(subscriber, [`id`, `name`])
  }
}
