// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'
import { size } from 'lodash-es'

import confirm from '@inquirer/confirm'

import { SubscriberQuery, saveDefaultSubscriber } from '../../lib/session.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
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
      exclusive: [`name`, `email`]
    }),
    name: flags.string({
      char: `n`,
      description: `subscriber name`,
      required: false,
      hidden: true,
      multiple: false,
      exclusive: [`subscriber-id`, `email`]
    }),
    email: flags.string({
      char: `e`,
      description: `owner email`,
      required: false,
      hidden: false,
      multiple: false,
      exclusive: [`name`, `subscriber-id`]
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(SubscriberSet)

    const subscriberId = flags[`subscriber-id`]
    const name = flags[`name`]
    const email = flags[`email`]

    const query: SubscriberQuery = {}
    let type
    let value
    if (subscriberId) {
      query.subscriber_id = subscriberId
      type = SubscriberSet.flags[`subscriber-id`].description
      value = subscriberId
    }
    if (name) {
      query.account_name = name
      type = SubscriberSet.flags[`name`].description
      value = name
    }
    if (email) {
      query.owner_email = email
      type = SubscriberSet.flags[`email`].description
      value = email
    }

    const [subscribers] = await this.relay.subscribers(query, false, 10)
    const numResults = size(subscribers)
    if (numResults === 0) {
      this.error(`No results. ${type} "${value}" returned more than one result.`)
    } else if (numResults > 1) {
      this.error(`Please be more specific. ${type} "${value}" returned more than one result.`)
    } else {
      const newSubscriber = subscribers[0]
      if (newSubscriber) {
        debug(`new default subscriber`, newSubscriber)
        this.log(`Changing default subscriber to ${newSubscriber.name} (${newSubscriber.id})`)
        const answer = await confirm({ message: `Are you sure?` })
        if (answer) {
          saveDefaultSubscriber(newSubscriber)
        }
      } else {
        debug(`find resulted in no valid subscriber`)
        this.error(`Failed to find a subscriber`)
      }
    }
  }
}
