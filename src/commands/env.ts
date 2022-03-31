import { CliUx } from '@oclif/core'
import { Command } from '../lib/command'
import { ROOT_DOMAIN, vars } from '../lib/vars'

export default class Env extends Command {
  static description = `displays the configured environment`
  static examples = [`
Define API and Auth Hosts using shell environment variables:

# Auth
RELAY_ENV=qa                               # default
RELAY_ENV=pro

# API
RELAY_HOST=all-api-qa-ibot.${ROOT_DOMAIN}    # default
RELAY_HOST=all-main-pro-ibot.${ROOT_DOMAIN}
`.trim()]

  async run(): Promise<void> {
    CliUx.ux.styledHeader(`ENVIRONMENT`)
    CliUx.ux.styledObject({
      env: vars.env,
      api: vars.host,
      auth: vars.authHost,
      auth_cli_id: vars.authCliId,
      auth_sdk_id: vars.authSdkId,
    })
    this.log(``)
    CliUx.ux.styledHeader(`USAGE`)
    Env.examples.forEach(e => this.log(e))
  }
}
