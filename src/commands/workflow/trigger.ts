// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'
import { mergeArgs } from '../../lib/utils.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:trigger`)

export default class Trigger extends Command {
  static hidden = false
  static description = `Trigger a workflow over HTTP`

  static flags = {
    [`workflow-id`]: flags.workflowId,
    [`user-id`]:  flags.string({
      char: `u`,
      multiple: false,
      required: true,
      description: `Target user id on behalf of which to trigger a workflow`,
    }),
    ...flags.subscriber,
    arg: flags.stringValue(),
    boolean: flags.booleanValue(),
    number: flags.numberValue(),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Trigger)
    const args = mergeArgs(flags.arg ?? [], flags.boolean ?? [], flags.number ?? [])
    debug(`triggering with`, args)
    await this.relay.triggerWorkflow(flags[`subscriber-id`], flags[`workflow-id`], flags[`user-id`], args)
    this.log(`Relay CLI trigger submitted`)
  }
}
