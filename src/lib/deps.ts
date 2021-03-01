import CLI = require('cli-ux')
import HTTP = require('http-call')

import apiClient = require('./api-client')
import file = require('./file')
import flags = require('./flags')

import Conf from 'conf'

let config = new Conf()

export const deps = {
  get cli(): typeof CLI.default { return fetch('cli-ux').default },
  get HTTP(): typeof HTTP { return fetch('http-call') },
  get APIClient(): typeof apiClient.APIClient { return fetch('./api-client').APIClient },
  get file(): typeof file { return fetch('./file') },
  get flags(): typeof flags { return fetch('./flags') },
  get config() { return config },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}

export default deps
