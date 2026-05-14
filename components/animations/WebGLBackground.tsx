"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * WebGL Background — luxurious animated noise shader.
 * Features gold particle-like warmth moving slowly in the background.
 * Runs on GSAP ticker for zero RAF conflicts with Lenis.
 */
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Enhanced shader — warm gold atmospheric noise with subtle vignette
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_resolution;

      /* ── Noise helpers ── */
      float hash21(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
        for(int i = 0; i < 5; i++) {
          v += amp * noise(p);
          p = rot * p * 2.01 + vec2(0.7, 1.3);
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float ar = u_resolution.x / u_resolution.y;
        vec2 st = uv;
        st.x *= ar;

        float t  = u_time * 0.06;
        vec2  p  = st * 2.2;

        /* Layered domain-warped fbm */
        vec2 q  = vec2(fbm(p + vec2(t * 0.8, t * 0.4)),
                       fbm(p + vec2(t * 0.3, t * 0.9)));
        vec2 r  = vec2(fbm(p + q + vec2(1.7, 9.2) + t * 0.15),
                       fbm(p + q + vec2(8.3, 2.8) - t * 0.12));
        float n = fbm(p + r);

        /* PTS color palette — deep charcoal to warm bronze-gold */
        vec3 deep   = vec3(0.038, 0.038, 0.042);   /* #0a0a0b */
        vec3 bg     = vec3(0.067, 0.064, 0.060);   /* warm charcoal */
        vec3 mid    = vec3(0.12,  0.10,  0.082);   /* warm mid */
        vec3 bronze = vec3(0.26,  0.21,  0.15);    /* bronze warmth */
        vec3 gold   = vec3(0.32,  0.25,  0.17);    /* soft gold peak */

        vec3 color = deep;
        color = mix(color, bg,     smoothstep(0.20, 0.45, n));
        color = mix(color, mid,    smoothstep(0.42, 0.62, n));
        color = mix(color, bronze, smoothstep(0.60, 0.78, n) * 0.7);
        color = mix(color, gold,   smoothstep(0.75, 0.92, n) * 0.4);

        /* Vignette */
        vec2 vig = uv - 0.5;
        float v  = 1.0 - dot(vig * vec2(1.0 / ar, 1.0), vig * vec2(1.0 / ar, 1.0)) * 1.6;
        color *= clamp(v, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");

    // Low-res for GPU performance (40% of DPR)
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5) * 0.38;
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(document.documentElement);

    const start = performance.now();
    const tick  = () => {
      gl.uniform1f(uTime, (performance.now() - start) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none w-full h-full"
      style={{ imageRendering: "auto" }}
    />
  );
}
