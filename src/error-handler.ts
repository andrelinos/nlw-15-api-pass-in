import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequest } from './_errors/bad-request'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, replay) => {
  if (error instanceof ZodError) {
    return replay.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return replay.status(400).send({ message: error.message })
  }

  return replay.status(500).send({ message: 'Internal server error' })
}
