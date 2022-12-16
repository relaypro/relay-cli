// Copyright © 2022 Relay Inc.

// import { CliUx } from '@oclif/core'
// import split from 'split2'

import { Command } from '../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { DateTime } from 'luxon'

import * as flags from '../../lib/flags'
import { WorkflowEventQuery } from '../../lib/api'
import { pipeline, /*Transform*/ } from 'stream'
import { jsonStreamParser, Log } from '../../lib/ndjson'

const debug = debugFn(`workflow:logs`)

// type Filter = (log: Log) => boolean
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const defaultFilter: Filter = (_log: Log) => true
const defaultFormat: Formatter = (log: Log) => `${formatTimestamp(log)} ${formatLevel(log)} ${formatWorkflowId(log)} ${log.message}`
defaultFormat
export default class WorkflowLogs extends Command {
  static description = `Display workflow realtime logs`

  static hidden = true

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
    [`quiet`]: flags.boolean({
      char: `q`,
      description: `hide the "connected" message`,
      required: false,
      hidden: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkflowLogs)
    const subscriberId = flags[`subscriber-id`]
    const workflowId = flags[`workflow-id`]
    const userId = flags[`user-id`]
    const quiet = flags[`quiet`]

    debug(`flags`, flags)

    const query: WorkflowEventQuery = {}

    if (workflowId) {
      query.workflow_id = workflowId
    }

    if (userId) {
      query.user_id = userId
    }

    debug(`query`, query)

    // const logTransform = new Transform({
    //   transform: (log: Log, _encoding, callback) => {
    //     debug(`log`, log)
    //     if (log && defaultFilter(log)) {
    //       callback(null, defaultFormat(log))
    //     } else {
    //       callback(null, ``)
    //     }
    //   }
    // })

    try {

      const response = await this.relay.workflowLogs(subscriberId, query)

      const parser = jsonStreamParser()
      parser.on(`error`, (err) => debug(`error`, err))

      if (!quiet) {
        process.stdout.write("Connected to server...\n")
      }

      pipeline(
        response,
        // jsonStreamParser(),
        // logTransform,
        process.stdout,
        (err) => {
          if (err) {
            debug(`Error in log stream processing`, err)
          } else {
            debug(`Log stream ended`)
          }
        }
      )

      // await CliUx.ux.anykey()

      // this.exit()
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}

/*
      response
        .pipe(split((line: string) => {
          debug(`line`, line)
          try {
            if (line) {
              return JSON.parse(line)
            }
          } catch (err) {
            debug(`parse error`, err)
          }
        }))
        .on(`data`, (log: Log) => {
          debug(`data log`, log)
          // if (log && defaultFilter(log)) {
          // this.log(defaultFormat(log))
          // } else {
          // debug(`filtered data log`)
          // }
        })
        .on(`error`, err => {
          debug(err)
          this.log(`Error in log stream processing`, err)
        })
*/
