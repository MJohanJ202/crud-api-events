import { z } from 'zod'
import { eventSchema } from './event.js'
import { mergeWithSearchSchema } from './general.js'

const participantSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  event: eventSchema.pick({ name: true, date: true })
})

const searchParticipantByParamsSchema = mergeWithSearchSchema(participantSchema.partial())

export type ParticipantSchema = z.infer<typeof participantSchema>
export type PartialParticipantSchema = Partial<ParticipantSchema>
export type SearchOneParticipantByParams = Omit<PartialParticipantSchema, 'event'> & { id?: string }

export type SearchParticipantByParams = z.infer<typeof searchParticipantByParamsSchema>

export const validateParticipantInfo = (shape: unknown) => {
  return participantSchema.safeParse(shape)
}

export const validatePartialParticipantInfo = (shape: unknown) => {
  return participantSchema.omit({ email: true }).partial().safeParse(shape)
}

export const validateSearchParticipantByParams = (shape: unknown) => {
  return searchParticipantByParamsSchema.safeParse(shape)
}
