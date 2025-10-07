// Copyright © 2022 Relay Inc.

import deps from './deps'
import { vars } from './vars'

export type Subscriber = {
  id: string,
}

export type User = {
  email: string,
  userid: string,
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

export const acceptTerms = (): void => {
  deps.termsConfig.set(`terms.accepted`, true)
}

export const hasPreviouslyAcceptedTerms = (): boolean => {
  return deps.termsConfig.get(`terms.accepted`) === true
}
