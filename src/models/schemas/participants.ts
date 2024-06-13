import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import { EventsModel } from '@/models/schemas/events.js'
import { connectClient } from '@/models/utils/clientDB.js'
import type {
  PartialParticipantSchema,
  ParticipantSchema,
  SearchOneParticipantByParams,
  SearchParticipantByParams
} from '@/schemas/participant.js'

interface ParticipantSelectFields {
  id: true
  name: boolean
  createdAt: boolean
  updatedAt: boolean
  email: boolean
  event: boolean
}

export class ParticipantsModel {
  private static readonly database = connectClient
  private static readonly defaultSelect: ParticipantSelectFields = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    email: true,
    event: true
  }

  private async checkId ({ id }: { id: string }) {
    const existParticipant = await ParticipantsModel.exist({ id })
    if (existParticipant) return null
    throw HTTPClientError.notFound({
      message: 'id not exist',
      path: '/participants',
      name: 'participantNotFound',
      errors: ['participant with this id not exist']
    })
  }

  static async findOneById ({ id }: { id: string }) {
    const client = await this.database
    const results = await client.participant.findUnique({
      where: { id },
      select: this.defaultSelect
    })
    return results
  }

  static async findOne ({ query }: { query: SearchOneParticipantByParams }) {
    const client = await this.database
    if (isEmptyObject(query) || typeof query === 'undefined') {
      throw HTTPClientError.notFound({
        message: 'search parameters by participant are empty',
        path: '/participants',
        name: 'emptySearchParameters',
        errors: ['search query params by participant is failed']
      })
    }

    const participant = await client.participant.findFirst({
      where: { ...query },
      select: this.defaultSelect
    })

    return participant
  }

  static async findAll ({ query }: { query?: SearchParticipantByParams }) {
    const client = await this.database

    if (!isEmptyObject(query) || typeof query === 'undefined') {
      const participants = await client.participant
        .findMany({ select: this.defaultSelect })
      return participants
    }

    const { limit, orderBy, ...searchParams } = query
    const participants = await client.participant.findMany({
      where: { ...searchParams },
      orderBy: { name: orderBy },
      take: limit,
      select: this.defaultSelect
    })

    return participants
  }

  static async createOne ({ shape }: { shape: unknown }) {
    const client = await this.database
    const { name, email, event } = shape as ParticipantSchema
    const participantEvent = await EventsModel.findOne({ query: event })

    if (participantEvent === null) {
      throw HTTPClientError.notFound({
        message:
          'the operation was unsuccessful because the event is not registered',
        path: '/events',
        name: 'eventNotFound',
        errors: ['this event is not recorded']
      })
    }

    const data = { name, email, eventId: participantEvent.id }
    const saveParticipant = await client.participant.create({
      data,
      select: this.defaultSelect
    })
    return saveParticipant
  }

  static async updateOneById ({ id, shape }: { id: string, shape: unknown }) {
    const client = await this.database
    const participantModel = new ParticipantsModel()
    await participantModel.checkId({ id })

    const { name } = shape as PartialParticipantSchema
    const participant = await client.participant.update({
      where: { id },
      data: { name },
      select: this.defaultSelect
    })
    return participant
  }

  static async deleteOneById ({ id }: { id: string }) {
    const client = await this.database
    const participantModel = new ParticipantsModel()
    await participantModel.checkId({ id })

    const participant = await client.participant.delete({
      where: { id },
      select: this.defaultSelect
    })
    return participant
  }

  static async exist (
    searchBy: Partial<SearchParticipantByParams> & { id?: string }
  ) {
    const client = await this.database
    const searchByKeys = Object.keys(searchBy)
    if (searchByKeys.length === 0) return false

    const conditions = searchByKeys.map((key) => {
      return { [key]: searchBy[key as keyof SearchParticipantByParams] }
    })

    const results = await client.participant.findFirst({
      where: { OR: conditions }
    })
    return Boolean(results?.email)
  }
}
