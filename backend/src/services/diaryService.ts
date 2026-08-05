import diaryEntries from "../../data/entries.json";
import type {
  DiaryEntry,
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
} from "../types";

// Explicitly typecast static JSON seed records array into our strict runtime DiaryEntry interface layout
const diaries: DiaryEntry[] = diaryEntries as DiaryEntry[];

/**
 * Extract every record held in memory complete with sensitive narrative text blocks intact
 * @returns {DiaryEntry[]} Full comprehensive logs array
 */
const getEntries = (): DiaryEntry[] => {
  return diaries;
};

/**
 * Extract records while omitting sensitive comment blocks using object destructuring
 * to protect private diary information before wire transmission.
 * @returns {NonSensitiveDiaryEntry[]} Sanitized entry logs array
 */
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

/**
 * Query the in-memory array to find a unique diary log tracking parameter criteria match
 * @param {number} id - The numeric ID of the specific flight record
 * @returns {DiaryEntry | undefined} The located object shape, or undefined if missed
 */
const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaries.find((d) => d.id === id);
  return entry;
};

/**
 * Append a newly validated configuration log seamlessly onto our global dataset array
 * @param {NewDiaryEntry} entry - Safely validated data layout payload (omits ID)
 * @returns {DiaryEntry} The completely populated record including its newly calculated sequential ID field
 */
const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiaryEntry = {
    // Generate an incremental unique identifier token by finding the current highest numerical index and adding 1
    id: Math.max(...diaries.map((d) => d.id)) + 1,
    ...entry,
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addDiary,
};
