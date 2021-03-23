`relay env`
===========

displays the configured environment

* [`relay env`](#relay-env)

## `relay env`

displays the configured environment

```
USAGE
  $ relay env

EXAMPLE
  Define API and Auth Hosts using shell environment variables:

  # Auth
  RELAY_ENV=qa                              # default
  RELAY_ENV=pro

  # API
  RELAY_HOST=all-api-qa-ibot.nocell.io      # default
  RELAY_HOST=all-api-pro-ibot.nocell.io
```

_See code: [dist/commands/env.ts](https://github.com/relaypro/relay-cli/blob/v0.0.4/dist/commands/env.ts)_
