// import { CliUx } from '@oclif/core'

// import { Command } from '../../lib/command'
// import isEmpty from 'lodash/isEmpty'

// import { printWorkflows } from '../../lib/utils'

// import * as flags from '../../lib/flags'

// // eslint-disable-next-line quotes
// import debugFn = require('debug')

// const debug = debugFn(`workflow`)

// export default class Capsule extends Command {
//     static description = `List task configurations`
    
//     static flags = {
//         ...flags.subscriber,
//         ...CliUx.ux.table.flags(),
//         types: flags.string({
//             char: `t`,
//             description: `List the task types`,
//             multiple: false,
//             required: false,
//         }),minors
//         major: flags.string({
//             description: `List majors with the corresponding name`,
//             multiple: false,
//             required: false,
//         }),
//         minor: flags.string({
//             description: `List minors with the corresponding name`,
//             multiple: false,
//             required: false,
//         })
//     }
// }