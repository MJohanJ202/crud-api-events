import { HTTP_SUCCESS_CODES, type CLIENT_SUCCESS_CODE } from '@/config/enums/httpStatusCode.js'
import type { CookieOptions, Response } from 'express'

export interface SendResponse {
  status: CLIENT_SUCCESS_CODE
  message?: string
  res: Response
  data?: unknown
  redirect?: string
}

export interface SendResponseWithCookie extends Omit<SendResponse, 'status'> {
  cookieName: string
  cookieValue: unknown
  cookieOptions: CookieOptions
}

export class HTTPResponse {
  public res: Response

  constructor ({ res }: { res: Response }) {
    this.res = res
  }

  private sendResponse (params: SendResponse) {
    const { res, status } = params
    const { data = [], redirect, message } = params

    res.status(status).json({ success: true, data, message, redirect })
  }

  private sendResponseWithCookie (params: SendResponseWithCookie, status: CLIENT_SUCCESS_CODE) {
    const { res, cookieName, cookieValue, cookieOptions } = params
    const { data = [], redirect, message } = params

    res.cookie(cookieName, cookieValue, cookieOptions)
      .status(status)
      .json({ success: true, data, message, redirect })
  }

  public ok (params: Omit<SendResponse, 'status'>) {
    this.sendResponse({ ...params, status: HTTP_SUCCESS_CODES.OK })
  }

  public created (params: Omit<SendResponse, 'status'>) {
    this.sendResponse({ ...params, status: HTTP_SUCCESS_CODES.CREATED })
  }

  public createdWithCookie (params: Omit<SendResponseWithCookie, 'status'>) {
    this.sendResponseWithCookie(params, HTTP_SUCCESS_CODES.CREATED)
  }

  public accepted (params: Omit<SendResponse, 'status'>) {
    this.sendResponse({ ...params, status: HTTP_SUCCESS_CODES.ACCEPTED })
  }

  public acceptedWithCookie (params: Omit<SendResponseWithCookie, 'status'>) {
    this.sendResponseWithCookie(params, HTTP_SUCCESS_CODES.ACCEPTED)
  }

  public noContent (params: Omit<SendResponse, 'status' | 'data'>) {
    this.sendResponse({ ...params, status: HTTP_SUCCESS_CODES.NO_CONTENT })
  }

  public partialContent (params: Omit<SendResponse, 'status'>) {
    this.sendResponse({ ...params, status: HTTP_SUCCESS_CODES.PARTIAL_CONTENT })
  }
}
