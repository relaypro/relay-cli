// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command'
import { subscriber, workflowFlags, timerFlags } from '../../../lib/flags'

import { createTimerWorkflow } from '../../../lib/workflow'

// eslint-disable-next-line quotes
import debugFn = require('debug')

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
    const { flags, raw } = await this.parse(TimerWorkflowCommand)

    try {

      const workflow = await createTimerWorkflow(flags, raw)

      await this.saveWorkflow(flags[`subscriber_id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
