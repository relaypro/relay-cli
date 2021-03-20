import { cli } from 'cli-ux'
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
    const { flags } = this.parse(DevicesCommand)

    debug(`run`)
    const devices = await this.relay.devices(flags[`subscriber-id`])
    const mappedDevices = map(devices, d => ({ id: d }))

    cli.table(mappedDevices, {
      id: {
        header: `ID`
      },
    }, {
      printLine: this.log,
    })
  }
}
