import { useEffect, useState, useCallback } from "react";
import { chordProgressions } from "./chords/progressions";
import type { Genre } from "./chords/progressions";
import { minorScales, majorScales } from "./chords/statics";
import { resolveChordSymbol } from "./chords/functions";

export function useChordProgression(
  pickedChord: string | null,
  genre: Genre = "jazz",
  refreshKey = 0,
) {
  const [progression, setProgression] = useState<string[]>([]);

  const generate = useCallback(() => {
    if (!pickedChord) {
      setProgression([]);
      return;
    }

    const isMinor = pickedChord.endsWith("m");
    const tonality = isMinor ? "minor" : "major";

    try {
      const genreData = chordProgressions[genre];
      const availableProgressions = genreData?.[tonality];

      if (!availableProgressions) {
        setProgression([]);
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * availableProgressions.length,
      );
      const randomProgression = availableProgressions[randomIndex];

      const scale =
        (isMinor ? minorScales[pickedChord] : majorScales[pickedChord]) ?? [];

      const resolvedProgression = randomProgression?.map((symbol) => {
        const res = resolveChordSymbol(symbol, scale, pickedChord);
        // Check against string "undefined" just in case, but valid string check is better
        return res && res !== "undefined" && res !== "NaN" ? res : pickedChord;
      });

      setProgression(resolvedProgression ?? []);
    } catch (error) {
      console.error("Error generating progression:", error);
      setProgression([]);
    }
  }, [pickedChord, genre]);

  useEffect(() => {
    generate();
  }, [generate, refreshKey]);

  return progression;
}
