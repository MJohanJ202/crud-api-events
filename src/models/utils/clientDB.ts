import { HTTPServerError } from '@/helpers/HTTP/ServerError.js'
import { PrismaClient } from '@prisma/client'

/**
 * Creates a connection to the database.
 * @returns {Promise<object>} - A Promise resolving to the database client.
 * @throws {Error} - If the connection to the database fails.
 */
const createConnection = async () => {
  try {
    const client = new PrismaClient()
    await client.$connect()

    console.log('Successfully connected to the database')
    return client
  } catch (error) {
    console.log('Failed to connect to the database')

    throw HTTPServerError.internalServerError({
      message: 'Failed to connect to the database',
      path: '/',
      name: 'DatabaseConnectionError'
    })
  }
}

export const connectClient = createConnection()
