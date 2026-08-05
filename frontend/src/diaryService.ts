import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";

// Target endpoint URL routing traffic directly to the local backend service
const baseUrl = "http://localhost:3000/api/diaries";

/**
 * Async API Client Service: GET
 * Queries the backend service to retrieve the array collection of existing entries.
 * @returns {Promise<DiaryEntry[]>} Array data containing public diary objects
 */
export const getAllDiaries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

/**
 * Async API Client Service: POST
 * Dispatches a newly configured un-indexed log record to the persistent storage controller.
 * @param {NewDiaryEntry} object - The validated user payload object collected from form inputs
 * @returns {Promise<DiaryEntry>} The resulting completed database object including its newly assigned ID
 */
export const createDiary = async (object: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(baseUrl, object);
  return response.data;
};
