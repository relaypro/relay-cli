import { cli } from 'cli-ux'
import { map } from 'lodash'
import { Command } from '../lib/command'

const debug = require('debug')(`devices`)

export class DevicesCommand extends Command {

  static description = `list all device ids`

  async run() {
    const devices = await this.relay.devices()
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
