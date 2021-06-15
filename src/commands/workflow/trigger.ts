import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { parseArgs } from '../../lib/workflow'

const debug = debugFn(`workflow:trigger`)

export default class Trigger extends Command {
  static hidden = true
  static description = `Trigger a workflow over HTTP`

  static flags = {
    [`workflow-id`]: flags.workflowId,
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
    const { flags, raw } = this.parse(Trigger)
    const args = parseArgs(raw)
    debug(`triggering with`, { flags, args })
    await this.relay.triggerWorkflow(flags[`subscriber-id`], flags[`workflow-id`], args)
    this.log(`Relay CLI trigger`)
  }
}
