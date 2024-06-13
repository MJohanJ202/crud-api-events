import { HTTPResponse } from '@/helpers/HTTP/ResponseClient.js'
import { HTTPResponseError } from '@/helpers/HTTP/ResponseClientError.js'
import { ParticipantsModel } from '@/models/schemas/participants.js'
import type { EventSchema } from '@/schemas/event.js'
import type { Request, Response } from 'express'
export class ParticipantController {
  static getAll = async (_req: Request, res: Response) => {
    // const { query } = req
    const responseHandler = new HTTPResponse({ res })

    // if (isEmptyObject(query)) {
    const participants = await ParticipantsModel.findAll({})
    responseHandler.ok({ res, data: participants })
    return null
    // }

    // const findEventsByParams = await EventsModel.findAll({ query })
    // responseHandler.ok({ res, data: findEventsByParams })
  }

  static getOneById = async (req: Request, res: Response) => {
    const { params } = req
    const { id } = params

    const findParticipant = await ParticipantsModel.findOneById({ id })
    if (findParticipant === null) {
      const errorResponseHandler = new HTTPResponseError({ res })
      errorResponseHandler.notFound({
        res,
        message: 'participant not exist',
        path: req.originalUrl,
        name: 'NotFoundError',
        errors: ['The participant resource was not found']
      })
      return null
    }

    const responseHandler = new HTTPResponse({ res })
    responseHandler.ok({ res, data: findParticipant })
  }

  static createOne = async (req: Request, res: Response) => {
    const shape = req.body as EventSchema
    const responseHandler = new HTTPResponse({ res })
    const existParticipant = await ParticipantsModel.findOne({
      query: { ...shape }
    })

    if (existParticipant !== null) {
      const errorResponseHandler = new HTTPResponseError({ res })
      errorResponseHandler.badRequest({
        res,
        message: ' exist participant',
        path: req.originalUrl,
        name: 'existParticipant',
        errors: ['The participant is ready recoding']
      })
      return null
    }

    const saveParticipant = await ParticipantsModel.createOne({ shape })
    responseHandler.created({ res, data: saveParticipant })
  }

  static updateOneById = async (req: Request, res: Response) => {
    const { params, body: shape } = req
    const { id } = params
    const responseHandler = new HTTPResponse({ res })
    const findParticipant = await ParticipantsModel.updateOneById({ id, shape })
    responseHandler.created({ res, data: findParticipant })
  }

  static deleteOneById = async (req: Request, res: Response) => {
    const { params } = req
    const { id } = params
    const responseHandler = new HTTPResponse({ res })
    await ParticipantsModel.deleteOneById({ id })
    responseHandler.noContent({
      res,
      message: 'participant is eliminated successfully'
    })
  }
}
