// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { createTagContent } from '../../lib/tag'

const debug = debugFn(`tag`)

export class TagCreateCommand extends Command {

  static description = `Creates a tag configuration.`

  static flags = {
    ...flags.subscriber,
    ...flags.tagFlags,
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(TagCreateCommand)
    const subscriberId = flags[`subscriber-id`]

    const tagContent = createTagContent(flags, raw)

    debug(`tagContent`, tagContent)

    const response = await this.relay.createNfcTag(subscriberId, tagContent)

    debug(`response`, response)
  }
}
