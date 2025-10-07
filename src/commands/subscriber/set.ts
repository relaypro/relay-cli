// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

// eslint-disable-next-line quotes
import debugFn = require('debug')

import { saveDefaultSubscriber } from '../../lib/session'
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
      exclusive: [`name`, `email`],

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
      hidden: true,
      multiple: false,
      exclusive: [`name`, `subscriber-id`],
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(SubscriberSet)

    const subscriberId = flags[`subscriber-id`]
    const name = flags[`name`]
    const email = flags[`email`]

    if (name) {
      this.error(`--${SubscriberSet.flags.name.name}" is not longer supported`)
      return
    }
    if (email) {
      this.error(`--${SubscriberSet.flags.email.name}" is not longer supported`)
      return
    }

    if (subscriberId) {
      debug(`new default subscriber`, subscriberId)
      this.log(`Changing default subscriber to ${subscriberId}`)
      const prompt = new Confirm({
        name: `change`,
        message: `Are you sure?`
      })
      const answer = await prompt.run()
      if (answer) {
        saveDefaultSubscriber({ id: subscriberId })
      }
    }

  }
}
