// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { parseArgs } from '../../lib/workflow'

const debug = debugFn(`workflow:trigger`)

export default class Trigger extends Command {
  static hidden = false
  static description = `Trigger a workflow over HTTP`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    [`user-id`]:  flags.string({
      char: `u`,
      multiple: true,
      required: true,
      description: `Target user id on behalf of which to trigger a workflow`,
    }),
    ...flags.subscriber,
    arg: flags.string({
      char: `a`,
      multiple: true,
      required: false,
      description: `String name/value pair workflow arg`,
    }),
    boolean: flags.booleanValue(),
    number: flags.numberValue(),
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(Trigger)
    const args = await parseArgs(raw)
    debug(`triggering with`, { flags, args })
    await this.relay.triggerWorkflow(flags[`subscriber-id`], flags[`workflow-id`], flags[`user-id`], args)
    this.log(`Relay CLI trigger submitted`)
  }
}
