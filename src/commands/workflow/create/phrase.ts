import { Command } from '../../../lib/command'
import { string, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow, printWorkflows } from '../../../lib/workflow'

const debug = debugFn(`workflow:create:phrase`)

type PhraseWorkflow = NewWorkflow & { config: { trigger: { on_phrase: string }}}

export class PhraseWorkflowCommand extends Command {

  static description = `Create or update a workflow triggered by a spoken phrase`

  static strict = false

  static flags = {
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      description: `Phrase spoken to Relay Assistant to trigger this workflow`,
      helpValue: `"hello world"`
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = this.parse(PhraseWorkflowCommand)

    try {

      const workflow: PhraseWorkflow = createWorkflow(flags, raw) as PhraseWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_phrase = flags.trigger
      } else {
        throw new Error(`Trigger type phrase requires specifying a phrase. For instance '--phrase hello'`)
      }

      debug(workflow)

      const workflows = await this.relay.saveWorkflow(workflow)

      printWorkflows(workflows)

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
