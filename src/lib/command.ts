import { Command as Base } from '@oclif/command'

import { APIClient } from './api-client'
import deps from './deps'

const pjson = require('../../package.json')

export abstract class Command extends Base {
  base = `${pjson.name}@${pjson.version}`
  _relay!: APIClient

  get relay(): APIClient {
    if (this._relay) return this._relay
    this._relay = new deps.APIClient(this.config)
    return this._relay
  }
}
