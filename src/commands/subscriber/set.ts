// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
import { find } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

// eslint-disable-next-line quotes
import debugFn = require('debug')

import { getSubscribers, resolveSubscriber, saveDefaultSubscriber } from '../../lib/session'
import * as flags from '../../lib/flags'


const debug = debugFn(`subscriber`)

export default class SubscriberSet extends Command {
  static description = `set the default subscriber`

  static flags = {
    [`subscriber-id`]: flags.string({
      char: `s`,
      description: `subscriber id`,
      required: false,
      hidden: false,
      multiple: false,
      exclusive: [`name`]
    }),
    name: flags.string({
      char: `n`,
      description: `subscriber name`,
      required: false,
      hidden: true,
      multiple: false,
      exclusive: [`subscriber-id`]
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(SubscriberSet)

    if (flags.name) {
      throw new Error(`name not yet implemented`)
    }

    const subscriberId = flags[`subscriber-id`]

    if (subscriberId) {
      debug(`change to explicit subscriber id => ${flags[`subscriber-id`]}`)
      const subscribers = getSubscribers()
      const newSubscriber = find(subscribers, [`id`, subscriberId])
      if (newSubscriber) {
        debug(`new default subscriber`, newSubscriber)
        this.log(`Changing default subscriber to ${newSubscriber.name} (${newSubscriber.id})`)
        const prompt = new Confirm({
          name: `change`,
          message: `Are you sure?`
        })
        const answer = await prompt.run()
        if (answer) {
          saveDefaultSubscriber(newSubscriber)
        }
      } else {
        debug(`find resulted in no valid subscriber`)
        this.error(`Subscriber ID not found: ${subscriberId}`)
      }
    } else {
      await resolveSubscriber()
    }
  }
}
