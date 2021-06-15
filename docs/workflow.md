`relay workflow`
================

Manage workflow configurations

* [`relay workflow:args`](#relay-workflowargs)
* [`relay workflow:args:get ARG`](#relay-workflowargsget-arg)
* [`relay workflow:args:set`](#relay-workflowargsset)
* [`relay workflow:args:unset`](#relay-workflowargsunset)
* [`relay workflow:create:battery`](#relay-workflowcreatebattery)
* [`relay workflow:create:button`](#relay-workflowcreatebutton)
* [`relay workflow:create:call`](#relay-workflowcreatecall)
* [`relay workflow:create:event`](#relay-workflowcreateevent)
* [`relay workflow:create:http`](#relay-workflowcreatehttp)
* [`relay workflow:create:phrase`](#relay-workflowcreatephrase)
* [`relay workflow:create:timer`](#relay-workflowcreatetimer)
* [`relay workflow:delete`](#relay-workflowdelete)
* [`relay workflow:install ID`](#relay-workflowinstall-id)
* [`relay workflow:list`](#relay-workflowlist)
* [`relay workflow:uninstall ID`](#relay-workflowuninstall-id)

## `relay workflow:args`

List a workflow's args

```
USAGE
  $ relay workflow:args

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/args/index.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/args/index.ts)_

## `relay workflow:args:get ARG`

display a single workflow arguments

```
USAGE
  $ relay workflow:args:get ARG

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/args/get.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/args/get.ts)_

## `relay workflow:args:set`

set one or more workflow arguments

```
USAGE
  $ relay workflow:args:set

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
  -b, --boolean=arg1=[true|false]    Boolean name/value pair workflow arg
  -r, --number=arg1=100.0            Number name/value pair workflow arg
```

_See code: [dist/commands/workflow/args/set.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/args/set.ts)_

## `relay workflow:args:unset`

unset one or more workflow arguments

```
USAGE
  $ relay workflow:args:unset

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/args/unset.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/args/unset.ts)_

## `relay workflow:create:battery`

Create or update a workflow triggered by crossing a charging or discharging threshold of any device on the account

```
USAGE
  $ relay workflow:create:battery

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --threshold=threshold            (required) [default: 25] Threshold percentage as an integer to trigger workflow

  --trigger=(charge|discharge)     (required) [default: discharge] Trigger whether threshold value is reached when
                                   charging or discharging

  -a, --arg=arg                    String name/value pair workflow arg

  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg

  -e, --hidden                     Hide channel from originating device

  -h, --http                       Allow this workflow to be triggered with an HTTP request

  -i, --install=install            device / user ID to install workflow on

  -r, --number=arg1=100.0          Number name/value pair workflow arg

  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/battery.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/battery.ts)_

## `relay workflow:create:button`

Create or update a workflow triggered by button taps

```
USAGE
  $ relay workflow:create:button

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --trigger=(single|double)        (required) [default: single] Number of button taps to trigger this workflow
  -a, --arg=arg                    String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg
  -e, --hidden                     Hide channel from originating device
  -h, --http                       Allow this workflow to be triggered with an HTTP request
  -i, --install=install            device / user ID to install workflow on
  -r, --number=arg1=100.0          Number name/value pair workflow arg
  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/button.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/button.ts)_

## `relay workflow:create:call`

Create or update a workflow triggered by inbound or outbound calling

```
USAGE
  $ relay workflow:create:call

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --trigger=(inbound|outbound)     (required) [default: outbound] Trigger whether an inbound or outbound call is placed
  -a, --arg=arg                    String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg
  -e, --hidden                     Hide channel from originating device
  -h, --http                       Allow this workflow to be triggered with an HTTP request
  -i, --install=install            device / user ID to install workflow on
  -r, --number=arg1=100.0          Number name/value pair workflow arg
  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/call.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/call.ts)_

## `relay workflow:create:event`

Create or update a workflow triggered by event emitted by Relay device

```
USAGE
  $ relay workflow:create:event

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --trigger=(emergency)            (required) [default: emergency] Relay device event to trigger this workflow
  -a, --arg=arg                    String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg
  -e, --hidden                     Hide channel from originating device
  -h, --http                       Allow this workflow to be triggered with an HTTP request
  -i, --install=install            device / user ID to install workflow on
  -r, --number=arg1=100.0          Number name/value pair workflow arg
  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/event.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/event.ts)_

## `relay workflow:create:http`

Create or update a workflow triggered by an HTTP request

```
USAGE
  $ relay workflow:create:http

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --trigger=(POST)                 (required) [default: POST] HTTP method to trigger this workflow
  -a, --arg=arg                    String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg
  -e, --hidden                     Hide channel from originating device
  -h, --http                       Allow this workflow to be triggered with an HTTP request
  -i, --install=install            device / user ID to install workflow on
  -r, --number=arg1=100.0          Number name/value pair workflow arg
  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/http.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/http.ts)_

## `relay workflow:create:phrase`

Create or update a workflow triggered by a spoken phrase

```
USAGE
  $ relay workflow:create:phrase

OPTIONS
  -n, --name=name                  (required) Name of the workflow
  -u, --uri=uri                    (required) WebSocket URI workflow can be accessed
  --trigger="hello world"          (required) Phrase spoken to Relay Assistant to trigger this workflow
  -a, --arg=arg                    String name/value pair workflow arg
  -b, --boolean=arg1=[true|false]  Boolean name/value pair workflow arg
  -e, --hidden                     Hide channel from originating device
  -h, --http                       Allow this workflow to be triggered with an HTTP request
  -i, --install=install            device / user ID to install workflow on
  -r, --number=arg1=100.0          Number name/value pair workflow arg
  -t, --[no-]transient             Allow workflow to run in the background; otherwise terminate workflow
```

_See code: [dist/commands/workflow/create/phrase.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/phrase.ts)_

## `relay workflow:create:timer`

Create or update a workflow triggered immediately or with a repeating rule

```
USAGE
  $ relay workflow:create:timer

OPTIONS
  -n, --name=name
      (required) Name of the workflow

  -u, --uri=uri
      (required) WebSocket URI workflow can be accessed

  -z, --timezone=one of "local", "utc", offset like "UTC-5", or valid IANA (https://www.iana.org/time-zones) time zone 
  like "America/New_York"
      (required) [default: local]

  --trigger=(immediately|schedule|repeat)
      (required) [default: immediately] Trigger immediately or based on a repeating rule

  -a, --arg=arg
      String name/value pair workflow arg

  -b, --boolean=arg1=[true|false]
      Boolean name/value pair workflow arg

  -c, --count=count

  -e, --hidden
      Hide channel from originating device

  -e, --until=until

  -f, --frequency=(minutely|hourly|daily|weekly|monthly|yearly)
      [default: hourly]

  -h, --http
      Allow this workflow to be triggered with an HTTP request

  -i, --install=install
      device / user ID to install workflow on

  -r, --number=arg1=100.0
      Number name/value pair workflow arg

  -s, --start=start

  -t, --[no-]transient
      Allow workflow to run in the background; otherwise terminate workflow

  -v, --interval=interval
```

_See code: [dist/commands/workflow/create/timer.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/create/timer.ts)_

## `relay workflow:delete`

Destructively delete and remove a workflow

```
USAGE
  $ relay workflow:delete

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/delete.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/delete.ts)_

## `relay workflow:install ID`

Install an existing workflow into one or more devices

```
USAGE
  $ relay workflow:install ID

ARGUMENTS
  ID  device / user ID to install workflow on

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/install.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/install.ts)_

## `relay workflow:list`

List workflow configurations

```
USAGE
  $ relay workflow:list

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -x, --extended                     show extra columns
  --columns=columns                  only show provided columns (comma-separated)
  --csv                              output is csv format [alias: --output=csv]
  --filter=filter                    filter property by partial string matching, ex: name=foo
  --no-header                        hide table header from output
  --no-truncate                      do not truncate output to fit screen
  --output=csv|json|yaml             output in a more machine friendly format
  --sort=sort                        property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/workflow/list.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/list.ts)_

## `relay workflow:uninstall ID`

Uninstall an existing workflow from one or more devices

```
USAGE
  $ relay workflow:uninstall ID

ARGUMENTS
  ID  device / user ID to uninstall workflow on

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 6aa4cf8f-cb49-483b-aca8-80b01a4c1e25] subscriber id
  -w, --workflow-id=workflow-id      (required) workflow id
```

_See code: [dist/commands/workflow/uninstall.ts](https://github.com/relaypro/relay-cli/blob/v0.1.0/dist/commands/workflow/uninstall.ts)_
