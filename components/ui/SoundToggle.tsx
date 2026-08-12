"use client";

import { useRef, useState } from "react";
import * as Tone from "tone";

interface SoundToggleProps {
  label?: string;
}

/**
 * Opt-in ambient sound toggle using Tone.js.
 * Starts muted; user must explicitly enable. No autoplay.
 */
export default function SoundToggle({ label }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  const toggle = async () => {
    if (!enabled) {
      await Tone.start();
      const reverb = new Tone.Reverb({ decay: 6, wet: 0.6 }).toDestination();
      const filter = new Tone.Filter(800, "lowpass").connect(reverb);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "fatsine" },
        envelope: { attack: 1.5, decay: 0.5, sustain: 0.4, release: 3 },
        volume: -22,
      }).connect(filter);
      synthRef.current = synth;

      const chords = [
        ["C3", "G3", "E4"],
        ["A2", "E3", "C4"],
        ["F2", "C3", "A3"],
        ["G2", "D3", "B3"],
      ];
      let chordIndex = 0;
      const loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease(chords[chordIndex], "4n", time);
        chordIndex = (chordIndex + 1) % chords.length;
      }, "8n");
      loopRef.current = loop;
      loop.start(0);
      Tone.Transport.bpm.value = 30;
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      loopRef.current?.dispose();
      synthRef.current?.dispose();
      loopRef.current = null;
      synthRef.current = null;
    }

    setEnabled(!enabled);
  };

  return (
    <button
      onClick={toggle}
      className="flex h-9 items-center gap-2 rounded-full border border-surface-3 px-3 text-sm transition-colors hover:bg-surface-1"
      aria-pressed={enabled}
      aria-label={label || "Toggle ambient sound"}
      title={label || "Toggle ambient sound"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={enabled ? "text-accent" : "text-text-tertiary"}
      >
        {enabled ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
