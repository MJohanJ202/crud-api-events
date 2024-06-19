import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import { isEmpty, isEmptyArray } from '@/helpers/general/validateTypes.js'
import type {
  EventSchema,
  ExistEvent,
  FilterEvent,
  FiltersEvents,
  PartialEventSchema
} from '@/schemas/event.js'
import { connectClient } from '../utils/clientDB.js'

export class EventsModel {
  private static readonly database = connectClient

  private async checkId ({ id }: { id: string }) {
    const existEvent = await EventsModel.exist({ id })
    if (existEvent) return null
    throw HTTPClientError.notFound({
      message: 'id not exist',
      path: '/events',
      name: 'eventNotFound',
      errors: ['the event with id not exist']
    })
  }

  static async findOneById ({ id }: { id: string }) {
    const client = await this.database
    const event = await client.event.findUnique({ where: { id } })
    return event
  }

  static async findOne ({ filters }: { filters: FilterEvent }) {
    const client = await this.database
    const { name, date } = filters
    const findByCompositeIndex = !isEmpty(name) && !isEmpty(date)
    if (findByCompositeIndex) {
      const event = await client.event
        .findUnique({ where: { name_date: { name: name!, date: date! } } })
      return event
    }

    const event = await client.event
      .findFirst({ where: { ...filters } })
    return event
  }

  static async findAll ({ filters }: { filters?: FiltersEvents }) {
    const client = await this.database

    if (isEmptyObject(filters) || isEmpty(filters)) {
      const events = await client.event.findMany()
      return events
    }

    const { name, description, location, date } = filters!
    const { orderBy, limit, offset } = filters!

    const events = await client.event.findMany({
      where: {
        name: { contains: name },
        description: { contains: description },
        location: { contains: location },
        date
      },
      take: limit,
      orderBy: { createdAt: orderBy },
      skip: offset
    })
    return events
  }

  static async createOne ({ shape }: { shape: unknown }) {
    const client = await this.database
    const { name, date, location, description } = shape as EventSchema
    const existEvent = await EventsModel.findOne({ filters: { name, date } })

    if (!isEmpty(existEvent)) {
      throw HTTPClientError.badRequest({
        message: 'event already recorded',
        path: '/events',
        name: 'eventExist',
        errors: ['such an event already exists']
      })
    }

    const newEvent = await client.event.create({
      data: {
        name,
        date,
        location,
        description
      }
    })
    return newEvent
  }

  static async updateOneById ({ id, shape }: { id: string, shape: unknown }) {
    const client = await this.database
    const eventModel = new EventsModel()
    await eventModel.checkId({ id })

    const { name, location, date, description } = shape as PartialEventSchema
    const event = await client.event
      .update({
        where: { id },
        data: {
          name,
          location,
          date,
          description
        }
      })
    return event
  }

  static async deleteOneById ({ id }: { id: string }) {
    const client = await this.database
    const eventModel = new EventsModel()
    await eventModel.checkId({ id })

    const event = await client.event.delete({ where: { id } })
    return event
  }

  static async exist (searchBy: ExistEvent) {
    const client = await this.database
    const searchByKeys = Object.keys(searchBy)
    if (isEmptyArray(searchByKeys)) return false

    const conditions = searchByKeys.map((key) => {
      return { [key]: searchBy[key as keyof ExistEvent] }
    })

    const results = await client.event.findFirst({ where: { OR: conditions } })
    return Boolean(results?.name)
  }
}
