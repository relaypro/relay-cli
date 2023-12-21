// Copyright © 2023 Relay Inc.

import { CliUx } from '@oclif/core'

import { Command } from '../../../lib/command'
import * as flags from '../../../lib/flags'
import { printMinors } from '../../../lib/utils'
// eslint-disable-next-line quotes
import debugFn = require('debug')

const debug = debugFn(`task:types:fetch`)

export default class TaskTypesFetchCommand extends Command {
  static description = `Fetch a specific minor`
  static strict = false

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags()
  }

  static args = [
    {
      name: `namespace`,
      required: true,
      description: `Namespace of the task type`,
      options: [`account`, `system`],
      hidden: false
    },
    {
      name: `type`,
      required: true,
      description: `Task type name`,
      hidden: false,
    },
    {
      name: `major`,
      required: true,
      description: `Major version`,
    },
    {
      name: `minor`,
      required: true,
      description: `Minor version. Pass in "latest" to get latest version`
    }
  ]
  async run(): Promise<void> {
    const { flags, argv } = await this.parse(TaskTypesFetchCommand)
    const subscriberId = flags[`subscriber-id`]
    const namespace = argv[0] as string
    const type = argv[1] as string
    const major = argv[2] as string
    const iminor = argv[3] as string

    try {
      const minor = [await this.relay.fetchMinor(subscriberId, namespace, type, major, iminor)]

      debug(`minor`, minor)

      flags.minor === `latest` ? printMinors(minor, flags, type, true, namespace) : printMinors(minor, flags, type, false, namespace)
    } catch (err) {
      debug(err)
      this.safeError(err)
    }

  }
}



