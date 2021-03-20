import * as fs from 'fs'
import { promisify } from 'util'

export function exists(f: string): Promise<boolean> {
  return promisify(fs.exists)(f)
}

export function readdir(f: string): Promise<string[]> {
  return promisify(fs.readdir)(f)
}

export function readFile(f: string): Promise<Buffer> {
  return promisify(fs.readFile)(f)
}
