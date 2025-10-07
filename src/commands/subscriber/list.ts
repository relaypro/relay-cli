// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'

import * as flags from '../../lib/flags'

export default class SubscriberList extends Command {
  static description = `list subscribers`

  static hidden = true

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
    this.error(`Listing subscribers is no longer available`)
  }
}
