// Copyright © 2022 Relay Inc.

import { Command as Base } from '@oclif/core'

import { APIClient } from './api-client'
import deps from './deps'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { NewWorkflow } from './api'
import { printWorkflows } from './utils'
const debug = debugFn(`error`)

export abstract class Command extends Base {

  _relay!: APIClient

  get relay(): APIClient {
    if (this._relay) return this._relay
    this._relay = new deps.APIClient(this.config)
    return this._relay
  }

  async catch(error: never): Promise<unknown> {
    debug(error)
    return super.catch(error)
  }

  async finally(possibleError: Error | undefined): Promise<unknown> {
    return super.finally(possibleError)
  }

  safeError(err: unknown): Error {
    if (err instanceof Error) {
      if (!this.jsonEnabled()) {
        this.error(err.message)
      }
      return err
    } else if (typeof err === `string`) {
      if (!this.jsonEnabled()) {
        this.error(err)
      }
      return new Error(err)
    } else {
      return new Error(`failed to safely unwrap error`)
    }
  }

}

export abstract class CreateCommand extends Command {

  async saveWorkflow(subscriberId: string, workflow: NewWorkflow, dryRun: boolean): Promise<void> {
    if (!dryRun) {
      debug(workflow)
      const workflows = await this.relay.saveWorkflow(subscriberId, workflow)
      printWorkflows(workflows, { extended: true })
    } else {
      this.log(`Workflow dry-run:\n${JSON.stringify(workflow, null, 2)}`)
    }
  }
}
