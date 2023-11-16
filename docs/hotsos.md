`relay hotsos`
==============

Manage HotSOS integrations

* [`relay hotsos start NAMESPACE MAJOR CONFIG`](#relay-hotsos-start-namespace-major-config)
* [`relay hotsos stop NAME`](#relay-hotsos-stop-name)

## `relay hotsos start NAMESPACE MAJOR CONFIG`

Start a HotSOS poller with the given configuration

```
USAGE
  $ relay hotsos:start [NAMESPACE] [MAJOR] [CONFIG] -s <value> -n <value> [--tag <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  MAJOR      Major version
  CONFIG     Subscriber config file name

FLAGS
  -n, --name=<value>           (required) [default: hotsos_poller] Task name
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  --tag=<value>...             Tag to tie to poller

DESCRIPTION
  Start a HotSOS poller with the given configuration
```

_See code: [dist/commands/hotsos/start.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/hotsos/start.ts)_

## `relay hotsos stop NAME`

Stop a running HotSOS poller task

```
USAGE
  $ relay hotsos:stop [NAME] -s <value>

ARGUMENTS
  NAME  [default: hotsos_poller] Task name

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id

DESCRIPTION
  Stop a running HotSOS poller task
```

_See code: [dist/commands/hotsos/stop.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/hotsos/stop.ts)_
