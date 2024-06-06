import { EventController } from '@/controllers/events.js'
import { wrapAsyncController } from '@/helpers/wrapperAsyncController.js'
import {
  searchParamsValidator,
  searchQueryParamsValidator
} from '@/middlewares/validateSearchParams.js'
import { bodyInfoValidator } from '@/middlewares/validatorBodyInfo.js'
import { validateEventInfo, validatePartialEventInfo, validateSearchEventByParams } from '@/schemas/event.js'
import { validateSearchParams } from '@/schemas/general.js'
import { Router } from 'express'

const router = Router()
const handleValidationBody = bodyInfoValidator({
  validator: validateEventInfo
})

const validationPartialOwner = bodyInfoValidator({
  validator: validatePartialEventInfo
})

const validateParams = searchParamsValidator({
  validator: validateSearchParams
})
const validateQueryParams = searchQueryParamsValidator({
  validator: validateSearchEventByParams
})

router.get(
  '/',
  validateQueryParams,
  wrapAsyncController(EventController.getAll)
)

router.get(
  '/:id',
  validateParams,
  wrapAsyncController(EventController.getOneById)
)

router.post(
  '/',
  handleValidationBody,
  wrapAsyncController(EventController.createOne)
)

router.patch(
  '/:id',
  validateParams,
  validationPartialOwner,
  wrapAsyncController(EventController.updateOneById)
)

router.delete(
  '/:id',
  validateParams,
  wrapAsyncController(EventController.deleteOneById)
)

export default router
