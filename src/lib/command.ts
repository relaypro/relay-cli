import { Command as Base } from '@oclif/command'

import { APIClient } from './api-client'
import deps from './deps'

// eslint-disable-next-line quotes
import debugFn = require('debug')
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
