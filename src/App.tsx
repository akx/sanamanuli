import React from "react";
import { findMatches, loadData } from "./data";

function App() {
  const [wordData, setWordData] = React.useState<Uint8ClampedArray | null>(
    null,
  );
  const [disallowedLetters, setDisallowedLetters] = React.useState("");
  const [mustHaveLetters, setMustHaveLetters] = React.useState("");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [expectedLength, setExpectedLength] = React.useState(5);
  React.useEffect(() => {
    loadData().then(setWordData);
  }, []);
  const results = React.useMemo(() => {
    if (!wordData) return null;
    if (
      !(
        mustHaveLetters.length ||
        disallowedLetters.length ||
        start.length ||
        end.length
      )
    )
      return null;
    const accepted = findMatches(
      wordData,
      mustHaveLetters,
      disallowedLetters,
      expectedLength,
    );
    return [...accepted].sort().filter((w) => {
      if (start.length && !w.startsWith(start)) return false;
      if (end.length && !w.endsWith(end)) return false;
      return true;
    });
  }, [
    wordData,
    mustHaveLetters,
    disallowedLetters,
    expectedLength,
    start,
    end,
  ]);
  return (
    <main>
      <div className="controls">
        <label>
          <span>Tarttee olla:</span>
          <input
            type="text"
            placeholder="kirjaimia..."
            value={mustHaveLetters}
            onChange={(e) =>
              setMustHaveLetters(e.target.value.trim().toLowerCase())
            }
          />
        </label>
        <label>
          <span>{mustHaveLetters.length ? "Mut ei" : "Ei"} saa olla:</span>
          <input
            type="text"
            placeholder="kirjaimia..."
            value={disallowedLetters}
            onChange={(e) =>
              setDisallowedLetters(e.target.value.trim().toLowerCase())
            }
          />
        </label>
        <label>
          <span>Pituus:</span>
          <div>
            <button
              onClick={() => setExpectedLength(5)}
              disabled={expectedLength === 5}
            >
              5
            </button>
            <button
              onClick={() => setExpectedLength(6)}
              disabled={expectedLength === 6}
            >
              6
            </button>
          </div>
        </label>
      </div>
      <div className="controls">
        <label>
          <span>Tarttee alkaa:</span>
          <input
            type="text"
            placeholder="kirjaimia..."
            value={start}
            onChange={(e) => setStart(e.target.value.trim().toLowerCase())}
          />
        </label>
        <label>
          <span>{start.length ? "Ja tarttee" : "Tarttee"} loppuu:</span>
          <input
            type="text"
            placeholder="kirjaimia..."
            value={end}
            onChange={(e) => setEnd(e.target.value.trim().toLowerCase())}
          />
        </label>
      </div>
      <div className="results">
        {results?.map((word) => (
          <div key={word}>{word}</div>
        ))}
      </div>
    </main>
  );
}

export default App;
