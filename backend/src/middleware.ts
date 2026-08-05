import { type Request, type Response, type NextFunction } from "express";
import { NewEntrySchema } from "./types";
import { z } from "zod";

/**
 * Request Validation Middleware
 * Intercepts incoming POST payloads and parses them against the strict Zod schema before hitting controllers.
 */
export const newDiaryParser = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // Reassigning req.body captures the completely cleaned, safely-typed object strip of unexpected fields
    req.body = NewEntrySchema.parse(req.body);

    // Successfully validated; hand control off to the next function handler in the routing chain
    next();
  } catch (error: unknown) {
    // Pass validation structural errors automatically down to the centralized Express error receiver
    next(error);
  }
};

/**
 * Centralized Error Boundary Middleware
 * Captures thrown verification failures and formats readable error issue reporting responses.
 */
export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If the error originated from a failed Zod runtime structural parse validation check
  if (error instanceof z.ZodError) {
    // Return a bad request status along with the exact descriptive list of validation failures
    res.status(400).send({ error: error.issues });
  } else {
    // Forward non-validation or unhandled application errors to default structural log trees
    next(error);
  }
};
