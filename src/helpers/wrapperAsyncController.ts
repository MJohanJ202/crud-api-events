import type { NextFunction, Request, Response } from 'express'

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>

export function wrapAsyncController (routeHandler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    routeHandler(req, res, next).catch(next)
  }
}
