'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// 3D Step Card Component
const StepCard = ({ 
  position, 
  rotation, 
  step, 
  title, 
  description, 
  icon, 
  index,
  isHovered,
  onHover 
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  step: string;
  title: string;
  description: string;
  icon: string;
  index: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      
      // Hover effect
      if (isHovered) {
        meshRef.current.scale.setScalar(1.05);
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position} rotation={rotation}>
        {/* Main Card */}
        <mesh
          ref={meshRef}
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
        >
          <boxGeometry args={[5, 7, 0.3]} />
          <meshStandardMaterial 
            color={isHovered ? "#8B5CF6" : "#1F2937"}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Card Border Glow */}
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[5.1, 7.1, 0.05]} />
          <meshStandardMaterial 
            color={isHovered ? "#EC4899" : "#6B7280"}
            emissive={isHovered ? "#EC4899" : "#374151"}
            emissiveIntensity={isHovered ? 0.3 : 0.05}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Step Number */}
        <Text
          position={[0, 2.5, 0.2]}
          fontSize={1.2}
          color={isHovered ? "#EC4899" : "#8B5CF6"}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          {step}
        </Text>

        {/* Icon */}
        <group position={[0, 1.2, 0.2]}>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial 
              color={isHovered ? "#EC4899" : "#8B5CF6"}
              emissive={isHovered ? "#EC4899" : "#8B5CF6"}
              emissiveIntensity={isHovered ? 0.2 : 0.05}
            />
          </mesh>
        </group>

        {/* Title */}
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={4.5}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          {title}
        </Text>

        {/* Description */}
        <Text
          position={[0, -1.8, 0.2]}
          fontSize={0.25}
          color="#9CA3AF"
          anchorX="center"
          anchorY="middle"
          maxWidth={4.5}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          {description}
        </Text>
      </group>
    </Float>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);

    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Purple to teal gradient matching landing page
      const lerp = Math.random();
      colors[i * 3] = THREE.MathUtils.lerp(0.5, 0, lerp); // R
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.2, 0.6, lerp); // G
      colors[i * 3 + 2] = THREE.MathUtils.lerp(0.8, 0.6, lerp); // B
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={2000} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={2000} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.4} />
    </points>
  );
};

// Fallback Content Component
const FallbackContent = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Event & Services",
      description: "Select your event type, choose the services you need, and pick the perfect package for your celebration.",
      icon: "🎯"
    },
    {
      step: "02", 
      title: "We Call You & Fine-tune",
      description: "We call you to discuss your requirements in detail, fine-tune everything, and provide you with a detailed quotation.",
      icon: "📞"
    },
    {
      step: "03",
      title: "We Execute", 
      description: "Our dedicated team takes over and executes your event flawlessly, ensuring every detail is perfect.",
      icon: "✨"
    },
    {
      step: "04",
      title: "We Tell Your Story",
      description: "We capture and share your special event story through social media, creating lasting memories and engagement.",
      icon: "📱"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300"
        >
          <div className="text-6xl mb-4">{step.icon}</div>
          <div className="text-3xl font-bold text-purple-400 mb-4">{step.step}</div>
          <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
          <p className="text-gray-300 leading-relaxed">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Main 3D Scene Component
const Steps3DScene = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show fallback after 3 seconds if 3D scene doesn't load
    const timer = setTimeout(() => setShowFallback(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      step: "01",
      title: "Choose Your Event & Services",
      description: "Select your event type, choose the services you need, and pick the perfect package for your celebration.",
      icon: "🎯"
    },
    {
      step: "02", 
      title: "We Call You & Fine-tune",
      description: "We call you to discuss your requirements in detail, fine-tune everything, and provide you with a detailed quotation.",
      icon: "📞"
    },
    {
      step: "03",
      title: "We Execute", 
      description: "Our dedicated team takes over and executes your event flawlessly, ensuring every detail is perfect.",
      icon: "✨"
    },
    {
      step: "04",
      title: "We Tell Your Story",
      description: "We capture and share your special event story through social media, creating lasting memories and engagement.",
      icon: "📱"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#8B5CF6" />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00A3A3" />
          <pointLight position={[0, 10, 0]} intensity={0.6} color="#EC4899" />
          
          {/* Background Particles */}
          <FloatingParticles />
          
          {/* Step Cards */}
          {steps.map((step, index) => (
            <StepCard
              key={index}
              position={[
                (index - 1.5) * 8, // X position - more spread out
                0, // Y position
                index * -3 // Z position for depth
              ]}
              rotation={[0, index * 0.1, 0]}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
            />
          ))}
          
          {/* Camera Controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 2.1}
          />
        </Canvas>
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-white mb-16"
        >
          <div className="text-purple-400 text-lg font-semibold mb-4">How It Works</div>
                      <h2 className="text-6xl md:text-8xl font-black mb-8">
              <span className="gradient-text">4 Steps</span><br />
              to Your Perfect Event
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From planning to storytelling, we handle everything for your celebration
            </p>
        </motion.div>

        {/* Fallback Content - Always visible */}
        <FallbackContent />
      </div>
    </div>
  );
};

export default Steps3DScene;
