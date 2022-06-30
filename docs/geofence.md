`relay geofence`
================

Create geofence

* [`relay geofence create`](#relay-geofence-create)
* [`relay geofence delete`](#relay-geofence-delete)
* [`relay geofence list`](#relay-geofence-list)

## `relay geofence create`

Create geofence

```
USAGE
  $ relay geofence:create -s <value> -n <value> -r <value> [-N] [-a <value> | -g <value> | -t <value>]

FLAGS
  -n, --name=<value>           (required) friendly name of the geofence
  -r, --radius=<value>         (required) radius in meters that defines the geofence circle
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -N, --dry-run
  -a, --address=<value>        street address of the geofence
  -g, --longitude=<value>      longitude coordinate between [-180, 180]
  -t, --latitude=<value>       latitude coordinate between [-90, 90]

DESCRIPTION
  Create geofence
```

_See code: [dist/commands/geofence/create.ts](https://github.com/relaypro/relay-cli/blob/v1.1.0/dist/commands/geofence/create.ts)_

## `relay geofence delete`

Delete geofence

```
USAGE
  $ relay geofence:delete -s <value> -i <value>

FLAGS
  -i, --id=<value>             (required) Geofence id to delete
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Delete geofence
```

_See code: [dist/commands/geofence/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.1.0/dist/commands/geofence/delete.ts)_

## `relay geofence list`

List geofence configurations

```
USAGE
  $ relay geofence:list -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --sort=<value>               property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List geofence configurations
```

_See code: [dist/commands/geofence/list.ts](https://github.com/relaypro/relay-cli/blob/v1.1.0/dist/commands/geofence/list.ts)_
