// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { isEmpty } from 'lodash'
import { Result, Err, Ok } from 'ts-results'

import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'
import { printGeofences } from '../../lib/utils'
import { Geofence } from '../../lib/api'

// eslint-disable-next-line quotes
import debugFn = require('debug')




const debug = debugFn(`geofence`)

export default class GeofenceList extends Command {
  static description = `List geofence configurations`

  static hidden = true

  static enableJsonFlag = true

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
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
