import { OrbitControls, Plane, shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { Color, DoubleSide, ShaderMaterial } from "three";
import { start } from "tone";
import { Sample, CHORDS } from "./App";
import { fragmentShader, vertexShader } from "./shader";
import { useGesture } from "react-use-gesture";

declare const fxrand: () => number;

const sortRandom = (array: any[]) => array.sort((a, b) => 0.5 - Math.random());

const pickRandom = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

const sortRandomHash = (array: any[]) => array.sort((a, b) => 0.5 - fxrand());

const pickRandomHash = (array: any[]) =>
  array[Math.floor(fxrand() * array.length)];

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

const pitch = pickRandomHash(PITCH);
const pattern = pickRandomHash(PATTERN);
const scale = pickRandomHash(SCALE);
const blur = pickRandomHash(BLUR);
const time = pickRandomHash(TIME);
const theme = sortRandomHash(COLORS);

const bgColor = new Color(pickRandomHash(theme[0]));
const lineColor1 = new Color(pickRandomHash(theme[1]));
const lineColor2 = new Color(pickRandomHash(theme[1]));

// @ts-ignore
window.$fxhashFeatures = {
  pitch,
  pattern,
  scale,
  blur,
  time,
  bgColor: bgColor.getHexString(),
  lineColor1: lineColor1.getHexString(),
  lineColor2: lineColor2.getHexString()
};

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

  const availableChords = useMemo(
    () =>
      CHORDS.filter(({ sampler, index }) => index !== lastPlayedSample?.index),
    [lastPlayedSample]
  );

  const getPlaneSize = useCallback(
    (size: number) => (viewport.aspect > 1 ? size : size * viewport.aspect),
    [viewport.aspect]
  );

  const [{ scale }, setScale] = useSpring(() => ({
    scale: [1, 1, 1],
  }));

  const [{ rotation }, setRotation] = useSpring(() => ({
    rotation: [0, 0, 0],
  }));

  const [{ animTime }, setAnimTime] = useSpring(() => ({
    animTime: 0,
  }));

  useEffect(() => {
    console.log(
      "%c * Computer Emotions * ",
      "color: #d80fe7; font-size: 16px; background-color: #000000;"
    );

    CHORDS.forEach(({ sampler }) => sampler.toDestination());
  }, []);

  useEffect(() => {
    if (lastPlayedSample) {
      lastPlayedSample.sampler.triggerAttack(pitch);
    }
  }, [lastPlayedSample]);

  useFrame(({ clock }) => {
    material.current!.uniforms.time.value = Math.sin(
      (2 * Math.PI * clock.getElapsedTime() + animTime.get()) / time
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
      if (rotation.isAnimating) {
        return;
      }

      setScale.start({ scale: [0.9, 0.9, 0.9], config: { friction: 20 } });
    },
    onPointerUp: () => {
      if (rotation.isAnimating) {
        return;
      }

      onClick();
      setScale.start({
        scale: [1, 1, 1],
        config: { friction: 17, mass: 1 },
      });

      setRotation.start({
        rotation: [0, 0, rotation.get()[2] - Math.PI / 2],
        config: { friction: 17, mass: 1 },
      });

      setAnimTime.start({
        animTime: animTime.get() + 500,
        config: { friction: 17, mass: 1 },
      });
    },
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <OrbitControls enabled={false} />
      {/*
        // @ts-ignore */}
      <AnimatedPlane
        {...bind()}
        scale={scale as any}
        rotation={rotation as any}
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
