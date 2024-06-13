import { ParticipantController } from '@/controllers/participants.js'
import { wrapAsyncController } from '@/helpers/wrapperAsyncController.js'
import {
  searchParamsValidator,
  searchQueryParamsValidator
} from '@/middlewares/validateSearchParams.js'
import { bodyInfoValidator } from '@/middlewares/validatorBodyInfo.js'
import { validateSearchParams } from '@/schemas/general.js'
import {
  validatePartialParticipantInfo,
  validateParticipantInfo,
  validateSearchParticipantByParams
} from '@/schemas/participant.js'
import { Router } from 'express'

const router = Router()
const validatorParticipant = bodyInfoValidator({
  validator: validateParticipantInfo
})

const validatePartialParticipant = bodyInfoValidator({
  validator: validatePartialParticipantInfo
})

const validateParams = searchParamsValidator({
  validator: validateSearchParams
})

const validateQueryParams = searchQueryParamsValidator({
  validator: validateSearchParticipantByParams
})

router.get(
  '/',
  validateQueryParams,
  wrapAsyncController(ParticipantController.getAll)
)

router.get(
  '/:id',
  validateParams,
  wrapAsyncController(ParticipantController.getOneById)
)

router.post(
  '/',
  validatorParticipant,
  wrapAsyncController(ParticipantController.createOne)
)

router.patch(
  '/:id',
  validateParams,
  validatePartialParticipant,
  wrapAsyncController(ParticipantController.updateOneById)
)

router.delete(
  '/:id',
  validateParams,
  wrapAsyncController(ParticipantController.deleteOneById)
)

export default router
