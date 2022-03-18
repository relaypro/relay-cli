import { Command as Base } from '@oclif/command'

import { APIClient } from './api-client'
import deps from './deps'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from './api'
import { printWorkflows } from './utils'
import { cli } from 'cli-ux'
const debug = debugFn(`error`)

export abstract class Command extends Base {

  _relay!: APIClient

  get relay(): APIClient {
    if (this._relay) return this._relay
    this._relay = new deps.APIClient(this.config)
    return this._relay
  }

  async catch(error: unknown): Promise<unknown> {
    debug(error)
    return super.catch(error)
  }

  async finally(possibleError: Error | undefined): Promise<unknown> {
    return super.finally(possibleError)
  }

}

export abstract class CreateCommand extends Command {

  async saveWorkflow(workflow: NewWorkflow, dryRun: boolean): Promise<void> {
    if (!dryRun) {
      debug(workflow)
      const workflows = await this.relay.saveWorkflow(workflow)
      printWorkflows(workflows, { extended: true })
    } else {
      cli.info(`Workflow dry-run:\n${JSON.stringify(workflow, null, 2)}`)
    }
  }
}
