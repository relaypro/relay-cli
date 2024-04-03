// Copyright © 2022 Relay Inc.

import { CreateCommand } from '../../../lib/command.js'
import { string, subscriber, workflowFlags } from '../../../lib/flags/index.js'

import { NewWorkflow } from '../../../lib/api.js'
import { createWorkflow } from '../../../lib/workflow.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:create:button`)

type TapType = `action_button_single_tap` | `action_button_double_tap`
type ButtonWorkflow = NewWorkflow & { config: { trigger: { on_button: TapType }}}

const mapTap = (tap: string): TapType => `action_button_${tap}_tap` as TapType

export class ButtonWorkflowCommand extends CreateCommand {

  static description = `Create or update a workflow triggered by button taps`

  static strict = false

  static flags = {
    ...subscriber,
    ...workflowFlags,
    trigger: string({
      required: true,
      multiple: false,
      default: `single`,
      options: [`single`, `double`],
      description: `Number of button taps to trigger this workflow`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(ButtonWorkflowCommand)

    try {

      const workflow: ButtonWorkflow = await createWorkflow(flags) as ButtonWorkflow

      if (flags.trigger) {
        workflow.config.trigger.on_button = mapTap(flags.trigger)
      } else {
        throw new Error(`Trigger type button requires specifying number of taps. For instance '--trigger single'`)
      }

      await this.saveWorkflow(flags[`subscriber-id`], workflow, flags[`dry-run`])

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
