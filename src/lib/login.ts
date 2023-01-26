// Copyright © 2022 Relay Inc.

import { Interfaces, CliUx } from '@oclif/core'
import HTTP from 'http-call'
import encode from 'form-urlencoded'
import open from 'open'
import http from 'http'
import { URL, URLSearchParams } from 'url'
import { isEmpty, map } from 'lodash'
import debugFn from 'debug'
import crypto = require('crypto') // eslint-disable-line quotes

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer') // eslint-disable-line quotes

import { vars } from './vars'
import { AccountEnvelope, clearSubscribers, deleteSession, getToken, resolveSubscriber, saveSubscribers, setToken, Subscriber, TokenAccount, Tokens } from './session'
import { getOrThrow, uuid, base64url } from './utils'
import jwtValues from './jwt'

const debug = debugFn(`login`)

type Term = {
  id: number,
  name: string,
  product: string,
  version_number: string,
}
type Terms = Term[]

type TermsPointers = {
  terms: {
    platform_api: {
      json: string,
      title: string,
      url: string,
    }
  }
}

// type TermsContents = {
//   description: string,
//   stratus_key: string,
//   url: string,
//   content: string
// }

type ResponseHandler = (code: number, message: string, callback: () => void) => void
type HttpHandler<T> = (url: string, responseHandler: ResponseHandler, resolve: (value: T) => void, reject: (reason: Error) => void) => void

export class Login {

  constructor(private readonly config: Interfaces.Config) {}

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
        await this.logout()
      }

      const auth = await this.generateCliTokenAccount()
      debug(`auth`, auth)
      const subscribers = await this.fetchSubscribers(auth.access_token)
      debug(`subscribers`, subscribers)

      if (!isEmpty(subscribers)) {
        setToken(auth)
        saveSubscribers(subscribers)
        const success = await resolveSubscriber(subscribers)
        if (success) {
          loggedIn = true
        } else {
          CliUx.ux.warn(`Default Relay account not set... logging out.`)
          this.doLogout()
        }

        const hasAcceptedTerms = await this.hasAcceptedTerms(auth)

        if (!hasAcceptedTerms) {
          throw new Error(`Legal Terms and Conditions not accepted`)
        }

        CliUx.ux.log()
        CliUx.ux.log(`Logged in`)

        return auth
      } else {
        throw new Error(`Failed to discover subscriber id`)
      }
    } catch(err) {
      CliUx.ux.log(`Logging out`)
      await this.doLogout()
      throw err
    }
  }

  async logout(): Promise<void> {

    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) {
        CliUx.ux.warn(`Cannot open browser.`)
        CliUx.ux.warn(`Copy and paste into a browser: ${CliUx.ux.url(`Click here to login`, url)}`)
      }
      urlDisplayed = true
    }

    const httpHandler: HttpHandler<boolean> = (requestUrl: string, respond: ResponseHandler, resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
      const url = new URL(requestUrl, vars.authRedirectUrlBase)
      const { pathname } = new URL(vars.postLogoutRedirectUrl)

      if (url.pathname === pathname) {
        respond(200, `Relay CLI session ended. You can close this tab.`, () => {
          resolve(true)
        })
      } else {
        respond(404, `Relay CLI session end failed. Redirected to unknown path. Please try again.`, () => {
          reject(new Error(`redirected to unknown path`))
        })
      }
    }

    const { response } = await this.startHttpCodeServer(httpHandler)

    const { url } = this.createEndSession(vars.authCliId)
    debug(`endSessionEndpoint`, url)
    CliUx.ux.log(`Opening browser to end authenticated session`)
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

    CliUx.ux.action.start(`Waiting for your browser`)
    const success = await response
    debug(`end session success`, success)
    CliUx.ux.action.stop(`done`)

    await this.doLogout()
  }

  async doLogout(): Promise<void> {
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

    const httpHandler: HttpHandler<string> = (requestUrl: string, respond: ResponseHandler, resolve: (value: string) => void, reject: (reason: Error) => void) => {
      const success = (code: string) => {
        respond(200, `Relay CLI authorization complete. You can close this tab.`, () => {
          resolve(code)
        })
      }

      const failure = (status: string) => {
        switch(status) {
          case `not-found`: {
            respond(404, `Relay CLI authorization failed. Redirected to unknown path. Please try again.`, () => {
              reject(new Error(`redirected to unknown path`))
            })

            return
          }
          case `no-code`: {
            respond(400, `Relay CLI authorization failed. No code found. Please try again.`, () => {
              reject(new Error(`authorization code not found on redirect`))
            })
            return
          }
        }

      }

      const url = new URL(requestUrl, vars.authRedirectUrlBase)
      const { pathname } = new URL(vars.authRedirectUrl)

      if (url.pathname === pathname) {
        const code = url.searchParams.get(`code`)
        if (code) {
          success(code)
        } else {
          failure(`no-code`)
        }
      } else {
        failure(`not-found`)
      }
    }

    const { response } = await this.startHttpCodeServer(httpHandler)
    debug(`authorization url`, url)
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
    CliUx.ux.action.start(`Waiting for you to login in your browser`)
    const code = await response
    debug(`got code ${code}`)
    CliUx.ux.action.stop(`done`)

    const body = {
      grant_type: `authorization_code`,
      redirect_uri: vars.authRedirectUrl,
      client_id,
      code,
      code_verifier: codeVerifier,
    }

    const headers: Record<string, string> = {
      accept: `application/json`,
      'content-type': `application/x-www-form-urlencoded`,
    }

    const tokenOptions = { headers, body: encode(body) }
    debug(`token request`, tokenOptions)
    const { body: auth } = await HTTP.post<Tokens>(`${vars.tokenEndpoint}`, tokenOptions)

    debug(`tokens`, auth)

    const info = jwtValues(auth.id_token)

    debug(`info`, info)

    const uuid = info.preferred_username
    const username = info.email

    return {
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
      id_token: auth.id_token,
      uuid,
      username,
    }
  }

  private startHttpCodeServer<T>(httpHandler: HttpHandler<T>): Promise<{ response: Promise<T> }> {
    return new Promise((serverResolve, serverReject) => {
      const response: Promise<T> = new Promise((responseResolve, responseReject) => {

        const timeout = setTimeout(() => {
          responseReject(new Error(`timed out waiting for browser login`))
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

          if (req.url) {
            httpHandler(req.url, respond, responseResolve, responseReject)
          } else {
            respond(418, `Relay CLI authorization failed. Please try again.`, () => {
              responseReject(new Error(`redirect contined no url`))
            })
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
          serverResolve({ response })
        })
      })

    })
  }

  private createEndSession(client_id: string): { url: string } {
    const params = {
      client_id,
      post_logout_redirect_uri: vars.postLogoutRedirectUrl,
    }
    const queryString = (new URLSearchParams(params)).toString()

    return {
      url: `${vars.endSessionEndpoint}?${queryString}`
    }
  }

  private createAuthorization(client_id: string): { url: string, codeVerifier: string } {
    const codeVerifier = uuid()
    const codeChallenge = base64url(crypto.createHash(`sha256`).update(codeVerifier).digest(`base64`))
    const params = {
      client_id,
      response_type: `code`,
      scope: `openid profile offline_access`,
      redirect_uri: vars.authRedirectUrl,
      state: uuid(),
      code_challenge_method: `S256`,
      code_challenge: codeChallenge,
    }
    const queryString = (new URLSearchParams(params)).toString()
    return {
      url: `${vars.authorizationEndpoint}?${queryString}`,
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

    const { body: auth } = await HTTP.post<Tokens>(`${vars.tokenEndpoint}`, options)

    return {
      ...tokens,
      id_token: auth.id_token,
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
    }
  }

  private async hasAcceptedTerms(account: TokenAccount): Promise<boolean> {
    const options = {
      headers: {
        authorization: `Bearer ${account.access_token}`
      }
    }

    const timeout = setTimeout(() => {
      CliUx.ux.action.start(`Validating legal terms and conditions`)
    }, 2000)

    /*
      [
        {
          id: 52,
          name: 'platform_api',
          product: 'Relay_Platform',
          version_number: '1.0'
        }
      ]
    */
    const { body: unacceptedTerms } = await HTTP.get<Terms>(`${vars.stratusUrl}/v3/terms?product=Relay_Platform&unaccepted=true&version=latest`, options)

    clearTimeout(timeout)

    const apiTerm = (unacceptedTerms ?? []).find(t => t.product === `Relay_Platform`)
    if (!apiTerm) {
      return true
    } else {
      const { body: { terms: { platform_api: { title, url } } } } = await HTTP.get<TermsPointers>(`${vars.contentUrl}/version.json`)
      CliUx.ux.log()
      CliUx.ux.styledHeader(`\n${title}`)
      CliUx.ux.log(`In order to use the Relay CLI, API, and SDKs, you must accept our terms and conditions>Your rights and responsibilities when accessing the Relay publicly available application programming interfaces (the "APIs")`)
      CliUx.ux.url(`Click here to read the legal agreement`, `${vars.contentUrl}${url}`)
      CliUx.ux.log()
      const prompt = new Confirm({
        name: `accept_terms`,
        message: `Do you and your organization accept these terms and conditions?`,
      })
      try {
        const answer = await prompt.run()
        if (answer) {
          const body = {
            terms_and_condition_id: `${apiTerm.id}`,
            contact_uuid: account.uuid
          }
          await HTTP.post(`${vars.stratusUrl}/v3/agreements`, {
            ...options,
            body,
          })
          return true
        } else {
          CliUx.ux.log(`You declined to accept ${title}`)
          return false
        }
      } catch(err) {
        return false
      }
    }
  }

  private async fetchSubscribers(token: string): Promise<Subscriber[]> {
    const options = {
      headers: {
        authorization: `Bearer ${token}`
      },
      timeout: 15000,
    }

    const timeout = setTimeout(() => {
      CliUx.ux.action.start(`Retrieving authorized subscribers`)
    }, 2000)

    try {
      const { body: accounts } = await HTTP.get<Record<string, AccountEnvelope>[]>(`${vars.stratusUrl}/v3/subscribers;view=dash_overview`, options)

      debug(`accounts`, accounts)

      if (CliUx.ux.action.running) {
        CliUx.ux.action.stop()
      }

      return map(accounts, account => ({
        id: getOrThrow(account, [`account`, `subscriber_id`]),
        email: getOrThrow(account, [`account`, `owner_email`]),
        name: getOrThrow(account, [`account`, `account_name`]),
      }))
    } catch (err) {
      debug(`accounts error`, err)
      return []
    } finally {
      clearTimeout(timeout)
    }

  }
}
