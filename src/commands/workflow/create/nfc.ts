import filter from 'lodash/filter'
import reduce from 'lodash/reduce'

import { CreateCommand } from '../../../lib/command'
import * as Flags from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'
import { parseArg } from '../../../lib/utils'

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
    matcher: Flags.string({
      char: `m`,
      hidden: true,
      required: false,
      multiple: true,
      description: `Arbitrary name/value pair to match against the triggering NFC Tag's content`,
      helpValue: `"category=task"`
    }),
    type: Flags.enum({
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
    const { flags, raw } = await this.parse(NfcWorkflowCommand)
    const type = flags[`type`] as NfcType
    try {

      const workflow: NfcWorkflow = await createWorkflow(flags, raw) as NfcWorkflow

      const onNfc: OnNfc = { type }

      if (flags.category) {
        onNfc.category = flags.category
      }

      if (flags.label) {
        onNfc.label = flags.label
      }

      let matcher = {}

      if (flags.matcher) {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nfcArgFlags = filter(raw, ({ flag }: any) => `matcher` === flag)
        matcher = reduce(nfcArgFlags, (args, flag) => {
          const [, name, value] = parseArg(flag.input)
          return { ...args, [name]: value }
        }, {})
      }

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
