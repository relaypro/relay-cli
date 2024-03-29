// Copyright © 2022 Relay Inc.

import { size, map } from 'lodash'
import { CliUx } from '@oclif/core'

import debugFn from 'debug'

import deps from './deps'
import { vars } from './vars'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AutoComplete, Select } = require('enquirer') // eslint-disable-line quotes

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
  return deps.config.get(`session`) as Session
}

export const clearConfig = (): void => {
  deps.config.clear()
}

export const deleteSession = (): void => {
  deps.config.delete(`session`)
}

export const clearSubscribers = (): void => {
  deps.susbscriberConfig.clear()
}

export const getToken = (host: string = vars.apiHost): TokenAccount | undefined => {
  const tokens = deps.config.get(`session.tokens`) as SessionTokens
  return tokens?.[host]
}

export const setToken = (token: TokenAccount, host: string = vars.apiHost): void => {
  const tokens: SessionTokens = (deps.config.get(`session.tokens`) || {}) as SessionTokens
  tokens[host] = token
  deps.config.set(`session.tokens`, tokens)
}

export const saveDefaultSubscriber = (subscriber: Subscriber): void => {
  deps.config.set(`session.subscriber`, subscriber)
}

export const getDefaultSubscriber = (): Subscriber => {
  const subscriber = deps.config.get(`session.subscriber`)
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
      CliUx.ux.log(`Too many results to select during login`)
      CliUx.ux.log(`Use the following command to search subscribers:`)
      CliUx.ux.log(`    relay subscriber list --name "Account Name"`)
      CliUx.ux.log(`    relay subscriber list --email "Owner Email"`)
      CliUx.ux.log(`    `)
      CliUx.ux.log(`Use the follwing command to set the default subscriber:`)
      CliUx.ux.log(`    relay subscriber set --subscriber-id "Account ID"`)
      CliUx.ux.log(`    relay subscriber set --name "Account Name"`)
      CliUx.ux.log(`    relay subscriber set --email "Owner Email"`)
      return true
    } else {
      const selector = (subscribersSize > 25) ? AutoComplete : Select
      const subscriberPrompt = new selector({
        multiple: false,
        name: `subscriber`,
        message: `Pick your default Relay account`,
        choices: map(subscribers, (subscriber, value) => ({ name: `${subscriber.name} (${subscriber.id})`, value })),
        limit: 10,
      })

      const subscriberIdx: number = await subscriberPrompt.run()
      debug(`choosen index`, subscriberIdx)

      const subscriber = subscribers[subscriberIdx]
      if (subscriber) {
        debug(`choosen subscriber`, subscriber)
        saveDefaultSubscriber(subscriber)
        if (subscribersSize > 1) {
          CliUx.ux.log(`=====================`)
          CliUx.ux.log(`Default Relay Account`)
          CliUx.ux.log(`${subscriber.name} (${subscriber.id})`)
          CliUx.ux.log(`=====================`)
        }
        return true
      } else {
        return false
      }
    }
  }
}
