'use client'
import { useState, useEffect } from "react";
import { chords, majorScales, minorScales } from "@/util/chords/statics";
import { useChordProgression } from "@/util/chord-hook";
import { useSequencer } from "@/util/use-sequencer";
import { updateSynth, updateEffects } from "@/util/synth";
import type { SynthParams } from "@/util/synth";
import type { VoicingType, PatternType } from "@/util/chords/functions";
import type { Genre } from "@/util/chords/progressions";
import { downloadMidi } from "@/util/midi-export";
import { Play, Square, RefreshCcw, Zap, Sliders, Music, Volume2, Activity, Download, Layers, Radio, Plus, X, Wand2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableChord } from "./_components/sortable-chord";

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Home() {
  const [pickedChord, setPickedChord] = useState<string | null>(null);
  const [bpm, setBpm] = useState(100);
  const [voicing, setVoicing] = useState<VoicingType>('open');
  const [pattern, setPattern] = useState<PatternType>('strum');
  const [genre, setGenre] = useState<Genre>('jazz');
  const [enableBass, setEnableBass] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  // Unified Items State for Drag & Drop
  const [items, setItems] = useState<{ id: string, chord: string }[]>([]);
  const [isManualMode, setIsManualMode] = useState(false);

  // Auto Progression Logic
  const autoProgression = useChordProgression(pickedChord, genre, refreshKey);

  // Sync Auto Progression to Items when in Auto Mode
  useEffect(() => {
    if (!isManualMode) {
      setItems(autoProgression.map(c => ({ id: generateId(), chord: c })));
    }
  }, [autoProgression, isManualMode]);

  // Sequencer uses only the chord names
  const progressionStrings = items.map(i => i.chord);
  const { isPlaying, togglePlay, stop, currentStep } = useSequencer(progressionStrings, bpm, voicing, pattern, enableBass);

  const [oscType, setOscType] = useState<SynthParams['oscillatorType']>('fatsine1');
  const [attack, setAttack] = useState(0.01);
  const [release, setRelease] = useState(1.0);
  const [reverbMix, setReverbMix] = useState(0.2);
  const [delayMix, setDelayMix] = useState(0.1);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsManualMode(true); // Implicit switch to manual
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Manual Mode Logic
  const handleManualAdd = (chord: string) => {
    setIsManualMode(true);
    setItems(prev => [...prev, { id: generateId(), chord }]);
  };

  const handleManualRemove = (id: string) => {
    setIsManualMode(true); // Implicit switch
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearManual = () => {
    setItems([]);
    setIsManualMode(true);
  };

  const switchToAuto = () => {
    setIsManualMode(false);
    setRefreshKey(prev => prev + 1);
  };

  const availableChords = pickedChord
    ? (pickedChord.endsWith('m') ? minorScales[pickedChord] : majorScales[pickedChord])
    : [];

  useEffect(() => {
    if (isPlaying) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    updateSynth({
      oscillatorType: oscType,
      envelope: { attack, decay: 0.1, sustain: 0.3, release }
    });
    updateEffects({
      reverb: { wet: reverbMix, decay: 2 },
      delay: { wet: delayMix, delayTime: "8n.", feedback: 0.3 }
    });
  }, [oscType, attack, release, reverbMix, delayMix]);

  const oscOptions: SynthParams['oscillatorType'][] = ['fatsine1', 'sawtooth', 'square'];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30">
      <header className="border-b border-zinc-800 p-6 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Music className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-100 uppercase">Magic<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Chords</span></h1>
            <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Producers Edition</p>
          </div>
        </div>
      </header>


      <div className="flex items-center gap-6 bg-zinc-900 p-2 px-4 rounded-full border border-zinc-800 fixed bottom-4 sm:bottom-auto sm:top-4 left-auto right-4 z-50">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-zinc-500" />
          <div className="flex flex-col">
            <label className="text-[10px] uppercase text-zinc-500 font-bold">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="bg-transparent w-12 font-mono font-bold text-amber-500 focus:outline-none text-center"
              min={40} max={240}
            />
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-800 mx-2"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`${isPlaying ? 'bg-zinc-800 text-red-400' : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'} p-3 rounded-full transition-all active:scale-95 shadow-lg`}
          >
            {isPlaying ? <Square className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-0.5" />}
          </button>
        </div>

        {/*         <div className="h-8 w-px bg-zinc-800 mx-2"></div>
          <button
            onClick={() => pickedChord && downloadMidi(progressionStrings, bpm, voicing)}
            disabled={!pickedChord}
            className="text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed p-2 rounded-full transition-colors"
            title="Export MIDI"
          >
            <Download className="w-5 h-5" />
          </button> */}
      </div>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-80 border-r border-zinc-800 bg-zinc-900/30 p-6 overflow-y-auto">
          <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Root Note
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {chords.map((chord) => (
              <button
                key={chord}
                onClick={() => {
                  setPickedChord(chord);
                  setIsManualMode(false);
                  setItems([]); // Will be re-populated by effect
                  setRefreshKey(prev => prev + 1);
                }}
                className={`aspect-square rounded-lg font-bold text-sm transition-all border ${pickedChord === chord ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'}`}
              >
                {chord}
              </button>
            ))}
          </div>

          <div className="my-6 h-px bg-zinc-800"></div>

          <div className="space-y-6">

            <div className={`transition-opacity duration-300 ${isManualMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-sm font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Radio className="w-4 h-4" /> Style
              </h2>
              <div className="grid grid-cols-2 gap-1 gap-y-2">
                {(['jazz', 'neosoul', 'lofi', 'pop', 'dark'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => { setGenre(g); setRefreshKey(prev => prev + 1); }}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all border ${genre === g ? 'bg-amber-500 text-zinc-900 border-amber-500 font-black' : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Voicing
              </h2>
              <div className="flex flex-col gap-1">
                {(['open', 'root', 'first', 'second', 'extended'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setVoicing(v)}
                    className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wide rounded-md transition-all ${voicing === v ? 'bg-zinc-800 text-amber-400 shadow-sm border-l-2 border-amber-400' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Pattern
              </h2>
              <div className="grid grid-cols-2 gap-1">
                {(['strum', 'pad', 'arp-up', 'arp-down', 'pulse', 'melody'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPattern(p)}
                    className={`px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide rounded-md transition-all border border-transparent ${pattern === p ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              <span className="text-xs font-bold uppercase text-zinc-400">Bassline</span>
              <button
                onClick={() => setEnableBass(!enableBass)}
                className={`w-10 h-5 rounded-full transition-colors relative ${enableBass ? 'bg-amber-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${enableBass ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col bg-zinc-950 relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center">
            {!pickedChord ? (
              <div className="text-center space-y-4 opacity-50">
                <div className="w-20 h-20 border-2 border-dashed border-zinc-700 rounded-2xl mx-auto flex items-center justify-center">
                  <Music className="w-8 h-8 text-zinc-700" />
                </div>
                <p className="text-zinc-500 font-mono">Select a root note to generate a progression</p>
              </div>
            ) : (
              <div className="w-full max-w-4xl">
                <div className="flex justify-between items-end mb-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-light text-zinc-400">
                        {isManualMode ? 'Custom' : 'Auto'} Progression in <strong className="text-amber-400">{pickedChord}</strong>
                      </h2>
                      <p className="text-zinc-600 mt-1 font-mono text-sm max-w-md">
                        {isManualMode ? 'Click suggested chords, drag to reorder' : `Style: ${genre.toUpperCase()} • Pattern: ${pattern.toUpperCase()}`}
                      </p>
                    </div>
                    {isManualMode && (
                      <button
                        onClick={switchToAuto}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 border border-zinc-700"
                      >
                        <Wand2 className="w-3 h-3" /> Auto
                      </button>
                    )}
                  </div>

                  {!isManualMode && (
                    <button onClick={() => setRefreshKey(prev => prev + 1)} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer hover:bg-zinc-900 p-2 rounded">
                      <RefreshCcw className="w-3 h-3" /> Regenerate
                    </button>
                  )}

                  {isManualMode && (
                    <button onClick={clearManual} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer hover:bg-zinc-900 p-2 rounded">
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                      {items.map((item, idx) => (
                        <SortableChord key={item.id} id={item.id} className="cursor-grab active:cursor-grabbing">
                          <div
                            className={`relative group h-full aspect-[3/4] md:aspect-square rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center
                                    ${currentStep === idx ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] z-10 scale-105' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}
                                    `}
                          >
                            <span className="text-3xl md:text-5xl font-black text-zinc-200 tracking-tighter group-hover:text-white transition-colors text-center pointer-events-none">
                              {item.chord}
                            </span>
                            <span className="mt-2 text-xs font-mono text-zinc-600 uppercase tracking-widest pointer-events-none">
                              Bar {idx + 1}
                            </span>

                            {/* Remove Button (Mouse only) */}
                            <button
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 p-1 rounded text-red-500 hover:bg-red-500/40 cursor-pointer"
                              onPointerDown={(e) => { e.stopPropagation(); handleManualRemove(item.id); }}
                            >
                              <X className="w-3 h-3" />
                            </button>

                            {currentStep === idx && (
                              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]"></div>
                            )}
                          </div>
                        </SortableChord>
                      ))}

                      {/* Add Placeholder */}
                      {items.length < 16 && (
                        <div className="aspect-[3/4] md:aspect-square rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-700">
                          <span className="text-xs font-bold uppercase text-center px-4">Select a chord below</span>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Suggestion Strip */}
                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Suggested Chords (Key of {pickedChord})
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {availableChords?.map((sChord, i) => (
                      <button
                        key={i}
                        onClick={() => handleManualAdd(sChord)}
                        className="flex-shrink-0 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500 hover:bg-zinc-800 hover:text-amber-400 transition-all text-zinc-400 font-bold text-lg"
                      >
                        {sChord}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border-t border-zinc-800 p-6 md:h-48 relative z-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 h-full">

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Oscillator
                </h3>
                <div className="bg-zinc-950 p-1 rounded-lg flex gap-1 border border-zinc-800">
                  {oscOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => setOscType(type)}
                      className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-md transition-all ${oscType === type ? 'bg-zinc-800 text-amber-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      {type === 'fatsine1' ? 'Fat' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-3 h-3" /> Envelope
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-mono text-zinc-500 w-8">ATK</label>
                    <input type="range" min="0.001" max="0.5" step="0.001" value={attack} onChange={e => setAttack(Number(e.target.value))} className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-mono text-zinc-500 w-8">REL</label>
                    <input type="range" min="0.1" max="3.0" step="0.1" value={release} onChange={e => setRelease(Number(e.target.value))} className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3 h-3" /> FX Chain
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono"><span>REVERB</span> <span>{(reverbMix * 100).toFixed(0)}%</span></div>
                    <input type="range" min="0" max="0.5" step="0.01" value={reverbMix} onChange={e => setReverbMix(Number(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono"><span>DELAY</span> <span>{(delayMix * 100).toFixed(0)}%</span></div>
                    <input type="range" min="0" max="0.5" step="0.01" value={delayMix} onChange={e => setDelayMix(Number(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
