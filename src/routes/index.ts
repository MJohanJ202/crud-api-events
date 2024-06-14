import { HTTPServerError } from '@/helpers/HTTP/ServerError.js'
import { isEmpty } from '@/helpers/general/validateTypes.js'
import { Router } from 'express'
import { readdir } from 'node:fs'
import { resolve } from 'node:path'

const router = Router()
const excludesPathsNames = ['index']
const currentDir = resolve('./src/routes')

const clearPathName = (pathname: string) => {
  const filename = pathname.replace(/\.js|\.ts/, '')
  return filename.toLowerCase()
}

const addRoutes = async (endpoint: string) => {
  const path = `/${endpoint}`
  const fullPath = resolve(currentDir, `${endpoint}.js`)
  try {
    const module = await import(fullPath)
    const endpointRouter = module.default as Router
    router.use(path, endpointRouter)
  } catch (error) {
    const errorMessage = `Failed to load route: ${endpoint}`
    throw new HTTPServerError({
      message: errorMessage,
      status: 500,
      path: fullPath,
      name: 'RouteLoadError'
    })
  }
}

readdir(currentDir, { encoding: 'utf-8' }, (err, files) => {
  if (!isEmpty(err)) {
    const errorMessage = 'Failed to read directory'
    throw new HTTPServerError({
      message: errorMessage,
      status: 500,
      path: currentDir,
      name: 'DirectoryReadError'
    })
  }

  files
    .map(clearPathName)
    .filter((pathName) => !excludesPathsNames.includes(pathName))
    .forEach(addRoutes)
})

export default router
