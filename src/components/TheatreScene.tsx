"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CharacterModel, { type CharacterId } from "./CharacterModel";
import { createSurface } from "./materials";

type PropId = "box" | "note" | "perfume" | "receipt" | "script" | "key";
type Vec3 = [number, number, number];

const wood = "#493126";
const brass = "#a7814a";
const paper = "#d6c4a0";

function Block({ position, args, color, metalness = 0, roughness = .75, rotation }: { position: Vec3; args: Vec3; color: string; metalness?: number; roughness?: number; rotation?: Vec3 }) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow><boxGeometry args={args} /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}

function Lamp({ position, lit = true }: { position: Vec3; lit?: boolean }) {
  return <group position={position}>
    <mesh castShadow><sphereGeometry args={[.092, 12, 12]} /><meshStandardMaterial color={lit ? "#ffdb9c" : "#79716d"} emissive={lit ? "#ffad5c" : "#000000"} emissiveIntensity={lit ? 2 : 0} /></mesh>
    <mesh position={[0, 0, -.05]}><cylinderGeometry args={[.105, .105, .045, 12]} /><meshStandardMaterial color={brass} metalness={.75} roughness={.25} /></mesh>
  </group>;
}

function Curtain({ x }: { x: number }) {
  const velvet = useMemo(() => createSurface("velvet"), []);
  useEffect(() => () => velvet.dispose(), [velvet]);
  return <group position={[x, 0, -2.62]}>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(i - 4) * .105, .16, .05 + (i % 2) * .075]} castShadow><cylinderGeometry args={[.12, .09, 3.65, 8, 1, true, 0, Math.PI]} /><meshStandardMaterial map={velvet} color={i % 2 ? "#e9d1c5" : "#ab9294"} side={THREE.DoubleSide} roughness={.96} /></mesh>)}
    <mesh position={[0, -.48, .21]} rotation={[0, 0, x < 0 ? -.22 : .22]}><torusGeometry args={[.43, .035, 6, 28, Math.PI]} /><meshStandardMaterial color={brass} metalness={.7} /></mesh>
  </group>;
}

function Vanity() {
  return <group>
    <Block position={[0, -.26, -1.58]} args={[4.65, .15, 1.03]} color={wood} roughness={.47} />
    <Block position={[0, -.58, -1.97]} args={[4.38, .49, .62]} color="#3b241e" />
    {[-1.9, 1.9].map(x => <group key={x}><Block position={[x, -1.07, -1.85]} args={[.16, .98, .18]} color={wood} /><Block position={[x, -.64, -1.59]} args={[.84, .34, .05]} color="#56392b" /></group>)}
    {[-.87, 0, .87].map(x => <group key={x}><Block position={[x, -.6, -1.64]} args={[.79, .37, .045]} color="#543729" /><mesh position={[x, -.61, -1.61]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.027, .009, 6, 12]} /><meshStandardMaterial color={brass} metalness={.85} /></mesh></group>)}
    <Block position={[0, 1.24, -2.46]} args={[2.53, 2.18, .16]} color={brass} metalness={.72} roughness={.34} />
    <Block position={[0, 1.24, -2.37]} args={[2.36, 2.01, .07]} color="#393b3e" metalness={.73} roughness={.18} />
    <Block position={[.15, 1.25, -2.328]} args={[.83, 1.96, .008]} color="#62666b" metalness={.7} roughness={.27} />
    {[-1.39, 1.39].flatMap(x => [-.0, .57, 1.14, 1.71, 2.26].map((y, i) => <Lamp key={`${x}-${i}`} position={[x, y, -2.32]} lit={i !== 2 || x < 0} />))}
    {[-.93, -.46, 0, .46, .93].map(x => <Lamp key={x} position={[x, 2.48, -2.32]} />)}
    <mesh position={[0, -.97, -.84]} castShadow><cylinderGeometry args={[.48, .43, .15, 24]} /><meshStandardMaterial color="#6f4435" roughness={.85} /></mesh>
    <mesh position={[0, -1.22, -.84]}><cylinderGeometry args={[.07, .11, .4, 12]} /><meshStandardMaterial color="#35302c" metalness={.5} /></mesh>
  </group>;
}

function CostumeRack() {
  return <group position={[2.9, 0, -.8]}>
    {[-.55, .55].map(x => <mesh key={x} position={[x, .22, 0]}><cylinderGeometry args={[.025, .025, 2.3, 8]} /><meshStandardMaterial color="#75706b" metalness={.8} /></mesh>)}
    <mesh position={[0, 1.42, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.035, .035, 1.35, 10]} /><meshStandardMaterial color="#897b69" metalness={.8} /></mesh>
    {["#3a2934", "#635142", "#722b38", "#414e50"].map((color, i) => <group key={color} position={[-.36 + i * .24, .46, 0]}>
      <mesh position={[0, .34, 0]} castShadow><cylinderGeometry args={[.15, .3, 1.3, 8]} /><meshStandardMaterial color={color} roughness={.95} /></mesh>
      <mesh position={[0, 1.08, 0]}><torusGeometry args={[.07, .012, 5, 12, Math.PI]} /><meshStandardMaterial color={brass} metalness={.7} /></mesh>
    </group>)}
  </group>;
}

function Door() {
  return <group position={[-3.55, .35, -2.52]}>
    <Block position={[0, .08, .09]} args={[1.2, 3.02, .19]} color="#523528" />
    <Block position={[0, .15, .205]} args={[.91, 2.62, .03]} color="#292326" />
    <Block position={[0, -.47, .25]} args={[.66, .9, .045]} color="#40302c" />
    <mesh position={[.39, -.2, .28]}><sphereGeometry args={[.065, 12, 12]} /><meshStandardMaterial color={brass} metalness={.9} roughness={.24} /></mesh>
    <Block position={[0, 1.71, .18]} args={[1.4, .32, .1]} color="#241b1b" />
  </group>;
}

function EclairBox() {
  return <group>
    <RoundedBox args={[.69, .15, .45]} radius={.018} castShadow><meshStandardMaterial color="#b88963" roughness={.8} /></RoundedBox>
    <Block position={[0, .09, -.24]} args={[.72, .015, .17]} color="#d1ad85" rotation={[-.4, 0, 0]} />
    {[-.17, .09].map(x => <group key={x} position={[x, .1, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[.058, .17, 4, 9]} /><meshStandardMaterial color="#bb7c3a" roughness={.75} /></mesh><mesh position={[0, .055, 0]}><sphereGeometry args={[.045, 8, 6]} /><meshStandardMaterial color="#a6a96c" roughness={.9} /></mesh></group>)}
  </group>;
}

function Note() { return <group><Block position={[0, 0, 0]} args={[.42, .005, .31]} color={paper} rotation={[0, .15, .06]} />{[-.05, .0, .05].map(z => <Block key={z} position={[0, .005, z]} args={[.25, .002, .006]} color="#4d4442" rotation={[0, .15, .06]} />)}</group>; }

function Perfume() { return <group><mesh position={[0, .13, 0]} castShadow><cylinderGeometry args={[.115, .14, .23, 16]} /><meshPhysicalMaterial color="#b3938f" transparent opacity={.75} roughness={.12} metalness={.12} transmission={.35} thickness={.5} /></mesh><mesh position={[0, .3, 0]}><cylinderGeometry args={[.045, .055, .12, 12]} /><meshStandardMaterial color={brass} metalness={.8} roughness={.2} /></mesh><Block position={[0, .14, .12]} args={[.12, .085, .005]} color={paper} /></group>; }

function Key() { return <group rotation={[0, .2, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.085, .023, 8, 18]} /><meshStandardMaterial color={brass} metalness={.85} roughness={.3} /></mesh><Block position={[.18, 0, 0]} args={[.27, .035, .035]} color={brass} metalness={.85} /><Block position={[.28, 0, .04]} args={[.035, .035, .09]} color={brass} metalness={.85} /></group>; }

function Selectable({ id, position, label, selected, onSelect, children }: { id: PropId; position: Vec3; label: string; selected: boolean; onSelect: (id: PropId) => void; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  function click(e: ThreeEvent<MouseEvent>) { e.stopPropagation(); onSelect(id); }
  return <group position={position} onClick={click} onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}>
    {children}
    <mesh position={[0, .09, 0]}><boxGeometry args={[.64, .32, .52]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    {(hover || selected) && <mesh position={[0, .04, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.33, .35, 32]} /><meshBasicMaterial color="#e1bc7c" transparent opacity={.65} side={THREE.DoubleSide} /></mesh>}
    <mesh position={[0, .38, 0]}><sphereGeometry args={[.025, 8, 8]} /><meshBasicMaterial color={selected ? "#ffd695" : "#c7a977"} /></mesh>
    <mesh position={[0, .38, 0]} onClick={click} aria-label={`Изучить ${label}`}><sphereGeometry args={[.18, 10, 10]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
  </group>;
}

function DressingRoom({ onSelect, onCharacter, selected }: { onSelect: (id: PropId) => void; onCharacter: (id: CharacterId) => void; selected: string | null }) {
  const floor = useMemo(() => createSurface("wood"), []);
  const walls = useMemo(() => createSurface("plaster"), []);
  useEffect(() => () => { floor.dispose(); walls.dispose(); }, [floor, walls]);
  return <group>
    <mesh position={[0, -1.38, 0]} receiveShadow><boxGeometry args={[8.6, .22, 5.8]} /><meshStandardMaterial map={floor} roughness={.78} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <Block key={i} position={[(i - 5) * .78, -1.266, 0]} args={[.013, .006, 5.75]} color="#574034" />)}
    <mesh position={[0, .79, -2.89]} receiveShadow><boxGeometry args={[8.6, 4.3, .16]} /><meshStandardMaterial map={walls} roughness={.97} /></mesh>
    <Block position={[-4.25, .79, 0]} args={[.16, 4.3, 5.8]} color="#32272b" />
    <Block position={[4.25, -.96, -1.45]} args={[.16, .62, 2.9]} color="#282227" />
    <Block position={[0, -1.22, -2.84]} args={[8.6, .15, .13]} color="#5e4232" />
    <Block position={[0, 2.68, -2.84]} args={[8.6, .2, .14]} color="#4c3331" />
    <Curtain x={-2.4} /><Curtain x={2.35} />
    <Door /><Vanity /><CostumeRack />
    <Block position={[3.25, -1.17, 1]} args={[1.08, .12, .85]} color="#4b342e" />
    <mesh position={[3.27, -.99, 1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.74, .58]} /><meshStandardMaterial color="#b39166" roughness={.97} /></mesh>
    <Selectable id="box" position={[-.85, -.1, -1.48]} label="коробку эклеров" selected={selected === "box"} onSelect={onSelect}><EclairBox /></Selectable>
    <Selectable id="note" position={[.42, -.16, -1.25]} label="записку" selected={selected === "note"} onSelect={onSelect}><Note /></Selectable>
    <Selectable id="perfume" position={[1.15, -.18, -1.66]} label="флакон духов" selected={selected === "perfume"} onSelect={onSelect}><Perfume /></Selectable>
    <Selectable id="receipt" position={[-1.57, -.15, -1.19]} label="чек" selected={selected === "receipt"} onSelect={onSelect}><Note /></Selectable>
    <Selectable id="script" position={[3.26, -1.04, 1]} label="сценарий" selected={selected === "script"} onSelect={onSelect}><Block position={[0, 0, 0]} args={[.46, .03, .32]} color="#cbb99e" /><Block position={[0, .019, 0]} args={[.31, .003, .24]} color="#ede0c9" /></Selectable>
    <Selectable id="key" position={[-2.3, -1.18, -1.52]} label="ключ" selected={selected === "key"} onSelect={onSelect}><Key /></Selectable>
    <mesh position={[2.45, .65, -2.75]}><boxGeometry args={[.62, .82, .035]} /><meshStandardMaterial color="#85644d" /></mesh>
    <mesh position={[2.45, .65, -2.72]}><planeGeometry args={[.52, .72]} /><meshStandardMaterial color={paper} /></mesh>
    <CharacterModel id="evelina" position={[-2.9, -1.26, .7]} rotation={.45} onSelect={onCharacter} />
    <CharacterModel id="max" position={[2.45, -1.26, .6]} rotation={-.4} onSelect={onCharacter} />
    <CharacterModel id="grigory" position={[3.8, -1.26, -1.9]} rotation={-.7} onSelect={onCharacter} />
  </group>;
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const portrait = size.width / size.height < .85;
    perspective.fov = portrait ? 57 : 41;
    perspective.position.set(portrait ? 4.5 : 5.9, portrait ? 3.3 : 2.9, portrait ? 12.8 : 7.9);
    perspective.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function SceneLights() {
  const light = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => { if (light.current) light.current.intensity = 33 + Math.sin(clock.elapsedTime * 1.7) * .7; });
  return <><ambientLight intensity={1.1} color="#b5abb5" /><hemisphereLight intensity={1.15} color="#b4b9d5" groundColor="#38221e" /><spotLight ref={light} position={[-.2, 4.1, 1.8]} angle={.8} penumbra={.8} color="#ffce89" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-.0005} /><pointLight position={[2.7, 1.8, -.9]} intensity={4} color="#d27a5e" distance={5} /><pointLight position={[-2.5, 1, .5]} intensity={2.3} color="#8d4763" distance={5} /></>;
}

export default function TheatreScene({ onSelect, onCharacter, selected }: { onSelect: (id: PropId) => void; onCharacter: (id: CharacterId) => void; selected: string | null }) {
  return <div className="scene-canvas"><Canvas shadows dpr={[1, 1.6]} camera={{ position: [5.9, 2.9, 7.9], fov: 41, near: .1, far: 60 }} gl={{ antialias: true, powerPreference: "high-performance" }} fallback={<p className="scene-fallback">3D недоступно на этом устройстве. Улики доступны в архиве.</p>}>
    <color attach="background" args={["#131016"]} /><fog attach="fog" args={["#131016", 14, 28]} /><ResponsiveCamera /><SceneLights /><DressingRoom onSelect={onSelect} onCharacter={onCharacter} selected={selected} /><OrbitControls target={[0, .25, -1]} enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={.8} maxPolarAngle={1.7} minAzimuthAngle={-.9} maxAzimuthAngle={1.05} enableDamping dampingFactor={.08} touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }} />
  </Canvas><div className="scene-caption"><span>ЛОКАЦИЯ 01 / 01</span><strong>Гримёрная · Театр</strong><small>Осмотрите предметы на столе. Поверните сцену одним пальцем.</small></div></div>;
}
