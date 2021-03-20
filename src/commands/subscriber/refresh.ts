import { cli } from 'cli-ux'
import debugFn from 'debug'
import { size } from 'lodash'
import { Command } from '../../lib/command'
import { saveSubscribers } from '../../lib/session'

const debug = debugFn(`subscriber`)

export default class SubscriberRefresh extends Command {
  static description = `refresh available subscribers`

  async run(): Promise<void> {
    cli.action.start(`Retrieving authorized subscribers`)
    const subscribers = await this.relay.subscribers()
    debug(subscribers)
    cli.action.stop()

    saveSubscribers(subscribers)

    cli.styledHeader(`${size(subscribers)} Subscribers Refreshed`)
  }
}
