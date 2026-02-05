`relay user`
============

list current user profiles

* [`relay user list`](#relay-user-list)

## `relay user list`

list current user profiles

```
USAGE
  $ relay user:list -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  list current user profiles
```

_See code: [dist/commands/user/list.ts](https://github.com/relaypro/relay-cli/blob/v1.10.1/dist/commands/user/list.ts)_
