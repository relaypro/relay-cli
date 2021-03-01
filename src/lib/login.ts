import * as Config from '@oclif/config'
import cli from 'cli-ux'
import HTTP from 'http-call'
import encode from 'form-urlencoded'

import { APIClient, APIError } from './api-client'

import { vars } from './vars'
import deps from './deps'

const debug = require('debug')('relay-cli-command')

export namespace Login {
  export interface Options {
    method?: `interactive`,
    mfa?: string,
  }
}

interface ConfigEntry {
  username: string
  access_token: string
  refresh_token: string
}

interface Map {
  [ k: string ]: string
}

const createAuthorization = (id: string, secret: string) => {
  const auth = (Buffer.from(`${id}:${secret}`)).toString(`base64`)
  return `Basic ${auth}`
}

export class Login {

  constructor(private readonly config: Config.IConfig, private readonly relay: APIClient) {}

  async login(opts: Login.Options = {}): Promise<void> {
    debug(this.config)
    debug(opts)
    let loggedIn = false
    try {
      setTimeout(() => {
        if (!loggedIn) cli.error(`timed out`)
      }, 1000 * 60 * 10).unref()

      if (process.env.RELAY_API_KEY) cli.error(`Cannot log in with RELAY_API_KEY set`)

      const tokens: any = deps.config.get(`tokens`)
      const previousUsername = tokens && tokens[vars.apiHost] && tokens[vars.apiHost].username
      try {
        if (previousUsername) await this.relay.logout()
      } catch(err) {
        cli.warn(err)
      }
      let auth = await this.interactive()
      let subscriberId = await this.fetchSubscriberId(auth.access_token)

      if (subscriberId) {
        await this.saveToken(auth)
        await this.saveSubscriberId(subscriberId)
      } else {
        throw new Error(`Failed to discover subscriber id`)
      }
    } catch(err) {
      throw new APIError(err)
    } finally {
      loggedIn = true
    }
  }

  async logout() {
    deps.config.delete(`tokens`)
    deps.config.delete(`subscriberId`)
  }

  async refresh() {
    const auth = await this.refreshOAuthToken()
    await this.saveToken(auth)
  }

  private async interactive(login?: string): Promise<ConfigEntry> {
    cli.log('Enter your login credentials\n')
    login = await cli.prompt(`Email`, { default: login })
    const password = await cli.prompt(`Password`, { type: `hide` })
    let auth
    try {
      auth = await this.createOAuthToken(login!, password)
    } catch(err) {
      if (err.body.error === `mfa_required`) {
        const mfa = await cli.prompt(`Two-factor code`, { type: `mask` })
        auth = await this.createOAuthToken(login!, password, { mfa })
      } else if (err.body.error === `invalid_grant`) {
        throw new Error(err.body.error_description)
      } else {
        throw err
      }
    }
    this.relay.auth = auth.access_token
    return auth
  }

  private async createOAuthToken(username: string, password: string, opts: { mfa?: string } = {}): Promise<ConfigEntry> {
    const body: Map = {
      grant_type: `password`,
      client_id: `VH9364WE`,
      username,
      password,
      scope: `openid profile`,
    }

    if (opts.mfa) {
      body.mfa_code = opts.mfa
    }

    let headers: Map = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
      authorization: createAuthorization(vars.authId, vars.authSecret),
    }

    const options = { headers, body: encode(body) }

    debug(`createOAuthToken`, options)

    const { body: auth } = await HTTP.post<any>(`${vars.authUrl}/oauth2/token`, options)

    return {
      access_token: auth.access_token,
      username: username,
      refresh_token: auth.refresh_token,
    }
  }

  private async refreshOAuthToken() {
    const tokens: any = deps.config.get(`tokens`)
    const refreshToken = tokens?.[vars.apiHost]?.refresh_token
    const username = tokens?.[vars.apiHost]?.username

    if (!refreshToken) {
      throw new Error(`no refresh token to refresh`)
    }

    const body: Record<string, string> = {
      grant_type: `refresh_token`,
      refresh_token: refreshToken,
    }

    let headers: Map = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
      authorization: createAuthorization(vars.authId, vars.authSecret),
    }

    const options = { headers, body: encode(body) }

    debug(`refreshOAuthToken`, options)

    const { body: auth } = await HTTP.post<any>(`${vars.authUrl}/oauth2/token`, options)

    return {
      access_token: auth.access_token,
      username: username,
      refresh_token: auth.refresh_token,
    }
  }

  private async saveToken(entry: ConfigEntry) {
    const tokens: any = deps.config.get(`tokens`) || {}
    tokens[vars.apiHost] = entry
    deps.config.set(`tokens`, tokens)
  }

  private async saveSubscriberId(id: string) {
    const existingId: string = deps.config.get(`subscriberId`) as string
    if (existingId) {
      cli.log(`Subscriber ID change: ${existingId} => ${id}`)
    }
    deps.config.set(`subscriberId`, id)
  }

  private async fetchSubscriberId(token: string): Promise<string|undefined> {
    const options = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const { body: result} = await HTTP.get<Record<string, string>>(`${vars.authUrl}/oauth2/validate`, options)
    return result.service_line_id
  }
}
