import * as uuid from 'uuid'

export const requestIdHeader = `Request-Id`

export class RequestId {
  static ids: string[] = []

  static track(...ids: string[]): string[] {
    const tracked = RequestId.ids
    ids = ids.filter(id => !(tracked.includes(id)))
    RequestId.ids = [...ids, ...tracked]
    return RequestId.ids
  }

  static create(): string[] {
    const tracked = RequestId.ids
    const generatedId = uuid.v4()
    RequestId.ids = [generatedId, ...tracked]
    return RequestId.ids
  }

  static empty(): void {
    RequestId.ids = []
  }

  static get headerValue(): string {
    return RequestId.ids.join(`,`)
  }
}
