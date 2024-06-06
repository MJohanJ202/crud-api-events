import cookieParser from 'cookie-parser'
import type { Request, Response } from 'express'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { HTTPResponse } from './helpers/HTTP/ResponseClient.js'
import { HTTPResponseError } from './helpers/HTTP/ResponseClientError.js'
import { handleHTTPError } from './middlewares/ErrorHandler.js'
import routesApi from './routes/index.js'

const createModule = createRequire('./')
export const app = express()
const publicPath = resolve('./', 'public')

// config
app.use(express.static(publicPath))
app.disable('x-powered-by')

//  middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(helmet())

//  routes/**
// --> documentation api
app.get('/', async (_req: Request, res: Response) => {
  const packageJsonFile = await createModule('package.json')
  const dataApi = {
    version: packageJsonFile.version,
    description: packageJsonFile.description,
    author: packageJsonFile.author,
    keywords: packageJsonFile.keywords,
    projectName: packageJsonFile.name
  }
  const responseHandler = new HTTPResponse({ res })
  responseHandler.ok({ res, data: dataApi })
})

// routes --> api
app.use('/api/v1', routesApi)

// Application routes
// --> Not found
app.use((req: Request, res: Response) => {
  const errorResponseHandler = new HTTPResponseError({ res })
  const errors = ['The requested resource was not found']
  errorResponseHandler.notFound({
    res,
    message: 'Resource not found',
    path: req.originalUrl,
    name: 'NotFoundError',
    errors
  })
})

// --> server Error
app.use(handleHTTPError)
