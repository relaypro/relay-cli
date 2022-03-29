import { CliUx } from '@oclif/core'
import { map } from 'lodash'
import { Command } from '../lib/command'
import * as flags from '../lib/flags'

// eslint-disable-next-line quotes
import debugFn = require('debug')

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

    CliUx.ux.table(mappedDevices, {
      id: {
        header: `ID`
      },
    }, {
      printLine: this.log,
    })
  }
}
