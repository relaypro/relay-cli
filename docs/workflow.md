`relay workflow`
================

manage workflow configurations

* [`relay workflow:args`](#relay-workflowargs)
* [`relay workflow:args:get ARG`](#relay-workflowargsget-arg)
* [`relay workflow:args:set`](#relay-workflowargsset)
* [`relay workflow:args:unset`](#relay-workflowargsunset)
* [`relay workflow:create [ID]`](#relay-workflowcreate-id)
* [`relay workflow:delete`](#relay-workflowdelete)
* [`relay workflow:install ID`](#relay-workflowinstall-id)
* [`relay workflow:list`](#relay-workflowlist)
* [`relay workflow:uninstall ID`](#relay-workflowuninstall-id)

## `relay workflow:args`

list a workflow's args

```
USAGE
  $ relay workflow:args

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:args:get ARG`

display a single workflow arguments

```
USAGE
  $ relay workflow:args:get ARG

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:args:set`

set one or more workflow arguments

```
USAGE
  $ relay workflow:args:set

OPTIONS
  -b, --boolean=boolean          boolean arg name/value pair
  -n, --number=number            number arg name/value pair
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:args:unset`

unset one or more workflow arguments

```
USAGE
  $ relay workflow:args:unset

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:create [ID]`

create or update a workflow

```
USAGE
  $ relay workflow:create [ID]

ARGUMENTS
  ID  device / user ID to install workflow on

OPTIONS
  -b, --boolean=boolean        boolean arg name/value pair
  -h, --http
  -i, --hidden
  -n, --number=number          number arg name/value pair
  -t, --transient
  --arg=arg                    string arg name/value pair
  --button=(single|double)     [default: single]
  --name=name                  (required)
  --phrase=phrase
  --type=(phrase|button|http)  (required) [default: phrase]
  --uri=uri                    (required)
```

## `relay workflow:delete`

destructively delete and remove a workflow

```
USAGE
  $ relay workflow:delete

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:install ID`

install an existing workflow into one or more devices

```
USAGE
  $ relay workflow:install ID

ARGUMENTS
  ID  device / user ID to install workflow on

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

## `relay workflow:list`

list workflow configurations

```
USAGE
  $ relay workflow:list

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

## `relay workflow:uninstall ID`

uninstall an existing workflow from one or more devices

```
USAGE
  $ relay workflow:uninstall ID

ARGUMENTS
  ID  device / user ID to uninstall workflow on

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```
