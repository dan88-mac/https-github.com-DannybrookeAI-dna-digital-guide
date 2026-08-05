"use client";

import { useEffect, useRef, useState } from "react";
import { ReducedMotionFallback } from "@/components/ui/ReducedMotionFallback";

export function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setUseFallback(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) {
      setUseFallback(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio, 2);
    let raf = 0;
    let start = performance.now();

    const vsSource = `
      attribute vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv -= 0.5;
        uv.x *= u_resolution.x / u_resolution.y;
        float t = u_time * 0.15;
        float band = sin(uv.x * 6.0 + t) * 0.08 + cos(uv.y * 8.0 - t) * 0.08;
        float edge = smoothstep(0.35, 0.0, abs(uv.y) + abs(uv.x) * 0.6 + band);
        vec3 base = vec3(0.02, 0.02, 0.05);
        vec3 glow = vec3(0.35, 0.38, 0.95) * edge;
        float vignette = 1.0 - length(uv) * 0.85;
        gl_FragColor = vec4((base + glow) * vignette, 1.0);
      }
    `;

    function compile(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const loop = (now: number) => {
      if (document.visibilityState === "hidden") {
        raf = requestAnimationFrame(loop);
        return;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  if (useFallback) return <ReducedMotionFallback />;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-90"
      aria-hidden
    />
  );
}
