import * as Config from '@oclif/config'
import cli from 'cli-ux'
import HTTP from 'http-call'
import encode from 'form-urlencoded'
import querystring from 'querystring'
import open from 'open'

import { APIClient, APIError } from './api-client'

import { vars } from './vars'
import deps from './deps'
import color from './color'
import http from 'http'
import { URL } from 'url'
import { isEmpty, map, size } from 'lodash'
import { Socket } from 'net'

const crypto = require(`crypto`)
const { MultiSelect } = require('enquirer')
const debug = require('debug')('login')

export namespace Login {
  export interface Options {
    method?: `interactive`,
    mfa?: string,
  }
}

interface Subscriber {
  id: string,
  email: string,
  name: string,
}

interface ConfigEntry {
  username: string
  access_token: string
  refresh_token: string
}

interface Map {
  [ k: string ]: string
}

const createBasicAuthorization = (id: string, secret: string) => {
  const auth = (Buffer.from(`${id}:${secret}`)).toString(`base64`)
  return `Basic ${auth}`
}

export class Login {

  constructor(private readonly config: Config.IConfig, private readonly relay: APIClient) {}

  async login(opts: Login.Options = {}): Promise<void> {
    // debug(opts)
    let loggedIn = false
    try {
      setTimeout(() => {
        if (!loggedIn) cli.error(`timed out`)
      }, 1000 * 60 * 10).unref()

      if (process.env.RELAY_API_KEY) cli.error(`Cannot log in with RELAY_API_KEY set`)

      const tokens: any = deps.config.get(`session.tokens`)

      const previousUsername = tokens && tokens[vars.apiHost] && tokens[vars.apiHost].username

      try {
        if (previousUsername) {
          cli.warn(`Previously logged in as ${previousUsername}... logging out.`)
          await this.relay.logout()
        }
      } catch(err) {
        cli.warn(err)
      }
      let auth = await this.browser()
      let subscribers = await this.fetchSubscribers(auth.access_token)
      debug(`subscribers`, subscribers)

      if (!isEmpty(subscribers)) {
        this.saveToken(auth)
        this.saveSubscribers(subscribers)
        if (size(subscribers) === 1 && subscribers[0]) {
          this.saveDefaultSubscriber(subscribers[0])
        } else {
          const subscriberPrompt = new MultiSelect({
            name: `subscriber`,
            message: `Pick your default account`,
            limit: 1,
            choices: map(subscribers, value => ({ name: value.name, value }))
          })

          const subscriber = await subscriberPrompt.run()
          this.saveDefaultSubscriber(subscriber)
        }
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
    deps.config.delete(`session`)
  }

  async refresh() {
    const auth = await this.refreshOAuthToken()
    await this.saveToken(auth)
  }

  private async browser(): Promise<ConfigEntry> {
    // set up callback server
    const { url, codeVerifier } = this.createAuthorization()

    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) {
        cli.warn(`Cannot open browser.`)
        cli.warn(`Copy and paste into a browser: ${color.greenBright(cli.url(`Click here to login`, url))}`)
      }
      urlDisplayed = true
    }
    const { codePromise } = await this.startHttpCodeServer()
    // await cli.open(url)
    debug(url)
    cli.log(`Opening browser to login`)
    cli.wait(500)
    const cp = await open(url, { wait: false })
    cp.on(`error`, err => {
      cli.warn(err)
      showUrl()
    })
    cp.on(`close`, code => {
      if (code !== 0) {
        showUrl()
      }
    })
    cli.action.start(`relay: Waiting for login`)
    const code = await codePromise
    debug(`got code ${code}`)
    cli.action.stop(`done`)

    const body = {
      grant_type: `authorization_code`,
      redirect_uri: vars.authRedirectUri,
      client_id: vars.authCodeId,
      code,
      code_verifier: codeVerifier,
    }

    let headers: Map = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
    }

    const tokenOptions = { headers, body: encode(body) }
    // debug(`token request`, tokenOptions)
    const { body: auth } = await HTTP.post<any>(`${vars.authUrl}/oauth2/token`, tokenOptions)

    const validateOptions = { headers: { authorization: `Bearer ${auth.access_token}`}}
    // debug(`validate request`, validateOptions)
    const { body: user } = await HTTP.get<any>(`${vars.authUrl}/oauth2/validate`, validateOptions)

    // if (!auth.refresh_token) {
    //   debug(`no refresh_token`)

    //   const expiresHours = (auth.expires_in||7200)/60/60

    //   cli.log(`Your login session will expire in ${expiresHours} hours.`)
    //   cli.log(`If you sign in again and check "Remember me", your session will not expire`)

    //   const prompt = new Toggle({
    //     message: `Sign in again?`,
    //     enabled: `Yes`,
    //     disabled: `No, expire in ${expiresHours} hours`,
    //   })

    //   if (await prompt.run()) {
    //     return await this.browser()
    //   }
    // }


    return {
      access_token: auth.access_token,
      username: user.email,
      refresh_token: auth.refresh_token,
    }
  }

  private startHttpCodeServer(): Promise<{ codePromise: Promise<string> }> {
    return new Promise((serverResolve, serverReject) => {
      const codePromise: Promise<string> = new Promise((codeResolve, codeReject) => {

        const timeout = setTimeout(() => {
          codeReject(new Error(`timed out waiting for browser login`))
        }, 3 * 60 * 1000) // three minutes

        let socket: Socket
        const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
          clearTimeout(timeout)

          const respond = (statusCode: number, message: string, cb: () => void) => {
            const body = `
              <html>
                <body>
                  <h4>${message}</h4>
                </body>
                <script>
                  window.close()
                </script>
              </html>
            `
            res.writeHead(statusCode, {
              'Content-Length': Buffer.byteLength(body),
              'Content-Type': `text/html`,
            })
            res.flushHeaders()
            res.write(body)
            debug(`http responded`)
            res.end(() => {
              debug(`http ended`)
              // @ts-expect-error
              const serverResponse = socket._httpMessage
              if (serverResponse) {
                if (!serverResponse.headersSent) {
                  serverResponse.setHeader(`connection`, `close`)
                }
              }
              socket.destroy()
              server.close(err => {
                server.unref()
                debug(`server closed`)
                if (err) {
                  debug(err)
                }
                cb()
              })
            })
          }

          const success = (code: string) => {
            respond(200, `Relay CLI authorization complete. You can close this tab.`, () => {
              codeResolve(code)
            })
          }

          const failure = (status: string) => {
            switch(status) {
              case `no-url`: {
                respond(418, `Relay CLI authorization failed. Please try again.`, () => {
                  codeReject(new Error(`redirect contined no url`))
                })
                return
              }
              case `not-found`: {
                respond(404, `Relay CLI authorization failed. Redirected to unknown path. Please try again.`, () => {
                  codeReject(new Error(`redirected to unknown path`))
                })

                return
              }
              case `no-code`: {
                respond(400, `Relay CLI authorization failed. No code found. Please try again.`, () => {
                  codeReject(new Error(`authorization code not found on redirect`))
                })
                return
              }
            }

          }

          if (req?.url) {
            const url = new URL(req.url, `http://localhost:8080`)
            const authUrl = new URL(vars.authRedirectUri)

            if (url.pathname === authUrl.pathname) {
              const code = url.searchParams.get(`code`)
              if (code) {
                success(code)
              } else {
                failure(`no-code`)
              }
            } else {
              failure(`not-found`)
            }
          } else {
            failure(`no-url`)
          }
        })
        server.on(`connection`, s => {
          socket = s
        })
        server.on(`error`, err => {
          serverReject(err)
        })
        server.listen(8080, () => {
          debug(`listening on 8080`)
          serverResolve({ codePromise })
        })
      })

    })
  }

  private createAuthorization(): { url: string, codeVerifier: string } {
    const codeVerifier = uuid()
    const codeChallenge = base64url(crypto.createHash(`sha256`).update(codeVerifier).digest(`base64`))
    const params = {
      client_id: vars.authCodeId,
      response_type: `code`,
      scope: `openid profile`,
      redirect_uri: `http://localhost:8080/authorization-code/callback`,
      state: uuid(),
      code_challenge_method: `S256`,
      code_challenge: codeChallenge,
    }
    return {
      url: `${vars.authUrl}/oauth2/authorization?${querystring.stringify(params)}`,
      codeVerifier
    }
  }

  private async interactive(login?: string): Promise<ConfigEntry> {
    cli.log('Enter your login credentials\n')
    login = await cli.prompt(`Email`, { default: login })
    const password = await cli.prompt(`Password`, { type: `hide` })
    let auth
    try {
      auth = await this.createPasswordGrantToken(login!, password)
    } catch(err) {
      if (err.body.error === `mfa_required`) {
        const mfa = await cli.prompt(`Two-factor code`, { type: `mask` })
        auth = await this.createPasswordGrantToken(login!, password, { mfa })
      } else if (err.body.error === `invalid_grant`) {
        throw new Error(err.body.error_description)
      } else {
        throw err
      }
    }
    this.relay.auth = auth.access_token
    return auth
  }

  private async createPasswordGrantToken(username: string, password: string, opts: { mfa?: string } = {}): Promise<ConfigEntry> {
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
      authorization: createBasicAuthorization(vars.authId, vars.authSecret),
    }

    const options = { headers, body: encode(body) }

    debug(`createPasswordGrantToken`, options)

    const { body: auth } = await HTTP.post<any>(`${vars.authUrl}/oauth2/token`, options)

    return {
      access_token: auth.access_token,
      username: username,
      refresh_token: auth.refresh_token,
    }
  }

  private async refreshOAuthToken() {
    const tokens: any = deps.config.get(`session.tokens`)
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
      authorization: createBasicAuthorization(vars.authId, vars.authSecret),
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

  private saveToken(entry: ConfigEntry) {
    const tokens: any = deps.config.get(`session.tokens`) || {}
    tokens[vars.apiHost] = entry
    deps.config.set(`session.tokens`, tokens)
  }

  private saveSubscribers(subscribers: Subscriber[]) {
    deps.config.set(`session.subscriber.all`, subscribers)
  }

  private saveDefaultSubscriber(subscriber: Subscriber) {
    deps.config.set(`session.subscriber.default`, subscriber)
  }

  private async fetchSubscribers(token: string): Promise<Subscriber[]> {
    const options = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const { body: accounts } = await HTTP.get<Record<string, any>[]>(`${vars.stratusUrl}/v3/subscribers;view=dash_overview`, options)
    return map(accounts, account => ({
      name: account.account.account_name,
      id: account.account.subscriber_id,
      email: account.account.owner_email,
    }))
  }
}

function uuid(): string {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' +
    s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' +
    s4() + '_' + s4() + '_' + s4()
}

function base64url(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}
