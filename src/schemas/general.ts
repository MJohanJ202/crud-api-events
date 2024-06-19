import { z, type ZodRawShape } from 'zod'

const searchParamSchema = z.object({
  id: z.string().uuid()
})

const convertToNumber = (value: unknown) => {
  const number = Number(value)
  return isNaN(number) ? value : number
}

export const extendWithSearchCriteria = <T extends ZodRawShape>(
  providedSchema: z.ZodObject<T>
) => {
  const searchCriteriaSchema = z.object({
    limit: z.preprocess(convertToNumber, z.number().int().min(1).max(20).default(10).optional()),
    orderBy: z.enum(['desc', 'asc']).default('desc').optional(),
    offset: z.preprocess(convertToNumber, z.number().int().min(0).default(0).optional())
  })

  return searchCriteriaSchema.merge(providedSchema)
}

export const validateSearchParams = (shape: unknown) => {
  return searchParamSchema.safeParse(shape)
}
