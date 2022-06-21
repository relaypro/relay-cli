// Copyright © 2022 Relay Inc.

import Base62Str from 'base62str'
import CryptoJS from 'crypto-js'

export default function userId(subscriberId: string, userUuid: string): string {
  const base62 = Base62Str.createInstanceWithGmpCharacterSet()
  const md5Bytes = Base62Str.getBytes(CryptoJS.enc.Latin1.stringify(CryptoJS.MD5(`${subscriberId}${userUuid}`)))
  const encoded = Base62Str.getString(base62.encode(md5Bytes))
  return `VIRT${encoded}`
}
