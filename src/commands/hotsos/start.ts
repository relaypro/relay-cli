// Copyright © 2023 Relay Inc.

import * as fs from 'fs'
import { Command } from '../../lib/command.js'
import debugFn from 'debug'

import * as flags from '../../lib/flags/index.js'
import { createHotSOSArgs, createTask } from '../../lib/tasks.js'
import { integrationStartArgs } from '../../lib/args.js'

const debug = debugFn(`hotsos:start`)

export default class HosSOSStartCommand extends Command {
  static description = `Start a HotSOS poller with the given configuration`
  static strict = false

  static flags = {
    ...flags.subscriber,
    name: flags.string({
      char: `n`,
      required: true,
      multiple: false,
      default: `hotsos_poller`,
      description: `Task name`
    }),
    tag: flags.string({
      required: false,
      multiple: true,
      description: `Tag to tie to poller`
    }),
  }

  static args = {
    ...integrationStartArgs
  }
  async run(): Promise<void> {
    const { flags, argv } = await this.parse(HosSOSStartCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const major = argv[1] as string
    let config = argv[2] as string

    debug(flags)

    config = fs.readFileSync(config,{ encoding: `utf8`, flag: `r` }).toString()
    const encodedConfig = JSON.parse(config)

    const args = await createHotSOSArgs(encodedConfig, flags, namespace, major)
    if (flags.tag) {
      args.tags.push(...flags.tag)
    }

    const newTask = {
      namespace: namespace,
      type: `hotsos_poller`,
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
