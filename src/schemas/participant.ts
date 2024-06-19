import { z } from 'zod'
import { eventSchema } from './event.js'
import { extendWithSearchCriteria } from './general.js'

const participantSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  event: eventSchema.pick({ name: true, date: true })
})

const filterParticipantSchema = extendWithSearchCriteria(
  participantSchema.omit({ event: true }).partial()
    .extend({ eventId: z.string().uuid().optional() }))

export const validateParticipantInfo = (shape: unknown) => {
  return participantSchema.safeParse(shape)
}

export const validatePartialParticipantInfo = (shape: unknown) => {
  return participantSchema.omit({ email: true }).partial().safeParse(shape)
}

export const validateSearchParticipantByParams = (shape: unknown) => {
  return filterParticipantSchema.safeParse(shape)
}

export type ParticipantSchema = z.infer<typeof participantSchema>
export type PartialParticipantSchema = Partial<ParticipantSchema>
export type FiltersParticipants = z.infer<typeof filterParticipantSchema>
export type FilterParticipant = FiltersParticipants & { id?: string }
