`relay tag`
===========

Manages configurations that can be associated with an NFC tag

* [`relay tag create`](#relay-tag-create)
* [`relay tag delete`](#relay-tag-delete)
* [`relay tag list`](#relay-tag-list)
* [`relay tag update`](#relay-tag-update)

## `relay tag create`

Creates a tag configuration.

```
USAGE
  $ relay tag:create -s <value> -c <value> -l <value>

FLAGS
  -c, --category=<value>       (required) Sets the custom category; useful to group like tags in the same category
  -l, --label=<value>          (required) Sets the tag label; useful to differentiate individual tags
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Creates a tag configuration.
```

_See code: [dist/commands/tag/create.ts](https://github.com/relaypro/relay-cli/blob/v1.10.0/dist/commands/tag/create.ts)_

## `relay tag delete`

Deletes a tag configuration.

```
USAGE
  $ relay tag:delete -s <value> -t <value>

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -t, --tag-id=<value>         (required) Tag identifier to delete

DESCRIPTION
  Deletes a tag configuration.
```

_See code: [dist/commands/tag/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.10.0/dist/commands/tag/delete.ts)_

## `relay tag list`

Lists all tag configurations.

```
USAGE
  $ relay tag:list -s <value> [--json] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [-c <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -c, --category=<value>       Show only tags of this category
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
  Lists all tag configurations.
```

_See code: [dist/commands/tag/list.ts](https://github.com/relaypro/relay-cli/blob/v1.10.0/dist/commands/tag/list.ts)_

## `relay tag update`

Updates a tag configuration.

```
USAGE
  $ relay tag:update -s <value> -t <value> -c <value> -l <value>

FLAGS
  -c, --category=<value>       (required) Sets the custom category; useful to group like tags in the same category
  -l, --label=<value>          (required) Sets the tag label; useful to differentiate individual tags
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -t, --tag-id=<value>         (required) Tag identifier to update

DESCRIPTION
  Updates a tag configuration.
```

_See code: [dist/commands/tag/update.ts](https://github.com/relaypro/relay-cli/blob/v1.10.0/dist/commands/tag/update.ts)_
