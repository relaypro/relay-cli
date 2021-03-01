import cli from 'cli-ux'

import { Command } from '../../lib/command'
import { last, isEmpty } from 'lodash'

import { formatWorkflowArgs, formatWorkflowType } from '../../lib/utils'

const debug = require('debug')(`workflow`)

export default class Workflow extends Command {
  static description = 'list workflow configurations'

  static flags = {
    ...cli.table.flags(),
  }

  async run() {
    const { flags } = this.parse(Workflow)

    try {
      const workflows = await this.relay.workflows()

      debug(workflows)

      if (!isEmpty(workflows)) {
        cli.styledHeader(`Installed Workflows`)
        cli.table(workflows, {
          workflow_id: {
            header: `ID`,
            get: row => last(row.workflow_id.split(`_`))
          },
          name: {},
          type: {
            get: formatWorkflowType,
          },
          uri: {
            get: row => row.config.trigger.start.workflow.uri,
            extended: true,
          },
          args: {
            get: formatWorkflowArgs,
            extended: true,
          },
          install: {
            header: `Installed on`,
            get: row => row.install.join(`\n`),
            extended: true
          }
        }, {
          printLine: this.log,
          ...flags,
        })
      } else {
        this.log(`No Workflows have been created yet`)
      }


    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
