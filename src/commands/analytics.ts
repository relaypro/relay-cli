// Copyright © 2022 Relay Inc.

import { Command } from '../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../lib/flags'
import { CliUx } from '@oclif/core'
import { WorkflowEvent, WorkflowEventQuery, WorkflowEvents } from '../lib/api'
import { isEmpty } from 'lodash'
import { Result, Ok } from 'ts-results'
// import { CliUx } from '@oclif/core'

const debug = debugFn(`analytics`)

export default class WorkflowAnalytics extends Command {
  static description = `Display and filter analytics`
  static strict = false

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

  static args = [
    {
      name: `category`,
      required: false,
      description: `Can be workflow, tasks, or a custom category`,
    }
  ]

  async run(): Promise<Result<WorkflowEvents, Error>> {
    const { flags, argv } = await this.parse(WorkflowAnalytics)
    const subscriberId = flags[`subscriber-id`]
    const workflowId = flags[`workflow-id`]
    const workflowInstanceId = flags[`workflow-instance-id`]
    const userId = flags[`user-id`]
    const type = flags[`type`]
    const parse = flags[`parse`]
    const category = argv[0]

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

    if (type) {
      query.source_type = type
    }

    if (category) {
      query.category = category
    }

    debug(`query`, query)

    let analytics: WorkflowEvents = []

    try {

      analytics = await this.relay.workflowEvents(subscriberId, query)
      if (!this.jsonEnabled()) {
        if (!isEmpty(analytics)) {
          CliUx.ux.log(`=> Showing ${analytics?.length} events`)
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
          CliUx.ux.log(`=> Showing ${analytics?.length} events`)
        } else {
          this.log(`No analytic events found from the provided criteria`)
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
  if (row.content_type === `application/json` || row.content_type == `application/vnd.relay.tasks.parameters.v2+json`) {
    return JSON.stringify(JSON.parse(row.content), null, 2)
  } else {
    return row.content
  }
}
