import { HTTP_SERVER_ERROR_CODES, type SERVER_ERROR_CODE } from '@/config/enums/httpStatusCode.js'

interface ParamsError {
  message: string
  status: SERVER_ERROR_CODE
  path: string
  name: string
}

type ParamsMethodServerError = Omit<ParamsError, 'status'>

export class HTTPServerError extends Error {
  public path: string
  public status: number

  constructor ({ message, status, path, name }: ParamsError) {
    super(message)
    this.name = name
    this.path = path
    this.status = status

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }

  public toJson () {
    return {
      name: this.name,
      path: this.path,
      status: this.status,
      message: this.message
    }
  }

  static internalServerError ({ message, path, name }: ParamsMethodServerError) {
    const status = HTTP_SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR
    return new HTTPServerError({ message, path, name, status })
  }

  static serviceUnavailable ({ message, path, name }: ParamsMethodServerError) {
    const status = HTTP_SERVER_ERROR_CODES.SERVICE_UNAVAILABLE
    return new HTTPServerError({ message, path, name, status })
  }

  static gatewayTimeout ({ message, path, name }: ParamsMethodServerError) {
    const status = HTTP_SERVER_ERROR_CODES.GATEWAY_TIMEOUT
    return new HTTPServerError({ message, path, name, status })
  }
}
