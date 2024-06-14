export const isEmpty = (value?: unknown) => {
  return typeof value === 'undefined' || value === null
}

export const isEmptyArray = (value?: unknown[]) => {
  return isEmpty(value) || value?.length === 0
}
