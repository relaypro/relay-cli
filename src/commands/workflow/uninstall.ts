import { cli } from 'cli-ux'
import { filter, includes, join, uniq } from 'lodash'
import { CreateCommand } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { Workflow } from '../../lib/api'

const debug = debugFn(`workflow`)

export class UninstallWorkflowCommand extends CreateCommand {

  static description = `Uninstall an existing workflow from one or more devices`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
    ...flags.installFlags,
  }

  static args = [
    { // deprecated in favor of explicit flags
      name: `ID`,
      required: false,
      description: `device / user ID to uninstall workflow on`,
      hidden: true,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = this.parse(UninstallWorkflowCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]

    if (argv.length > 0 && (flags.install?.length > 0 || flags[`install-all`])) {
      throw new Error(`command arguments and --install[-all] flags are mutually exclusive`)
    }

    const dryRun = flags[`dry-run`]

    try {
      const _workflow = await this.relay.workflow(subscriberId, workflowId)

      if (_workflow) {
        const { install, install_rule, ..._workflow_ } = _workflow
        const workflow = _workflow_ as Workflow
        debug(`existing install`, { install_rule, install })

        if (argv.length > 0) {
          workflow.install = uniq(filter(install, i => !includes(argv, i)))
        } else if (flags.install?.length > 0) {
          workflow.install = uniq(filter(install, i => !includes(flags.install, i)))
        } else if (flags[`install-all`]) {
          workflow.install = []
        }

        await this.saveWorkflow(workflow, dryRun)

      } else {
        cli.action.stop(`failed`)
        cli.log(`Workflow ID does not exist: ${workflowId}`)
      }
    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
