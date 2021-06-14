import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import last from 'lodash/last'

import type { ParsingToken } from '@oclif/parser/lib/parse'

import { booleanValue, numberValue, TimerFlags, TimerOptions, TimerWorkflow, WorkflowFlags } from './flags'
import { formatWorkflowArgs, formatWorkflowType, parseArg } from './utils'
import { NewWorkflow, Workflow } from './api'
import { cli } from 'cli-ux'
import { getTimestampFromFlag, getTimestampNow } from './datetime'

const parseArgs = (tokens: ParsingToken[]) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const normalArgFlags = filter(tokens, ({ flag }: any) => `arg` === flag)
  const normalArgs = reduce(normalArgFlags, (args, flag) => {
    const [, name, value] = parseArg(flag.input)
    return { ...args, [name]: value }
  }, {})

  const booleanParser = booleanValue().parse
  const booleanFlags = filter(tokens, ({ flag }: any) => `boolean` === flag)
  const booleanArgs = reduce(booleanFlags, (args: Record<string, any>, flag) => {
    const nameValue = booleanParser(flag.input, null)
    return { ...args, ...nameValue }
  }, {})

  const numberParser = numberValue().parse
  const numberFlags = filter(tokens, ({ flag }: any) => `number` === flag)
  const numberArgs = reduce(numberFlags, (args: Record<string, any>, flag) => {
    const nameValue = numberParser(flag.input, null)
    return { ...args, ...nameValue }
  }, {})
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { ...normalArgs, ...booleanArgs, ...numberArgs }
}

export const createWorkflow = (flags: WorkflowFlags, tokens: ParsingToken[]): NewWorkflow => {

  const args = parseArgs(tokens)

  const workflow = {
    name: flags.name,
    options: {
      transient: flags.transient,
      hidden: flags.hidden,
      allow_remote_invoke: flags.http,
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
    },
    install: flags.install
  }

  return workflow
}

export const createTimerWorkflow = (flags: TimerFlags, argv: string[], tokens: ParsingToken[]): TimerWorkflow => {
  const workflow: TimerWorkflow = createWorkflow(flags, argv, tokens) as TimerWorkflow

  if (flags.trigger === `immediately`) {
    workflow.config.trigger.on_timer = { start_time: `immediately` }
  } else if (!flags.start) {
    throw new Error(`Trigger type timer with repeating rule requires specifying a start time. For instance '--start ${getTimestampNow()}'`)
  } else {
    const options: TimerOptions = {}
    options.start_time = getTimestampFromFlag(flags.start, flags.timezone)

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

      if (flags.until) {
        options.until = getTimestampFromFlag(flags.until, flags.timezone)
      }

      if (flags.frequency) {
        options.frequency = flags.frequency
      }

      if (flags.interval !== undefined) {
        options.interval = flags.interval
      }

      if (flags.count !== undefined) {
        options.count = flags.count
      }
    }

    workflow.config.trigger.on_timer = options
  }
  return workflow
}

export const printWorkflows = (workflows: Workflow[]): void => {
  cli.styledHeader(`Installed Workflow`)
  cli.table(workflows, {
    workflow_id: {
      header: `ID`,
      get: row => last(row.workflow_id.split(`_`))
    },
    name: {},
    type: {
      get: formatWorkflowType,
    },
    uri: {
      get: row => row.config.trigger.start.workflow.uri,
    },
    args: {
      get: formatWorkflowArgs,
    },
    install: {
      header: `Installed on`,
      get: row => row.install.join(`\n`),
    }
  })
}
