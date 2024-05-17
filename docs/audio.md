`relay audio`
=============

Create custom audio

* [`relay audio create`](#relay-audio-create)
* [`relay audio delete`](#relay-audio-delete)
* [`relay audio list`](#relay-audio-list)

## `relay audio create`

Create custom audio

```
USAGE
  $ relay audio:create -s <value> -n <value> -f <value>

FLAGS
  -f, --file=<value>           (required) file path to be uploaded
  -n, --name=<value>           (required) friendly name of the file to be used in workflows as
                               `relay-static://friendly-name-here`
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Create custom audio
```

_See code: [dist/commands/audio/create.ts](https://github.com/relaypro/relay-cli/blob/v1.9.1/dist/commands/audio/create.ts)_

## `relay audio delete`

Delete custom audio

```
USAGE
  $ relay audio:delete -s <value> -i <value>

FLAGS
  -i, --id=<value>             (required) file id to delete
  -s, --subscriber-id=<value>  (required) [default: 282b5c81-2410-4302-8f74-95207bdbe9d9] subscriber id

DESCRIPTION
  Delete custom audio
```

_See code: [dist/commands/audio/delete.ts](https://github.com/relaypro/relay-cli/blob/v1.9.1/dist/commands/audio/delete.ts)_

## `relay audio list`

List custom audio

```
USAGE
  $ relay audio:list -s <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List custom audio
```

_See code: [dist/commands/audio/list.ts](https://github.com/relaypro/relay-cli/blob/v1.9.1/dist/commands/audio/list.ts)_
