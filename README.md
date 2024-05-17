relay
=====

Relay Workflow developer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@relaypro/cli)](https://www.npmjs.com/package/@relaypro/cli)
[![License](https://img.shields.io/npm/l/@relaypro/cli)](https://github.com/relaypro/relay-cli/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Command Topics](#command-topics)
* [Contributing](#contributing)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @relaypro/cli
$ relay COMMAND
running command...
$ relay (--version|-v)
@relaypro/cli/1.9.0 darwin-arm64 node-v20.11.0
$ relay --help [COMMAND]
USAGE
  $ relay COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
# Command Topics

* [`relay analytics`](docs/analytics.md) - Display and filter analytics
* [`relay audio`](docs/audio.md) - Create custom audio
* [`relay devices`](docs/devices.md) - list all device ids
* [`relay env`](docs/env.md) - displays the configured environment
* [`relay group`](docs/group.md) - Lists all groups.
* [`relay help`](docs/help.md) - Display help for relay.
* [`relay login`](docs/login.md) - login with your Relay credentials
* [`relay logout`](docs/logout.md) - logout and forget any tokens
* [`relay positions`](docs/positions.md) - list all positions by venue
* [`relay subscriber`](docs/subscriber.md) - show default subscriber
* [`relay tag`](docs/tag.md) - Manages configurations that can be associated with an NFC tag
* [`relay token`](docs/token.md) - generate a token that can be used with the Relay SDK
* [`relay update`](docs/update.md) - update the relay CLI
* [`relay venues`](docs/venues.md) - list all venues
* [`relay version`](docs/version.md)
* [`relay whoami`](docs/whoami.md) - display the current logged in user
* [`relay workflow`](docs/workflow.md) - Manage workflow configurations

<!-- commandsstop -->

<!-- contribution -->
# Contributing

Relay CLI is largely built on top of Saleforce's [oclif](https://oclif.io/) CLI framework, which provides
many features common to the best CLIs, including commands, subcommands, flags, arguments, and environment
variable overrides. All while producing user-facing help documentation to assist CLI users learn how to use
the Relay CLI.

The best way to use the Relay CLI is to install via NPM as demonstrated in the [Usage](#usage) section. However,
if you'd like to contribute or test a branch before it is made public, you'll need to run the Relay CLI from
source. Here's how to get started:

### 1 - Clone the repo

```
$ git clone https://github.com/relaypro/relay-cli.git
$ cd relay-cli
```

### 2 - Switch to the right branch

You can run from the default `main` branch. It contains the latest
public, and perhaps a little more, depending on the current development
lifecycle.

If you are contributing new code or seeking a fix, create a new branch:

```
$ git checkout -b feature/my-awesome-patch
```

### 3 - Install NPM dependencies

```
$ npm install
```

### 4 - Run or Build the project

When running the Relay CLI when installed from NPM, the `relay` entry
point is set up and all commands are
There are two commands that are the "entry points" into the Relay CLI.
Each has a distinct purpose:

* `bin/dev` is slow, but accurate. Every time you execute, the entire
  project is rescannded and the source is compiled. On average, this
  command can take up to 5 seconds. This command is primarily used
  during development. If you are editing source code regularly and
  testing those changes, this is the command to use.
* `bin/run` is fast, but inaccurate. Meaning, `bin/run` utilizes metadata
  cached on the filesystem and pre-compiled code in order to be fast.
  This command, in fact, is what is used when you install via NPM and
  run using `relay`. However, it is "inaccurate" in that you must
  remember to execute the caching and compiling commands before using it
  otherwise you will see errors or outdated, precompiled code will be
  used.

The following development-time invocation is slow, but accurate and will always
compile code.

```
$ bin/dev COMMAND
```

The following development-time invocation is fast, but inaccurate... will use
cached metadata and pre-compiled code.

```
$ bin/run COMMAND
```

#### Before running `bin/run`

Before you run `bin/run` you will need to create the command metadata
cache and pre-compile the code. This can be done with the `prepack`
command as follows:

```
$ npm run prepack
```

It is safe to run this multiple times as you make changesas the command
will overwrite the metadata cache and compiled code. No need to manually
clean up the output of the `prepack` command.
<!-- contributionstop -->
