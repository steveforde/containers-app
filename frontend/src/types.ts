/**
 * Complete Public Diary Record Structure
 * Mirrors the object layout retrieved directly from the database storage engine.
 */
export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string; // Optional property layer (not all records contain text descriptions)
}

/**
 * Log Creation Payload Shape
 * Uses the 'Omit' utility to dynamically drop the backend-managed 'id' property.
 * This guarantees type safety when capturing new entry information from client form fields.
 */
export type NewDiaryEntry = Omit<DiaryEntry, "id">;
