import { Command } from '../../../lib/command'
import { workflowFlags, timerFlags } from '../../../lib/flags'

import { createTimerWorkflow, printWorkflows } from '../../../lib/workflow'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow:create:timer`)

export class TimerWorkflowCommand extends Command {

  static description = `Create or update a workflow triggered immediately or with a repeating rule`

  static strict = false

  static flags = {
    ...workflowFlags,
    ...timerFlags,
  }

  async run(): Promise<void> {
    const { flags, argv, raw } = this.parse(TimerWorkflowCommand)

    try {

      const workflow = createTimerWorkflow(flags, argv, raw)

      debug(workflow)

      const workflows = await this.relay.saveWorkflow(workflow)

      printWorkflows(workflows)

    } catch (err) {
      debug(err)
      this.error(err)
    }
  }
}
