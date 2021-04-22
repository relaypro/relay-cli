import * as Config from '@oclif/config'
import Help from '@oclif/plugin-help'
import CommandHelp from '@oclif/plugin-help/lib/command'
import { orderBy } from 'lodash'

// eslint-disable-next-line quotes
// import debugFn = require('debug')
// const debug = debugFn(`cli`)

export default class RelayHelp extends Help {
  // acts as a "router"
  // and based on the args it receives
  // calls one of showRootHelp, showTopicHelp,
  // or showCommandHelp
  showHelp(args: string[]): void {
    super.showHelp(args)
  }

  // display the root help of a CLI
  showRootHelp(): void {
    super.showRootHelp()
  }

  // display help for a topic
  showTopicHelp(topic: Config.Topic): void {
    super.showTopicHelp(topic)
  }

  // display help for a command
  showCommandHelp(command: Config.Command): void {
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
  formatTopic(topic: Config.Topic): string {
    return super.formatTopic(topic)
  }

  // the formatting for a list of topics
  protected formatTopics(topics: Config.Topic[]): string {
    return super.formatTopics(topics)
  }

  // the formatting for a list of commands
  formatCommands(commands: Config.Command[]): string {
    return super.formatCommands(commands)
  }

  // the formatting for an individual command
  formatCommand(command: Config.Command): string {
    const help = new RelayCommandHelp(command, this.config, this.opts)
    return help.generate()
  }
}

class RelayCommandHelp extends CommandHelp {
  protected flags(flags: Config.Command.Flag[]): string | undefined {
    const priorityFlagOrder = orderBy(flags, [f => f.required || false], [`desc`])
    return super.flags(priorityFlagOrder)
  }
}
