import { isEmptyArray } from './validateTypes.js'

export const isEmptyObject = (shape: unknown) => {
  if (typeof shape !== 'object' || shape === null) return false
  return isEmptyArray(Object.keys(shape))
}
