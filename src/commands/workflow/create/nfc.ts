import filter from 'lodash/filter'
import reduce from 'lodash/reduce'

import { CreateCommand } from '../../../lib/command'
import { string, workflowFlags } from '../../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from '../../../lib/api'
import { createWorkflow } from '../../../lib/workflow'
import { parseArg } from '../../../lib/utils'

const debug = debugFn(`workflow:create:nfc`)

type OnNfc = {
  type: `custom`,
  [k: string]: string,
}

type NfcWorkflow = NewWorkflow & { config: { trigger: { on_nfc: OnNfc }}}

export class NfcWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by a spoken phrase`

  static strict = false

  static flags = {
    ...workflowFlags,
    matcher: string({
      required: true,
      multiple: true,
      description: `String name/value pair to match against the triggering NFC Tag's content (see "relay nfc create --help")`,
      helpValue: `"category=task"`
    }),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(NfcWorkflowCommand)

    try {

      const workflow: NfcWorkflow = createWorkflow(flags, raw) as NfcWorkflow

      // eslint-disable-next-line no-constant-condition
      if (true || flags.trigger) {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nfcArgFlags = filter(raw, ({ flag }: any) => `matcher` === flag)
        const nfcArgs = reduce(nfcArgFlags, (args, flag) => {
          const [, name, value] = parseArg(flag.input)
          return { ...args, [name]: value }
        }, {})

        workflow.config.trigger.on_nfc = {
          type: `custom`,
          ...nfcArgs,
        }
      } else {
        throw new Error(`Trigger type nfc requires specifying at least one name value pair. For instance '--trigger category=task'`)
      }

      debug(`nfc workflow => ${JSON.stringify(workflow, null, 2)}`)

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
