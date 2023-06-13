import map from 'lodash/map'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'

import { APIClient } from '../api-client'
import { SubscriberQuery } from '../session'

import debugFn from 'debug'



const debug = debugFn(`SubscriberPrompt`)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AutoComplete } = require('enquirer') // eslint-disable-line quotes

type SubscriberPromptOptions = {
  api: APIClient,
}

type SuggestResults = {
  name: string,
  value: number,
}[]

type Prompt = {
  run: () => Promise<number>
}

export const subscriberPrompt = (options: SubscriberPromptOptions): Prompt => {
  const suggest = async (search: string, choices: string[]): Promise<SuggestResults> => {
    debug(`suggest`, { search, choices })
    const idQuery: SubscriberQuery = { subscriber_id: search }
    const nameQuery: SubscriberQuery = { account_name: search }
    const [[idSubscribers], [nameSubscribers]] = await Promise.all([
      options.api.subscribers(idQuery),
      options.api.subscribers(nameQuery),
    ])
    const subscribers = sortBy(uniqBy([...idSubscribers, ...nameSubscribers], `id`), `name`)
    debug(`subscribers`, subscribers)
    prompt.render()
    return map(subscribers, (subscriber, value) => ({ name: `${subscriber.name} (${subscriber.id})`, value, }))
  }

  const prompt = new AutoComplete({
    multiple: false,
    name: `subscriber`,
    message: `Pick your default Relay account`,
    choices: [],
    limit: 10,
    suggest: debounce(suggest, 1000, { maxWait: 4000 }),
    hint: `Start typing to search by name or subscriber id`,
  })

  return prompt
}
