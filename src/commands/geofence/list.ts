// Copyright © 2022 Relay Inc.

import { ux } from '@oclif/core'
import { isEmpty } from 'lodash-es'
import { Result, Err, Ok } from 'ts-results-es'

import { Command } from '../../lib/command.js'
import * as flags from '../../lib/flags/index.js'
import { printGeofences } from '../../lib/utils.js'
import { Geofence } from '../../lib/api.js'

import debugFn from 'debug'
const debug = debugFn(`geofence`)

export default class GeofenceList extends Command {
  static description = `List geofence configurations`

  static hidden = true

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...ux.table.flags(),
  }

  async run(): Promise<Result<Geofence[], Error>> {
    const { flags } = await this.parse(GeofenceList)
    const subscriberId = flags[`subscriber-id`]
    try {
      const geofences = await this.relay.geofences(subscriberId)

      debug(geofences)

      if (!this.jsonEnabled()) {
        if (!isEmpty(geofences)) {
          printGeofences(geofences, flags)
        } else {
          this.log(`No geofences have been created yet`)
        }
      }

      return Ok(geofences)

    } catch (err) {
      debug(err)
      return Err(this.safeError(err))
    }
  }
}
