"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createSurface } from "./materials";

export type CharacterId = "evelina" | "max" | "grigory";

const cast = {
  evelina: { skin: "#bb8974", hair: "#241a18", jacket: "#55303c", shirt: "#a7907a", trousers: "#282129", height: 1.04, longHair: true, beard: false },
  max: { skin: "#bc8b70", hair: "#3c2a20", jacket: "#4d5558", shirt: "#a7a09a", trousers: "#25272a", height: 1.08, longHair: false, beard: false },
  grigory: { skin: "#a57965", hair: "#534943", jacket: "#393434", shirt: "#bbb0a0", trousers: "#292726", height: 1.12, longHair: false, beard: true },
} as const;

function Limb({ from, to, radius, color, roughness = .86 }: { from: THREE.Vector3; to: THREE.Vector3; radius: number; color: string; roughness?: number }) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const center = new THREE.Vector3().addVectors(from, to).multiplyScalar(.5);
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={center} quaternion={rotation} castShadow><cylinderGeometry args={[radius * .85, radius, direction.length(), 10]} /><meshStandardMaterial color={color} roughness={roughness} /></mesh>;
}

function Eye({ x, blink }: { x: number; blink: boolean }) {
  return <group position={[x, 1.765, .157]}>
    <mesh scale={[.027, blink ? .003 : .019, .009]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#e5d8c8" roughness={.3} /></mesh>
    {!blink && <mesh position={[0, 0, .009]} scale={[.011, .014, .006]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#2c2725" roughness={.2} /></mesh>}
    <mesh position={[0, .035, -.001]} scale={[.039, .007, .012]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#3d2a25" roughness={1} /></mesh>
  </group>;
}

export default function CharacterModel({ id, position, rotation = 0, onSelect }: { id: CharacterId; position: [number, number, number]; rotation?: number; onSelect?: (id: CharacterId) => void }) {
  const look = cast[id];
  const fabric = useMemo(() => createSurface("cloth", 128, 128), []);
  useEffect(() => () => fabric.dispose(), [fabric]);
  const animated = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const phase = id === "max" ? 1.8 : id === "grigory" ? 3.6 : 0;
  const [blink, setBlink] = useState(false);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (animated.current) animated.current.position.y = Math.sin(t * 1.4) * .005;
    if (head.current) head.current.rotation.y = Math.sin(t * .38) * .045;
    const blinkNow = t % 4.7 < .12;
    if (blink !== blinkNow) setBlink(blinkNow);
  });
  return <group position={position} rotation={[0, rotation, 0]} onClick={(event) => { event.stopPropagation(); onSelect?.(id); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
    <group ref={animated} scale={[look.height, look.height, look.height]}>
      <mesh position={[0, .64, 0]} castShadow><cylinderGeometry args={[.17, .135, .52, 14]} /><meshStandardMaterial color={look.trousers} roughness={.95} /></mesh>
      {[-1, 1].map(side => <group key={side}>
        <Limb from={new THREE.Vector3(side * .105, .54, 0)} to={new THREE.Vector3(side * .12, .095, .025)} radius={.075} color={look.trousers} />
        <mesh position={[side * .12, .065, .09]} castShadow scale={[.095, .065, .19]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#211d1c" roughness={.72} /></mesh>
        <Limb from={new THREE.Vector3(side * .22, 1.35, 0)} to={new THREE.Vector3(side * .28, 1.04, .025)} radius={.07} color={look.jacket} />
        <Limb from={new THREE.Vector3(side * .28, 1.04, .025)} to={new THREE.Vector3(side * .22, .77, .13)} radius={.055} color={look.jacket} />
        <mesh position={[side * .22, .75, .13]} scale={[.052, .09, .05]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={look.skin} roughness={.9} /></mesh>
      </group>)}
      <mesh position={[0, 1.16, 0]} castShadow><cylinderGeometry args={[.23, .175, .58, 16]} /><meshStandardMaterial map={fabric} color={look.jacket} roughness={.91} /></mesh>
      <mesh position={[0, 1.23, .202]} scale={[.115, .25, .02]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={look.shirt} roughness={.93} /></mesh>
      <mesh position={[0, 1.525, 0]}><cylinderGeometry args={[.065, .065, .16, 12]} /><meshStandardMaterial color={look.skin} roughness={.94} /></mesh>
      <group ref={head}>
        <mesh position={[0, 1.755, .012]} castShadow scale={[.17, .22, .16]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={look.skin} roughness={.85} /></mesh>
        <mesh position={[0, 1.745, .17]} scale={[.035, .065, .043]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={look.skin} roughness={.83} /></mesh>
        <mesh position={[0, 1.665, .16]} scale={[.043, .009, .011]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#71473f" roughness={.85} /></mesh>
        {[-.078, .078].map(x => <Eye key={x} x={x} blink={blink} />)}
        {[-1, 1].map(side => <mesh key={side} position={[side * .166, 1.74, .005]} scale={[.03, .056, .029]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={look.skin} roughness={.85} /></mesh>)}
        <mesh position={[0, 1.895, -.02]} scale={[.18, .09, .175]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={look.hair} roughness={.98} /></mesh>
        {look.longHair && [-1, 1].map(side => <mesh key={side} position={[side * .135, 1.675, -.065]} scale={[.066, .27, .115]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={look.hair} roughness={.98} /></mesh>)}
        {look.beard && <mesh position={[0, 1.615, .052]} scale={[.145, .08, .13]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={look.hair} roughness={.99} /></mesh>}
      </group>
    </group>
  </group>;
}
