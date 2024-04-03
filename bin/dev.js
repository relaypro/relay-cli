#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

// Copyright © 2022 Relay Inc.

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})
