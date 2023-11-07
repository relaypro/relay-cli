`relay task`
============

Manage task configurations

* [`relay task delete`](#relay-task-delete)
* [`relay task groups create NAMESPACE NAME TYPE MAJOR ASSIGN-TO MEMBERS`](#relay-task-groups-create-namespace-name-type-major-assign-to-members)
* [`relay task groups delete GROUP ID`](#relay-task-groups-delete-group-id)
* [`relay task groups list`](#relay-task-groups-list)
* [`relay task list`](#relay-task-list)
* [`relay task schedule NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS START TIMEZONE`](#relay-task-schedule-namespace-type-major-name-assign-to-args-start-timezone)
* [`relay task start NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS`](#relay-task-start-namespace-type-major-name-assign-to-args)
* [`relay task types create NAMESPACE NAME SOURCE`](#relay-task-types-create-namespace-name-source)
* [`relay task types delete NAMESPACE NAME`](#relay-task-types-delete-namespace-name)
* [`relay task types dump NAMESPACE`](#relay-task-types-dump-namespace)
* [`relay task types fetch NAMESPACE TYPE MAJOR MINOR`](#relay-task-types-fetch-namespace-type-major-minor)
* [`relay task types list majors NAMESPACE TYPE`](#relay-task-types-list-majors-namespace-type)
* [`relay task types list minors NAMESPACE TYPE MAJOR`](#relay-task-types-list-minors-namespace-type-major)
* [`relay task types list types NAMESPACE`](#relay-task-types-list-types-namespace)
* [`relay task types update major NAMESPACE NAME SOURCE`](#relay-task-types-update-major-namespace-name-source)
* [`relay task types update minor NAMESPACE NAME MAJOR SOURCE`](#relay-task-types-update-minor-namespace-name-major-source)

## `relay task delete`

Delete a running or scheduled task

```
USAGE
  $ relay task:delete -s <value> [--scheduled] [-i <value> | --tag <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -i, --task-id=<value>        Task identifier to delete
  --scheduled                  Delete a scheduled task
  --tag=<value>...             Delete all tasks with the specified tag

DESCRIPTION
  Delete a running or scheduled task
```

_See code: [dist/commands/task/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/delete.ts)_

## `relay task groups create NAMESPACE NAME TYPE MAJOR ASSIGN-TO MEMBERS`

Create a task group

```
USAGE
  $ relay task:groups:create [NAMESPACE] [NAME] [TYPE] [MAJOR] [ASSIGN-TO] [MEMBERS] -s <value>

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

_See code: [dist/commands/task/groups/create.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/groups/create.ts)_

## `relay task groups delete GROUP ID`

Delete a task group

```
USAGE
  $ relay task:groups:delete [GROUP ID] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
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

_See code: [dist/commands/task/groups/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/groups/delete.ts)_

## `relay task groups list`

List task groups

```
USAGE
  $ relay task:groups:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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

_See code: [dist/commands/task/groups/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/groups/list.ts)_

## `relay task list`

List task configurations

```
USAGE
  $ relay task:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--scheduled] [-t <value>] [-g <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -g, --group-id=<value>       Group ID
  -t, --tag=<value>...         Tag
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --scheduled                  List scheduled tasks
  --sort=<value>               property to sort by (prepend '-' for descending)

DESCRIPTION
  List task configurations
```

_See code: [dist/commands/task/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/list.ts)_

## `relay task schedule NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS START TIMEZONE`

Schedule a task with the given configuration

```
USAGE
  $ relay task:schedule [NAMESPACE] [TYPE] [MAJOR] [NAME] [ASSIGN-TO] [ARGS] [START] [TIMEZONE] -s <value> [--tag
    <value>] [-c <value> -f monthly|weekly|daily|hourly|minutely] [-u <value> ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Name of the task type for this task
  MAJOR      Major version of the task type
  NAME       Name of the task
  ASSIGN-TO  Devices on which to start this task
  ARGS       Encoded JSON or @filename
  START      Start time in ISO format in specified timezone
  TIMEZONE   (America/Anchorage|America/Chicago|America/Denver|America/Los_Angeles|America/New_York|America/Phoenix|Paci
             fic/Honolulu) Timezone of start time

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -c, --count=<value>          Number of times to repeat
  -f, --frequency=<option>     Repeat frequency
                               <options: monthly|weekly|daily|hourly|minutely>
  -u, --until=<value>          Until timstamp
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Schedule a task with the given configuration
```

_See code: [dist/commands/task/schedule.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/schedule.ts)_

## `relay task start NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS`

Start a task with the given configuration

```
USAGE
  $ relay task:start [NAMESPACE] [TYPE] [MAJOR] [NAME] [ASSIGN-TO] [ARGS] -s <value> [--tag <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Name of the task type for this task
  MAJOR      Major version of the task type
  NAME       Name of the task
  ASSIGN-TO  Devices on which to start this task
  ARGS       Encoded JSON or @filename

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Start a task with the given configuration
```

_See code: [dist/commands/task/start.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/start.ts)_

## `relay task types create NAMESPACE NAME SOURCE`

Create a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task:types:create [NAMESPACE] [NAME] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Create a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task/types/create.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/create.ts)_

## `relay task types delete NAMESPACE NAME`

Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task:types:delete [NAMESPACE] [NAME] -s <value>

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id

DESCRIPTION
  Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task/types/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/delete.ts)_

## `relay task types dump NAMESPACE`

Dumps task types along with their latest minor, major, and comment

```
USAGE
  $ relay task:types:dump [NAMESPACE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type

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
  Dumps task types along with their latest minor, major, and comment
```

_See code: [dist/commands/task/types/dump.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/dump.ts)_

## `relay task types fetch NAMESPACE TYPE MAJOR MINOR`

Fetch a specific minor

```
USAGE
  $ relay task:types:fetch [NAMESPACE] [TYPE] [MAJOR] [MINOR] -s <value> [--columns <value> | -x] [--sort <value>]
    [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name
  MAJOR      Major version
  MINOR      Minor version. Pass in "latest" to get latest version

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
  Fetch a specific minor
```

_See code: [dist/commands/task/types/fetch.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/fetch.ts)_

## `relay task types list majors NAMESPACE TYPE`

List task type configurations

```
USAGE
  $ relay task:types:list:majors [NAMESPACE] [TYPE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name

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
  List task type configurations
```

_See code: [dist/commands/task/types/list/majors.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/list/majors.ts)_

## `relay task types list minors NAMESPACE TYPE MAJOR`

List task type configurations

```
USAGE
  $ relay task:types:list:minors [NAMESPACE] [TYPE] [MAJOR] -s <value> [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name
  MAJOR      Major version

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
  List task type configurations
```

_See code: [dist/commands/task/types/list/minors.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/list/minors.ts)_

## `relay task types list types NAMESPACE`

List task type configurations

```
USAGE
  $ relay task:types:list:types [NAMESPACE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) [default: account] Namespace of the task type

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
  List task type configurations
```

_See code: [dist/commands/task/types/list/types.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/list/types.ts)_

## `relay task types update major NAMESPACE NAME SOURCE`

Update a task type's major. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task:types:update:major [NAMESPACE] [NAME] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Update a task type's major. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task/types/update/major.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/update/major.ts)_

## `relay task types update minor NAMESPACE NAME MAJOR SOURCE`

Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task:types:update:minor [NAMESPACE] [NAME] [MAJOR] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  MAJOR      Major version
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task/types/update/minor.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task/types/update/minor.ts)_
