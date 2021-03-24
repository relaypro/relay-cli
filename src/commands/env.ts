import { cli } from 'cli-ux'
import { Command } from '../lib/command'
import { vars } from '../lib/vars'

export default class Env extends Command {
  static description = `displays the configured environment`
  static examples = [`
Define API and Auth Hosts using shell environment variables:

# Auth
RELAY_ENV=qa                              # default
RELAY_ENV=pro

# API
RELAY_HOST=all-api-qa-ibot.nocell.io      # default
RELAY_HOST=all-api-pro-ibot.nocell.io
`.trim()]

  async run(): Promise<void> {
    cli.styledHeader(`ENVIRONMENT`)
    cli.styledObject({
      env: vars.env,
      api: vars.host,
      auth: vars.authHost,
      authId: vars.authId,
    })
    cli.log(``)
    cli.styledHeader(`USAGE`)
    Env.examples.forEach(e => cli.log(e))
  }
}
