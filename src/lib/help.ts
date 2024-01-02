// Copyright © 2022 Relay Inc.

import { Help, Interfaces, CommandHelp, CliUx } from '@oclif/core'

import { orderBy } from 'lodash'
import { RELAY } from './art'

// eslint-disable-next-line quotes
// import debugFn = require('debug')
// const debug = debugFn(`cli`)


export default class RelayHelp extends Help {
  // acts as a "router"
  // and based on the args it receives
  // calls one of showRootHelp, showTopicHelp,
  // or showCommandHelp
  async showHelp(args: string[]): Promise<void> {
    super.showHelp(args)
  }

  protected async customShowRootHelp(): Promise<void> {
    let rootTopics = super.sortedTopics
    let rootCommands = super.sortedCommands

    const state = this.config.pjson?.oclif?.state
    if (state) {
      super.log(state === `deprecated` ? `${super.config.bin} is deprecated` : `${super.config.bin} is in ${state}.\n`)
    }

    super.log(super.formatRoot())
    super.log(``)

    // take out top level help for capsule commands
    rootTopics = rootTopics.filter((t) => !t.name.includes(`task`))
    rootTopics = rootTopics.filter((t) => !t.name.includes(`alice`))
    rootTopics = rootTopics.filter((t) => !t.name.includes(`hotsos`))

    if (!this.opts.all) {
      rootTopics = rootTopics.filter((t) => !t.name.includes(`:`))
      rootCommands = rootCommands.filter((c) => !c.id.includes(`:`))
    }

    if (rootTopics.length > 0) {
      super.log(super.formatTopics(rootTopics))
      super.log(``)
    }

    if (rootCommands.length > 0) {
      rootCommands = rootCommands.filter((c) => c.id)
      super.log(super.formatCommands(rootCommands))
      super.log(``)
    }
  }

  // display the root help of a CLI
  async showRootHelp(): Promise<void> {
    CliUx.ux.log(RELAY)
    this.customShowRootHelp()
  }

  protected get sortedTopics(): Interfaces.Topic[] {
    return super.sortedTopics.filter(t => !(t as RelayTopic).hidden)
  }

  // display help for a topic
  async showTopicHelp(topic: Interfaces.Topic): Promise<void> {
    super.showTopicHelp(topic)
  }

  // display help for a command
  async showCommandHelp(command: Interfaces.Command): Promise<void> {
    super.showCommandHelp(command)
  }

  // the default implementations of showRootHelp
  // showTopicHelp and showCommandHelp
  // will call various format methods that
  // provide the formatting for their corresponding
  // help sections;
  // these can be overwritten as well

  // the formatting responsible for the header
  // displayed for the root help
  formatRoot(): string {
    return super.formatRoot()
  }

  // the formatting for an individual topic
  formatTopic(topic: Interfaces.Topic): string {
    return super.formatTopic(topic)
  }

  // the formatting for a list of topics
  protected formatTopics(topics: Interfaces.Topic[]): string {
    return super.formatTopics(topics)
  }

  // the formatting for a list of commands
  formatCommands(commands: Interfaces.Command[]): string {
    return super.formatCommands(commands)
  }

  // the formatting for an individual command
  formatCommand(command: Interfaces.Command): string {
    const help = new RelayCommandHelp(command, this.config, this.opts)
    return help.generate()
  }
}

interface RelayTopic extends Interfaces.Topic {
  hidden?: boolean
}

class RelayCommandHelp extends CommandHelp {
  protected flags(flags: Interfaces.Command.Flag[]): [string, string | undefined][] | undefined {
    const priorityFlagOrder = orderBy(flags, [f => f.required || false], [`desc`])
    return super.flags(priorityFlagOrder)
  }
}
