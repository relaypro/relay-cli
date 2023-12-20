`relay env`
===========

Displays the configured environment

* [`relay env`](#relay-env)

## `relay env`

Displays the configured environment

```
USAGE
  $ relay env [--json] [-P]

FLAGS
  -P, --process  Include shell process environment variables

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays the configured environment

EXAMPLES
  Define API and Auth Hosts using shell environment variables:
  # Auth
  RELAY_ENV=pro                                # default
  RELAY_ENV=qa
  # API
  RELAY_HOST=all-main-pro-ibot.relaysvr.com  # default
  RELAY_HOST=all-main-qa-ibot.relaysvr.com
```

_See code: [dist/commands/env.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/env.ts)_
