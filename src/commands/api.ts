// Copyright © 2022 Relay Inc.

import { Args } from '@oclif/core'
import { Command } from '../lib/command.js'
import * as flags from '../lib/flags/index.js'

import debugFn from 'debug'
import { toLower } from 'lodash-es'

const debug = debugFn(`api`)

type HttpMethod = `get`|`post`|`put`|`delete`

export class ApiCommand extends Command {

  static hidden = true

  static description = `Makes an authenticated HTTP request to the Relay API and prints the response.`

  static flags = {
    ...flags.subscriber,
    ...flags.apiFlags,
  }

  static args = {
    endpoint: Args.string({
      name: `endpoint`,
      required: true,
      description: `endpoint argument is the path of a Relay API endpoint`,
    })
  }

  async run(): Promise<void> {
    const { flags, args } = await  this.parse(ApiCommand)
    const subscriberId = flags[`subscriber-id`]

    const method = toLower(flags.method) as HttpMethod

    debug(`run`, flags)
    const response = await this.relay.api(args.endpoint, method, subscriberId)

    this.log(JSON.stringify(response.body, null, 2))
  }
}
