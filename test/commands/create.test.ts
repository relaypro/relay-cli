import { expect, test } from '@oclif/test'

describe(`workflow:create`, () => {
  test
    .nock(`https://all-api-qa-ibot.nocell.io`, api => api
      .post(`/ibot/workflow`)
      .query({ subscriber_id: `423f93b9-439a-4ee7-814d-0c079fc27918` })
      .reply(401)
    )
    .stdout()
    .command([`workflow:create`, `--name=test`, `--uri=relay-local://test`])
    .it(`creates workflow`, ctx => {
      expect(ctx.stdout)//.to.contain(`hello world`)
    })
})
