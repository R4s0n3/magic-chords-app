'use client'
import { useEffect, useRef } from "react";
import { Circle, Magnet, Trash2, X, Keyboard } from "lucide-react";
import type { RecordedNote } from "@/util/composition";

const MIN_MIDI = 36; // C2
const MAX_MIDI = 96; // C7
const ROW_H = 10;
const ROWS = MAX_MIDI - MIN_MIDI + 1;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(midi % 12);
const noteName = (midi: number) =>
  `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

type Props = {
  notes: RecordedNote[];
  activeNotes: Set<number>;
  bars: number;
  isRecording: boolean;
  octave: number;
  onToggleRecord: () => void;
  onQuantize: () => void;
  onClear: () => void;
  onRemoveNote: (id: string) => void;
  getLoopProgress: () => number;
  onClose: () => void;
};

export function PianoRoll({
  notes,
  activeNotes,
  bars,
  isRecording,
  octave,
  onToggleRecord,
  onQuantize,
  onClear,
  onRemoveNote,
  getLoopProgress,
  onClose,
}: Props) {
  const loopBeats = bars * 4;
  const scrollRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Center the view around C4 on open
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = (MAX_MIDI - 60) * ROW_H - 90;
  }, []);

  // Drive the playhead outside React so it stays smooth
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (playheadRef.current)
        playheadRef.current.style.left = `${getLoopProgress() * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [getLoopProgress]);

  const rows = Array.from({ length: ROWS }, (_, i) => MAX_MIDI - i);

  return (
    <div className="bg-zinc-900/80 border-t border-zinc-800 relative z-20">
      <div className="px-4 md:px-6 py-2.5 flex items-center gap-3 flex-wrap border-b border-zinc-800/60">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Keyboard className="w-4 h-4" /> Piano Roll
        </h3>

        <button
          onClick={onToggleRecord}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50'}`}
        >
          <Circle className={`w-2.5 h-2.5 fill-current ${isRecording ? 'animate-pulse' : ''}`} />
          {isRecording ? 'Recording' : 'Record'}
        </button>

        <button
          onClick={onQuantize}
          disabled={notes.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600 disabled:opacity-30 transition-all"
        >
          <Magnet className="w-3 h-3" /> Quantize
        </button>

        <button
          onClick={onClear}
          disabled={notes.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50 disabled:opacity-30 transition-all"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>

        <span className="text-[10px] font-mono text-zinc-600 hidden md:inline">
          Keys A–; play · Z/X octave (C{octave}) · MIDI controllers auto-connect · click a note to delete
        </span>

        <button
          onClick={onClose}
          className="ml-auto text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex max-h-52 overflow-y-auto">
        {/* Key column */}
        <div className="w-12 flex-shrink-0 border-r border-zinc-800 select-none">
          {rows.map((midi) => (
            <div
              key={midi}
              style={{ height: ROW_H }}
              className={`flex items-center justify-end pr-1.5 text-[8px] font-mono border-b border-zinc-800/30 transition-colors ${
                activeNotes.has(midi)
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : isBlackKey(midi)
                    ? 'bg-zinc-950 text-zinc-700'
                    : 'bg-zinc-800/80 text-zinc-500'
              }`}
            >
              {midi % 12 === 0 ? noteName(midi) : ''}
            </div>
          ))}
        </div>

        {/* Note grid */}
        <div
          className="flex-1 relative"
          style={{
            height: ROWS * ROW_H,
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: `${100 / bars}% 100%, ${100 / (bars * 16)}% 100%, 100% ${ROW_H}px`,
          }}
        >
          {/* Black-key row shading */}
          {rows.map(
            (midi) =>
              isBlackKey(midi) && (
                <div
                  key={midi}
                  className="absolute left-0 right-0 bg-zinc-950/40 pointer-events-none"
                  style={{ top: (MAX_MIDI - midi) * ROW_H, height: ROW_H }}
                />
              ),
          )}

          {/* Recorded notes */}
          {notes.map(
            (n) =>
              n.midi >= MIN_MIDI &&
              n.midi <= MAX_MIDI && (
                <button
                  key={n.id}
                  onClick={() => onRemoveNote(n.id)}
                  title={`${noteName(n.midi)} — click to delete`}
                  className="absolute rounded-sm bg-amber-500 hover:bg-red-500 border border-amber-300/50 transition-colors cursor-pointer"
                  style={{
                    top: (MAX_MIDI - n.midi) * ROW_H + 1,
                    height: ROW_H - 2,
                    left: `${(n.start / loopBeats) * 100}%`,
                    width: `max(${(n.duration / loopBeats) * 100}%, 4px)`,
                    opacity: 0.4 + n.velocity * 0.6,
                  }}
                />
              ),
          )}

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-0 w-px bg-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.8)] pointer-events-none"
          />

          {notes.length === 0 && (
            <div className="sticky top-20 text-center text-zinc-600 text-xs font-mono pointer-events-none py-2">
              Jam with your keyboard or MIDI controller — hit Record to capture over the loop
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
