import * as Config from '@oclif/config'
import { CLIError, warn } from '@oclif/errors'
import { cli } from 'cli-ux'
import { HTTP, HTTPError, HTTPRequestOptions } from 'http-call'
import { find, includes, isString, map } from 'lodash'
import * as url from 'url'

import deps from './deps'
import { Login } from './login'
import { RequestId, requestIdHeader } from './request-id'
import { vars } from './vars'

const debug = require('debug')('api-client')

export namespace APIClient {
  export interface Options extends HTTPRequestOptions {
    retryAuth?: boolean
  }
}

export interface IOptions {
  required?: boolean
  preauth?: boolean
}

export interface APIErrorOptions {
  resource?: string
  id?: string
  message?: string
  url?: string
}

export class APIError extends CLIError {
  http: HTTPError
  body: APIErrorOptions

  constructor(httpError: HTTPError) {
    super(httpError)
    if (!httpError) throw new Error(`invalid error`)
    let options: APIErrorOptions = httpError.body
    if (!options || !options.message) throw httpError
    let info = []
    if (options.id) info.push(`Error ID: ${options.id}`)
    if (options.url) info.push(`See ${options.url} for more information.`)
    if (info.length) super([options.message, ''].concat(info).join('\n'))
    else super(options.message)
    this.http = httpError
    this.body = options
  }
}

export class APIClient {
  preauthPromises: { [k: string]: Promise<HTTP<any>>}
  authPromise?: Promise<HTTP<any>>
  http: typeof HTTP
  private readonly _login = new Login(this.config, this)
  private _auth?: string

  constructor(protected config: Config.IConfig, public options: IOptions = {}) {
    this.config = config
    if (options.required === undefined) options.required = true
    options.preauth = options.preauth !== false
    this.options = options
    let apiUrl = url.URL ? new url.URL(vars.apiUrl) : url.parse(vars.apiUrl)
    let envHeaders = JSON.parse(process.env.RELAY_HEADERS || `{}`)
    this.preauthPromises = {}
    let self = this as any
    const opts = {
      host: apiUrl.hostname,
      port: apiUrl.port,
      protocol: apiUrl.protocol,
      headers: {
        accpet: `application/json`,
        'user-agent': `relay-cli/${self.config.version} ${self.config.platform}`,
        ...envHeaders,
      },
    }
    this.http = class APIHTTPClient<T> extends deps.HTTP.HTTP.create(opts)<T> {
      static trackRequestIds<T>(response: HTTP<T>) {
        const responseRequestIdHeader = response.headers[requestIdHeader]
        if (responseRequestIdHeader) {
          const requestIds = Array.isArray(responseRequestIdHeader) ? responseRequestIdHeader : responseRequestIdHeader.split(`,`)
          RequestId.track(...requestIds)
        }
      }

      static async request<T>(url: string, opts: APIClient.Options = {}, retries = 3): Promise<APIHTTPClient<T>> {
        opts.headers = opts.headers || {}
        opts.headers[requestIdHeader] = RequestId.create() && RequestId.headerValue

        if (!Object.keys(opts.headers).find(h => h.toLowerCase() === `authorization`)) {
          opts.headers.authorization = `Bearer ${self.auth}`
        }
        retries--
        try {
          const response = await super.request<T>(url, opts)
          this.trackRequestIds<T>(response)
          return response
        } catch(err) {
          if (!(err instanceof deps.HTTP.HTTPError)) throw err
          if (retries > 0) {
            if (opts.retryAuth !== false && err.http.statusCode === 401) {
              debug(`Token expired`)
              if (process.env.RELAY_API_KEY) {
                throw new Error(`The token provided to RELAY_API_KEY is invalid. Please double-heck that you have the correct token, or run 'relay login' without RELAY_API_KEY set.`)
              }
              const tokens: any = deps.config.get(`session.tokens`)
              if (tokens?.[vars.apiHost]?.refresh_token) {
                debug(`attempting refresh`)
                if (!self.authPromise) self.authPromise = self.refresh()
                await self.authPromise
                debug(`refresh successful`)
                opts.headers.authorization = `Bearer ${self.auth}`
                debug(`re-requesting original`)
                return this.request<T>(url, opts, retries)
              } else {
                cli.log(`Not logged in`)
                debug(`attempting login`)
                if (!self.authPromise) self.authPromise = self.login()
                await self.authPromise
                opts.headers.authorization = `Bearer ${self.auth}`
                debug(`re-requesting original`)
                return this.request<T>(url, opts, retries)
              }
            }
          }
          throw new APIError(err)
        }
      }
    }
  }

  get auth(): string | undefined {
    if (!this._auth) {
      if (process.env.RELAY_API_TOKEN && !process.env.RELAY_API_KEY) deps.cli.warn(`RELAY_API_TOKEN is set but you probably meant RELAY_API_KEY`)
      this._auth = process.env.RELAY_API_KEY
      if (!this._auth) {
        const tokens: any = deps.config.get(`session.tokens`)
        this._auth = tokens?.[vars.apiHost]?.access_token
      }
    }
    return this._auth
  }

  set auth(token: string | undefined) {
    delete this.authPromise
    this._auth = token
  }

  refresh() {
    this._auth = undefined
    return this._login.refresh()
  }

  get<T>(url: string, options: APIClient.Options = {}) {
    return this.http.get<T>(url, options)
  }
  post<T>(url: string, options: APIClient.Options = {}) {
    return this.http.post<T>(url, options)
  }
  put<T>(url: string, options: APIClient.Options = {}) {
    return this.http.put<T>(url, options)
  }
  delete<T>(url: string, options: APIClient.Options = {}) {
    return this.http.delete<T>(url, options)
  }
  request<T>(url: string, options: APIClient.Options = {}) {
    return this.http.request<T>(url, options)
  }

  login(opts: Login.Options = {}) {
    return this._login.login(opts)
  }
  async logout() {
    try {
      await this._login.logout()
    } catch (err) {
      warn(err)
    }
  }
  get defaults(): typeof HTTP.defaults {
    return this.http.defaults
  }
  async whoami(): Promise<Record<string, string>> {
    const result = await this.get<Record<string, string>>(`${vars.authUrl}/oauth2/validate`)
    return result.body
  }
  async devices(): Promise<any> {
    const subscriberId = deps.config.get(`session.subscriber.default.id`)
    const { body: { devices } } = await this.get<any>(`/ibot/subscriber/${subscriberId}/device_ids`)
    return devices
  }
  async workflows(): Promise<any> {
    const subscriberId = deps.config.get(`session.subscriber.default.id`)
    const { body: { results } } = await this.get<any>(`/ibot/workflow?subscriber_id=${subscriberId}`)
    return map(results, row => {
      if (isString(row.config)) {
        row.config = JSON.parse(row.config)
      }
      return row
    })
  }
  async workflow(id: string): Promise<any> {
    const workflows = await this.workflows()
    return find(workflows, ({ workflow_id }) => includes(workflow_id, id))
  }
  async saveWorkflow(workflow: any): Promise<any> {
    const subscriberId = deps.config.get(`session.subscriber.default.id`)
    const { body: results } = await this.post<any>(`/ibot/workflow?subscriber_id=${subscriberId}`, {
      body: workflow,
    })
    return map(results, row => {
      if (isString(row.config)) {
        row.config = JSON.parse(row.config)
      }
      return row
    })
  }
  async removeWorkflow(id: string): Promise<boolean> {
    const subscriberId = deps.config.get(`session.subscriber.default.id`)
    await this.delete(`/ibot/workflow/${id}?subscriber_id=${subscriberId}`)
    return true
  }
  reset(): void {
    deps.config.clear()
  }
  session(): any {
    return deps.config.get(`session`)
  }
}
