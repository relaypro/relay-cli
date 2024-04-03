// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { subscriber, workflowFlags, timerFlags } from '../../../lib/flags/index.js'

import { createTimerWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:timer`)

export class TimerWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered immediately or with a repeating rule`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    ...timerFlags,
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(TimerWorkflowCommand)

    try {

      const workflow = await createTimerWorkflow(flags)

      await this.saveWorkflow(flags[`subscriber_id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
