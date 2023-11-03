// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import * as flags from '../../lib/flags'
import { taskStartArgs, ScheduleArgs, createScheduleArgs  } from '../../lib/args'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { createScheduledTask } from '../../lib/tasks'

import { Command } from '../../lib/command'

const debug = debugFn(`tasks:schedule`)

export default class TasksScheduleCommand extends Command {

  static description = `Schedule a task with the given configuration`
  static strict = false
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Optional tag to tie to your task`
    }),
    frequency: flags.string({
      char: `f`,
      required: false,
      multiple: false,
      options: [`monthly`, `weekly`, `daily`, `hourly`, `minutely`],
      description: `Repeat frequency`,
    }),
    count: flags.integer({
      char: `c`,
      required: false,
      multiple: false,
      description: `Number of times to repeat`,
      dependsOn: [`frequency`],
      exclusive: [`until`]
    }),
    until: flags.string({
      char: `u`,
      required: false,
      multiple: false,
      description: `Until timstamp`,
      dependsOn: [`frequency`],
      exclusive: [`count`]
    })
  }

  static args = [
    ...taskStartArgs,
    {
      name: `start`,
      required: true,
      description: `Start time in ISO format in specified timezone`
    },
    {
      name: `timezone`,
      required: true,
      options: [
        `America/Anchorage`,
        `America/Chicago`,
        `America/Denver`,
        `America/Los_Angeles`,
        `America/New_York`,
        `America/Phoenix`,
        `Pacific/Honolulu`
      ],
      description: `Timezone of start time`
    }
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TasksScheduleCommand)
    const subscriberId = flags[`subscriber-id`]
    const scheduledArgs: ScheduleArgs = createScheduleArgs(argv)

    let encoded_string = scheduledArgs.args as string
    if (encoded_string.charAt(0) == `@`) {

      const stats = fs.statSync(encoded_string.substring(1, encoded_string.length))
      const fileSizeInMegabytes = stats.size / (1024*1024)
      if (fileSizeInMegabytes > 10) {
        this.error(`args file is too large`)
      }

      encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: `utf8`, flag: `r` }).toString()
    }

    const args = JSON.parse(encoded_string)
    args.tags = [scheduledArgs.type, ...(flags.tag ?? [])]
    scheduledArgs.args = args

    try {
      const task = await createScheduledTask(flags, scheduledArgs)
      const success = await this.relay.scheduleTask(subscriberId, task)

      if (success) {
        this.log(`Successfully scheduled task`)
      } else {
        this.log(`Could not schedule task`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
