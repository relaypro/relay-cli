`relay positions`
=================

list all positions by venue

* [`relay positions`](#relay-positions)

## `relay positions`

list all positions by venue

```
USAGE
  $ relay positions -s <value> -v <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: ae0f3ba5-e35e-421a-98e2-e9ae93136997] subscriber id
  -v, --venue-id=<value>       (required) venue id
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
  list all positions by venue
```

_See code: [dist/commands/positions.ts](https://github.com/relaypro/relay-cli/blob/v1.6.0/dist/commands/positions.ts)_
