`relay workflow`
================

Manage workflow configurations

* [`relay workflow analytics`](#relay-workflow-analytics)
* [`relay workflow args get ARG`](#relay-workflow-args-get-arg)
* [`relay workflow args list`](#relay-workflow-args-list)
* [`relay workflow args set`](#relay-workflow-args-set)
* [`relay workflow args unset`](#relay-workflow-args-unset)
* [`relay workflow create battery`](#relay-workflow-create-battery)
* [`relay workflow create button`](#relay-workflow-create-button)
* [`relay workflow create call`](#relay-workflow-create-call)
* [`relay workflow create event`](#relay-workflow-create-event)
* [`relay workflow create geofence`](#relay-workflow-create-geofence)
* [`relay workflow create http`](#relay-workflow-create-http)
* [`relay workflow create nfc`](#relay-workflow-create-nfc)
* [`relay workflow create phrase`](#relay-workflow-create-phrase)
* [`relay workflow create position`](#relay-workflow-create-position)
* [`relay workflow create timer`](#relay-workflow-create-timer)
* [`relay workflow delete`](#relay-workflow-delete)
* [`relay workflow install`](#relay-workflow-install)
* [`relay workflow instance list`](#relay-workflow-instance-list)
* [`relay workflow list`](#relay-workflow-list)
* [`relay workflow logs`](#relay-workflow-logs)
* [`relay workflow trigger`](#relay-workflow-trigger)
* [`relay workflow uninstall`](#relay-workflow-uninstall)

## `relay workflow analytics`

Display and filter workflow analytics

```
USAGE
  $ relay workflow:analytics -s <value> [--json] [-w <value>] [-i <value>] [-u <value>] [-c <value>] [-t system|user]
    [-p] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv |
    --no-truncate]] [--no-header | ]

FLAGS
  -s, --subscriber-id=<value>         (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -c, --category=<value>              analytic category
  -i, --workflow-instance-id=<value>  workflow instance id
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
  Display and filter workflow analytics
```

_See code: [dist/commands/workflow/analytics.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/analytics.ts)_

## `relay workflow args get ARG`

display arguments for a workflow

```
USAGE
  $ relay workflow:args:get [ARG] -w <value> -s <value>

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id

DESCRIPTION
  display arguments for a workflow
```

_See code: [dist/commands/workflow/args/get.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/args/get.ts)_

## `relay workflow args list`

List a workflow's args

```
USAGE
  $ relay workflow:args:list -w <value> -s <value>

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id

DESCRIPTION
  List a workflow's args
```

_See code: [dist/commands/workflow/args/list.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/args/list.ts)_

## `relay workflow args set`

set one or more workflow arguments

```
USAGE
  $ relay workflow:args:set -w <value> -s <value> [-a <value>] [-b <value>] [-r <value>]

FLAGS
  -s, --subscriber-id=<value>         (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>           (required) workflow id
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -r, --number=arg1=100.0...          Number name/value pair workflow arg

DESCRIPTION
  set one or more workflow arguments
```

_See code: [dist/commands/workflow/args/set.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/args/set.ts)_

## `relay workflow args unset`

unset one or more workflow arguments

```
USAGE
  $ relay workflow:args:unset -w <value> -s <value>

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id

DESCRIPTION
  unset one or more workflow arguments
```

_See code: [dist/commands/workflow/args/unset.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/args/unset.ts)_

## `relay workflow create battery`

Create or update a workflow triggered by crossing a charging or discharging threshold of any device on the account

```
USAGE
  $ relay workflow:create:battery -n <value> -u <value> --trigger charge|discharge --threshold <value> [-N] [-i <value> | -A]
    [-t] [-e] [-a <value>] [-b <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --threshold=<value>                 (required) [default: 25] Threshold percentage as an integer to trigger workflow
  --trigger=(charge|discharge)        (required) [default: discharge] Trigger whether threshold value is reached when
                                      charging or discharging
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by crossing a charging or discharging threshold of any device on the account
```

_See code: [dist/commands/workflow/create/battery.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/battery.ts)_

## `relay workflow create button`

Create or update a workflow triggered by button taps

```
USAGE
  $ relay workflow:create:button -n <value> -u <value> --trigger single|double [-N] [-i <value> | -A] [-t] [-e] [-a <value>]
    [-b <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --trigger=(single|double)           (required) [default: single] Number of button taps to trigger this workflow
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by button taps
```

_See code: [dist/commands/workflow/create/button.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/button.ts)_

## `relay workflow create call`

Create or update a workflow triggered by inbound or outbound calling

```
USAGE
  $ relay workflow:create:call -n <value> -u <value> --trigger inbound|outbound [-N] [-i <value> | -A] [-t] [-e] [-a
    <value>] [-b <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --trigger=(inbound|outbound)        (required) [default: outbound] Trigger whether an inbound or outbound call is
                                      placed
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by inbound or outbound calling
```

_See code: [dist/commands/workflow/create/call.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/call.ts)_

## `relay workflow create event`

Create or update a workflow triggered by event emitted by Relay device

```
USAGE
  $ relay workflow:create:event -n <value> -u <value> --trigger emergency [-N] [-i <value> | -A] [-t] [-e] [-a <value>] [-b
    <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --trigger=(emergency)               (required) [default: emergency] Relay device event to trigger this workflow
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by event emitted by Relay device
```

_See code: [dist/commands/workflow/create/event.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/event.ts)_

## `relay workflow create geofence`

Create or update a workflow triggered by geofence transition

```
USAGE
  $ relay workflow:create:geofence -n <value> -u <value> --trigger entry|exit --id <value> [-N] [-i <value> | -A] [-t] [-e]
    [-a <value>] [-b <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --id=<value>                        (required) Geofence ID
  --trigger=<option>                  (required) [default: entry] Transition trigger for the specified geofence
                                      <options: entry|exit>
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by geofence transition
```

_See code: [dist/commands/workflow/create/geofence.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/geofence.ts)_

## `relay workflow create http`

Create or update a workflow triggered by an HTTP request

```
USAGE
  $ relay workflow:create:http -n <value> -u <value> --trigger POST [-N] [-i <value> | -A] [-t] [-e] [-a <value>] [-b
    <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --trigger=(POST)                    (required) [default: POST] HTTP method to trigger this workflow
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by an HTTP request
```

_See code: [dist/commands/workflow/create/http.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/http.ts)_

## `relay workflow create nfc`

Create or update a workflow triggered by an NFC tap

```
USAGE
  $ relay workflow:create:nfc -n <value> -u <value> [-N] [-i <value> | -A] [-t] [-e] [-a <value>] [-b <value>] [-r
    <value>] [-c <value>] [-l <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -c, --category=<value>              Tag category to match against when tapped
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -l, --label=<value>                 Tag label to match against when tapped
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by an NFC tap
```

_See code: [dist/commands/workflow/create/nfc.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/nfc.ts)_

## `relay workflow create phrase`

Create or update a workflow triggered by a spoken phrase

```
USAGE
  $ relay workflow:create:phrase -n <value> -u <value> --trigger <value> [-N] [-i <value> | -A] [-t] [-e] [-a <value>] [-b
    <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  --trigger="hello world"...          (required) Phrase spoken to Relay Assistant to trigger this workflow
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by a spoken phrase
```

_See code: [dist/commands/workflow/create/phrase.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/phrase.ts)_

## `relay workflow create position`

Create or update a workflow triggered by a position transition

```
USAGE
  $ relay workflow:create:position -n <value> -u <value> --trigger entry|exit -v <value> -p <value> [-N] [-i <value> | -A]
    [-t] [-e] [-a <value>] [-b <value>] [-r <value>]

FLAGS
  -n, --name=<value>                  (required) Name of the workflow
  -p, --position_id=<value>           (required) Position ID
  -u, --uri=<value>                   (required) WebSocket URI workflow can be accessed
  -v, --venue_id=<value>              (required) Venue ID
  --trigger=<option>                  (required) [default: entry] Transition trigger for the specified position
                                      <options: entry|exit>
  -A, --install-all                   Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -e, --hidden                        Hide channel from originating device
  -i, --install=<value>...            device / user ID to install workflow on
  -r, --number=arg1=100.0...          Number name/value pair workflow arg
  -t, --[no-]transient                Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered by a position transition
```

_See code: [dist/commands/workflow/create/position.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/position.ts)_

## `relay workflow create timer`

Create or update a workflow triggered immediately or with a repeating rule

```
USAGE
  $ relay workflow:create:timer -n <value> -u <value> --trigger immediately|schedule|repeat -z
    local|America/New_York|America/Chicago|America/Denver|America/Los_Angeles|America/Phoenix|Pacific/Honolulu [-N] [-i
    <value> | -A] [-t] [-e] [-a <value>] [-b <value>] [-r <value>] [-s <value>] [-l <value> | -c <value>] [-d <value>]

FLAGS
  -n, --name=<value>
      (required) Name of the workflow

  -u, --uri=<value>
      (required) WebSocket URI workflow can be accessed

  -z, --timezone=(local|America/New_York|America/Chicago|America/Denver|America/Los_Angeles|America/Phoenix|Pacific/Hono
  lulu)
      (required) [default: local]

  --trigger=(immediately|schedule|repeat)
      (required) [default: immediately] Trigger immediately or based on a repeating rule

  -A, --install-all
      Enable rule to install workflow on all device and users on the account

  -N, --dry-run

  -a, --arg=<value>...
      String name/value pair workflow arg

  -b, --boolean=arg1=[true|false]...
      Boolean name/value pair workflow arg

  -c, --count=<value>

  -d, --day=<value>...
      [default: MO,TU,WE,TH,FR,SA,SU] Days of the week to repeat on

  -e, --hidden
      Hide channel from originating device

  -i, --install=<value>...
      device / user ID to install workflow on

  -l, --until=<value>

  -r, --number=arg1=100.0...
      Number name/value pair workflow arg

  -s, --start=<value>
      [default: 2023-08-21T14:00:00]

  -t, --[no-]transient
      Allow workflow to run in the background; otherwise terminate workflow

DESCRIPTION
  Create or update a workflow triggered immediately or with a repeating rule
```

_See code: [dist/commands/workflow/create/timer.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/create/timer.ts)_

## `relay workflow delete`

Destructively delete and remove a workflow

```
USAGE
  $ relay workflow:delete -w <value> -s <value>

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id

DESCRIPTION
  Destructively delete and remove a workflow
```

_See code: [dist/commands/workflow/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/delete.ts)_

## `relay workflow install`

Install an existing workflow into one or more devices

```
USAGE
  $ relay workflow:install [ID] -w <value> -s <value> [-N] [-i <value> | -A]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id
  -A, --install-all            Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -i, --install=<value>...     device / user ID to install workflow on

DESCRIPTION
  Install an existing workflow into one or more devices
```

_See code: [dist/commands/workflow/install.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/install.ts)_

## `relay workflow instance list`

List workflow instances

```
USAGE
  $ relay workflow:instance:list -s <value> [--json] [-H] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -H, --include-history
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
  List workflow instances
```

_See code: [dist/commands/workflow/instance/list.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/instance/list.ts)_

## `relay workflow list`

List workflow configurations

```
USAGE
  $ relay workflow:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

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
  List workflow configurations
```

_See code: [dist/commands/workflow/list.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/list.ts)_

## `relay workflow logs`

Display workflow realtime logs

```
USAGE
  $ relay workflow:logs -s <value> [-w <value>] [-u <value>]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -u, --user-id=<value>        user id
  -w, --workflow-id=<value>    workflow id

DESCRIPTION
  Display workflow realtime logs
```

_See code: [dist/commands/workflow/logs.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/logs.ts)_

## `relay workflow trigger`

Trigger a workflow over HTTP

```
USAGE
  $ relay workflow:trigger -w <value> -u <value> -s <value> [-a <value>] [-b <value>] [-r <value>]

FLAGS
  -s, --subscriber-id=<value>         (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -u, --user-id=<value>               (required) Target user id on behalf of which to trigger a workflow
  -w, --workflow-id=<value>           (required) workflow id
  -a, --arg=<value>...                String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]...  Boolean name/value pair workflow arg
  -r, --number=arg1=100.0...          Number name/value pair workflow arg

DESCRIPTION
  Trigger a workflow over HTTP
```

_See code: [dist/commands/workflow/trigger.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/trigger.ts)_

## `relay workflow uninstall`

Uninstall an existing workflow from one or more devices

```
USAGE
  $ relay workflow:uninstall [ID] -w <value> -s <value> [-N] [-i <value> | -A]

FLAGS
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id
  -w, --workflow-id=<value>    (required) workflow id
  -A, --install-all            Enable rule to install workflow on all device and users on the account
  -N, --dry-run
  -i, --install=<value>...     device / user ID to install workflow on

DESCRIPTION
  Uninstall an existing workflow from one or more devices
```

_See code: [dist/commands/workflow/uninstall.ts](https://github.com/relaypro/relay-cli/blob/v1.7.0/dist/commands/workflow/uninstall.ts)_
