`relay task-groups`
===================

Manage task group configurations

* [`relay task-groups create NAMESPACE NAME TYPE MAJOR ASSIGN-TO MEMBERS`](#relay-task-groups-create-namespace-name-type-major-assign-to-members)
* [`relay task-groups delete GROUP ID`](#relay-task-groups-delete-group-id)
* [`relay task-groups list`](#relay-task-groups-list)

## `relay task-groups create NAMESPACE NAME TYPE MAJOR ASSIGN-TO MEMBERS`

Create a task group

```
USAGE
  $ relay task-groups:create [NAMESPACE] [NAME] [TYPE] [MAJOR] [ASSIGN-TO] [MEMBERS] -s <value>

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Group name
  TYPE       Task type
  MAJOR      Major version
  ASSIGN-TO  Device name
  MEMBERS    Encoded JSON or @filename

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id

DESCRIPTION
  Create a task group
```

_See code: [dist/commands/task-groups/create.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-groups/create.ts)_

## `relay task-groups delete GROUP ID`

Delete a task group

```
USAGE
  $ relay task-groups:delete [GROUP ID] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  GROUP ID  Task group ID

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --sort=<value>               property to sort by (prepend '-' for descending)

DESCRIPTION
  Delete a task group
```

_See code: [dist/commands/task-groups/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-groups/delete.ts)_

## `relay task-groups list`

List task groups

```
USAGE
  $ relay task-groups:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --sort=<value>               property to sort by (prepend '-' for descending)

DESCRIPTION
  List task groups
```

_See code: [dist/commands/task-groups/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-groups/list.ts)_
