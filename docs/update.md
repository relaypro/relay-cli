`relay update`
==============

update the relay CLI

* [`relay update [CHANNEL]`](#relay-update-channel)

## `relay update [CHANNEL]`

update the relay CLI

```
USAGE
  $ relay update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the relay CLI

EXAMPLES
  Update to the stable channel:

    $ relay update stable

  Update to a specific version:

    $ relay update --version 1.0.0

  Interactively select version:

    $ relay update --interactive

  See available versions:

    $ relay update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.0/src/commands/update.ts)_
