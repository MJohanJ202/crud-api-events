import { HTTP_SERVER_ERROR_CODES } from '@/config/enums/httpStatusCode.js'
import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import { HTTPResponseError } from '@/helpers/HTTP/ResponseClientError.js'
import { HTTPServerError } from '@/helpers/HTTP/ServerError.js'
import type { NextFunction, Request, Response } from 'express'

export function handleHTTPError (
  error: HTTPClientError | HTTPServerError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorResponseHandler = new HTTPResponseError({ res })
  if (error instanceof HTTPClientError) {
    const errorClient = error.toJson()
    const response = { res, ...errorClient }
    errorResponseHandler.sendResponse(response)
    return
  }

  if (error instanceof HTTPServerError) {
    const errorClient = error.toJson()
    const path = req.originalUrl
    const response = { res, ...errorClient, path }
    errorResponseHandler.sendResponse(response)
    return
  }

  const { originalUrl: path } = req
  const message = 'Internal ServerError'
  const name = 'InternalServerError'
  const status = HTTP_SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR
  const errors = ['An unexpected error occurred']
  const response = { res, message, status, name, path, errors }
  errorResponseHandler.sendResponse(response)
  next()
}
