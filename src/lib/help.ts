// Copyright © 2022 Relay Inc.

import { Help, Interfaces, CommandHelp, ux, Command } from '@oclif/core'

import {orderBy} from 'lodash-es'

import { RELAY } from './art.js'

// import debugFn from 'debug'
// const debug = debugFn(`cli`)


export default class RelayHelp extends Help {
  // acts as a "router"
  // and based on the args it receives
  // calls one of showRootHelp, showTopicHelp,
  // or showCommandHelp
  async showHelp(args: string[]): Promise<void> {
    super.showHelp(args)
  }

  // display the root help of a CLI
  async showRootHelp(): Promise<void> {
    ux.log(RELAY)
    super.showRootHelp()
  }

  protected get sortedTopics(): Interfaces.Topic[] {
    return super.sortedTopics.filter(t => !(t as RelayTopic).hidden)
  }

  // display help for a topic
  async showTopicHelp(topic: Interfaces.Topic): Promise<void> {
    super.showTopicHelp(topic)
  }

  // display help for a command
  async showCommandHelp(command: Command.Loadable): Promise<void> {
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
  formatCommands(commands: Command.Loadable[]): string {
    return super.formatCommands(commands)
  }

  // the formatting for an individual command
  formatCommand(command: Command.Loadable): string {
    const help = new RelayCommandHelp(command, this.config, this.opts)
    return help.generate()
  }
}

interface RelayTopic extends Interfaces.Topic {
  hidden?: boolean
}

class RelayCommandHelp extends CommandHelp {
  protected flags(flags: Command.Flag.Any[]): [string, string | undefined][] | undefined {
    const priorityFlagOrder = orderBy(flags, [f => f.required || false], [`desc`])
    return super.flags(priorityFlagOrder)
  }
}
