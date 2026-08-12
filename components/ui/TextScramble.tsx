"use client";

import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  charset?: string;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_+=/";

/**
 * Hover-triggered text scramble/decrypt effect for mono labels.
 * Only animates on mouse enter; restores on mouse leave.
 */
export default function TextScramble({
  text,
  className = "",
  duration = 600,
  charset = DEFAULT_CHARSET,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const scramble = () => {
    cancelAnimationFrame(frameRef.current);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const revealed = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < revealed) {
          out += text[i];
        } else {
          out += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      setDisplay(out);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <span
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={() => {
        cancelAnimationFrame(frameRef.current);
        setDisplay(text);
      }}
    >
      {display}
    </span>
  );
}
