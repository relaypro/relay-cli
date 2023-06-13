// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'

import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { SubscriberQuery } from '../../lib/session'

const debug = debugFn(`subscriber`)

export default class SubscriberList extends Command {
  static description = `list subscribers`

  static flags = {
    name: flags.string({
      char: `n`,
      description: `accounnt name`,
      required: false,
      hidden: false,
      multiple: false,
      exclusive: [`email`]
    }),
    email: flags.string({
      char: `e`,
      description: `owner email`,
      required: false,
      hidden: false,
      multiple: false,
      exclusive: [`name`]
    }),

    all: flags.boolean({
      char: `a`,
      description: `retrieve all results`,
      required: false,
      hidden: false,
      default: false,
      allowNo: true,
    }),
    size: flags.integer({
      char: `s`,
      description: `size of the page of results`,
      required: false,
      hidden: false,
      default: 100,
      min: 10,
      max: 1000,
    })
  }


  async run(): Promise<void> {
    const { flags } = await this.parse(SubscriberList)

    const all = flags[`all`]
    const size = flags[`size`]

    const name = flags[`name`]
    const email = flags[`email`]
    const query: SubscriberQuery = {}
    if (name) {
      query.account_name = name
    }
    if (email) {
      query.owner_email = email
    }

    const timeout = setTimeout(() => {
      CliUx.ux.action.start(`Retrieving authorized subscribers`)
    }, 2000)

    try {
      const [subscribers, pagedPath] = await this.relay.subscribers(query, all, size)

      // debug(subscribers)
      debug(pagedPath)

      if (CliUx.ux.action.running) {
        CliUx.ux.action.stop()
      }

      CliUx.ux.table(subscribers, {
        name:{},
        email: {},
        id: {},
      })

      if (pagedPath) {
        this.log(`Not all results were retrieved. Set --all flag to true to fetch complete results.`)
      }
    } catch (err) {
      debug(err)
      this.error(`Failed to retrieve any results`)
    } finally {
      clearTimeout(timeout)
    }
  }
}
