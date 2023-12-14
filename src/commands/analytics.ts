// Copyright © 2022 Relay Inc.

import { Command } from '../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../lib/flags'
import { CliUx } from '@oclif/core'
import { WorkflowEventQuery, WorkflowEvents } from '../lib/api'
import { isEmpty } from 'lodash'
import { Result, Ok } from 'ts-results'
import { printAnalytics } from '../lib/utils'

const debug = debugFn(`analytics`)

export default class Analytics extends Command {
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
    [`limit`]: flags.integer({
      char: `l`,
      description: `limit the number of events to retrieve`,
      default: 20,
      required: false,
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
    const { flags, argv } = await this.parse(Analytics)
    const subscriberId = flags[`subscriber-id`]
    const workflowId = flags[`workflow-id`]
    const workflowInstanceId = flags[`workflow-instance-id`]
    const userId = flags[`user-id`]
    const type = flags[`type`]
    const parse = flags[`parse`]
    const limit = flags[`limit`]
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

    if (limit) {
      query.limit = limit
    }
    query.limit = limit
    debug(`query`, query)

    let analytics: WorkflowEvents = []

    try {
      analytics = await this.relay.workflowEvents(subscriberId, query)
      if (isEmpty(analytics)) {
        this.log(`No analytic events found from the provided criteria`)
      } else if (!this.jsonEnabled()) {
        printAnalytics(analytics, flags, parse)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
    return Ok(analytics)
  }
}
