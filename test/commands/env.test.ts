import { expect, test } from '@oclif/test'

describe(`env`, () => {
  test
    .stdout()
    .command([`env`])
    .it(`runs env`, ctx => {
      expect(ctx.stdout)//.to.contain(`hello world`)
    })
})
