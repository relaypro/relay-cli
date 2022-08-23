// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../lib/flags'
import { CliUx } from '@oclif/core'
import { WorkflowEvent, WorkflowEventQuery, WorkflowEvents } from '../../lib/api'
import { isEmpty } from 'lodash'
import { Result, Ok } from 'ts-results'
// import { CliUx } from '@oclif/core'

const debug = debugFn(`workflow:analytics`)

export default class WorkflowAnalytics extends Command {
  static description = `Display and filter workflow analytics`

  static enableJsonFlag = true

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
    [`workflow-instance-id`]: flags.string({
      char: `i`,
      description: `workflow instance id`,
      required: false,
      hidden: false,
      multiple: false,
    }),
    [`user-id`]: flags.string({
      char: `u`,
      description: `user id`,
      required: false,
      hidden: false,
      multiple: false,
    }),
    [`category`]: flags.string({
      char: `c`,
      description: `analytic category`,
      required: false,
      hidden: false,
      multiple: false,
    }),
    [`type`]: flags.enum({
      char: `t`,
      description: `analytic type`,
      options: [`system`, `user`],
      required: false,
      hidden: false,
      multiple: false,
    }),
    [`parse`]: flags.boolean({
      char: `p`,
      description: `whether to parse/process the analytic content based on the 'content_type'`,
      default: true,
      required: false,
      hidden: false,
    }),
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<WorkflowEvents, Error>> {
    const { flags } = await this.parse(WorkflowAnalytics)
    const subscriberId = flags[`subscriber-id`]
    const workflowId = flags[`workflow-id`]
    const workflowInstanceId = flags[`workflow-instance-id`]
    const userId = flags[`user-id`]
    const category = flags[`category`]
    const type = flags[`type`]
    const parse = flags[`parse`]

    debug(`flags`, flags)

    const query: WorkflowEventQuery = {}

    if (workflowId) {
      query.workflow_id = workflowId
    }

    if (workflowInstanceId) {
      query.workflow_instance_id = workflowInstanceId
    }

    if (userId) {
      query.user_id = userId
    }

    if (category) {
      query.category = category
    }

    if (type) {
      query.source_type = type
    }

    debug(`query`, query)

    let analytics: WorkflowEvents = []

    try {

      analytics = await this.relay.workflowEvents(subscriberId, query)

      if (!this.jsonEnabled()) {
        if (!isEmpty(analytics)) {
          CliUx.ux.log(`=> Showing up to 100 events`)
          CliUx.ux.table(analytics, {
            workflow_id: {
              header: `Workflow ID`,
            },
            source_type: {
              header: `Type`,
            },
            category: {},
            workflow_instance_id: {
              header: `Instance ID`,
            },
            id: {
              header: `Analytic ID`,
              extended: true
            },
            timestamp: {},
            user_id: {
              header: `User ID`,
            },
            content_type: {
              header: `Content Type`,
              extended: true,
            },
            content: {
              get: row => {
                if (parse) {
                  return parseContent(row)
                } else {
                  return row.content
                }
              }
            },
          })
        } else {
          this.log(`No analytic events`)
        }
      }
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

    return Ok(analytics)
  }
}


const parseContent = (row: WorkflowEvent): string => {
  if (row.content_type === `application/json`) {
    return JSON.stringify(JSON.parse(row.content), null, 2)
  } else {
    return row.content
  }
}
