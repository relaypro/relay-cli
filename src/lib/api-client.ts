// Copyright © 2022 Relay Inc.

import { Interfaces, Errors, CliUx } from '@oclif/core'
import { HTTP, HTTPError, HTTPRequestOptions } from 'http-call'
import { find, includes, isString, map, filter, pick } from 'lodash'
import * as url from 'url'

import deps from './deps'
import { Login } from './login'
import { RequestId, requestIdHeader } from './request-id'
import { vars } from './vars'

import debugFn = require('debug') // eslint-disable-line quotes
import { clearConfig, clearSubscribers, AccountEnvelope, getDefaultSubscriber, getDefaultSubscriberId, getSession, getToken, Session, Subscriber, TokenAccount } from './session'
import { Capabilities, CustomAudio, CustomAudioUpload, DeviceId, DeviceIds, Geofence, GeofenceResults, Group, HistoricalWorkflowInstance, HttpMethod, NewWorkflow, Tag, TagForCreate, TagResults, SubscriberInfo, Workflow, WorkflowEventQuery, WorkflowEventResults, WorkflowEvents, WorkflowInstance, Workflows, Venues, VenueResults, Positions, PositionResults, AuditEventType, ProfileAuditEventResults, RawAuditEventResults, ProfileAuditEvent, PagingParams, WorkflowLogQuery } from './api'
import { getOrThrow, normalize } from './utils'
import { createReadStream } from 'fs'
import { access, stat } from 'fs/promises'
import { R_OK } from 'constants'
import userId from './user-id'
import { IncomingMessage } from 'http'
import jwtValues from './jwt'

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

export class APIError extends Errors.CLIError {
  http: HTTPError
  body: APIErrorOptions

  constructor(httpError: HTTPError) {
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
  private readonly _login = new Login(this.config)
  private _auth?: string

  constructor(protected config: Interfaces.Config, public options: IOptions = {}) {
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
        accept: `application/json`,
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
                CliUx.ux.log(`Not logged in`)
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
      if (process.env.RELAY_API_TOKEN && !process.env.RELAY_API_KEY) {
        CliUx.ux.warn(`RELAY_API_TOKEN is set but you probably meant RELAY_API_KEY`)
      }
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
  GET<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.get<T>(url, options)
  }
  POST<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.post<T>(url, options)
  }
  PUT<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.put<T>(url, options)
  }
  DELETE<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.delete<T>(url, options)
  }
  request<T>(url: string, options: APIClient.Options = {}): Promise<HTTP<T>> {
    return this.http.request<T>(url, options)
  }
  api(endpoint: string, method: HttpMethod, subscriberId: string, ): Promise<HTTP<string>> {
    const tokenAccount = getToken()
    const userId = tokenAccount?.uuid
    if (!userId) {
      throw new Error(`Could not resolve userId`)
    }
    const _endpoint = normalize(endpoint, { subscriberId, userId })
    return this[`${method}`]?.(`/ibot/${_endpoint}`)
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
        Errors.warn(err)
      }
    }
  }
  get defaults(): typeof HTTP.defaults {
    return this.http.defaults
  }
  async whoami(): Promise<Record<string, string|Record<string, boolean>>> {
    // TODO use parameterized subscriberId
    const subscriber = getDefaultSubscriber()
    if (this.auth) {
      await this.refresh()
      const user = jwtValues(this.auth)
      const capabilities = await this.capabilities(subscriber.id)
      return {
        Name: `${user.given_name} ${user.family_name}`,
        Email: `${user.email}`,
        [`Auth User ID`]: `${user.preferred_username}`,
        [`Relay User ID`]: `${userId(subscriber.id, user.preferred_username)}`,
        [`Default Subscriber`]: subscriber.id,
        Capabilities: pick(capabilities, [
          `workflow_sdk`,
          `indoor_positioning`,
          `ui_nfc`,
          `calling`,
          `calling_between_devices_support`,
          `enable_audit_logs`,
        ])
      }
    } else {
      throw new Error(`no_auth_token`)
    }


  }
  async capabilities(subscriberId: string): Promise<Capabilities> {
    const subscriberInfo = await this.subscriberInfo(subscriberId)
    return subscriberInfo.capabilities
  }
  async subscriberInfo(subscriberId: string): Promise<SubscriberInfo> {
    const { body: subscriberInfo } = await this.get<SubscriberInfo>(`/ibot/subscriber/${subscriberId}?include_devices=false`)
    debug(`subscriberInfo`, subscriberInfo)
    return subscriberInfo
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

  async venues(subscriberId: string): Promise<Venues> {
    const { body } = await this.get<VenueResults>(`/ibot/indoor_venue?subscriber_id=${subscriberId}`)
    return body.results
  }

  async venuePositions(subscriberId: string, venueId: string): Promise<Positions> {
    const { body } = await this.get<PositionResults>(`/ibot/indoor_position/${venueId}?subscriber_id=${subscriberId}`)
    return body.results
  }

  async auditEvents(subscriberId: string, userId: string|undefined, type: AuditEventType, { latest, oldest, cursor, limit }: PagingParams): Promise<RawAuditEventResults> {
    const params = new URLSearchParams({
      subscriber_id: subscriberId,
      event_type: type,
      action: `assigned`,
    })

    if (userId !== undefined) {
      params.set(`user_id`, userId)
    }

    if (latest) {
      params.set(`latest`, latest)
    }

    if (oldest) {
      params.set(`oldest`, oldest)
    }

    if (cursor) {
      params.set(`cursor`, cursor)
    }

    if (limit) {
      params.set(`limit`, `${limit}`)
    }

    const { body } = await this.get<RawAuditEventResults>(`/ibot/audit?${params}`)

    return body
  }

  async profileAuditEvents(subscriberId: string, userId: string|undefined, params: PagingParams): Promise<ProfileAuditEventResults> {
    const { cursor, data } = await this.auditEvents(subscriberId, userId, `ibot_user_profile`, params)
    const results: ProfileAuditEvent[] = map(data, ({ data, ...event }) => {
      if (isString(data)) {
        const { id, device_id } = JSON.parse(data)
        return { ...event, id, device_id }
      } else {
        return { ...event, id: `unknown`, device_id: `unknown` }
      }
    })

    return { cursor, results }
  }

  async workflowInstances(subscriberId: string): Promise<WorkflowInstance[]> {
    const { body } = await this.get<WorkflowInstance[]>(`/ibot/workflow_instances?subscriber_id=${subscriberId}`)
    return map(body, instance => ({ ...instance, status: `running` }))
  }

  async historicalWorkflowInstances(subscriberId: string, query: WorkflowEventQuery = {}): Promise<HistoricalWorkflowInstance[]> {
    query.category = `workflow`
    const events = await this.workflowEvents(subscriberId, query)
    // debug(`history events`, events)
    const terminateEvents = filter(events, event => event?.jsonContent?.command === `terminate`)
    const instances = map(terminateEvents, event => ({
      instance_id: event.workflow_instance_id,
      subscriber_id: event.sub_id,
      triggering_user_id: event.user_id,
      workflow_id: event.workflow_id,
      workflow_uri: event?.jsonContent?.workflow_uri,
      end_time: event?.jsonContent?.end_time,
      terminate_reason: event?.jsonContent?.terminate_reason,
      status: `terminated`,
    })) as HistoricalWorkflowInstance[]
    return instances
  }

  async stopWorkflowInstance(subscriberId: string, instanceId: string): Promise<void> {
    await this.delete(`/ibot/workflow_instances/${instanceId}?subscriber_id=${subscriberId}`)
  }

  async workflowLogs(subscriberId: string, query: WorkflowLogQuery = {}): Promise<IncomingMessage> {
    const params = new URLSearchParams({
      subscriber_id: subscriberId,
      ...query as Record<string, string|number>,
    })

    const url = `/ibot/workflowdebug?${params.toString()}`

    const http = await this.http.request<Workflow>(url, { raw: true })

    return http.response
  }

  async workflowEvents(subscriberId: string, query: WorkflowEventQuery = {}): Promise<WorkflowEvents> {
    const params = new URLSearchParams({
      subscriber_id: subscriberId,
      ...query as Record<string, string|number>,
    })

    const url = `/ibot/workflow_analytics_events?${params.toString()}`

    const response = await this.get<WorkflowEventResults>(url)

    const events = map(response?.body?.data, event => ({
      ...event,
      jsonContent: event.content_type === `application/json` ? JSON.parse(event.content) : undefined
    }))

    return events
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
  async removeWorkflow(subscriberId: string, id: string): Promise<boolean> {
    await this.delete(`/ibot/workflow/${id}?subscriber_id=${subscriberId}`)
    return true
  }
  async triggerWorkflow(subscriberId: string, workflowId: string, userId: string, args: Record<string, string>): Promise<void> {

    const uri = `/ibot/workflow/${workflowId}?subscriber_id=${subscriberId}&user_id=${userId}`

    const body = {
      action: `invoke`,
      target_device_ids: [ `${userId}` ],
      action_args: args,
    }

    debug(`triggerWorkflow`, { uri, body })

    await this.post<void>(uri, { body })
  }
  async geofences(subscriberId: string): Promise<Geofence[]> {
    const { body } = await this.get<GeofenceResults>(`/ibot/geofence?subscriber_id=${subscriberId}`)
    return body.results
  }
  async createGeofenceFromAddress(subscriberId: string, label: string, address: string, radius: number): Promise<Geofence> {
    const body = {
      label,
      address,
      radius
    }
    const { body: response } = await this.post<Geofence>(`/ibot/geofence?subscriber_id=${subscriberId}`, { body })
    return response
  }
  async createGeofenceFromLatLong(subscriberId: string, label: string, lat: number, long: number, radius: number): Promise<Geofence> {
    const body = {
      label,
      lat, long,
      radius
    }
    const { body: response } = await this.post<Geofence>(`/ibot/geofence?subscriber_id=${subscriberId}`, { body })
    return response
  }
  async deleteGeofence(subscriberId: string, geofenceId: string): Promise<void> {
    await this.delete(`/ibot/geofence/${geofenceId}?subscriber_id=${subscriberId}`)
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

  async fetchNfcTags(subscriberId: string): Promise<Tag[]> {
    const url = `/ibot/relay_nfc_tag?subscriber_id=${subscriberId}`
    const response =  await this.get<TagResults>(url)
    return response.body.results
  }

  async fetchNfcTag(subscriberId: string, tagId: string): Promise<Tag> {
    const { body: response } = await this.get<Tag>(`/ibot/relay_nfc_tag/${tagId}?subscriber_id=${subscriberId}`)
    return response
  }

  async createNfcTag(subscriberId: string, content: TagForCreate) {
    const { body: response } = await this.post(`/ibot/relay_nfc_tag?subscriber_id=${subscriberId}`, {
      body: { content }
    })
    return response
  }

  async updateNfcTag(subscriberId: string, tagId: string, content: Record<string, string>) {
    await this.put(`/ibot/relay_nfc_tag/${tagId}?subscriber_id=${subscriberId}`, { body: { content } })
  }

  async deleteNfcTag(subscriberId: string, tagId: string) {
    await this.delete(`/ibot/relay_nfc_tag/${tagId}?subscriber_id=${subscriberId}`)
    return true
  }

  // async assignNfcTag(subscriberId: string, tagId: string, tagUri: string) {
  //   await this.put(`/ibot/relay_nfc_tag/${tagId}?subscriber_id=${subscriberId}`, { body: { tag_uri: tagUri } })
  // }

  // async unassignNfcTag(subscriberId: string, tagId: string) {
  //   // unassign is currently fetch content, delete, create a new tag with same content
  //   // this will result in a new tag_id
  //   const nfcTag = await this.fetchNfcTag(subscriberId, tagId)
  //   await this.deleteNfcTag(subscriberId, tagId)
  //   await this.createNfcTag(subscriberId, nfcTag.content)
  // }
}
