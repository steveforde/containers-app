import express, { type Response } from "express";
import diaryService from "../services/diaryService";
import { NewEntrySchema } from "../types";
import type { DiaryEntry, NonSensitiveDiaryEntry } from "../types";

// Initialize an isolated Express Router instance to handle individual sub-route paths elegantly
const router = express.Router();

/**
 * Route Endpoint: GET /api/diaries
 * Fetches all records while stripping out restricted sensitive weather/visibility strings.
 */
router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

/**
 * Route Endpoint: GET /api/diaries/:id
 * Locates and sends back a complete single diary entry matching the URL path ID parameter.
 */
router.get("/:id", (req, res: Response<DiaryEntry>) => {
  // Convert the URL string path parameter explicitly to a number before database lookup execution
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    // Return an immediate 404 Not Found error status code if record lookup fails
    res.sendStatus(404);
  }
});

/**
 * Route Endpoint: POST /api/diaries
 * Validates the request body structural runtime scheme using Zod before allowing data persist pipelines.
 */
router.post("/", (req, res) => {
  try {
    // Run the incoming payload request body through the rigid Zod ZodObject schema layout validation
    const newDiaryEntry = NewEntrySchema.parse(req.body);

    // Pass the safely parsed and structured payload to the data mutation layer engine
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    // Intercept parsing failures (such as structural validation issues like wrong or missing enum types)
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: "An unexpected error occurred." });
    }
  }
});

export default router;
