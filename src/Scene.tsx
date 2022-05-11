import { OrbitControls, Plane, shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { Color, DoubleSide, ShaderMaterial } from "three";
import { start } from "tone";
import { Sample, CHORDS, PLUCKS } from "./App";
import { fragmentShader, vertexShader } from "./shader";
import { useGesture } from "react-use-gesture";

const sortRandom = (array: any[]) => array.sort((a, b) => 0.5 - Math.random());

const pickRandom = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export const PITCH = ["8.5", "10"];

export const PATTERN = [0.0, 20.0, 40.0, 60.0, 80.0, 100.0, 120.0, 140.0];

export const SCALE = [1.5, 2];

export const BLUR = [0.0, 0.2, 0.4];

export const TIME = [200, 100];

export const COLORS = [
  // dark
  [
    "#000000", // black
    "#004451", // greenblue
    "#111033", // blue
    "#800b0b", // red
    "#053d08", // green
    "#dc0fc0", // pink
    "#aa4807", // orange
    "#75007e", // purple
  ],
  // light
  [
    "#ffffff", // white
    "#ffd600", // yellow
    "#497fff", // blue
    "#eb3434", // red
    "#30f8a0", // green
    "#ff6aeb", // pink
    "#fe7418", // orange
    "#00f7fb", // turqoise
  ],
];

const pitch = pickRandom(PITCH);
const pattern = pickRandom(PATTERN);
const scale = pickRandom(SCALE);
const blur = pickRandom(BLUR);
const time = pickRandom(TIME);
const theme = sortRandom(COLORS);

const bgColor = new Color(pickRandom(theme[0]));
const lineColor1 = new Color(pickRandom(theme[1]));
const lineColor2 = new Color(pickRandom(theme[1]));

const NoiseMaterial = shaderMaterial(
  {
    scale,
    size: 0.2,
    density: 4.0,
    time: 0.0,
    pattern,
    blur,
    bgColor,
    lineColor1,
    lineColor2,
  },
  vertexShader,
  fragmentShader
);

extend({ NoiseMaterial });

const AnimatedPlane = a(Plane);

const Scene = () => {
  const { viewport } = useThree();
  const material = useRef<ShaderMaterial>(null);
  const [toneInitialized, setToneInitialized] = useState(false);
  const [lastPlayedSample, setLastPlayedSample] = useState<Sample>();
  const plucks = useMemo(() => PLUCKS.map((pluck) => pluck), []);
  const availableChords = useMemo(
    () =>
      CHORDS.filter(({ sampler, index }) => index !== lastPlayedSample?.index),
    [lastPlayedSample]
  );

  const getPlaneSize = useCallback(
    (size: number) => (viewport.aspect > 1 ? size : size * viewport.aspect),
    [viewport.aspect]
  );

  const [spring, setSpring] = useSpring(() => ({
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    time: 0,
  })) as any;

  useEffect(() => {
    console.log(
      "%c * Computer Emotions * ",
      "color: #d80fe7; font-size: 16px; background-color: black;"
    );
    CHORDS.forEach(({ sampler }) => sampler.toDestination());
    PLUCKS.forEach(({ sampler }) => sampler.toDestination());
  }, []);

  useEffect(() => {
    if (lastPlayedSample) {
      lastPlayedSample.sampler.triggerAttack(pitch);

      plucks[lastPlayedSample.index].sampler.volume.set({ value: -3 });
      plucks[lastPlayedSample.index].sampler.triggerAttack(pitch);
    }
  }, [lastPlayedSample, plucks]);

  useFrame(({ clock }) => {
    material.current!.uniforms.time.value = Math.sin(
      (2 * Math.PI * clock.getElapsedTime() + spring.time.get()) / time
    );
  });

  const initializeTone = useCallback(async () => {
    await start();
    setToneInitialized(true);
  }, []);

  const onClick = useCallback(async () => {
    if (!toneInitialized) {
      await initializeTone();
    }

    const currentSampler = pickRandom(availableChords);
    setLastPlayedSample(currentSampler);
  }, [initializeTone, toneInitialized, availableChords]);

  const bind = useGesture({
    onPointerDown: () => {
      if (spring.rotation.isAnimating) {
        return;
      }

      setSpring.start({ scale: [0.9, 0.9, 0.9], config: { friction: 20 } });
    },
    onPointerUp: () => {
      if (spring.rotation.isAnimating) {
        return;
      }

      onClick();
      setSpring.start({
        scale: [1, 1, 1],
        rotation: [0, 0, spring.rotation.get()[2] - Math.PI / 2],
        time: spring.time.get() + 250,
        config: { friction: 17, mass: 1 },
      });
    },
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <OrbitControls enabled={false} />
      <AnimatedPlane
        {...bind()}
        {...spring}
        args={[getPlaneSize(14), getPlaneSize(14)]}
      >
        {/*
          // @ts-ignore */}
        <noiseMaterial ref={material} side={DoubleSide} />
      </AnimatedPlane>
    </>
  );
};

export default Scene;
