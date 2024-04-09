import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { errorHandler } from './error-handler'
import { checkIn } from './routes/check-in'
import { createEvent } from './routes/create-event'
import { deleteEvent } from './routes/delete-event'
import { getAllEvents } from './routes/get-all-events'
import { attendeeBadge } from './routes/get-attendee-badge'
import { getEvent } from './routes/get-event'
import { getEventAttendees } from './routes/get-event-attendees'
import { registerForEvent } from './routes/register-for-event'
import { updateEvent } from './routes/update-event'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description:
        'Especificações da API para o back-end da aplicação pass.in construída durante a NLW Unite da Rocketseat.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getAllEvents)
app.register(getEvent)
app.register(updateEvent)
app.register(deleteEvent)
app.register(getEventAttendees)
app.register(attendeeBadge)
app.register(checkIn)

app.setErrorHandler(errorHandler)

app.listen({ port: env.PORT || 3333, host: '0.0.0.0' }).then(() => {
  console.log('🔥 Server running on port 3333')
})
