import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import { isEmpty } from '@/helpers/general/validateTypes.js'
import { z } from 'zod'

const isAvailableDateTime = (date: string) => new Date(date) >= new Date()

const compareDates = (
  { dateTo, dateFrom }: { dateTo?: string, dateFrom?: string }
) => {
  if (!isEmpty(dateFrom) && !isEmpty(dateTo)) {
    return new Date(dateTo!) > new Date(dateFrom!)
  }
  return true
}

export const eventSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().datetime().refine(isAvailableDateTime, {
    message: 'Date must be in the future'
  }),
  location: z.string().max(200).optional(),
  description: z.string().max(1000).optional()
})

const filterEventsSchema = eventSchema.omit({ date: true }).partial().extend({
  dateFrom: eventSchema.shape.date.optional(),
  dateTo: eventSchema.shape.date.optional()
}).refine(({ dateFrom, dateTo }) => compareDates({ dateFrom, dateTo }), {
  message: 'dateTo must be greater than dateFrom',
  path: ['dateTo']
}).transform(({ dateFrom, dateTo, ...filters }) => {
  type FiltersWithContains = {
    [key in keyof typeof filters]: { contains: typeof filters[key] };
  }

  const filtersWithContains: Partial<FiltersWithContains> = {}
  const filtersKeys = Object.keys(filters) as Array<keyof typeof filters>

  filtersKeys.forEach((filtersKey: keyof typeof filters) => {
    const filter = filters[filtersKey]
    filtersWithContains[filtersKey] = { contains: filter }
  })

  return { ...filtersWithContains, dateFrom, dateTo }
}).transform(({ dateFrom, dateTo, ...filters }) => {
  const date: Record<string, (string | undefined)> = {}
  if (!isEmpty(dateFrom)) date.gte = dateFrom
  if (!isEmpty(dateTo)) date.lte = dateTo

  return isEmptyObject(date) ? filters : { ...filters, date }
})

export type EventSchema = z.infer<typeof eventSchema>
export type PartialEventSchema = Partial<EventSchema>
export type FilterEventsSchema = z.infer<typeof filterEventsSchema>
export type FilterOneEventSchema = PartialEventSchema & { id?: string }

export const validateEventInfo = (shape: unknown) => {
  return eventSchema.safeParse(shape)
}

export const validatePartialEventInfo = (shape: unknown) => {
  return eventSchema.partial().safeParse(shape)
}

export const validateFilterEvents = (shape: unknown) => {
  return filterEventsSchema.safeParse(shape)
}
