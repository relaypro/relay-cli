// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import { Command } from '../../../lib/command'
// eslint-disable-next-line quotes
import debugFn = require('debug')

import * as flags from '../../../lib/flags'
import { createArgs, createTask } from '../../../lib/tasks'

const debug = debugFn(`alice:webhook:start`)

export default class AliceWebhookStartCommand extends Command {
  static description = `Start an Alice webhook with the given configuration`
  // static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.aliceStartFlags
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(AliceWebhookStartCommand)
    const subscriberId = flags[`subscriber-id`]

    debug(flags)

    flags.config = fs.readFileSync(flags.config,{ encoding: `utf8`, flag: `r` }).toString()
    const config = JSON.parse(flags.config)

    const args = await createArgs(config, flags)

    const newTask = {
      ...flags,
      type: `alice_webhook`,
      [`assign-to`]: config.assign_to,
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