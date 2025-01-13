type ChordQuality = 'major' | 'minor' | 'dim' | 'aug' | '7' | 'maj7' | 'm7' | 'dim7';

type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

type ChordName = `${NoteName}${ChordQuality | ''}`;

type ChordVoicing = {
  root: string[];
  first: string[];
  second: string[];
  open: string[];
  extended: string[];
}

type ChordTiming = {
  chord: ChordName;
  duration: number;
}