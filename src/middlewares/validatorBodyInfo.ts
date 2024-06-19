import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import {
  wrapAsyncController
} from '@/helpers/wrapperAsyncController.js'
import type { NextFunction, Request, Response } from 'express'

export interface Validator {
  validator: (data: unknown) => { success: boolean, error?: any, data?: any }
}

export function bodyInfoValidator (options: Validator) {
  const validationHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const { body } = req
    const { validator } = options
    const validationResult = validator(body)

    if (!validationResult.success) {
      const { error: errors } = validationResult
      const path = req.originalUrl
      const name = 'validation'
      throw HTTPClientError.unprocessableEntity({
        message: 'error body validation',
        errors,
        name,
        path
      })
    }

    req.body = validationResult.data
    next()
  }

  return wrapAsyncController(validationHandler)
}
