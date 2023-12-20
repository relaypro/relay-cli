`relay subscriber`
==================

Show default subscriber

* [`relay subscriber get`](#relay-subscriber-get)
* [`relay subscriber list`](#relay-subscriber-list)
* [`relay subscriber set`](#relay-subscriber-set)

## `relay subscriber get`

Show default subscriber

```
USAGE
  $ relay subscriber:get

DESCRIPTION
  Show default subscriber
```

_See code: [dist/commands/subscriber/get.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/subscriber/get.ts)_

## `relay subscriber list`

List subscribers

```
USAGE
  $ relay subscriber:list [-n <value> | -e <value>] [-a] [-s <value>]

FLAGS
  -a, --[no-]all       retrieve all results
  -e, --email=<value>  owner email
  -n, --name=<value>   accounnt name
  -s, --size=<value>   [default: 100] size of the page of results

DESCRIPTION
  List subscribers
```

_See code: [dist/commands/subscriber/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/subscriber/list.ts)_

## `relay subscriber set`

Set the default subscriber

```
USAGE
  $ relay subscriber:set [-s <value> |  | -e <value>]

FLAGS
  -e, --email=<value>          owner email
  -s, --subscriber-id=<value>  subscriber id

DESCRIPTION
  Set the default subscriber
```

_See code: [dist/commands/subscriber/set.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/subscriber/set.ts)_
