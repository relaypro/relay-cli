// Copyright © 2022 Relay Inc.

import { CliUx } from '@oclif/core'
import { Command } from '../lib/command'
// import { string } from '../lib/flags'
import { ROOT_DOMAIN, vars } from '../lib/vars'

type EnvResult = {
  env: string,
  api: string,
  auth: string,
  auth_cli_id: string,
  auth_sdk_id: string,
}

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

  async run(): Promise<EnvResult> {
    const result = {
      env: vars.rawEnv,
      api: vars.host,
      auth: vars.authHost,
      auth_cli_id: vars.authCliId,
      auth_sdk_id: vars.authSdkId,
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
