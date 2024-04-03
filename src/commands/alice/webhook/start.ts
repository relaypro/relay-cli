// Copyright © 2023 Relay Inc.

import { Command } from '../../../lib/command.js'
import * as flags from '../../../lib/flags/index.js'
import { createAliceArgs, createTask } from '../../../lib/tasks.js'
import { integrationStartArgs } from '../../../lib/args.js'

import debugFn from 'debug'
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

  static args = {
    ...integrationStartArgs
  }
  async run(): Promise<void> {
    const { flags, args } = await this.parse(AliceWebhookStartCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = args.namespace
    const major = args.major

    const config = JSON.parse(args.config)

    const aliceArgs = await createAliceArgs(config, flags, namespace, major)
    if (flags.tag) {
      aliceArgs.tags.push(...flags.tag)
    }

    const newTask = {
      namespace: namespace,
      type: `alice_webhook`,
      major: major,
      name: flags.name,
      args: aliceArgs
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
