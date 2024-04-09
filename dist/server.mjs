import {
  deleteEvent
} from "./chunk-IQDXAH2Q.mjs";
import {
  getAllEvents
} from "./chunk-LNHZFXSZ.mjs";
import {
  attendeeBadge
} from "./chunk-6TUUW65O.mjs";
import {
  getEventAttendees
} from "./chunk-PDYG6SBP.mjs";
import {
  getEvent
} from "./chunk-KWKVWBZA.mjs";
import {
  registerForEvent
} from "./chunk-6PTILMZZ.mjs";
import {
  updateEvent
} from "./chunk-X6SF45Z2.mjs";
import {
  env
} from "./chunk-4JVYUT77.mjs";
import {
  errorHandler
} from "./chunk-OE3GRQW3.mjs";
import {
  checkIn
} from "./chunk-WJVSJ3KX.mjs";
import {
  createEvent
} from "./chunk-DY4JWCAJ.mjs";
import "./chunk-KDMJHR3Z.mjs";
import "./chunk-UX6HP52O.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante a NLW Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getAllEvents);
app.register(getEvent);
app.register(updateEvent);
app.register(deleteEvent);
app.register(getEventAttendees);
app.register(attendeeBadge);
app.register(checkIn);
app.setErrorHandler(errorHandler);
app.listen({ port: env.PORT || 3333, host: "0.0.0.0" }).then(() => {
  console.log("\u{1F525} Server running on port 3333");
});
