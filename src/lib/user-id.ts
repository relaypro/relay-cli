// Copyright © 2022 Relay Inc.

import Base62 from './base62.js'
import CryptoJS from 'crypto-js'

export default function userId(subscriberId: string, userUuid: string): string {
  const base62 = Base62.createInstanceWithGmpCharacterSet()
  const md5Bytes = Base62.getBytes(CryptoJS.enc.Latin1.stringify(CryptoJS.MD5(`${subscriberId}${userUuid}`))) // lgtm[js/weak-cryptographic-algorithm]
  const encoded = Base62.getString(base62.encode(md5Bytes))
  return `VIRT${encoded}`
}
