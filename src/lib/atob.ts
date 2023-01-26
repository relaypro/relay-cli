const atob = (base64: string) => {
  return Buffer.from(base64, `base64`).toString(`binary`)
}

export default atob
