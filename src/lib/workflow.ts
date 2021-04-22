import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import last from 'lodash/last'

import type { ParsingToken } from '@oclif/parser/lib/parse'

import { booleanValue, numberValue, WorkflowFlags } from './flags'
import { formatWorkflowArgs, formatWorkflowType, parseArg } from './utils'
import { NewWorkflow, Workflow } from './api'
import { cli } from 'cli-ux'

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

export const createWorkflow = (flags: WorkflowFlags, argv: string[], tokens: ParsingToken[]): NewWorkflow => {

  const args = parseArgs(tokens)

  const workflow = {
    name: flags.name,
    options: {
      transient: flags.transient,
      hidden: flags.hidden,
      allow_remote_invoke: flags.http,
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
    install: argv
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
