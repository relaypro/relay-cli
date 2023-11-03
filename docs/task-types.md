`relay task-types`
==================

Manage task type configurations

* [`relay task-types create NAMESPACE NAME SOURCE`](#relay-task-types-create-namespace-name-source)
* [`relay task-types delete NAMESPACE NAME`](#relay-task-types-delete-namespace-name)
* [`relay task-types dump NAMESPACE`](#relay-task-types-dump-namespace)
* [`relay task-types fetch NAMESPACE TYPE MAJOR MINOR`](#relay-task-types-fetch-namespace-type-major-minor)
* [`relay task-types list majors NAMESPACE TYPE`](#relay-task-types-list-majors-namespace-type)
* [`relay task-types list minors NAMESPACE TYPE MAJOR`](#relay-task-types-list-minors-namespace-type-major)
* [`relay task-types list types NAMESPACE`](#relay-task-types-list-types-namespace)
* [`relay task-types update major NAMESPACE NAME SOURCE`](#relay-task-types-update-major-namespace-name-source)
* [`relay task-types update minor NAMESPACE NAME MAJOR SOURCE`](#relay-task-types-update-minor-namespace-name-major-source)

## `relay task-types create NAMESPACE NAME SOURCE`

Create a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:create [NAMESPACE] [NAME] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Create a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/create.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/create.ts)_

## `relay task-types delete NAMESPACE NAME`

Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:delete [NAMESPACE] [NAME] -s <value>

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Delete a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/delete.ts)_

## `relay task-types dump NAMESPACE`

Dumps task types along with their latest minor, major, and comment

```
USAGE
  $ relay task-types:dump [NAMESPACE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type

FLAGS

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

_See code: [dist/commands/task-types/dump.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/dump.ts)_

## `relay task-types fetch NAMESPACE TYPE MAJOR MINOR`

Fetch a specific minor

```
USAGE
  $ relay task-types:fetch [NAMESPACE] [TYPE] [MAJOR] [MINOR] -s <value> [--columns <value> | -x] [--sort <value>]
    [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name
  MAJOR      Major version
  MINOR      Minor version. Pass in "latest" to get latest version

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

DESCRIPTION
  Fetch a specific minor
```

_See code: [dist/commands/task-types/fetch.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/fetch.ts)_

## `relay task-types list majors NAMESPACE TYPE`

List task type configurations

```
USAGE
  $ relay task-types:list:majors [NAMESPACE] [TYPE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name

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

DESCRIPTION
  List task type configurations
```

_See code: [dist/commands/task-types/list/majors.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/list/majors.ts)_

## `relay task-types list minors NAMESPACE TYPE MAJOR`

List task type configurations

```
USAGE
  $ relay task-types:list:minors [NAMESPACE] [TYPE] [MAJOR] -s <value> [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  TYPE       Task type name
  MAJOR      Major version

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

DESCRIPTION
  List task type configurations
```

_See code: [dist/commands/task-types/list/minors.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/list/minors.ts)_

## `relay task-types list types NAMESPACE`

List task type configurations

```
USAGE
  $ relay task-types:list:types [NAMESPACE] -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  NAMESPACE  (account|system) [default: account] Namespace of the task type

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

DESCRIPTION
  List task type configurations
```

_See code: [dist/commands/task-types/list/types.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/list/types.ts)_

## `relay task-types update major NAMESPACE NAME SOURCE`

Update a task type's major. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:update:major [NAMESPACE] [NAME] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Update a task type's major. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/update/major.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/update/major.ts)_

## `relay task-types update minor NAMESPACE NAME MAJOR SOURCE`

Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.

```
USAGE
  $ relay task-types:update:minor [NAMESPACE] [NAME] [MAJOR] [SOURCE] -s <value> [-k <value>]

ARGUMENTS
  NAMESPACE  (account|system) Namespace of the task type
  NAME       Task type name
  MAJOR      Major version
  SOURCE     Capsule source file name

FLAGS
  -s, --subscriber-id=<value>       (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -k, --key=<branch>@<commit hash>  Git version of source file

DESCRIPTION
  Update a task type. Must have admin priviledges and RELAY_ADMIN_TOKEN env variable set to run this command.
```

_See code: [dist/commands/task-types/update/minor.ts](https://github.com/relaypro/relay-cli/blob/v1.8.1/dist/commands/task-types/update/minor.ts)_
