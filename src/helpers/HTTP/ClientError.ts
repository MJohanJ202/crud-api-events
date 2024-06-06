import {
  HTTP_CLIENT_ERROR_CODES,
  type CLIENT_ERROR_CODE
} from '../../config/enums/httpStatusCode.js'

export type StatusError = CLIENT_ERROR_CODE

interface ParamsError {
  message: string
  status: StatusError
  path: string
  name: string
  errors?: unknown
}

type ParamsMethodClientError = Omit<ParamsError, 'status'>

export class HTTPClientError extends Error {
  public path: string
  public status: number
  public errors: unknown

  constructor ({ message, status, path, name, errors }: ParamsError) {
    super(message)
    this.name = name
    this.path = path
    this.status = status
    this.errors = errors

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }

  public toJson () {
    return {
      name: this.name,
      path: this.path,
      status: this.status,
      message: this.message,
      errors: this.errors
    }
  }

  static badRequest ({ message, path, name, errors }: ParamsMethodClientError) {
    const status = HTTP_CLIENT_ERROR_CODES.BAD_REQUEST
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static unauthorized (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.UNAUTHORIZED
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static forbidden ({ message, path, name, errors }: ParamsMethodClientError) {
    const status = HTTP_CLIENT_ERROR_CODES.FORBIDDEN
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static notFound ({ message, path, name, errors }: ParamsMethodClientError) {
    const status = HTTP_CLIENT_ERROR_CODES.NOT_FOUND
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static notAcceptable (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.NOT_ACCEPTABLE
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static conflict ({ message, path, name, errors }: ParamsMethodClientError) {
    const status = HTTP_CLIENT_ERROR_CODES.CONFLICT
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static unsupportedMediaType (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.UNSUPPORTED_MEDIA_TYPE
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static unprocessableEntity (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static tooEarly ({ message, path, name, errors }: ParamsMethodClientError) {
    const status = HTTP_CLIENT_ERROR_CODES.TOO_EARLY
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static tooManyRequests (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.TOO_MANY_REQUESTS
    return new HTTPClientError({ message, path, name, status, errors })
  }

  static headerFieldsTooLarge (
    { message, path, name, errors }: ParamsMethodClientError
  ) {
    const status = HTTP_CLIENT_ERROR_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE
    return new HTTPClientError({ message, path, name, status, errors })
  }
}
