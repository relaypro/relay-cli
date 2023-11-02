`relay task-types`
==================

Manage task type configurations

* [`relay task-types create`](#relay-task-types-create)
* [`relay task-types delete`](#relay-task-types-delete)
* [`relay task-types list`](#relay-task-types-list)
* [`relay task-types update`](#relay-task-types-update)

## `relay task-types create`

Create a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:create -s <value> -N account|system -n <value> -S <value> [-k <value>]

FLAGS
  -N, --namespace=<option>          (required) [default: account] Namespace of the task type
                                    <options: account|system>
  -S, --source=<value>              (required) Capsule source file name
  -n, --name=<value>                (required) Name for your task type
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Create a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/create.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/create.ts)_

## `relay task-types delete`

Delete a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:delete -s <value> -N account|system -n <value>

FLAGS
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -n, --name=<value>           (required) Name of task type to delete.
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Delete a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/delete.ts)_

## `relay task-types list`

List task type configurations

```
USAGE
  $ relay task-types:list -s <value> -N account|system [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--major <value> |  | [--types | --type
    <value> | --majors | --minors]]

FLAGS
  -N, --namespace=<option>     (required) [default: account] Namespace of the task type
                               <options: account|system>
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --major=<value>              Major version
  --majors                     List all majors for the task type
  --minors                     List all minors for task type and major
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --sort=<value>               property to sort by (prepend '-' for descending)
  --type=<value>               Task type name
  --types                      List all task types for the namespace

DESCRIPTION
  List task type configurations
```

_See code: [dist/commands/task-types/list.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/list.ts)_

## `relay task-types update`

Update a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:update -s <value> -N account|system -n <value> [-k <value>] (-M <value> -S <value>) [-m <value> -v
    <value> ]

FLAGS
  -N, --namespace=<option>          (required) [default: account] Namespace of the task type
                                    <options: account|system>
  -S, --source=<value>              (required) Capsule source file name
  -n, --name=<value>                (required) Task type name
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -M, --major=<value>               Update a task types major
  -k, --key=<branch>@<commit hash>  Git version of source file
  -m, --minor=<value>               Update a task types minor
  -v, --version=<value>             Major version of task type; for updating minor

DESCRIPTION
  Update a task type. Must have admin priviledges and ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/update.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/update.ts)_
