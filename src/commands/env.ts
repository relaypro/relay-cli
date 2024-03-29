// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../lib/command'
import * as flags from '../lib/flags'
import { ROOT_DOMAIN, vars } from '../lib/vars'
import pickBy from 'lodash/pickBy'
import { startsWith } from 'lodash'

type EnvResult = {
  env: string,
  api: string,
  auth: string,
  auth_cli_id: string,
  auth_sdk_id: string,
}

const PREFIX = `RELAY_`

export default class Env extends Command {
  static enableJsonFlag = true
  static description = `displays the configured environment`
  static examples = [`
Define API and Auth Hosts using shell environment variables:

# Auth
RELAY_ENV=pro                                # default
RELAY_ENV=qa

# API
RELAY_HOST=all-main-pro-ibot.${ROOT_DOMAIN}  # default
RELAY_HOST=all-main-qa-ibot.${ROOT_DOMAIN}
`.trim()]

  static flags = {

    process: flags.boolean({
      char: `P`,
      required: false,
      default: false,
      description: `Include shell process environment variables`
    }),
  }

  async run(): Promise<EnvResult> {
    const { flags } = await this.parse(Env)
    let result: EnvResult = {
      env: vars.rawEnv,
      api: vars.host,
      auth: vars.authHost,
      auth_cli_id: vars.authCliId,
      auth_sdk_id: vars.authSdkId,
    }

    if (flags.process) {
      result = {
        ...result,
        ...pickBy(process.env, (_, v) => startsWith(v, PREFIX)),
      }
    }

    if (!this.jsonEnabled()) {
      CliUx.ux.styledHeader(`ENVIRONMENT`)
      CliUx.ux.styledObject(result)
      this.log(``)
      CliUx.ux.styledHeader(`USAGE`)
      Env.examples.forEach(e => this.log(e))
    }
    return result
  }
}
