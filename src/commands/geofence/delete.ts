// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'

import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'

const debug = debugFn(`geofence`)

export default class GeofenceDelete extends Command {
  static description = `Delete geofence`

  static hidden = true

  static flags = {
    ...flags.subscriber,
    id: flags.string({
      char: `i`,
      multiple: false,
      required: true,
      description: `Geofence id to delete`
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(GeofenceDelete)

    try {
      const subscriberId = flags[`subscriber-id`]
      const id = flags[`id`]

      debug(`Deleting geofence`, { subscriberId, id })

      await this.relay.deleteGeofence(subscriberId, id)

      this.log(`Successfully deleted geofence with id ${id}`)
    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
