import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Vector3 } from "three";
import { Sampler } from "tone";

export interface Sample {
  index: number;
  sampler: Sampler;
}

export const CHORDS: Sample[] = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: "chord_1.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: "chord_2.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: "chord_3.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: "chord_4.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: "chord_5.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: "chord_6.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: "chord_7.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 7,
    sampler: new Sampler({
      urls: {
        1: "chord_8.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
];

export const PLUCKS: Sample[] = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: "pluck_1.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: "pluck_2.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: "pluck_3.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: "pluck_4.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: "pluck_5.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: "pluck_6.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: "pluck_7.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
  {
    index: 7,
    sampler: new Sampler({
      urls: {
        1: "pluck_8.mp3",
      },
      baseUrl: "/audio/",
    }),
  },
];

const App = () => (
  <Canvas
    dpr={window.devicePixelRatio}
    camera={{ position: new Vector3(0, 0, 10) }}
  >
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  </Canvas>
);

export default App;
