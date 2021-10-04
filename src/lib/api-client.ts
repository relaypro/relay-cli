import * as Config from '@oclif/config'
import { CLIError, warn } from '@oclif/errors'
import { cli } from 'cli-ux'
import { HTTP, HTTPError, HTTPRequestOptions } from 'http-call'
import { find, includes, isString, map, filter } from 'lodash'
import * as url from 'url'

import deps from './deps'
import { Login } from './login'
import { RequestId, requestIdHeader } from './request-id'
import { vars } from './vars'

import debugFn = require('debug') // eslint-disable-line quotes
import { clearConfig, clearSubscribers, AccountEnvelope, getDefaultSubscriber, getDefaultSubscriberId, getSession, getToken, Session, Subscriber, TokenAccount } from './session'
import { CustomAudio, CustomAudioUpload, DeviceId, DeviceIds, Group, NewWorkflow, Workflow, Workflows } from './api'
import { getOrThrow } from './utils'
import { createReadStream } from 'fs'
import { access, stat } from 'fs/promises'
import { R_OK } from 'constants'


const debug = debugFn(`api-client`)

// eslint-disable-next-line @typescript-eslint/no-namespace
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
    const options: APIErrorOptions = httpError.body
    if (!options || !options.message) throw httpError
    const info = []
    if (options.id) info.push(`Error ID: ${options.id}`)
    if (options.url) info.push(`See ${options.url} for more information.`)
    if (info.length) super([options.message, ``].concat(info).join(`\n`))
    else super(options.message)
    this.http = httpError
    this.body = options
  }
}

export class APIClient {
  authPromise?: Promise<TokenAccount>
  http: typeof HTTP
  private readonly _login = new Login(this.config, this)
  private _auth?: string

  constructor(protected config: Config.IConfig, public options: IOptions = {}) {
    this.config = config
    if (options.required === undefined) options.required = true
    options.preauth = options.preauth !== false
    this.options = options
    const apiUrl = new url.URL(vars.apiUrl)
    const envHeaders = JSON.parse(process.env.RELAY_HEADERS || `{}`)
    const self = this as APIClient
    const opts = {
      host: apiUrl.hostname,
      port: apiUrl.port,
      protocol: apiUrl.protocol,
      headers: {
        accpet: `application/json`,
        'user-agent': this.config.userAgent,
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
              const tokens = getToken()
              if (tokens?.refresh_token) {
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
        const tokens = getToken()
        this._auth = tokens?.access_token
      }
    }
    return this._auth
  }

  set auth(token: string | undefined) {
    delete this.authPromise
    this._auth = token
  }

  refresh(): Promise<TokenAccount> {
    this._auth = undefined
    return this._login.refresh()
  }

  get<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.get<T>(url, options)
  }
  post<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.post<T>(url, options)
  }
  put<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.put<T>(url, options)
  }
  delete<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.delete<T>(url, options)
  }
  request<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.request<T>(url, options)
  }
  generateToken(): Promise<string> {
    return this._login.generateSdkTokenAccount()
  }
  login(): Promise<TokenAccount> {
    return this._login.login()
  }
  async logout(): Promise<void> {
    try {
      await this._login.logout()
    } catch (err) {
      if (err instanceof Error || typeof err === `string`) {
        warn(err)
      }
    }
  }
  get defaults(): typeof HTTP.defaults {
    return this.http.defaults
  }
  async whoami(): Promise<Record<string, string>> {
    // TODO use parameterized subscriberId
    const subscriber = getDefaultSubscriber()
    const { body: user } = await this.get<Record<string, string>>(`${vars.authUrl}/oauth2/validate`)
    return {
      Name: `${user.given_name} ${user.family_name}`,
      Email: `${user.email}`,
      [`User ID`]: `${user.userid}`,
      [`Default Subscriber`]: subscriber.id,
    }
  }
  async devices(subscriberId: string): Promise<DeviceId[]> {
    const { body: { devices } } = await this.get<DeviceIds>(`/ibot/subscriber/${subscriberId}/device_ids`)
    return devices
  }
  async groups(subscriberId: string): Promise<Group[]> {
    let { body } = await this.get<Group[]>(`/ibot/groups?subscriber_id=${subscriberId}`)
    body = isString(body) ? JSON.parse(body) : body
    return filter(body, { owner: subscriberId })
  }
  async workflows(subscriberId: string): Promise<Workflow[]> {
    const { body: { results } } = await this.get<Workflows>(`/ibot/workflow?subscriber_id=${subscriberId}`)
    return map(results, row => {
      if (isString(row.config)) {
        row.config = JSON.parse(row.config)
      }
      return row
    })
  }
  async workflow(subscriberId: string, id: string): Promise<Workflow|undefined> {
    const workflows = await this.workflows(subscriberId)
    return find(workflows, ({ workflow_id }) => includes(workflow_id, id))
  }
  async saveWorkflow(workflow: NewWorkflow): Promise<Workflow[]> {
    // TODO use parameterized subscriberId
    const subscriberId = getDefaultSubscriberId()
    const { body } = await this.post<Workflow[]>(`/ibot/workflow?subscriber_id=${subscriberId}`, {
      body: workflow,
    })
    return map(body, row => {
      if (isString(row.config)) {
        row.config = JSON.parse(row.config)
      }
      return row
    })
  }
  async removeWorkflow(id: string): Promise<boolean> {
    // TODO use parameterized subscriberId
    const subscriberId = getDefaultSubscriberId()
    await this.delete(`/ibot/workflow/${id}?subscriber_id=${subscriberId}`)
    return true
  }
  async triggerWorkflow(subscriberId: string, workflowId: string, args: Record<string, string>): Promise<void> {
    const tokenAccount = getToken()

    const uri = `/ibot/workflow/${workflowId}?subscriber_id=${subscriberId}&user_id=${tokenAccount?.uuid}`
    const body = {
      action: `invoke`,
      action_args: args,
    }

    debug(`triggerWorkflow`, { uri, body })

    await this.post<void>(uri, { body })
  }
  clear(): void {
    clearConfig()
    clearSubscribers()
  }
  session(): Session {
    return getSession()
  }
  async subscribers(): Promise<Subscriber[]> {
    const { body: accounts } = await this.request<Record<string, AccountEnvelope>[]>(`${vars.stratusUrl}/v3/subscribers;view=dash_overview`)
    return map(accounts, account => ({
      id: getOrThrow(account, [`account`, `subscriber_id`]),
      email: getOrThrow(account, [`account`, `owner_email`]),
      name:  getOrThrow(account, [`account`, `account_name`]),
    }))
  }
  async listAudio(subscriberId: string): Promise<CustomAudio[]> {
    const { body } = await this.get<CustomAudio[]>(`/ibot/custom_audio?subscriber_id=${subscriberId}`)
    return body
  }
  async deleteAudio(subscriberId: string, id: string): Promise<void> {
    await this.delete<never>(`/ibot/custom_audio/${id}?subscriber_id=${subscriberId}`)
  }
  async uploadAudio(subscriberId: string, name: string, filePath: string): Promise<string> {
    const url = `/ibot/custom_audio?subscriber_id=${subscriberId}`

    await access(filePath, R_OK)
    const stats = await stat(filePath)

    const body: CustomAudio = {
      audio_format: `wave`,
      subscriber_id: subscriberId,
      short_name: name,
    }
    debug({ url, body })
    const { body: response } = await this.post<CustomAudioUpload>(url, { body })
    debug(response)
    const id = response?.result?.id
    if (id !== undefined) {
      const stream = createReadStream(filePath)
      const uploadUrl = response?.s3_upload_url

      debug(uploadUrl)

      await deps.HTTP.HTTP.put<never>(uploadUrl, {
        body: stream,
        headers: {
          'content-type': `audio/wave`,
          'content-length': stats.size,
        }
      })
      return id
    } else {
      throw new Error(`Failed to upload custom audio`)
    }
  }
}
