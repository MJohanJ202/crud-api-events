import { z } from 'zod'
import { mergeWithSearchSchema } from './general.js'

export const eventSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().datetime().refine(date => new Date(date) >= new Date(), {
    message: 'Date must be in the future'
  }),
  location: z.string().max(200).optional(),
  description: z.string().max(1000).optional()
})

const searchEventByParamsSchema = mergeWithSearchSchema(eventSchema.partial())

export type EventSchema = z.infer<typeof eventSchema>
export type PartialEventSchema = Partial<EventSchema>
export type SearchOneEventByParams = PartialEventSchema & { id?: string }
export type SearchEventByParams = z.infer<typeof searchEventByParamsSchema>

export const validateEventInfo = (shape: unknown) => {
  return eventSchema.safeParse(shape)
}

export const validatePartialEventInfo = (shape: unknown) => {
  return eventSchema.partial().safeParse(shape)
}

export const validateSearchEventByParams = (shape: unknown) => {
  return searchEventByParamsSchema.safeParse(shape)
}
