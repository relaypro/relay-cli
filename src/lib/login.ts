import { Interfaces, CliUx } from '@oclif/core'
import HTTP from 'http-call'
import encode from 'form-urlencoded'
import querystring from 'querystring'
import open from 'open'

import { APIClient } from './api-client'

import { vars } from './vars'
import http from 'http'
import { URL } from 'url'
import { isEmpty, map } from 'lodash'

import debugFn from 'debug'
import crypto = require('crypto') // eslint-disable-line quotes
import { AccountEnvelope, clearSubscribers, deleteSession, getToken, resolveSubscriber, saveSubscribers, setToken, Subscriber, TokenAccount, Tokens, User } from './session'
import { getOrThrow, uuid, base64url } from './utils'

const debug = debugFn(`login`)

export class Login {

  constructor(private readonly config: Interfaces.Config, private readonly relay: APIClient) {}

  async login(): Promise<TokenAccount> {
    debug(this.config)
    let loggedIn = false
    try {
      setTimeout(() => {
        if (!loggedIn) CliUx.ux.error(`timed out`)
      }, 1000 * 60 * 10).unref()

      if (process.env.RELAY_API_KEY) {
        CliUx.ux.error(`Cannot log in with RELAY_API_KEY set`)
      }

      const tokens = getToken()

      const previousUsername = tokens?.username

      if (previousUsername) {
        CliUx.ux.warn(`Previously logged in as ${previousUsername}... logging out.`)
        await this.relay.logout()
      }

      const auth = await this.generateCliTokenAccount()
      const subscribers = await this.fetchSubscribers(auth.access_token)
      debug(`subscribers`, subscribers)

      if (!isEmpty(subscribers)) {
        setToken(auth)
        saveSubscribers(subscribers)
        const success = await resolveSubscriber(subscribers)
        if (success) {
          CliUx.ux.log(`Logged in`)
          loggedIn = true
        } else {
          CliUx.ux.warn(`Default Relay account not set... logging out.`)
          this.logout()
        }

        return auth
      } else {
        throw new Error(`Failed to discover subscriber id`)
      }
    } catch(err) {
      this.logout()
      throw err
    }
  }

  async logout(): Promise<void> {
    deleteSession()
    clearSubscribers()
  }

  async refresh(): Promise<TokenAccount> {
    const auth = await this.refreshOAuthToken(vars.authCliId)
    setToken(auth)
    return auth
  }

  async generateSdkTokenAccount(): Promise<string> {
    const { refresh_token } = await this.generateToken(vars.authSdkId)
    if (refresh_token) {
      return refresh_token
    } else {
      throw new Error(`failed-to-generate-sdk-token`)
    }
  }

  private async generateCliTokenAccount(): Promise<TokenAccount> {
    return this.generateToken(vars.authCliId)
  }

  private async generateToken(client_id: string): Promise<TokenAccount> {
    // set up callback server
    const { url, codeVerifier } = this.createAuthorization(client_id)

    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) {
        CliUx.ux.warn(`Cannot open browser.`)
        CliUx.ux.warn(`Copy and paste into a browser: ${CliUx.ux.url(`Click here to login`, url)}`)
      }
      urlDisplayed = true
    }
    const { codePromise } = await this.startHttpCodeServer()
    debug(url)
    CliUx.ux.log(`Opening browser to login`)
    await CliUx.ux.wait(500)
    const cp = await open(url, { wait: false })
    cp.on(`error`, err => {
      CliUx.ux.warn(err)
      showUrl()
    })
    cp.on(`close`, code => {
      if (code !== 0) {
        showUrl()
      }
    })
    CliUx.ux.action.start(`relay: Waiting for login`)
    const code = await codePromise
    debug(`got code ${code}`)
    CliUx.ux.action.stop(`done`)

    const body = {
      grant_type: `authorization_code`,
      redirect_uri: vars.authRedirectUri,
      client_id,
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

    if (!auth.refresh_token) {
      debug(`no refresh_token`)

      const expiresHours = (auth.expires_in||7200)/60/60

      CliUx.ux.log(`Your login session will expire in ${expiresHours} hours.`)
      // cli.log(`If you sign in again and check "Remember me", your session will not expire`)

      // const prompt = new Toggle({
      //   message: `Sign in again?`,
      //   enabled: `Yes`,
      //   disabled: `No, expire in ${expiresHours} hours`,
      // })

      // if (await prompt.run()) {
      //   return await this.browser()
      // }
    }


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

        const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
          clearTimeout(timeout)
          req.socket.ref()

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
              req.socket.unref()
              req.socket.destroy()
              server.close(err => {
                server.unref()
                debug(`server closed`)
                if (err) {
                  debug(err)
                }
              })
              setImmediate(() => {
                server.emit(`close`)
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
            const url = new URL(req.url, vars.authRedirectHost)
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
        server.on(`connection`, socket => {
          socket.unref()
        })
        server.on(`error`, err => {
          serverReject(err)
        })
        server.listen(vars.authRedirectPort, () => {
          debug(`listening on ${vars.authRedirectPort}`)
          serverResolve({ codePromise })
        })
      })

    })
  }

  private createAuthorization(client_id: string): { url: string, codeVerifier: string } {
    const codeVerifier = uuid()
    const codeChallenge = base64url(crypto.createHash(`sha256`).update(codeVerifier).digest(`base64`))
    const params = {
      client_id,
      response_type: `code`,
      scope: `openid profile`,
      redirect_uri: vars.authRedirectUri,
      state: uuid(),
      code_challenge_method: `S256`,
      code_challenge: codeChallenge,
    }
    return {
      url: `${vars.authUrl}/oauth2/authorization?${querystring.stringify(params)}`,
      codeVerifier
    }
  }

  private async refreshOAuthToken(client_id: string): Promise<TokenAccount> {
    const tokens = getToken()
    const refreshToken = tokens?.refresh_token

    if (!refreshToken) {
      throw new Error(`no refresh token to refresh`)
    }

    if (!tokens?.username) {
      throw new Error(`no username`)
    }

    const body: Record<string, string> = {
      grant_type: `refresh_token`,
      refresh_token: refreshToken,
      client_id,
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
      CliUx.ux.action.start(`Retrieving authorized subscribers`)
    }, 2000)

    const { body: accounts } = await HTTP.get<Record<string, AccountEnvelope>[]>(`${vars.stratusUrl}/v3/subscribers;view=dash_overview`, options)

    clearTimeout(timeout)

    if (CliUx.ux.action.running) {
      CliUx.ux.action.stop()
    }

    return map(accounts, account => ({
      id: getOrThrow(account, [`account`, `subscriber_id`]),
      email: getOrThrow(account, [`account`, `owner_email`]),
      name: getOrThrow(account, [`account`, `account_name`]),
    }))
  }
}
