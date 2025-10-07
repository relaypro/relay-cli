// Copyright © 2022 Relay Inc.

import { URL } from 'url'

export const ROOT_DOMAIN = `relaysvr.com`

type EnvConfig = {
  host: string,
  authHost: string,
  authRedirectHost: string,
  authRedirectPort: number,
  authorizationEndpoint: string,
  tokenEndpoint: string,
  endSessionEndpoint: string,
  contentHost: string,
  cli_id: string,
  sdk_id: string,
}

type Env = `qa`|`pro`|`qa-legacy`|`pro-legacy`

const qa: EnvConfig = {
  host: `all-main-qa-ibot.${ROOT_DOMAIN}`,
  authHost: `auth2.relaygo.info`,
  authRedirectHost: `auth2-localredirect.relaygo.info`,
  authRedirectPort: 8079,
  authorizationEndpoint: `/realms/Relay/protocol/openid-connect/auth`,
  tokenEndpoint: `/realms/Relay/protocol/openid-connect/token`,
  endSessionEndpoint: `/realms/Relay/protocol/openid-connect/logout`,
  contentHost: `qa.relaygo.info`,
  cli_id: `4EgeETYm`,
  sdk_id: `rGGK996c`,
}

const pro: EnvConfig = {
  host: `all-main-pro-ibot.${ROOT_DOMAIN}`,
  authHost: `auth.relaypro.com`,
  authRedirectHost: `auth-localredirect.relaypro.com`,
  authRedirectPort: 8079,
  authorizationEndpoint: `/realms/Relay/protocol/openid-connect/auth`,
  tokenEndpoint: `/realms/Relay/protocol/openid-connect/token`,
  endSessionEndpoint: `/realms/Relay/protocol/openid-connect/logout`,
  contentHost: `relaypro.com`,
  cli_id: `83756T4P`,
  sdk_id: `RJZKRhh9`,
}

const config: Record<Env, EnvConfig> = {
  qa,
  pro,
  [`qa-legacy`]: {
    ...qa,
    authHost: `auth.relaygo.info`,
    authRedirectHost: `localhost`,
    authorizationEndpoint: `/oauth2/authorization`,
    tokenEndpoint: `/oauth2/token`,
    endSessionEndpoint: `/logout`,

  },
  [`pro-legacy`]: {
    ...pro,
    authHost: `auth.relaygo.com`,
    authRedirectHost: `localhost`,
    authorizationEndpoint: `/oauth2/authorization`,
    tokenEndpoint: `/oauth2/token`,
    endSessionEndpoint: `/logout`,
  }
}

export class Vars {
  get legacy(): ``|`-legacy` {
    const _legacy = process.env.RELAY_LEGACY_AUTH
    if (_legacy) {
      if (_legacy === `1` || _legacy === `true`) {
        return `-legacy`
      }
    }
    return ``
  }
  get rawEnv(): Env {
    if (process.env.RELAY_ENV) {
      if (process.env.RELAY_ENV !== `qa` && process.env.RELAY_ENV !== `pro`) {
        throw new Error(`RELAY_ENV must be set to either "qa" or "pro"`)
      } else {
        return process.env.RELAY_ENV
      }
    } else {
      return `pro`
    }
  }

  get env(): Env {
    const _env = process.env.RELAY_ENV
    if (_env) {
      if (_env !== `qa` && _env !== `pro`) {
        throw new Error(`RELAY_ENV must be set to either "qa" or "pro"`)
      } else {
        return `${_env}${this.legacy}`
      }
    }
    return `pro${this.legacy}`
  }

  get host(): string {
    const h = process.env.RELAY_HOST ?? config[this.env].host
    if (!h.includes(this.rawEnv)) {
      process.env.RELAY_ENV && console.error(`RELAY_ENV=${process.env.RELAY_ENV}`)
      process.env.RELAY_HOST && console.error(`RELAY_HOST=${process.env.RELAY_HOST}`)
      console.error(`Host and environment must align`)
      throw new Error(`Environment / host mismatch`)
    } else {
      return h
    }
  }

  get apiUrl(): string {
    return this.host.startsWith(`http`) ? this.host : `https://${this.host}`
  }

  get apiHost(): string {
    if (this.host.startsWith(`http`)) {
      const u = new URL(this.host)
      if (u.host) return u.host
    }
    return `${this.host}`
  }

  get authHost(): string {
    return config[this.env].authHost
  }

  get authorizationEndpoint(): string {
    return `https://${this.authHost}${config[this.env].authorizationEndpoint}`
  }

  get tokenEndpoint(): string {
    return `https://${this.authHost}${config[this.env].tokenEndpoint}`
  }

  get endSessionEndpoint(): string {
    return `https://${this.authHost}${config[this.env].endSessionEndpoint}`
  }

  get authCliId(): string {
    return process.env.RELAY_AUTH_CLIENT_ID ?? config[this.env].cli_id
  }

  get authSdkId(): string {
    return process.env.RELAY_AUTH_SDK_CLIENT_ID ?? config[this.env].sdk_id
  }

  get authRedirectPort(): number {
    return config[this.env].authRedirectPort
  }

  get authRedirectUrlBase(): string {
    return `http://${config[this.env].authRedirectHost}:${this.authRedirectPort }`
  }

  get authRedirectUrl(): string {
    return `${this.authRedirectUrlBase}/authorization-code/callback`
  }

  get postLogoutRedirectUrl(): string {
    return `${this.authRedirectUrlBase}/end-session/callback`
  }

  get contentHost(): string {
    return config[this.env].contentHost
  }

  get contentUrl(): string {
    return `https://${this.contentHost}`
  }
}

export const vars = new Vars()
