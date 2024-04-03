// Copyright © 2022 Relay Inc.

import { IntegrationStartFlags, TimerFlags, TimerOptions, TimerWorkflow, WorkflowFlags } from './flags/index.js'
import { NewWorkflow } from './api.js'
import { getTimestampFarFuture, getTimestampNow, resolveDayValues, resolveTimezone, withoutZ } from './datetime.js'
import { ALL } from './constants.js'
import { mergeArgs } from './utils.js'

export const createWorkflow = async (flags: WorkflowFlags): Promise<NewWorkflow> => {

  const args = mergeArgs(flags.arg, flags.boolean, flags.number)

  const workflow: NewWorkflow = {
    name: flags.name,
    options: {
      transient: flags.transient,
      hidden: flags.hidden,
      absorb_triggers: flags.absorb,
    },
    config: {
      trigger: {
        start: {
          workflow: {
            uri: flags.uri,
            args,
          }
        }
      }
    }
  }

  if (flags[`install-all`]) {
    workflow.install_rule = ALL
  } else if (flags[`install-group`]) {
    workflow.install_rule = flags[`install-group`]
  } else {
    workflow.install = flags.install || []
  }

  return workflow
}

export const createTimerWorkflow = async (flags: TimerFlags): Promise<TimerWorkflow> => {
  const workflow: TimerWorkflow = await createWorkflow(flags) as TimerWorkflow

  if (flags.trigger === `immediately`) {
    workflow.config.trigger.on_timer = { start_time: `immediately` }
  } else if (!flags.start) {
    throw new Error(`Trigger type timer with repeating rule requires specifying a start time. For instance '--start ${getTimestampNow()}'`)
  } else {
    const options: TimerOptions = {}
    options.start_time = withoutZ(flags.start)

    if (flags.timezone) {
      options.timezone = resolveTimezone(flags.timezone)
    }

    if (flags.trigger === `schedule`) {
      // schedule... set count to 1
      if (flags.until !== undefined || flags.count !== undefined) {
        throw new Error(`Trigger type schedule runs once in the future and cannot define "count" or "until" values`)
      }
      options.count = 1
    } else {
      // repeat
      if (flags.until && flags.count !== undefined) {
        throw new Error(`Trigger type timer with repeating rule cannot define both a "count" and "until" value`)
      } else if (flags.until === undefined && flags.count === undefined) {
        throw new Error(`Trigger type timer with repeating rule must define one of "count" or "until" value`)
      }

      if (flags.frequency) {
        options.frequency = flags.frequency
      }

      if (flags.interval !== undefined) {
        options.interval = flags.interval
      }

      if (flags.count !== undefined) {
        options.count = flags.count
      } else {
        options.until = getTimestampFarFuture()
      }

      if (flags.until) {
        options.until = withoutZ(flags.until)
      }

      if (flags.day) {
        options.byweekday = resolveDayValues(flags.day)
      }
    }

    workflow.config.trigger.on_timer = options
  }
  return workflow
}

export const createTicketingWorkflow = async (flags: IntegrationStartFlags, wf_source: string, wf_args: Record<string, unknown>): Promise<NewWorkflow> => {
  const workflow: NewWorkflow = {
    name: flags.name,
    options: {
      transient: false,
      hidden: false,
      absorb_triggers: undefined,
    },
    config: {
      trigger: {
        start: {
          workflow: {
            uri: `relay-local://capsule`,
            args: {
              source: wf_source,
              name: flags.name,
              args: JSON.stringify(wf_args)
            }
          }
        }
      }
    }
  }
  if (flags[`install-all`]) {
    workflow.install_rule = ALL
  } else if (flags[`install-group`]) {
    workflow.install_rule = flags[`install-group`]
  } else {
    workflow.install = flags.install || []
  }

  return workflow
}
