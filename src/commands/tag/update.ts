// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { createTagContent } from '../../lib/tag.js'

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
    const { flags } = await  this.parse(NfcUpdateCommand)
    const subscriberId = flags[`subscriber-id`]
    const tagId = flags[`tag-id`]

    const tagContent = createTagContent(flags.type, flags.category, flags.label, flags.arg ?? [])

    debug(`tagContent`, tagContent)

    const response = await this.relay.updateNfcTag(subscriberId, tagId, tagContent)

    debug(`response`, response)
  }
}
