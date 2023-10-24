`relay alice`
=============

something

* [`relay alice ticketer start`](#relay-alice-ticketer-start)
* [`relay alice webhook start`](#relay-alice-webhook-start)

## `relay alice ticketer start`

something

```
USAGE
  $ relay alice:ticketer:start -s <value> -N account|system -n <value> --tag <value> -m <value> -c <value> -t <value> -p
    <value> -I <value> [--json] [-N] [-i <value> | -A | -G <value>]

FLAGS
  -I, --service_id=<value>     (required) Tickets are created in this Alice service
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -c, --config=<value>         (required) Subscriber config file name
  -m, --major=<value>          (required) [default: 1] Major version
  -n, --name=<value>           (required) [default: alice_webhook] Task name
  -p, --phrases=<value>...     (required) List of phrase strings
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -t, --type=<value>           (required) Name of the task type
  --tag=<value>...             (required) Tag to tie to webhook
  -A, --install-all            Enable rule to install workflow on all device and users on the account
  -G, --install-group=<value>  Enable rule to install workflow on a group of device and users
  -N, --dry-run
  -i, --install=<value>...     device / user ID to install workflow on

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  something
```

_See code: [dist/commands/alice/ticketer/start.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/alice/ticketer/start.ts)_

## `relay alice webhook start`

Start an Alice webhook with the given configuration

```
USAGE
  $ relay alice:webhook:start -s <value> -N account|system -n <value> --tag <value> -m <value> -c <value>

FLAGS
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -c, --config=<value>         (required) Subscriber config file name
  -m, --major=<value>          (required) [default: 1] Major version
  -n, --name=<value>           (required) [default: alice_webhook] Task name
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  --tag=<value>...             (required) Tag to tie to webhook

DESCRIPTION
  Start an Alice webhook with the given configuration
```

_See code: [dist/commands/alice/webhook/start.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/alice/webhook/start.ts)_
