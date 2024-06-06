import { z, type ZodRawShape } from 'zod'

const searchParamSchema = z.object({
  id: z.string().uuid()
})

export const mergeWithSearchSchema = <T extends ZodRawShape>(
  providedSchema: z.ZodObject<T>
) => {
  const searchSchema = z.object({
    limit: z.number().int().min(1).optional().default(10),
    orderBy: z.enum(['desc', 'asc']).optional().default('desc'),
    offset: z.number().int().min(0).optional().default(0)
  })

  return searchSchema.merge(providedSchema)
}

export const validateSearchParams = (shape: unknown) => {
  return searchParamSchema.safeParse(shape)
}
