`relay tasks`
=============

Manage task configurations

* [`relay tasks delete`](#relay-tasks-delete)
* [`relay tasks list`](#relay-tasks-list)
* [`relay tasks schedule`](#relay-tasks-schedule)
* [`relay tasks start`](#relay-tasks-start)

## `relay tasks delete`

Delete a running or scheduled task

```
USAGE
  $ relay tasks:delete -s <value> [--scheduled] [-i <value> | --tag <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -i, --task-id=<value>        Task identifier to delete
  --scheduled                  Delete a scheduled task
  --tag=<value>...             Delete all tasks with the specified tag

DESCRIPTION
  Delete a running or scheduled task
```

_See code: [dist/commands/tasks/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/tasks/delete.ts)_

## `relay tasks list`

List task configurations

```
USAGE
  $ relay tasks:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--scheduled] [--tag <value>]

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
  --scheduled                  List scheduled tasks
  --sort=<value>               property to sort by (prepend '-' for descending)
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  List task configurations
```

_See code: [dist/commands/tasks/list.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/tasks/list.ts)_

## `relay tasks schedule`

Schedule a task with the given configuration

```
USAGE
  $ relay tasks:schedule -s <value> -N account|system -t <value> -m <value> -n <value> -A <value> -a <value> -S
    <value> -T America/Anchorage|America/Chicago|America/Denver|America/Los_Angeles|America/New_York|America/Phoenix|Pac
    ific/Honolulu [--tag <value>] [-c <value> -f monthly|weekly|daily|hourly|minutely] [-u <value> ]

FLAGS
  -A, --assign-to=<value>      (required) Devices on which to start this task
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -S, --start=<value>          (required) Start time in ISO format in specified timezone
  -T, --timezone=<option>      (required) Timezone of start time
                               <options: America/Anchorage|America/Chicago|America/Denver|America/Los_Angeles|America/Ne
                               w_York|America/Phoenix|Pacific/Honolulu>
  -a, --args=<value>           (required) Encoded JSON or @filename
  -m, --major=<value>          (required) [default: 1] Major version of the task type
  -n, --name=<value>           (required) Name of the task
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -t, --type=<value>           (required) Name of the task type for this task
  -c, --count=<value>          Number of times to repeat
  -f, --frequency=<option>     Repeat frequency
                               <options: monthly|weekly|daily|hourly|minutely>
  -u, --until=<value>          Until timstamp
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Schedule a task with the given configuration
```

_See code: [dist/commands/tasks/schedule.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/tasks/schedule.ts)_

## `relay tasks start`

Start a task with the given configuration

```
USAGE
  $ relay tasks:start -s <value> -N account|system -t <value> -m <value> -n <value> -A <value> -a <value> [--tag
    <value>]

FLAGS
  -A, --assign-to=<value>      (required) Devices on which to start this task
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -a, --args=<value>           (required) Encoded JSON or @filename
  -m, --major=<value>          (required) [default: 1] Major version of the task type
  -n, --name=<value>           (required) Name of the task
  -s, --subscriber-id=<value>  (required) [default: 8efb6648-c26c-4147-bee8-fa4c6811fd03] subscriber id
  -t, --type=<value>           (required) Name of the task type for this task
  --tag=<value>...             Optional tag to tie to your task

DESCRIPTION
  Start a task with the given configuration
```

_See code: [dist/commands/tasks/start.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/tasks/start.ts)_
