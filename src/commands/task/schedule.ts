// Copyright © 2023 Relay Inc.

import * as flags from '../../lib/flags/index.js'
import { taskStartArgs  } from '../../lib/args.js'

import { createScheduledTask } from '../../lib/tasks.js'

import { Command } from '../../lib/command.js'
import { Args } from '@oclif/core'

import debugFn from 'debug'
const debug = debugFn(`tasks:schedule`)

export default class TasksScheduleCommand extends Command {

  static description = `Schedule a task with the given configuration`
  static strict = false

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

  static args = {
    ...taskStartArgs,
    start: Args.string({
      name: `start`,
      required: true,
      description: `Start time in ISO format in specified timezone`
    }),
    timezone: Args.string({
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
    }),
  }

  async run(): Promise<void> {
    const { flags, args: commandArgs } = await this.parse(TasksScheduleCommand)
    const subscriberId = flags[`subscriber-id`]

    const scheduledArgs = JSON.parse(commandArgs.args)
    scheduledArgs.tags = [commandArgs.type, ...(flags.tag ?? [])]
    commandArgs.args = scheduledArgs

    try {
      const task = await createScheduledTask(flags, commandArgs)
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
