`relay audio`
=============

List custom audio

* [`relay audio:create`](#relay-audiocreate)
* [`relay audio:delete`](#relay-audiodelete)
* [`relay audio:list`](#relay-audiolist)

## `relay audio:create`

List custom audio

```
USAGE
  $ relay audio:create

OPTIONS
  -f, --file=file                    (required) file path to be uploaded

  -n, --name=name                    (required) friendly name of the file to be used in workflows as
                                     `relay-static://friendly-name-here`

  -s, --subscriber-id=subscriber-id  (required) [default: 7b28d9b0-4b46-41f8-910c-bcf8dac3a03b] subscriber id
```

_See code: [dist/commands/audio/create.ts](https://github.com/relaypro/relay-cli/blob/v0.2.3/dist/commands/audio/create.ts)_

## `relay audio:delete`

List custom audio

```
USAGE
  $ relay audio:delete

OPTIONS
  -i, --id=id                        (required) file id to delete
  -s, --subscriber-id=subscriber-id  (required) [default: 7b28d9b0-4b46-41f8-910c-bcf8dac3a03b] subscriber id
```

_See code: [dist/commands/audio/delete.ts](https://github.com/relaypro/relay-cli/blob/v0.2.3/dist/commands/audio/delete.ts)_

## `relay audio:list`

List custom audio

```
USAGE
  $ relay audio:list

OPTIONS
  -s, --subscriber-id=subscriber-id  (required) [default: 7b28d9b0-4b46-41f8-910c-bcf8dac3a03b] subscriber id
  -x, --extended                     show extra columns
  --columns=columns                  only show provided columns (comma-separated)
  --csv                              output is csv format [alias: --output=csv]
  --filter=filter                    filter property by partial string matching, ex: name=foo
  --no-header                        hide table header from output
  --no-truncate                      do not truncate output to fit screen
  --output=csv|json|yaml             output in a more machine friendly format
  --sort=sort                        property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/audio/list.ts](https://github.com/relaypro/relay-cli/blob/v0.2.3/dist/commands/audio/list.ts)_
