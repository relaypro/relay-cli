`relay analytics`
=================

Display and filter analytics

* [`relay analytics [CATEGORY]`](#relay-analytics-category)

## `relay analytics [CATEGORY]`

Display and filter analytics

```
USAGE
  $ relay analytics [CATEGORY] -s <value> [--json] [-w <value>] [-i <value>] [-u <value>] [-t system|user] [-p]
    [-l <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv |
    --no-truncate]] [--no-header | ]

ARGUMENTS
  CATEGORY  Can be workflow, tasks, or a custom category

FLAGS
  -s, --subscriber-id=<value>         (required) subscriber id
  -i, --workflow-instance-id=<value>  workflow instance id
  -l, --limit=<value>                 [default: 20] limit the number of events to retrieve
  -p, --parse                         whether to parse/process the analytic content based on the 'content_type'
  -t, --type=(system|user)            analytic type
  -u, --user-id=<value>               user id
  -w, --workflow-id=<value>           workflow id
  -x, --extended                      show extra columns
  --columns=<value>                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=<value>                    filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=<option>                   output in a more machine friendly format
                                      <options: csv|json|yaml>
  --sort=<value>                      property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Display and filter analytics
```

_See code: [dist/commands/analytics.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/analytics.ts)_
