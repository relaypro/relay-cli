`relay tasks`
=============

Manage task configurations

* [`relay tasks delete`](#relay-tasks-delete)
* [`relay tasks list`](#relay-tasks-list)
* [`relay tasks schedule NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS START TIMEZONE`](#relay-tasks-schedule-namespace-type-major-name-assign-to-args-start-timezone)
* [`relay tasks start NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS`](#relay-tasks-start-namespace-type-major-name-assign-to-args)

## `relay tasks delete`

Delete a running or scheduled task

```
USAGE
  $ relay tasks:delete -s <value> [--scheduled] [-i <value> | --tag <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -i, --task-id=<value>        Task identifier to delete
  --scheduled                  Delete a scheduled task
  --tag=<value>...             Delete all tasks with the specified tag

DESCRIPTION
  Delete a running or scheduled task
```

_See code: [dist/commands/tasks/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/tasks/delete.ts)_

## `relay tasks list`

List task configurations

```
USAGE
  $ relay tasks:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--scheduled] [-t <value>] [-g <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
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

_See code: [dist/commands/tasks/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/tasks/list.ts)_

## `relay tasks schedule NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS START TIMEZONE`

Schedule a task with the given configuration

```
USAGE
  $ relay tasks:schedule [NAMESPACE] [TYPE] [MAJOR] [NAME] [ASSIGN-TO] [ARGS] [START] [TIMEZONE] -s <value> [--tag
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
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -c, --count=<value>          Number of times to repeat
  -f, --frequency=<option>     Repeat frequency
                               <options: monthly|weekly|daily|hourly|minutely>
  -u, --until=<value>          Until timstamp
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Schedule a task with the given configuration
```

_See code: [dist/commands/tasks/schedule.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/tasks/schedule.ts)_

## `relay tasks start NAMESPACE TYPE MAJOR NAME ASSIGN-TO ARGS`

Start a task with the given configuration

```
USAGE
  $ relay tasks:start [NAMESPACE] [TYPE] [MAJOR] [NAME] [ASSIGN-TO] [ARGS] -s <value> [--tag <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Name of the task type for this task
  MAJOR      Major version of the task type
  NAME       Name of the task
  ASSIGN-TO  Devices on which to start this task
  ARGS       Encoded JSON or @filename

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Start a task with the given configuration
```

_See code: [dist/commands/tasks/start.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/tasks/start.ts)_
