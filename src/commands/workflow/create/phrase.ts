// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { string, subscriber, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'
import { lowerCase, map } from 'lodash'

const debug = debugFn(`workflow:create:phrase`)

type PhraseWorkflow = NewWorkflow & { config: { trigger: { on_phrases: string[] }}}

export class PhraseWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by a spoken phrase`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: true,
      description: `Phrase spoken to Relay Assistant to trigger this workflow`,
      helpValue: `"hello world"`
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(PhraseWorkflowCommand)

    try {

      const workflow: PhraseWorkflow = await createWorkflow(flags, raw) as PhraseWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_phrases = map(flags.trigger, lowerCase)
      } else {
        throw new Error(`Trigger type phrase requires specifying a phrase. For instance '--phrase hello'`)
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
