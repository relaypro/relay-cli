
import { CreateCommand } from '../../../lib/command.js'
import * as Flags from '../../../lib/flags/index.js'

import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'
import { mergeArgs } from '../../../lib/utils.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:nfc`)

type NfcType = `custom`|`user_profile`

type OnNfc = {
  type: NfcType,
  category?: string,
  label?: string,
  // [k: string]: string,
}

type NfcWorkflow = NewWorkflow & { config: { trigger: { on_nfc: OnNfc }}}

export class NfcWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by an NFC tap`

  static strict = false

  static flags = {
    ...Flags.subscriber,
    ...Flags.workflowFlags,
    matcher: Flags.stringValue({
      char: `m`,
      hidden: true,
      required: false,
      multiple: true,
      description: `Arbitrary name/value pair to match against the triggering NFC Tag's content`,
      helpValue: `"category=task"`
    }),
    type: Flags.string({
      char: `t`,
      hidden: true,
      description: `Tag type to match against when tapped`,
      options: [`user_profile`, `custom`],
      default: `custom`,
      multiple: false,
      required: true,
    }),
    category: Flags.string({
      char: `c`,
      description: `Tag category to match against when tapped`,
      multiple: false,
      required: false,
    }),
    label: Flags.string({
      char: `l`,
      description: `Tag label to match against when tapped`,
      multiple: false,
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(NfcWorkflowCommand)
    const type = flags[`type`] as NfcType
    try {

      const workflow: NfcWorkflow = await createWorkflow(flags) as NfcWorkflow

      const onNfc: OnNfc = { type }

      if (flags.category) {
        onNfc.category = flags.category
      }

      if (flags.label) {
        onNfc.label = flags.label
      }

      let matcher = mergeArgs(flags.matcher)

      workflow.config.trigger.on_nfc = {
        ...matcher,
        ...onNfc,
      }

      debug(`nfc workflow => ${JSON.stringify(workflow, null, 2)}`)

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
