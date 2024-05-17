`relay subscriber`
==================

show default subscriber

* [`relay subscriber get`](#relay-subscriber-get)
* [`relay subscriber list`](#relay-subscriber-list)
* [`relay subscriber set`](#relay-subscriber-set)

## `relay subscriber get`

show default subscriber

```
USAGE
  $ relay subscriber:get

DESCRIPTION
  show default subscriber
```

_See code: [dist/commands/subscriber/get.ts](https://github.com/relaypro/relay-cli/blob/v1.9.0/dist/commands/subscriber/get.ts)_

## `relay subscriber list`

list subscribers

```
USAGE
  $ relay subscriber:list [-n <value> | -e <value>] [-a] [-s <value>]

FLAGS
  -a, --[no-]all       retrieve all results
  -e, --email=<value>  owner email
  -n, --name=<value>   accounnt name
  -s, --size=<value>   [default: 100] size of the page of results

DESCRIPTION
  list subscribers
```

_See code: [dist/commands/subscriber/list.ts](https://github.com/relaypro/relay-cli/blob/v1.9.0/dist/commands/subscriber/list.ts)_

## `relay subscriber set`

set the default subscriber

```
USAGE
  $ relay subscriber:set [-s <value> |  | -e <value>]

FLAGS
  -e, --email=<value>          owner email
  -s, --subscriber-id=<value>  subscriber id

DESCRIPTION
  set the default subscriber
```

_See code: [dist/commands/subscriber/set.ts](https://github.com/relaypro/relay-cli/blob/v1.9.0/dist/commands/subscriber/set.ts)_
