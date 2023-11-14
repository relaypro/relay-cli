`relay alice`
=============

Manage Alice integrations

* [`relay alice ticketer start NAMESPACE MAJOR CONFIG TYPE SERVICE-ID`](#relay-alice-ticketer-start-namespace-major-config-type-service-id)
* [`relay alice webhook start NAMESPACE MAJOR CONFIG`](#relay-alice-webhook-start-namespace-major-config)
* [`relay alice webhook stop NAME`](#relay-alice-webhook-stop-name)

## `relay alice ticketer start NAMESPACE MAJOR CONFIG TYPE SERVICE-ID`

Start an Alice ticketing workflow with the given configuration

```
USAGE
  $ relay alice:ticketer:start [NAMESPACE] [MAJOR] [CONFIG] [TYPE] [SERVICE-ID] -s <value> -n <value> --phrases <value>
    [-N] [-i <value> | -A | -G <value>] [--tag <value>]

ARGUMENTS
  NAMESPACE   (account|system) Namespace of the task type
  MAJOR       Major version
  CONFIG      Subscriber config file name
  TYPE        Name of task type
  SERVICE-ID  Tickets are created in this Alice service

FLAGS
  -n, --name=<value>           (required) [default: alice_webhook] Task name
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  --phrases=<value>...         (required) List of phrase strings
  -A, --install-all            Enable rule to install workflow on all device and users on the account
  -G, --install-group=<value>  Enable rule to install workflow on a group of device and users
  -N, --dry-run
  -i, --install=<value>...     device / user ID to install workflow on
  --tag=<value>...             Tag to tie to webhook

DESCRIPTION
  Start an Alice ticketing workflow with the given configuration
```

_See code: [dist/commands/alice/ticketer/start.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/alice/ticketer/start.ts)_

## `relay alice webhook start NAMESPACE MAJOR CONFIG`

Start an Alice webhook with the given configuration

```
USAGE
  $ relay alice:webhook:start [NAMESPACE] [MAJOR] [CONFIG] -s <value> -n <value> [--tag <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  MAJOR      Major version
  CONFIG     Subscriber config file name

FLAGS
  -n, --name=<value>           (required) [default: alice_webhook] Task name
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  --tag=<value>...             Tag to tie to webhook

DESCRIPTION
  Start an Alice webhook with the given configuration
```

_See code: [dist/commands/alice/webhook/start.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/alice/webhook/start.ts)_

## `relay alice webhook stop NAME`

Stop a running Alice webhook

```
USAGE
  $ relay alice:webhook:stop [NAME] -s <value>

ARGUMENTS
  NAME  [default: alice_webhook] Task name

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id

DESCRIPTION
  Stop a running Alice webhook
```

_See code: [dist/commands/alice/webhook/stop.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/alice/webhook/stop.ts)_
