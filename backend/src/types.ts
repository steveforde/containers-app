import { z } from "zod";

// ==========================================
// 1. RUNTIME ENUM OBJECT DEFINITIONS
// ==========================================

/**
 * Read-only runtime lookup configuration for meteorological data points.
 * Using 'as const' forces TypeScript to treat the values as strict literal types.
 */
export const Weather = {
  Sunny: "sunny",
  Rainy: "rainy",
  Cloudy: "cloudy",
  Stormy: "stormy",
  Windy: "windy",
} as const;

/**
 * Read-only runtime lookup configuration for environmental atmospheric conditions.
 */
export const Visibility = {
  Great: "great",
  Good: "good",
  Ok: "ok",
  Poor: "poor",
} as const;

// ==========================================
// 2. COMPILE-TIME TYPE EXTRACTION
// ==========================================

// Map and extract individual string literal unions directly out of the runtime lookup structures
export type Weather = (typeof Weather)[keyof typeof Weather];
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

// ==========================================
// 3. RUNTIME VALIDATION DATA SCHEMA
// ==========================================

/**
 * Central Zod Structural Parsing Ruleset
 * Validates untrusted payload fields and throws deterministic exceptions if schemas do not match.
 */
export const NewEntrySchema = z.object({
  weather: z.nativeEnum(Weather), // String matching exactly one of our Weather object values
  visibility: z.nativeEnum(Visibility), // String matching exactly one of our Visibility object values
  date: z.string().date(), // Enforces exact ISO-standard calendar formats (YYYY-MM-DD)
  comment: z.string().optional(), // Optional field; permits text strings or undefined absences
});

// ==========================================
// 4. INTERFACE INFERENCE AND EXTENSIONS
// ==========================================

/**
 * Compile-time representation of an unsaved log payload automatically inferred from the Zod engine rules
 */
export type NewDiaryEntry = z.infer<typeof NewEntrySchema>;

/**
 * Complete Database Record Signature
 * Extends the basic creation layout to include a mandatory sequential index value.
 */
export interface DiaryEntry extends NewDiaryEntry {
  id: number;
}

/**
 * Privacy Protection Shape
 * Creates a public view layout by completely cutting out the sensitive 'comment' property string.
 */
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;
