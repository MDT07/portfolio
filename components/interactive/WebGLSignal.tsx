"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";

const copy = {
  ru: [
    { label: "Интерфейс", detail: "Сценарий становится системой экранов и состояний." },
    { label: "Архитектура", detail: "Компоненты, данные и интеграции соединяются в продукт." },
    { label: "Интеллект", detail: "AI работает внутри проверяемого процесса, а не вместо него." },
  ],
  en: [
    { label: "Interface", detail: "A user flow becomes a system of screens and states." },
    { label: "Architecture", detail: "Components, data, and integrations become a product." },
    { label: "Intelligence", detail: "AI operates inside a verifiable process, not instead of one." },
  ],
} as const;

const vertexShader = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const fragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uMode;

mat2 rotate2d(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float scene(vec3 p) {
  float time = uTime * 0.34;
  p.xz *= rotate2d(time + uPointer.x * 0.45);
  p.xy *= rotate2d(time * 0.61 - uPointer.y * 0.35);
  float core = length(p) - (0.46 + uMode * 0.025);
  float ringA = length(vec2(length(p.xz) - 0.92, p.y)) - 0.055;
  p.yz *= rotate2d(1.047 + uMode * 0.42);
  float ringB = length(vec2(length(p.xy) - 1.13, p.z)) - 0.038;
  p.xz *= rotate2d(1.16);
  float ringC = length(vec2(length(p.yz) - 1.34, p.x)) - 0.025;
  return min(core, min(ringA, min(ringB, ringC)));
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0025, 0.0);
  float d = scene(p);
  return normalize(vec3(
    scene(p + e.xyy) - d,
    scene(p + e.yxy) - d,
    scene(p + e.yyx) - d
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  vec3 ro = vec3(0.0, 0.0, 3.65);
  vec3 rd = normalize(vec3(uv, -1.8));
  float total = 0.0;
  float glow = 0.0;
  float hit = 0.0;
  vec3 point = ro;

  for (int i = 0; i < 52; i++) {
    point = ro + rd * total;
    float distanceToScene = scene(point);
    glow += 0.009 / (0.035 + abs(distanceToScene));
    if (distanceToScene < 0.002) { hit = 1.0; break; }
    if (total > 7.0) break;
    total += max(distanceToScene * 0.68, 0.008);
  }

  vec3 background = vec3(0.018, 0.043, 0.066);
  float vignette = 1.0 - smoothstep(0.35, 1.5, length(uv));
  background += vec3(0.018, 0.075, 0.12) * vignette;
  vec3 color = background + vec3(0.03, 0.23, 0.39) * min(glow * 0.045, 0.34);

  if (hit > 0.5) {
    vec3 normal = normalAt(point);
    vec3 light = normalize(vec3(-0.55, 0.7, 0.8));
    float diffuse = max(dot(normal, light), 0.0);
    float rim = pow(1.0 - max(dot(normal, -rd), 0.0), 2.4);
    float bands = 0.5 + 0.5 * sin((point.y + point.x * 0.35) * 24.0 + uTime * 1.25);
    color = mix(vec3(0.035, 0.16, 0.25), vec3(0.28, 0.72, 0.98), diffuse * 0.75 + rim);
    color += vec3(0.16, 0.48, 0.75) * bands * 0.13;
  }

  color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLSignal({ lang }: { lang: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(1);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(1);
  const [available, setAvailable] = useState(true);
  const items = copy[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setAvailable(false);
      return;
    }

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      setAvailable(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      setAvailable(false);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      setAvailable(false);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      setAvailable(false);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "uResolution");
    const pointer = gl.getUniformLocation(program, "uPointer");
    const time = gl.getUniformLocation(program, "uTime");
    const mode = gl.getUniformLocation(program, "uMode");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const density = window.matchMedia("(max-width: 700px)").matches
        ? 0.72
        : Math.min(window.devicePixelRatio || 1, 1.2);
      const width = Math.max(1, Math.floor(rect.width * density));
      const height = Math.max(1, Math.floor(rect.height * density));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      if (disposed) return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointer, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(time, reducedMotion ? 0.8 : now * 0.001);
      gl.uniform1f(mode, modeRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion && visible && !document.hidden) frame = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      if (nextVisible && !visible && !reducedMotion) {
        visible = true;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
      } else {
        visible = nextVisible;
        if (!visible) cancelAnimationFrame(frame);
      }
    }, { threshold: 0.05 });
    const handleVisibility = () => {
      if (!document.hidden && visible && !reducedMotion) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
      }
    };
    observer.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }

  function selectMode(index: number) {
    modeRef.current = index;
    setActive(index);
  }

  return (
    <div className="signal-core" onPointerMove={updatePointer} onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}>
      <div className="signal-core__fallback" aria-hidden>
        <i /><i /><i />
      </div>
      <canvas ref={canvasRef} className="signal-core__canvas" aria-hidden hidden={!available} />
      <div className="signal-core__hud">
        <header>
          <span><i aria-hidden /> WEBGL / PRODUCT CORE</span>
          <span>{available ? "GPU" : "CSS"} FALLBACK</span>
        </header>
        <div className="signal-core__readout" aria-live="polite">
          <span>0{active + 1}</span>
          <strong>{items[active].label}</strong>
          <p>{items[active].detail}</p>
        </div>
        <div className="signal-core__modes" role="group" aria-label={lang === "ru" ? "Режим визуализации" : "Visualization mode"}>
          {items.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={active === index} onClick={() => selectMode(index)}>
              <span>0{index + 1}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
