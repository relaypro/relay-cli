// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { workflowFlags, timerFlags } from '../../../lib/flags'

import { createTimerWorkflow } from '../../../lib/workflow'

// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`workflow:create:timer`)

export class TimerWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered immediately or with a repeating rule`

  static strict = false

  static flags = {
    ...workflowFlags,
    ...timerFlags,
  }

  async run(): Promise<void> {
    const { flags, raw } = await this.parse(TimerWorkflowCommand)

    try {

      const workflow = createTimerWorkflow(flags, raw)

      await this.saveWorkflow(workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
