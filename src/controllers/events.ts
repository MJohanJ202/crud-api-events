import { HTTPResponse } from '@/helpers/HTTP/ResponseClient.js'
import { HTTPResponseError } from '@/helpers/HTTP/ResponseClientError.js'
import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import { isEmpty } from '@/helpers/general/validateTypes.js'
import { EventsModel } from '@/models/schemas/events.js'
import type { EventSchema } from '@/schemas/event.js'
import type { Request, Response } from 'express'
export class EventController {
  static getAll = async (req: Request, res: Response) => {
    const { query } = req
    const responseHandler = new HTTPResponse({ res })

    if (isEmptyObject(query)) {
      const events = await EventsModel.findAll({})
      responseHandler.ok({ res, data: events })
      return null
    }

    const findEventsByParams = await EventsModel.findAll({ filters: query })
    responseHandler.ok({ res, data: findEventsByParams })
  }

  static getOneById = async (req: Request, res: Response) => {
    const { params } = req
    const { id } = params
    const findEvent = await EventsModel.findOneById({ id })

    if (isEmpty(findEvent)) {
      const errorResponseHandler = new HTTPResponseError({ res })
      errorResponseHandler.notFound({
        res,
        message: 'event not exist',
        path: req.originalUrl,
        name: 'NotFoundError',
        errors: ['The event resource was not found']
      })
      return
    }

    const responseHandler = new HTTPResponse({ res })
    responseHandler.ok({ res, data: findEvent })
  }

  static createOne = async (req: Request, res: Response) => {
    const shape = req.body as EventSchema
    const responseHandler = new HTTPResponse({ res })
    const saveEvent = await EventsModel.createOne({ shape })
    responseHandler.created({ res, data: saveEvent })
  }

  static updateOneById = async (req: Request, res: Response) => {
    const { params, body: shape } = req
    const { id } = params
    const responseHandler = new HTTPResponse({ res })
    const findEvent = await EventsModel.updateOneById({ id, shape })
    responseHandler.ok({ res, data: findEvent })
  }

  static deleteOneById = async (req: Request, res: Response) => {
    const { params } = req
    const { id } = params
    const responseHandler = new HTTPResponse({ res })
    await EventsModel.deleteOneById({ id })
    responseHandler.noContent({
      res,
      message: 'event is eliminated successfully'
    })
  }
}
