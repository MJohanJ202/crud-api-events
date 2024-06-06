export const isEmptyObject = (shape: unknown) => {
  if (typeof shape !== 'object' || shape === null) return false
  return Object.keys(shape).length === 0
}
