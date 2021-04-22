// import * as ansiStyles from 'ansi-styles'
import chalk from 'chalk'
// import * as supports from 'supports-color'

const dim = process.env.ConEmuANSI === `ON` ? chalk.gray : chalk.dim

let enabled: never

export const CustomColors: {
  // supports: typeof supports,
  gray: (s: string) => string,
  grey: (s: string) => string,
  dim: (s: string) => string,
  arg: (s: string) => string,
  device: (s: string) => string,
  workflow: (s: string) => string,
  relay: (s: string) => string
} = {
  // supports,
  gray: dim,
  grey: dim,
  dim,
  arg: chalk.cyan,
  device: chalk.yellow,
  workflow: (s: string) => enabled ? color.relay(`⬢ ${s}`) : s,
  relay: (s: string) => {
    if (!enabled) return s
    if (!color.supports) return s
    // const has256 = (color.supportsColor && color.supportsColor.has256) || (process.env.TERM || ``).indexOf(`256`) !== -1
    return /*has256 ? `\u001b[38;5;104m${s}${ansiStyles.reset.open}` :*/ chalk.magenta(s)
  }
}

export const color: typeof CustomColors & typeof chalk = new Proxy(chalk, {
  get: (chalk, name) => {
    if ((CustomColors as never)[name]) return (CustomColors as never)[name]
    return (chalk as never)[name]
  },
  set: (_, name, value: never) => {
    switch(name) {
      case `enabled`:
        enabled = value
        break
      default:
        throw new Error(`cannot set property ${name.toString()}`)
    }
    return true
  },
}) as typeof CustomColors & typeof chalk

export default color
