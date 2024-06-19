import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import { isEmpty } from '@/helpers/general/validateTypes.js'
import { z } from 'zod'
import { extendWithSearchCriteria } from './general.js'

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

export type EventSchema = z.infer<typeof eventSchema>

const filterEventsSchema = extendWithSearchCriteria(eventSchema.omit({ date: true }).partial())
  .extend({
    dateFrom: eventSchema.shape.date.optional(),
    dateTo: eventSchema.shape.date.optional()
  }).refine(({ dateFrom, dateTo }) => compareDates({ dateFrom, dateTo }), {
    message: 'dateTo must be greater than dateFrom',
    path: ['dateTo']
  })
type FilterEventsSchema = z.infer<typeof filterEventsSchema>

export const validateEventInfo = (shape: unknown) => {
  return eventSchema.safeParse(shape)
}

export const validatePartialEventInfo = (shape: unknown) => {
  return eventSchema.partial().safeParse(shape)
}

const transformFilters = (data: FilterEventsSchema) => {
  interface DateFilter { gte?: string, lte?: string }
  const { dateFrom, dateTo, ...filters } = data
  const date: DateFilter = {}

  if (!isEmpty(dateFrom)) date.gte = dateFrom
  if (!isEmpty(dateTo)) date.lte = dateTo

  return { ...filters, date: isEmptyObject(date) ? undefined : date }
}
export type FiltersEvents = Partial<ReturnType<typeof transformFilters>>

export const validateFilterEvents = (shape: unknown) => {
  const result = filterEventsSchema.safeParse(shape)

  if (!result.success) return result

  const transformed = transformFilters(result.data)

  return {
    success: true,
    data: transformed,
    error: null
  }
}

export type PartialEventSchema = Partial<EventSchema>
export type FilterEvent = PartialEventSchema & { id?: string }
export type ExistEvent = Omit<FilterEvent, 'date'>
