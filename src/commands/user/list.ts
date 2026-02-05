// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../../lib/command'
import * as flags from '../../lib/flags'

import { UserProfile } from '../../lib/api'
import { Ok, Result } from 'ts-results'
import { isEmpty, map, pick } from 'lodash'

export class UserProfileListCommand extends Command {

  static description = `list current user profiles`

  static enableJsonFlag = true

  static hidden = false

  static flags = {
    ...flags.subscriber,
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<Result<UserProfile[], Error>> {
    const { flags } = await  this.parse(UserProfileListCommand)
    const subscriberId = flags[`subscriber-id`]

    const profiles = await this.relay.fetchUserProfiles(subscriberId)
    const mappedProfiles = map(profiles, p => pick(p, [`username`, `user_profile_id`]))

    if (!this.jsonEnabled()) {
      CliUx.ux.styledHeader(`User profiles (Count: ${mappedProfiles.length})`)
      if (!isEmpty(mappedProfiles)) {
        CliUx.ux.table(mappedProfiles, {
          username: {
            header: `User Name`,
          },
          user_profile_id: {
            header: `User ID`,
          },
        }, {
          ...flags,
          sort: `username`,
        })
      }
    }

    return Ok(mappedProfiles)
  }
}
