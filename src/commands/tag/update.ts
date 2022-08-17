// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { createTagContent } from '../../lib/tag'

const debug = debugFn(`tag`)

export class NfcUpdateCommand extends Command {

  static description = `Updates a tag configuration.`

  static flags = {
    ...flags.subscriber,
    [`tag-id`]: flags.string({
      char: `t`,
      required: true,
      multiple: false,
      description: `Tag identifier to update`,
    }),
    ...flags.tagFlags,
  }

  async run(): Promise<void> {
    const { flags, raw } = await  this.parse(NfcUpdateCommand)
    const subscriberId = flags[`subscriber-id`]
    const tagId = flags[`tag-id`]

    const tagContent = createTagContent(flags, raw)

    debug(`tagContent`, tagContent)

    const response = await this.relay.updateNfcTag(subscriberId, tagId, tagContent)

    debug(`response`, response)
  }
}
