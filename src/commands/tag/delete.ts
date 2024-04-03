// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'

import confirm from '@inquirer/confirm'

import debugFn from 'debug'
const debug = debugFn(`tag`)

export class TagDeleteCommand extends Command {

  static description = `Deletes a tag configuration.`

  static flags = {
    ...flags.subscriber,
    // ...flags.dryRunFlags,
    [`tag-id`]: flags.string({
      char: `t`,
      required: true,
      multiple: false,
      description: `Tag identifier to delete`,
    })
  }

  async run(): Promise<void> {
    const { flags } = await  this.parse(TagDeleteCommand)
    const tagId = flags[`tag-id`]
    const subscriberId = flags[`subscriber-id`]

    debug(`flags`, flags)

    try {
      const tag = await this.relay.fetchNfcTag(subscriberId, tagId)

      if (tag) {
        const answer = await confirm({
          message: `Deleting ${tagId}. Are you sure?`
        })

        if (answer) {
          const success = await this.relay.deleteNfcTag(subscriberId, tagId)
          if (success) {
            this.log(`Tag deleted`)
          } else {
            this.log(`Tag NOT deleted`)
          }
        } else {
          this.log(`Tag NOT deleted`)
        }
      } else {
        this.log(`Tag ID does not exist: ${tagId}`)
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
