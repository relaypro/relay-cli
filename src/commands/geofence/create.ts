// Copyright © 2022 Relay Inc.

import { Command } from '../../lib/command.js'

import * as flags from '../../lib/flags/index.js'

import debugFn from 'debug'
import { isNumber } from 'lodash-es'

const debug = debugFn(`geofence`)

export default class GeofenceCreate extends Command {
  static description = `Create geofence`

  static hidden = true

  static flags = {
    ...flags.subscriber,
    ...flags.dryRunFlags,
    name: flags.string({
      char: `n`,
      multiple: false,
      required: true,
      description: `friendly name of the geofence`,
    }),
    address: flags.string({
      char: `a`,
      multiple: false,
      required: false,
      description: `street address of the geofence`,
      exclusive: [`longitude`, `latitude`],
    }),
    longitude: flags.coordinate({
      char: `g`,
      description: `longitude coordinate between [-180, 180]`,
      dependsOn: [`latitude`],
    }),
    latitude: flags.coordinate({
      char: `t`,
      description: `latitude coordinate between [-90, 90]`,
      dependsOn: [`longitude`],
    }),
    radius: flags.integer({
      char: `r`,
      multiple: false,
      required: true,
      description: `radius in meters that defines the geofence circle`,
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(GeofenceCreate)

    try {
      const dryRun = flags[`dry-run`]
      const subscriberId = flags[`subscriber-id`]
      const name = flags[`name`]
      const address = flags[`address`]
      const latitude = flags[`latitude`]
      const longitude = flags[`longitude`]
      const radius = flags[`radius`]

      if (address === undefined && latitude === undefined && longitude === undefined) {
        throw new Error(`Must provide an address or latitude and longitude`)
      }

      const payload = { subscriberId, name, address, latitude, longitude }
      debug(`Creating geofence`, payload)
      if (dryRun) {
        this.log(`Geofence dry-run:\n${JSON.stringify(payload, null, 2)}`)
      } else if (address) {
        await this.relay.createGeofenceFromAddress(subscriberId, name, address, radius)
      } else if (isNumber(latitude) && isNumber(longitude)) {
        await this.relay.createGeofenceFromLatLong(subscriberId, name, latitude, longitude, radius)
      } else {
        throw new Error(`Must provide an address or latitude and longitude`)
      }

    } catch (err) {
      debug(err)
      this.safeError(err)
    }
  }
}
