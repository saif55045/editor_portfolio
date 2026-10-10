"use client";
/**
 * Hero background: a single full-screen fragment shader (animated light-leak blobs
 * that drift toward the pointer). One plane, no post-processing — cheap enough for
 * almost any device. Hero.tsx loads it lazily and crossfades it over the CSS aurora.
 */
import { Component, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const frag = /* glsl */ `
  uniform float uTime; uniform vec2 uMouse; varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 blob(vec2 uv, vec2 c, float r, vec3 col){ return col * pow(smoothstep(r, 0., length(uv - c)), 1.7); }
  void main(){
    vec2 uv = vUv; float t = uTime * .08;
    vec2 m = uMouse * .05;
    vec3 col = vec3(.02, .02, .027);
    col += blob(uv, vec2(.18 + .08*sin(t*1.3) + m.x, .74 + .06*cos(t) + m.y), .6,  vec3(.486,.424,1.) * .65);
    col += blob(uv, vec2(.84 + .07*cos(t*1.1) - m.x, .62 + .08*sin(t*.9) - m.y), .55, vec3(1.,.36,.54) * .55);
    col += blob(uv, vec2(.5  + .12*sin(t*.7), .1 + .05*cos(t*1.7)), .55, vec3(.24,.85,.96) * .4);
    col += blob(uv, vec2(.72 + .05*sin(t*1.9) + m.x*2., .38 + m.y*2.), .3, vec3(1.,.7,.25) * .6);
    // slow horizontal "film burn" streak
    float streak = smoothstep(.02, 0., abs(uv.y - (.5 + .18*sin(t*.8)))) * (.5 + .5*sin(uv.x*3. + t*2.));
    col += vec3(1.,.55,.3) * streak * .05;
    col *= smoothstep(1.3, .15, length(uv - .5) * 1.45);
    col += (hash(uv * 900. + uTime) - .5) * .012; // dither / grain, kills banding
    gl_FragColor = vec4(col, 1.);
  }`;

function Plane() {
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }), []);
  useFrame((s, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(s.pointer, 0.04);
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady); // only after the first real frame is on screen
  });
  return null;
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function LightLeak({
  active,
  eventSource,
  onReady,
  onFail,
}: {
  active: boolean;
  eventSource: RefObject<HTMLElement | null>;
  onReady: () => void;
  onFail: () => void;
}) {
  return (
    <Boundary onError={onFail}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        eventSource={eventSource as RefObject<HTMLElement>}
        eventPrefix="client"
      >
        <Plane />
        <Ready onReady={onReady} />
      </Canvas>
    </Boundary>
  );
}
