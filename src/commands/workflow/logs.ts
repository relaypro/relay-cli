// Copyright © 2022 Relay Inc.

import { pipeline } from 'stream'
import { DateTime } from 'luxon'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'
import { WorkflowEventQuery } from '../../lib/api.js'
import { jsonStreamParser, Log } from '../../lib/ndjson.js'

import debugFn from 'debug'
const debug = debugFn(`workflow:logs`)

type Formatter = (log: Log) => string

const formatLevel = (log: Log): `I`|`E`|`U` => {
  if (log.level === `error`) {
    return `E`
  } else if (log.level === `info`) {
    return `I`
  } else {
    return `U`
  }
}

const formatWorkflowId = (log: Log) => {
  if (log.context.workflow_id) {
    return `[${log.context.workflow_id.slice(0, 9)}...${log.context.workflow_id.slice(-5)}]`
  } else {
    return ``
  }
}

const formatTimestamp = (log: Log) => DateTime.fromISO(log.timestamp).toFormat(`LL-dd HH:mm:ss.SSS`)

const defaultFormat: Formatter = (log: Log) => `${formatTimestamp(log)} ${formatLevel(log)} ${formatWorkflowId(log)} ${log.message}`
defaultFormat
export default class WorkflowLogs extends Command {
  static description = `Display workflow realtime logs`

  static hidden = false

  static flags = {
    ...flags.subscriber,
    [`workflow-id`]: flags.string({
      char: `w`,
      description: `workflow id`,
      required: false,
      hidden: false,
      multiple: false,
      env: `RELAY_WORKFLOW_ID`
    }),
    [`user-id`]: flags.string({
      char: `u`,
      description: `user id`,
      required: false,
      hidden: false,
      multiple: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkflowLogs)
    const subscriberId = flags[`subscriber-id`]
    const workflowId = flags[`workflow-id`]
    const userId = flags[`user-id`]

    debug(`flags`, flags)

    const query: WorkflowEventQuery = {}

    if (workflowId) {
      query.workflow_id = workflowId
    }

    if (userId) {
      query.user_id = userId
    }

    debug(`query`, query)

    try {

      const response = await this.relay.workflowLogs(subscriberId, query)
      this.logToStderr(`Connected to server...`)

      const parser = jsonStreamParser()
      parser.on(`error`, (err) => debug(`error`, err))

      pipeline(
        response,
        process.stdout,
        (err) => {
          if (err) {
            debug(`Error in log stream processing`, err)
          } else {
            debug(`Log stream ended`)
          }
        }
      )
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
