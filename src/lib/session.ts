// Copyright © 2022 Relay Inc.

import { size, map } from 'lodash-es'
import { ux } from '@oclif/core'
import select from '@inquirer/select'

import { config, susbscriberConfig } from './deps.js'
import { vars } from './vars.js'

import debugFn from 'debug'
const debug = debugFn(`session`)

export type Subscriber = {
  id: string,
  email: string,
  name: string,
}

export type SubscriberQuery = {
  owner_email?: string,
  account_name?: string,
  subscriber_id?: string,
}

export type User = {
  email: string,
  userid: string,
}

export type SubscriberPagedResults = {
  members: Subscriber[],
  next: string,
}

export type Tokens = {
  access_token: string,
  refresh_token: string,
  id_token: string,
}

export type TokenAccount = Tokens & {
  username: string,
  uuid: string,
}

export type SessionTokens = Record<string, TokenAccount>

export type Session = {
  subscriber: Subscriber
}

export const getSession = (): Session => {
  return config.get(`session`) as Session
}

export const clearConfig = (): void => {
  config.clear()
}

export const deleteSession = (): void => {
  config.delete(`session`)
}

export const clearSubscribers = (): void => {
  susbscriberConfig.clear()
}

export const getToken = (host: string = vars.apiHost): TokenAccount | undefined => {
  const tokens = config.get(`session.tokens`) as SessionTokens
  return tokens?.[host]
}

export const setToken = (token: TokenAccount, host: string = vars.apiHost): void => {
  const tokens: SessionTokens = (config.get(`session.tokens`) || {}) as SessionTokens
  tokens[host] = token
  config.set(`session.tokens`, tokens)
}

export const saveDefaultSubscriber = (subscriber: Subscriber): void => {
  config.set(`session.subscriber`, subscriber)
}

export const getDefaultSubscriber = (): Subscriber => {
  const subscriber = config.get(`session.subscriber`)
  if (subscriber === undefined) {
    throw new Error(`no default subscriber set`)
  } else {
    return subscriber as Subscriber
  }
}

export const getDefaultSubscriberId = (): string => {
  return getDefaultSubscriber().id
}

export const resolveSubscriber = async (subscribers: Subscriber[]): Promise<boolean> => {
  debug(subscribers)
  const subscribersSize = size(subscribers)
  if (subscribersSize === 1 && subscribers[0]) {
    saveDefaultSubscriber(subscribers[0])
    return true
  } else {
    if (subscribersSize >= 100) {
      ux.log(`Too many results to select during login`)
      ux.log(`Use the following command to search subscribers:`)
      ux.log(`    relay subscriber list --name "Account Name"`)
      ux.log(`    relay subscriber list --email "Owner Email"`)
      ux.log(`    `)
      ux.log(`Use the follwing command to set the default subscriber:`)
      ux.log(`    relay subscriber set --subscriber-id "Account ID"`)
      ux.log(`    relay subscriber set --name "Account Name"`)
      ux.log(`    relay subscriber set --email "Owner Email"`)
      return true
    } else {
      const subscriberIdx: number = await select({
        message: `Pick your default Relay account`,
        choices: map(subscribers, (subscriber, value) => ({ name: `${subscriber.name} (${subscriber.id})`, value })),
        pageSize: 10,
      })

      debug(`choosen index`, subscriberIdx)

      const subscriber = subscribers[subscriberIdx]
      if (subscriber) {
        debug(`choosen subscriber`, subscriber)
        saveDefaultSubscriber(subscriber)
        if (subscribersSize > 1) {
          ux.log(`=====================`)
          ux.log(`Default Relay Account`)
          ux.log(`${subscriber.name} (${subscriber.id})`)
          ux.log(`=====================`)
        }
        return true
      } else {
        return false
      }
    }
  }
}
