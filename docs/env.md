`relay env`
===========

displays the configured environment

* [`relay env`](#relay-env)

## `relay env`

displays the configured environment

```
USAGE
  $ relay env

DESCRIPTION
  displays the configured environment

EXAMPLES
  Define API and Auth Hosts using shell environment variables:
  # Auth
  RELAY_ENV=qa                               # default
  RELAY_ENV=pro
  # API
  RELAY_HOST=all-api-qa-ibot.relaysvr.com    # default
  RELAY_HOST=all-main-pro-ibot.relaysvr.com
```

_See code: [dist/commands/env.ts](https://github.com/relaypro/relay-cli/blob/v0.2.5/dist/commands/env.ts)_
