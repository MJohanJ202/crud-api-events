import { type CLIENT_ERROR_CODE } from '@/config/enums/httpStatusCode.js'
import type { Response } from 'express'
import { HTTPClientError } from './ClientError.js'
import type { SendResponse } from './ResponseClient.js'

interface SendResponseError
  extends Omit<SendResponse, 'data' | 'redirect' | 'status'> {
  status: CLIENT_ERROR_CODE
  errors?: unknown
  path: string
  name: string
  message: string
}

type ParamsMethodResponseError = Omit<SendResponseError, 'status'>

export class HTTPResponseError {
  public res: Response

  constructor ({ res }: { res: Response }) {
    this.res = res
  }

  public sendResponse (params: SendResponseError) {
    const { res, status } = params
    const defaultMessageError = ['Unknown error: something went wrong']
    const { message, path, name, errors = defaultMessageError } = params

    res.status(status).json({ success: false, message, path, name, errors })
  }

  public handleClientError (error: HTTPClientError) {
    const { res } = this
    const { message, status, path, name, errors } = error.toJson()

    this.sendResponse({ res, status, message, path, name, errors })
  }

  public badRequest (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.badRequest(params))
  }

  public unauthorized (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.unauthorized(params))
  }

  public forbidden (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.forbidden(params))
  }

  public notFound (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.notFound(params))
  }

  public conflict (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.conflict(params))
  }

  public unprocessableEntity (params: ParamsMethodResponseError) {
    this.handleClientError(HTTPClientError.conflict(params))
  }
}
