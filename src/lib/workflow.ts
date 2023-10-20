// Copyright © 2022 Relay Inc.

import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
// import last from 'lodash/last'

import type { Interfaces } from '@oclif/core'

import { booleanValue, numberValue, TicketerStartFlags, TimerFlags, TimerOptions, TimerWorkflow, WorkflowFlags } from './flags'
import { parseArg } from './utils'
import { NewWorkflow } from './api'
import { getTimestampFarFuture, getTimestampNow, resolveDayValues, resolveTimezone, withoutZ } from './datetime'
import { ALL } from './constants'

export const parseArgs = async (tokens: Interfaces.ParsingToken[]): Promise<Record<string, never>> => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const normalArgFlags = filter(tokens, ({ flag }: any) => `arg` === flag)
  const normalArgs = reduce(normalArgFlags, (args, flag) => {
    const [, name, value] = parseArg(flag.input)
    return { ...args, [name]: value }
  }, {})

  const booleanParser = booleanValue().parse
  const booleanFlags = filter(tokens, ({ flag }: any) => `boolean` === flag)
  let booleanArgs = {}
  for (const flag of booleanFlags)  {
    const nameValue = await booleanParser(flag.input, null, flag)
    booleanArgs = { ...booleanArgs, ...nameValue }
  }

  const numberParser = numberValue().parse
  const numberFlags = filter(tokens, ({ flag }: any) => `number` === flag)
  let numberArgs = {}
  for (const flag of numberFlags)  {
    const nameValue = await numberParser(flag.input, null, flag)
    numberArgs = { ...numberArgs, ...nameValue }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { ...normalArgs, ...booleanArgs, ...numberArgs }
}

export const createWorkflow = async (flags: WorkflowFlags, tokens: Interfaces.ParsingToken[]): Promise<NewWorkflow> => {

  const args = await parseArgs(tokens)

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

export const createTimerWorkflow = async (flags: TimerFlags, tokens: Interfaces.ParsingToken[]): Promise<TimerWorkflow> => {
  const workflow: TimerWorkflow = await createWorkflow(flags, tokens) as TimerWorkflow

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

export const createTicketingWorkflow = async (flags: TicketerStartFlags, wf_source: string, wf_args: Record<string, unknown>): Promise<NewWorkflow> => {
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
