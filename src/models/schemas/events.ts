import { HTTPClientError } from '@/helpers/HTTP/ClientError.js'
import { isEmptyObject } from '@/helpers/general/objectUtils.js'
import type { EventSchema, PartialEventSchema, SearchEventByParams } from '@/schemas/event.js'
import { connectClient } from '../utils/clientDB.js'

export class EventsModel {
  private static readonly database = connectClient

  private async checkId ({ id }: { id: string }) {
    const existEvent = await EventsModel.exist({ id })
    if (existEvent === null) return null
    const message = 'id not exist'
    const errors = ['the event with id not exist']
    throw HTTPClientError.notFound({ message, path: '/events', name: 'eventNotFound', errors })
  }

  static async findOneById ({ id }: { id: string }) {
    const client = await this.database
    const event = await client.event.findFirst({ where: { id } })
    return event
  }

  static async findAll ({ query }: { query?: SearchEventByParams }) {
    const client = await this.database

    if (!isEmptyObject(query) || typeof query === 'undefined') {
      const events = await client.event.findMany()
      return events
    }

    const { limit, orderBy, ...searchParams } = query
    const events = await client.event.findMany({
      where: { ...searchParams },
      orderBy: { name: orderBy },
      take: limit
    })

    return events
  }

  static async createOne ({ shape }: { shape: unknown }) {
    const client = await this.database
    const { name, date, location, description } = shape as EventSchema
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
          name, location, date, description
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

  static async exist (searchBy: Partial<SearchEventByParams> & { id?: string }) {
    const client = await this.database
    const searchByKeys = Object.keys(searchBy)
    if (searchByKeys.length === 0) return false

    const conditions = searchByKeys.map((key) => {
      return { [key]: searchBy[key as keyof SearchEventByParams] }
    })

    const results = await client.event.findFirst({ where: { OR: conditions } })
    return Boolean(results?.email)
  }
}
