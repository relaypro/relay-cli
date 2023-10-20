// Copyright © 2023 Relay Inc.

import { Command } from '../../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../../lib/flags'
import { Result, Ok } from 'ts-results'

const debug = debugFn(`alice:ticketer:stop`)

export default class AliceWebhookStopCommand extends Command {
  static description = `something`

  static enableJsonFlag = true

  static hidden = true

  static flags = {
    ...flags.subscriber,
  }

  async run(): Promise<Result<string, Error>> {
    const { flags } = await this.parse(AliceWebhookStopCommand)
    debug(flags)
    return Ok(`not-implemented`)
  }
}