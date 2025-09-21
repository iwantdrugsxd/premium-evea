'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Disco Ball Component
const RealisticDiscoBall = ({ 
  mouseRef, 
  velocityRef 
}: { 
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  velocityRef: React.MutableRefObject<{ vx: number; vy: number }>;
}) => {
  const ballRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ballRef.current) {
      // Base gentle float
      ballRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Pendulum-like swing
      const influence = 0.25;
      const targetX = mouseRef.current.y * influence;
      const targetZ = mouseRef.current.x * influence;
      const damping = 0.05;

      ballRef.current.rotation.x = THREE.MathUtils.lerp(
        ballRef.current.rotation.x,
        targetX,
        damping
      );

      ballRef.current.rotation.z = THREE.MathUtils.lerp(
        ballRef.current.rotation.z,
        targetZ,
        damping
      );

      // 🌟 Spin with mouse velocity
      const spinFactor = 5.0; // adjust for sensitivity
      ballRef.current.rotation.y += velocityRef.current.vx * spinFactor;

      // Also swing chain slightly
      if (ballRef.current.parent) {
        ballRef.current.parent.rotation.z = THREE.MathUtils.lerp(
          ballRef.current.parent.rotation.z,
          targetZ * 0.5,
          damping
        );
      }

      // Apply friction to velocity (so it eases out when you stop moving)
      velocityRef.current.vx *= 0.9;
      velocityRef.current.vy *= 0.9;
    }
  });

  // Create mirror tiles in a realistic pattern
  const createMirrorTiles = () => {
    const tiles = [];
    const rows = 60;
    const cols = 80;
    const radius = 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const theta = (row / rows) * Math.PI;
        const phi = (col / cols) * Math.PI * 2;
        
        // Calculate position on sphere
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);
        
        // Calculate rotation to face outward
        const position = new THREE.Vector3(x, y, z);
        const lookAt = position.clone().normalize();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), lookAt);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        
        tiles.push(
          <mesh
            key={`${row}-${col}`}
            position={[x * 0.98, y * 0.98, z * 0.98]}
            rotation={[euler.x, euler.y, euler.z]}
          >
            <boxGeometry args={[0.08, 0.08, 0.015]} />
            <meshPhysicalMaterial
              color="#E5E5E5"
              metalness={1.0}
              roughness={0.0}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              reflectivity={1.0}
              envMapIntensity={5.0}
            />
          </mesh>
        );
      }
    }
    
    return tiles;
  };

  return (
    <group ref={ballRef} scale={[1.8, 1.8, 1.8]}>
      {/* Dark core (visible between tiles) */}
      <mesh>
        <sphereGeometry args={[1.92, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Mirror tiles */}
      {createMirrorTiles()}
      
      {/* Top attachment point */}
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 8]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Chain Component
const DiscoChain = ({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) => {
  const chainRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (chainRef.current) {
      // Base subtle sway
      const baseSway = Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
      
      // Pendulum swing from mouse influence
      const mouseSway = mouseRef.current.x * 0.1;
      
      chainRef.current.rotation.z = baseSway + mouseSway;
    }
  });
  
  return (
    <group ref={chainRef} position={[0, 4.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 2, 6]} />
        <meshStandardMaterial
          color="#909090"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      {/* Chain links */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((y, i) => (
        <mesh key={i} position={[0, 0.8 - y, 0]}>
          <torusGeometry args={[0.04, 0.01, 4, 6]} />
          <meshStandardMaterial
            color="#909090"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};

// Disco Lighting Setup
const DiscoLighting = () => {
  const spot1Ref = useRef<THREE.SpotLight>(null);
  const spot2Ref = useRef<THREE.SpotLight>(null);
  const spot3Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate colored spotlights
    if (spot1Ref.current) {
      spot1Ref.current.position.x = Math.sin(time * 0.3) * 8;
      spot1Ref.current.position.z = Math.cos(time * 0.3) * 8;
    }
    if (spot2Ref.current) {
      spot2Ref.current.position.x = Math.sin(time * 0.3 + 2.1) * 8;
      spot2Ref.current.position.z = Math.cos(time * 0.3 + 2.1) * 8;
    }
    if (spot3Ref.current) {
      spot3Ref.current.position.x = Math.sin(time * 0.3 + 4.2) * 8;
      spot3Ref.current.position.z = Math.cos(time * 0.3 + 4.2) * 8;
    }
  });

  return (
    <>
      {/* Main white spotlight (classic disco setup) */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.3}
        intensity={50}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Pink spotlight */}
      <spotLight
        ref={spot1Ref}
        position={[8, 4, 8]}
        angle={0.4}
        penumbra={0.3}
        intensity={30}
        color="#FF1493"
        target-position={[0, 0, 0]}
      />
      
      {/* Violet spotlight */}
      <spotLight
        ref={spot2Ref}
        position={[-8, 4, 8]}
        angle={0.4}
        penumbra={0.3}
        intensity={30}
        color="#9370DB"
        target-position={[0, 0, 0]}
      />
      
      {/* Cyan spotlight */}
      <spotLight
        ref={spot3Ref}
        position={[0, 4, 10]}
        angle={0.4}
        penumbra={0.3}
        intensity={30}
        color="#00CED1"
        target-position={[0, 0, 0]}
      />
      
      {/* Key lights for strong reflections */}
      <directionalLight
        position={[10, 8, 10]}
        intensity={3}
        color="#ffffff"
      />
      <directionalLight
        position={[-10, 8, 10]}
        intensity={3}
        color="#ffffff"
      />
      
      {/* Rim lights for sparkle */}
      <pointLight position={[5, 2, 5]} intensity={10} color="#FFB6C1" />
      <pointLight position={[-5, 2, 5]} intensity={10} color="#DDA0DD" />
      <pointLight position={[0, 2, 7]} intensity={10} color="#87CEEB" />
      
      {/* Ambient light for overall visibility */}
      <ambientLight intensity={0.4} />
    </>
  );
};

// Floor with reflection
// const DiscoFloor = () => {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
//       <planeGeometry args={[40, 40]} />
//       <meshPhysicalMaterial
//         color="#0a0a0a"
//         metalness={0.8}
//         roughness={0.2}
//         envMapIntensity={0.5}
//       />
//     </mesh>
//   );
// };

// Animated reflection dots that move as the ball spins
const ReflectionDots = () => {
  const dotsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (dotsRef.current) {
      // Rotate dots in sync with ball rotation
      dotsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });
  
  // Generate reflection dots scattered around the scene
  const createReflectionDots = () => {
    const dots = [];
    const numDots = 25; // Low-poly for performance
    
    for (let i = 0; i < numDots; i++) {
      // Random positions in a sphere around the disco ball
      const radius = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Random colors matching disco theme
      const colors = ['#FF1493', '#9370DB', '#00CED1', '#FFB6C1', '#DDA0DD', '#87CEEB'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      dots.push(
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7}
          />
        </mesh>
      );
    }
    
    return dots;
  };
  
  return (
    <group ref={dotsRef}>
      {createReflectionDots()}
    </group>
  );
};

// Main Disco Ball Component
const DiscoBall = () => {
  const [mounted, setMounted] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Use ref for mouse tracking with velocity calculation
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -((event.clientY / window.innerHeight) * 2 - 1);

      // Calculate velocity = difference since last frame
      velocityRef.current.vx = x - lastMouse.current.x;
      velocityRef.current.vy = y - lastMouse.current.y;

      mouseRef.current = { x, y };
      lastMouse.current = { x, y };
    };

    // Throttled updates for glow overlay (smooth but not too frequent)
    let glowUpdateInterval: NodeJS.Timeout;
    const updateGlowPosition = () => {
      setGlowPosition({ x: mouseRef.current.x, y: mouseRef.current.y });
    };
    
    glowUpdateInterval = setInterval(updateGlowPosition, 16); // ~60fps

    window.addEventListener('mousemove', handleMouseMove);
    
    // Add CSS keyframes for brand gradient animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes brandGradient {
        0% {
          background: radial-gradient(circle, rgba(147, 112, 219, 0.2) 0%, rgba(147, 112, 219, 0.1) 50%, transparent 100%);
        }
        33% {
          background: radial-gradient(circle, rgba(0, 123, 255, 0.2) 0%, rgba(0, 123, 255, 0.1) 50%, transparent 100%);
        }
        66% {
          background: radial-gradient(circle, rgba(255, 20, 147, 0.2) 0%, rgba(255, 20, 147, 0.1) 50%, transparent 100%);
        }
        100% {
          background: radial-gradient(circle, rgba(147, 112, 219, 0.2) 0%, rgba(147, 112, 219, 0.1) 50%, transparent 100%);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(glowUpdateInterval);
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="absolute top-1/2 right-[5%] w-[45%] h-[75%] -translate-y-1/2 pointer-events-none z-10">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 35 }}
          style={{ width: '100%', height: '100%' }}
          shadows
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.8,
          }}
        >
          <DiscoLighting />
          <DiscoChain mouseRef={mouseRef} />
          <RealisticDiscoBall mouseRef={mouseRef} velocityRef={velocityRef} />
          <ReflectionDots />
          {/* <LightBeams /> */}
          {/* <DiscoFloor /> */}
          
          {/* Studio environment for realistic reflections */}
          <Environment preset="studio" intensity={0.5} />
          
          {/* Atmospheric fog */}
          <fog attach="fog" color="#0a0a0a" near={10} far={35} />
        </Canvas>
      </div>
      
      {/* Sparkle and glow effects overlay */}
      <div className="absolute top-1/2 right-[5%] w-[45%] h-[75%] -translate-y-1/2 pointer-events-none z-9">
        {/* Central dynamic brand glow from disco ball */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] 
          bg-gradient-radial from-white/15 via-white/05 to-transparent blur-2xl animate-brand-gradient 
          transition-transform duration-300 ease-out"
          style={{ 
            animation: 'brandGradient 7s ease-in-out infinite',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            transform: `translate(-50%, -50%) translate(${glowPosition.x * 20}px, ${glowPosition.y * 20}px)`
          }}></div>
        
        {/* Dynamic colored light spots with brand gradient */}
        <div className="absolute top-[30%] left-[25%] w-24 h-24 
          bg-gradient-radial blur-xl animate-brand-gradient"
          style={{ 
            animation: 'brandGradient 7s ease-in-out infinite',
            animationDelay: '0s'
          }}></div>
        
        <div className="absolute top-[35%] right-[25%] w-24 h-24 
          bg-gradient-radial blur-xl animate-brand-gradient"
          style={{ 
            animation: 'brandGradient 7s ease-in-out infinite',
            animationDelay: '2.3s'
          }}></div>
        
        <div className="absolute bottom-[35%] left-1/2 w-24 h-24 
          bg-gradient-radial blur-xl animate-brand-gradient"
          style={{ 
            animation: 'brandGradient 7s ease-in-out infinite',
            animationDelay: '4.6s'
          }}></div>
        
        {/* Sparkle dots (light reflections) */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${15 + Math.random() * 70}%`,
              width: '3px',
              height: '3px',
              backgroundColor: i % 3 === 0 ? 'rgba(255,255,255,0.8)' : i % 3 === 1 ? 'rgba(255,20,147,0.6)' : 'rgba(147,112,219,0.6)',
              boxShadow: `0 0 8px ${i % 3 === 0 ? 'rgba(255,255,255,0.8)' : i % 3 === 1 ? 'rgba(255,20,147,0.6)' : 'rgba(147,112,219,0.6)'}`,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default DiscoBall;