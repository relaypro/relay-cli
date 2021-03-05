import * as ansiStyles from 'ansi-styles'
import chalk from 'chalk'
import * as supports from 'supports-color'

const dim = process.env.ConEmuANSI === `ON` ? chalk.gray : chalk.dim

export const CustomColors: {
  supports: typeof supports,
  gray: (s: string) => string,
  grey: (s: string) => string,
  dim: (s: string) => string,
  arg: (s: string) => string,
  device: (s: string) => string,
  workflow: (s: string) => string,
  relay: (s: string) => string
} = {
  supports,
  gray: dim,
  grey: dim,
  dim,
  arg: chalk.cyan,
  device: chalk.yellow,
  workflow: (s: string) => chalk.enabled ? color.relay(`⬢ ${s}`) : s,
  relay: (s: string) => {
    if (!chalk.enabled) return s
    if (!color.supports) return s
    let has256 = (color.supportsColor && color.supportsColor.has256) || (process.env.TERM || '').indexOf(`256`) !== -1
    return has256 ? `\u001b[38;5;104m${s}${ansiStyles.reset.open}` : chalk.magenta(s)
  }
}

export const color: typeof CustomColors & typeof chalk = new Proxy(chalk, {
  get: (chalk, name) => {
    if ((CustomColors as any)[name]) return (CustomColors as any)[name]
    return (chalk as any)[name]
  },
  set: (chalk, name, value) => {
    switch(name) {
      case `enabled`:
        chalk.enabled = value
        break
      default:
          throw new Error(`cannot set property ${name.toString()}`)
    }
    return true
  },
}) as typeof CustomColors & typeof chalk

export default color
