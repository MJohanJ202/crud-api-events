import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import { wrapAsyncController } from '@/helpers/wrapperAsyncController.js'
import type { NextFunction, Request, Response } from 'express'
import type { Validator } from './validatorBodyInfo.js'

export function searchQueryParamsValidator (options: Validator) {
  const validationHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const { query } = req
    const { validator } = options
    const validationResult = validator(query)

    if (!validationResult.success) {
      const { error: errors } = validationResult
      const path = req.originalUrl
      const name = 'validation'
      throw HTTPClientError.badRequest({
        message: 'error validation query params',
        name,
        path,
        errors
      })
    }

    req.query = validationResult.data
    next()
  }

  return wrapAsyncController(validationHandler)
}

export function searchParamsValidator (options: Validator) {
  const validationHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const { params } = req
    const { validator } = options
    const validationResult = validator(params)

    if (!validationResult.success) {
      const { error: errors } = validationResult
      const path = req.originalUrl
      const name = 'validation'
      throw HTTPClientError.badRequest({
        message: 'error params validation',
        errors,
        name,
        path
      })
    }

    req.params = validationResult.data
    next()
  }

  return wrapAsyncController(validationHandler)
}
