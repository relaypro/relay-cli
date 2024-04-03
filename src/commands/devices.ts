// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { map } from 'lodash-es'
import { Command } from '../lib/command.js'
import * as flags from '../lib/flags/index.js'

import debugFn from 'debug'

const debug = debugFn(`devices`)

export class DevicesCommand extends Command {

  static description = `list all device ids`

  static flags = {
    ...flags.subscriber
  }

  async run(): Promise<void> {
    const { flags } = await  this.parse(DevicesCommand)

    debug(`run`)
    const devices = await this.relay.devices(flags[`subscriber-id`])
    const mappedDevices = map(devices, d => ({ id: d }))

    ux.table(mappedDevices, {
      id: {
        header: `ID`
      },
    })
  }
}
