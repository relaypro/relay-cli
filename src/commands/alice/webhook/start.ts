// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import { Command } from '../../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../../lib/flags'
import { createAliceArgs, createTask } from '../../../lib/tasks'
import { integrationStartArgs } from '../../../lib/args'

const debug = debugFn(`alice:webhook:start`)

export default class AliceWebhookStartCommand extends Command {
  static description = `Start an Alice webhook task with the given configuration`
  static strict = false

  static flags = {
    ...flags.subscriber,
    name: flags.string({
      char: `n`,
      required: true,
      multiple: false,
      default: `alice_webhook`,
      description: `Task name`
    }),
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Tag to tie to webhook`
    }),
  }

  static args = [
    ...integrationStartArgs
  ]
  async run(): Promise<void> {
    const { flags, argv } = await this.parse(AliceWebhookStartCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const major = argv[1] as string
    let config = argv[2] as string

    debug(flags)

    config = fs.readFileSync(config,{ encoding: `utf8`, flag: `r` }).toString()
    const encodedConfig = JSON.parse(config)

    const args = await createAliceArgs(encodedConfig, flags, namespace, major)
    if (flags.tag) {
      args.tags.push(...flags.tag)
    }

    const newTask = {
      namespace: namespace,
      type: `alice_webhook`,
      major: major,
      name: flags.name,
      args
    }

    try {
      const task = await createTask(newTask)
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
