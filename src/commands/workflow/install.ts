// Copyright © 2022 Relay Inc.

import { uniq } from 'lodash'
import { CreateCommand } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { ALL } from '../../lib/constants'
import { Workflow } from '../../lib/api'
import { HTTPError } from 'http-call'

const debug = debugFn(`workflow`)

export class InstallWorkflowCommand extends CreateCommand {

  static description = `Install an existing workflow into one or more devices`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    ...flags.subscriber,
    ...flags.installFlags,
  }

  static args = [
    { // deprecated in favor of explicit flags
      name: `ID`,
      required: false,
      description: `device / user ID to install workflow on`,
      hidden: true,
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(InstallWorkflowCommand)
    const workflowId = flags[`workflow-id`]
    const subscriberId = flags[`subscriber-id`]
    const _install = flags[`install`]
    const hasInstall = (_install && _install.length > 0)

    if (argv.length > 0 && (hasInstall || flags[`install-all`])) {
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
          workflow.install = uniq([...(install ?? []), ...argv])
        } else if (hasInstall) {
          workflow.install = uniq([...(install ?? []), ..._install])
        } else if (flags[`install-all`]) {
          workflow.install_rule = ALL
        } else if (flags[`install-group`]) {
          workflow.install_rule = flags[`install-group`]
        }

        await this.saveWorkflow(workflow, dryRun)

      } else {
        this.log(`Workflow ID does not exist: ${workflowId}`)
      }

    } catch (err) {
      debug(err)
      if (err instanceof HTTPError && err.statusCode === 400 && err.body.error === `invalid_install_user_id`) {
        this.error(`One or more of IDs is not valid`)
      } else {
        this.safeError(err)
      }
    }
  }
}
