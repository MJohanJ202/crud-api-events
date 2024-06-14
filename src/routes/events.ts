import { EventController } from '@/controllers/events.js'
import { wrapAsyncController } from '@/helpers/wrapperAsyncController.js'
import {
  searchParamsValidator,
  searchQueryParamsValidator
} from '@/middlewares/validateSearchParams.js'
import { bodyInfoValidator } from '@/middlewares/validatorBodyInfo.js'
import { validateEventInfo, validateFilterEvents, validatePartialEventInfo } from '@/schemas/event.js'
import { validateSearchParams } from '@/schemas/general.js'
import { Router } from 'express'

const router = Router()
const validateSaveEventInfo = bodyInfoValidator({
  validator: validateEventInfo
})

const validateUpdateEventInfo = bodyInfoValidator({
  validator: validatePartialEventInfo
})

const validateParams = searchParamsValidator({
  validator: validateSearchParams
})
const validateFilters = searchQueryParamsValidator({
  validator: validateFilterEvents
})

router.get(
  '/',
  validateFilters,
  wrapAsyncController(EventController.getAll)
)

router.get(
  '/:id',
  validateParams,
  wrapAsyncController(EventController.getOneById)
)

router.post(
  '/',
  validateSaveEventInfo,
  wrapAsyncController(EventController.createOne)
)

router.patch(
  '/:id',
  validateParams,
  validateUpdateEventInfo,
  wrapAsyncController(EventController.updateOneById)
)

router.delete(
  '/:id',
  validateParams,
  wrapAsyncController(EventController.deleteOneById)
)

export default router
