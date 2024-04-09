import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, replay) => {
  if (error instanceof ZodError) {
    return replay.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return replay.status(400).send({ message: error.message });
  }
  return replay.status(500).send({ message: "Internal server error" });
};

export {
  errorHandler
};
