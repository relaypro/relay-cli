relay
=====

Relay Workflow developer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/relay.svg)](https://npmjs.org/package/relay)
[![Downloads/week](https://img.shields.io/npm/dw/relay.svg)](https://npmjs.org/package/relay)
[![License](https://img.shields.io/npm/l/relay.svg)](https://github.com/BrandonSmith/relay/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @relaypro/cli
$ relay COMMAND
running command...
$ relay (-v|--version|version)
@relaypro/cli/0.0.0 darwin-x64 node-v14.15.4
$ relay --help [COMMAND]
USAGE
  $ relay COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`relay autocomplete [SHELL]`](#relay-autocomplete-shell)
* [`relay commands`](#relay-commands)
* [`relay devices`](#relay-devices)
* [`relay help [COMMAND]`](#relay-help-command)
* [`relay login`](#relay-login)
* [`relay logout`](#relay-logout)
* [`relay whoami`](#relay-whoami)
* [`relay workflow:args`](#relay-workflowargs)
* [`relay workflow:args:get ARG`](#relay-workflowargsget-arg)
* [`relay workflow:args:set`](#relay-workflowargsset)
* [`relay workflow:args:unset`](#relay-workflowargsunset)
* [`relay workflow:create ID`](#relay-workflowcreate-id)
* [`relay workflow:delete`](#relay-workflowdelete)
* [`relay workflow:dev FILE`](#relay-workflowdev-file)
* [`relay workflow:install ID`](#relay-workflowinstall-id)
* [`relay workflow:list`](#relay-workflowlist)
* [`relay workflow:uninstall ID`](#relay-workflowuninstall-id)

## `relay autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ relay autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ relay autocomplete
  $ relay autocomplete bash
  $ relay autocomplete zsh
  $ relay autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `relay commands`

list all the commands

```
USAGE
  $ relay commands

OPTIONS
  -h, --help              show CLI help
  -j, --json              display unfiltered api data in json format
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --hidden                show hidden commands
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v1.3.0/src/commands/commands.ts)_

## `relay devices`

list all device ids

```
USAGE
  $ relay devices
```

_See code: [dist/commands/devices.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/devices.ts)_

## `relay help [COMMAND]`

display help for relay

```
USAGE
  $ relay help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `relay login`

login with your Relay credentials

```
USAGE
  $ relay login

OPTIONS
  -i, --interactive  login with username/password
```

_See code: [dist/commands/login.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/login.ts)_

## `relay logout`

logout and forget any tokens

```
USAGE
  $ relay logout
```

_See code: [dist/commands/logout.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/logout.ts)_

## `relay whoami`

display the current logged in user

```
USAGE
  $ relay whoami

ALIASES
  $ relay whoami
```

_See code: [dist/commands/whoami.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/whoami.ts)_

## `relay workflow:args`

list a workflow's args

```
USAGE
  $ relay workflow:args

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

_See code: [dist/commands/workflow/args/index.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/args/index.ts)_

## `relay workflow:args:get ARG`

display a single workflow arguments

```
USAGE
  $ relay workflow:args:get ARG

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

_See code: [dist/commands/workflow/args/get.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/args/get.ts)_

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

_See code: [dist/commands/workflow/args/set.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/args/set.ts)_

## `relay workflow:args:unset`

unset one or more workflow arguments

```
USAGE
  $ relay workflow:args:unset

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

_See code: [dist/commands/workflow/args/unset.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/args/unset.ts)_

## `relay workflow:create ID`

create or update a workflow

```
USAGE
  $ relay workflow:create ID

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

_See code: [dist/commands/workflow/create.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/create.ts)_

## `relay workflow:delete`

destructively delete and remove a workflow

```
USAGE
  $ relay workflow:delete

OPTIONS
  -w, --workflow-id=workflow-id  (required) workflow id
```

_See code: [dist/commands/workflow/delete.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/delete.ts)_

## `relay workflow:dev FILE`

workflow development

```
USAGE
  $ relay workflow:dev FILE

ARGUMENTS
  FILE  nodejs app entry point
```

_See code: [dist/commands/workflow/dev/index.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/dev/index.ts)_

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

_See code: [dist/commands/workflow/install.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/install.ts)_

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

_See code: [dist/commands/workflow/list.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/list.ts)_

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

_See code: [dist/commands/workflow/uninstall.ts](https://github.com/relaypro/relay-js/blob/v0.0.0/dist/commands/workflow/uninstall.ts)_
<!-- commandsstop -->
