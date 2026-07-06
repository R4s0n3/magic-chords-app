import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import {
  setupMelodySynth,
  melodyNoteOn,
  melodyNoteOff,
  releaseAllMelody,
  playMelodyNote,
} from "./melody-synth";
import type { RecordedNote } from "./composition";

// Classic DAW-style keyboard mapping: A row = white keys, W row = black keys
const KEY_TO_SEMITONE: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7,
  y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ";": 16,
};

const generateId = () => Math.random().toString(36).slice(2, 11);

/**
 * Piano-roll engine: live note input (computer keyboard + Web MIDI),
 * recording against the Transport, and looped playback of recorded notes.
 * `enabled` gates all listeners so closing the panel detaches everything.
 */
export function useMelody(enabled: boolean, bars: number, bpm: number) {
  const [notes, setNotes] = useState<RecordedNote[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [octave, setOctave] = useState(4);

  const loopBeats = bars * 4;

  // Refs so noteOn/noteOff keep a stable identity for the listener effects
  const recordingRef = useRef(isRecording);
  recordingRef.current = isRecording;
  const loopBeatsRef = useRef(loopBeats);
  loopBeatsRef.current = loopBeats;
  const octaveRef = useRef(octave);
  octaveRef.current = octave;

  // midi -> { start position in beats (NaN when not recording), velocity }
  const heldRef = useRef(new Map<number, { start: number; velocity: number }>());
  // keyboard key -> midi it triggered (octave may change while held)
  const keyNotesRef = useRef(new Map<string, number>());

  const transportBeats = () =>
    Tone.Transport.seconds * (Tone.Transport.bpm.value / 60);

  useEffect(() => {
    if (enabled) void setupMelodySynth();
  }, [enabled]);

  const noteOn = useCallback((midi: number, velocity = 0.8) => {
    if (heldRef.current.has(midi)) return;
    melodyNoteOn(midi, velocity);
    const start =
      recordingRef.current && Tone.Transport.state === "started"
        ? transportBeats() % loopBeatsRef.current
        : NaN;
    heldRef.current.set(midi, { start, velocity });
    setActiveNotes((prev) => new Set(prev).add(midi));
  }, []);

  const noteOff = useCallback((midi: number) => {
    melodyNoteOff(midi);
    const held = heldRef.current.get(midi);
    heldRef.current.delete(midi);
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });

    if (!held || Number.isNaN(held.start)) return;

    const loop = loopBeatsRef.current;
    let duration = (transportBeats() % loop) - held.start;
    if (duration <= 0) duration += loop; // note held across the loop point
    duration = Math.max(0.125, Math.min(duration, loop));

    setNotes((prev) => [
      ...prev,
      { id: generateId(), midi, start: held.start, duration, velocity: held.velocity },
    ]);
  }, []);

  // Computer keyboard input
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;

      const key = e.key.toLowerCase();
      if (key === "z") return setOctave((o) => Math.max(1, o - 1));
      if (key === "x") return setOctave((o) => Math.min(6, o + 1));

      const semitone = KEY_TO_SEMITONE[key];
      if (semitone === undefined || keyNotesRef.current.has(key)) return;
      e.preventDefault();
      const midi = 12 * (octaveRef.current + 1) + semitone;
      keyNotesRef.current.set(key, midi);
      noteOn(midi);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const midi = keyNotesRef.current.get(key);
      if (midi === undefined) return;
      keyNotesRef.current.delete(key);
      noteOff(midi);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      keyNotesRef.current.clear();
      heldRef.current.clear();
      setActiveNotes(new Set());
      releaseAllMelody();
    };
  }, [enabled, noteOn, noteOff]);

  // Web MIDI input (auto-connects all devices, including hot-plugged ones)
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.requestMIDIAccess)
      return;

    let cancelled = false;
    let access: MIDIAccess | null = null;

    const onMessage = (e: MIDIMessageEvent) => {
      const data = e.data;
      if (!data || data.length < 3) return;
      const status = data[0]!;
      const note = data[1]!;
      const velocity = data[2]!;
      const command = status & 0xf0;
      if (command === 0x90 && velocity > 0) noteOn(note, velocity / 127);
      else if (command === 0x80 || (command === 0x90 && velocity === 0))
        noteOff(note);
    };

    navigator
      .requestMIDIAccess()
      .then((a) => {
        if (cancelled) return;
        access = a;
        const attach = () =>
          a.inputs.forEach((input) => {
            input.onmidimessage = onMessage;
          });
        attach();
        a.onstatechange = attach;
      })
      .catch(() => {
        /* MIDI unavailable or permission denied — keyboard input still works */
      });

    return () => {
      cancelled = true;
      if (access) {
        access.onstatechange = null;
        access.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [enabled, noteOn, noteOff]);

  // Looped playback of recorded notes alongside the sequencer
  useEffect(() => {
    if (notes.length === 0) return;

    const beat = 60 / bpm;
    const part = new Tone.Part(
      (time, n: RecordedNote) => {
        playMelodyNote(n.midi, n.duration * beat, time, n.velocity);
      },
      notes.map((n) => [n.start * beat, n] as [number, RecordedNote]),
    ).start(0);
    part.loop = true;
    part.loopEnd = loopBeats * beat;

    return () => {
      part.dispose();
    };
  }, [notes, bpm, loopBeats]);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => setNotes([]), []);

  // Snap note starts to the nearest 16th
  const quantize = useCallback(() => {
    setNotes((prev) =>
      prev.map((n) => ({
        ...n,
        start: (Math.round(n.start * 4) / 4) % loopBeatsRef.current,
      })),
    );
  }, []);

  /** 0..1 position within the loop, for the playhead */
  const getLoopProgress = useCallback(() => {
    if (Tone.Transport.state !== "started") return 0;
    return (transportBeats() % loopBeatsRef.current) / loopBeatsRef.current;
  }, []);

  return {
    notes,
    removeNote,
    clear,
    quantize,
    isRecording,
    setIsRecording,
    activeNotes,
    octave,
    getLoopProgress,
  };
}
