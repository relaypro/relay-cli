// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import * as flags from '../../lib/flags'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import { createTask } from '../../lib/tasks'

import { Command } from '../../lib/command'
import { StartArgs, createStartArgs, taskStartArgs } from '../../lib/args'

const debug = debugFn(`tasks:start`)

export default class TasksStartCommand extends Command {

  static description = `Start a task with the given configuration`
  static strict = false
  static hidden = true

  static flags = {
    ...flags.subscriber,
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Optional tag to tie to your task`
    })
  }

  static args = [
    ...taskStartArgs
  ]

  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TasksStartCommand)
    const subscriberId = flags[`subscriber-id`]
    const startArgs: StartArgs =  createStartArgs(argv)

    let encoded_string = startArgs.args as string
    if (encoded_string.charAt(0) == `@`) {

      const stats = fs.statSync(encoded_string.substring(1, encoded_string.length))
      const fileSizeInMegabytes = stats.size / (1024*1024)
      if (fileSizeInMegabytes > 10) {
        this.error(`args file is too large`)
      }

      encoded_string = fs.readFileSync(encoded_string.substring(1, encoded_string.length),{ encoding: `utf8`, flag: `r` }).toString()
    }

    const args = JSON.parse(encoded_string)
    args.tags = [startArgs.type, ...(flags.tag ?? [])]
    startArgs.args = args

    try {
      const task = await createTask(startArgs)
      const success = await this.relay.startTask(subscriberId, task)

      if (success) {
        this.log(`Successfully started task`)
      } else {
        this.log(`Could not start task`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}

