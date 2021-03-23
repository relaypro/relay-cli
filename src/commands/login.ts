import { Command } from '../lib/command'

export default class Login extends Command {
  static description = `login with your Relay credentials`

  async run(): Promise<void> {
    await this.relay.login()
  }
}
