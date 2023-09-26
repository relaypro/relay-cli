import * as fs from 'fs'
import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')
import { createScheduledTask } from '../../lib/tasks'
import { NewScheduledTask } from '../../lib/api'
import { Command } from '../../lib/command'

const debug = debugFn(`tasks:schedule`)

export default class TasksScheduleCommand extends Command {

  static description = `Schedule a task with the given configuration`
  // static hidden = true

  static flags = { // NOTE: how to change ordering of these in help command?
    ...flags.subscriber,
    ...flags.taskStartFlags,
    start: flags.string({
      char: `S`,
      required: true,
      multiple: false,
      description: `Start time in ISO format in specified timezone`
    }),
    timezone: flags.string ({
      char: `T`,
      required: true,
      multiple: false,
      options: [
        `America/Anchorage`,
        `America/Chicago`,
        `America/Denver`,
        `America/Los_Angeles`,
        `America/New_York`,
        `America/Phoenix`,
        `Pacific/Honolulu`
      ]
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

  async run(): Promise<void> {
    const { flags } = await this.parse(TasksScheduleCommand)
    const subscriberId = flags[`subscriber-id`]

    let encoded_string = flags.args
    if (encoded_string.charAt(0) == `@`) {
      encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: `utf8`, flag: `r` }).toString()
    }
    flags.args = JSON.parse(encoded_string)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonObj = (flags.args as any)
    jsonObj.tags = [flags.type]

    if (flags.tag) {
      jsonObj.tags.push(flags.tag)
    }

    flags.args = jsonObj

    try {
      const task: NewScheduledTask = await createScheduledTask(flags) as NewScheduledTask
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

