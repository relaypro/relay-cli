import * as Config from '@oclif/config'
import cli from 'cli-ux'
import HTTP from 'http-call'
import encode from 'form-urlencoded'
import querystring from 'querystring'
import open from 'open'

import { APIClient, APIError } from './api-client'

import { vars } from './vars'
import http from 'http'
import { URL } from 'url'
import { isEmpty, map } from 'lodash'
import { Socket } from 'net'

import debugFn from 'debug'
import crypto = require('crypto') // eslint-disable-line quotes
import { AccountEnvelope, clearSubscribers, deleteSession, getToken, resolveSubscriber, saveSubscribers, setToken, Subscriber, TokenAccount, Tokens, User } from './session'
import { getOrThrow, uuid, base64url } from './utils'

const debug = debugFn(`login`)

export class Login {

  constructor(private readonly config: Config.IConfig, private readonly relay: APIClient) {}

  async login(): Promise<void> {
    debug(this.config)
    let loggedIn = false
    try {
      setTimeout(() => {
        if (!loggedIn) cli.error(`timed out`)
      }, 1000 * 60 * 10).unref()

      if (process.env.RELAY_API_KEY) cli.error(`Cannot log in with RELAY_API_KEY set`)

      const tokens = getToken()

      const previousUsername = tokens?.username

      try {
        if (previousUsername) {
          cli.warn(`Previously logged in as ${previousUsername}... logging out.`)
          await this.relay.logout()
        }
      } catch(err) {
        cli.warn(err)
      }
      const auth = await this.browser()
      const subscribers = await this.fetchSubscribers(auth.access_token)
      debug(`subscribers`, subscribers)

      if (!isEmpty(subscribers)) {
        setToken(auth)
        saveSubscribers(subscribers)
        const success = await resolveSubscriber(subscribers)
        if (success) {
          cli.log(`Logged in`)
          loggedIn = true
        } else {
          cli.warn(`Default Relay account not set... logging out.`)
          this.logout()
        }
      } else {
        throw new Error(`Failed to discover subscriber id`)
      }
    } catch(err) {
      this.logout()
      throw new APIError(err)
    }
  }

  async logout(): Promise<void> {
    deleteSession()
    clearSubscribers()
  }

  async refresh(): Promise<void> {
    const auth = await this.refreshOAuthToken()
    setToken(auth)
  }

  private async browser(): Promise<TokenAccount> {
    // set up callback server
    const { url, codeVerifier } = this.createAuthorization()

    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) {
        cli.warn(`Cannot open browser.`)
        cli.warn(`Copy and paste into a browser: ${cli.url(`Click here to login`, url)}`)
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

    const headers: Record<string, string> = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
    }

    const tokenOptions = { headers, body: encode(body) }
    // debug(`token request`, tokenOptions)
    const { body: auth } = await HTTP.post<Tokens>(`${vars.authUrl}/oauth2/token`, tokenOptions)

    const validateOptions = { headers: { authorization: `Bearer ${auth.access_token}`}}
    // debug(`validate request`, validateOptions)
    const { body: user } = await HTTP.get<User>(`${vars.authUrl}/oauth2/validate`, validateOptions)

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
      refresh_token: auth.refresh_token,
      uuid: user.userid,
      username: user.email,
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
              // @ts-expect-error accessing hidden property `_httpMessage` of socket to expedite server closing
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

  private async refreshOAuthToken(): Promise<TokenAccount> {
    const tokens = getToken()
    const refreshToken = tokens?.refresh_token

    if (!refreshToken) {
      throw new Error(`no refresh token to refresh`)
    }

    if (!tokens?.username) {
      throw new Error(`no username`)
    }

    if (!uuid) {
      throw new Error(`no user uuid`)
    }

    const body: Record<string, string> = {
      grant_type: `refresh_token`,
      refresh_token: refreshToken,
    }

    const headers: Record<string, string> = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
    }

    const options = { headers, body: encode(body) }

    debug(`refreshOAuthToken`, options)

    const { body: auth } = await HTTP.post<Tokens>(`${vars.authUrl}/oauth2/token`, options)

    return {
      ...tokens,
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
    }
  }

  private async fetchSubscribers(token: string): Promise<Subscriber[]> {
    const options = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }

    const timeout = setTimeout(() => {
      cli.action.start(`Retrieving authorized subscribers`)
    }, 2000)

    const { body: accounts } = await HTTP.get<Record<string, AccountEnvelope>[]>(`${vars.stratusUrl}/v3/subscribers;view=dash_overview`, options)

    clearTimeout(timeout)

    if (cli.action.running) {
      cli.action.stop()
    }

    return map(accounts, account => ({
      id: getOrThrow(account, [`account`, `subscriber_id`]),
      email: getOrThrow(account, [`account`, `owner_email`]),
      name:  getOrThrow(account, [`account`, `account_name`]),
    }))
  }
}
