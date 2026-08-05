import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./diaryService";
import axios from "axios";

/**
 * Root Application Component
 * Manages local diary log state, form field validations, and renders radio inputs.
 */
const App = () => {
  // Application State Hooks
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Allowed static option criteria strings used to accurately render mapped out input trees
  const visibilityOptions = ["great", "good", "ok", "poor"];
  const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];

  /**
   * Component Mounting Hook
   * Hydrates local state by firing an initial GET query payload fetching existing diaries.
   */
  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  /**
   * Submission Event Interceptor
   * Dispatches newly specified creation payloads to backend storage, featuring deep Zod error parser handles.
   */
  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const addedEntry = await createDiary({
        date,
        weather,
        visibility,
        comment,
      });

      // Update data views smoothly using pure array concatenation patterns
      setDiaries(diaries.concat(addedEntry));

      // Clear input fields and errors completely upon successful payload dispatching
      setDate("");
      setWeather("");
      setVisibility("");
      setComment("");
      setErrorMessage("");
    } catch (error: unknown) {
      // Catch bad response configurations originating directly from network data transactions
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;

        // Verify if error structure represents raw JSON error reporting returned via the Zod validation middleware
        if (data && typeof data === "object" && "error" in data) {
          try {
            // Unpack stringified error metadata issues arrays sent back by the backend middleware
            const zodErrors = JSON.parse(data.error as string);
            if (Array.isArray(zodErrors) && zodErrors.length > 0) {
              const firstIssue = zodErrors[0];
              const fieldName = firstIssue.path[0]; // Isolate the targeted error location (e.g. 'weather')

              let invalidValue = "";
              if (fieldName === "visibility") invalidValue = visibility;
              if (fieldName === "weather") invalidValue = weather;

              // Display localized warnings specifying exactly what data failed input rules
              setErrorMessage(`Incorrect ${fieldName}: ${invalidValue}`);
            } else {
              setErrorMessage("Validation failed on the backend.");
            }
          } catch {
            // Fall back to printing raw message text descriptions if JSON transformations fail
            setErrorMessage(String(data.error));
          }
        } else if (typeof data === "string") {
          setErrorMessage(data);
        } else {
          setErrorMessage("Something went wrong with the submission.");
        }
      } else {
        console.error(error);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        textAlign: "left",
      }}
    >
      <h2>Add new entry</h2>

      {/* Conditional Error Display Panel */}
      {errorMessage && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Error: {errorMessage}
        </p>
      )}

      <form onSubmit={diaryCreation} style={{ marginBottom: "30px" }}>
        {/* Date Input Field */}
        <div style={{ marginBottom: "10px" }}>
          <span style={{ marginRight: "10px" }}>date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Visibility Controlled Radio Options Selector */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span>visibility:</span>
          {visibilityOptions.map((option) => (
            <label
              key={option}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              {option}
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
            </label>
          ))}
        </div>

        {/* Weather Controlled Radio Options Selector */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span>weather:</span>
          {weatherOptions.map((option) => (
            <label
              key={option}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              {option}
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
            </label>
          ))}
        </div>

        {/* General Comment Narrative text node input */}
        <div style={{ marginBottom: "15px" }}>
          <span style={{ marginRight: "10px" }}>comment:</span>
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <button
          type="submit"
          style={{ padding: "4px 12px", cursor: "pointer" }}
        >
          add
        </button>
      </form>

      <hr style={{ border: "0.5px solid #ccc", margin: "20px 0" }} />

      {/* Historical Logs List Layout Rendering Grid */}
      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id} style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 5px 0" }}>{diary.date}</h3>
          <p style={{ margin: "2px 0" }}>visibility: {diary.visibility}</p>
          <p style={{ margin: "2px 0" }}>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
