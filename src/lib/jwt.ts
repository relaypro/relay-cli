import atob from './atob.js'

export type TokenInfoKeys = `preferred_username`|`given_name`|`family_name`|`email`

const jwtValues = (jwt: string): Record<TokenInfoKeys, string> => {
  const valuePart = (jwt.split(`.`)?.[1])
  if (valuePart) {
    return JSON.parse(atob(valuePart))
  } else {
    throw new Error(`failed_to_parse_jwt_values`)
  }
}

export default jwtValues
