"use client";

import React, { Suspense } from "react";
import { Manrope } from "next/font/google";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PresentationControls,
} from "@react-three/drei";
import {
  Box,
  Rotate3d,
  ZoomIn,
  Sparkles,
  MousePointer2,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../Theme/ThemeContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const HouseModel = () => {
  return (
    <group position={[0, -1.5, 0]}>
      {/* Floor */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>

      {/* Main Building */}
      <mesh position={[0.5, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.8, 3.5]} />
        <meshStandardMaterial color="#fdfdfd" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wooden Accent */}
      <mesh position={[-1.8, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.8, 3.6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.8} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 0.2, 4.5]} />
        <meshStandardMaterial color="#151515" roughness={0.8} />
      </mesh>

      {/* Glass */}
      <mesh position={[0.5, 1.6, 1.76]}>
        <boxGeometry args={[3.8, 2.6, 0.05]} />
        <meshPhysicalMaterial
          color="#9fd3e6"
          transmission={0.9}
          opacity={0.4}
          transparent
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>

      {/* Glass Frame */}
      <mesh position={[0.5, 1.6, 1.78]} castShadow>
        <boxGeometry args={[3.9, 2.7, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" wireframe />
      </mesh>

      {/* Door */}
      <mesh position={[-0.8, 1.1, 1.8]} castShadow>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial color="#2c1e16" roughness={0.8} />
      </mesh>

      {/* Path */}
      <mesh position={[-0.8, 0.15, 3.2]} receiveShadow>
        <boxGeometry args={[1.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#444444" roughness={0.9} />
      </mesh>

      {/* Bushes */}
      <mesh position={[2.2, 0.5, 2]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>

      <mesh position={[2.8, 0.4, 1.5]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>
    </group>
  );
};

export default function Property3D() {
  const { isDark } = useTheme();

  return (
    <section
      className={`w-full py-24 px-6 lg:px-12 relative overflow-hidden ${
        isDark ? "bg-[#0f2e28]" : "bg-white"
      } ${manrope.className}`}
    >
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#cddfa0]/10 blur-[150px] rounded-full" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-5">
            <div
              className={`inline-flex items-center gap-2 font-bold tracking-[0.4em] text-[10px] uppercase px-5 py-2 rounded-full border mb-8 ${
                isDark
                  ? "text-[#cddfa0] bg-white/5 border-white/10"
                  : "text-[#0f2e28] bg-black/5 border-black/10"
              }`}
            >
              <Rotate3d size={14} /> 360° Visual Tour
            </div>

            <h2
              className={`text-4xl lg:text-5xl font-black mb-8 ${
                isDark ? "text-white" : "text-[#0f2e28]"
              }`}
            >
              Reimagine{" "}
              <span className="text-[#cddfa0] italic font-light">Space</span> in
              3D
            </h2>

            <p
              className={`${
                isDark ? "text-white" : "text-black"
              } text-lg mb-10 max-w-lg`}
            >
              Experience the future of real estate with an interactive 3D
              property preview.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Box size={18} />, title: "Architectural Precision" },
                { icon: <ZoomIn size={18} />, title: "Interactive Control" },
                { icon: <Sparkles size={18} />, title: "Realistic Lighting" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-5 p-5 rounded-2xl ${
                    isDark ? "bg-white/5" : "bg-black/5"
                  } border ${isDark ? "border-white/5" : "border-black/5"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      isDark ? "bg-white/5" : "bg-black/5"
                    } flex items-center justify-center ${
                      isDark ? "text-[#cddfa0]" : "text-black"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <h4
                    className={`${
                      isDark ? "text-white" : "text-black"
                    } font-bold`}
                  >
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT 3D */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-[#081d19] border border-white/10">
              <div className="absolute top-8 left-8 z-20 bg-[#0f2e28]/80 px-5 py-2 rounded-full text-[10px] text-white font-black">
                <MousePointer2
                  size={14}
                  className="inline mr-2 text-[#cddfa0]"
                />
                Click & Drag
              </div>

              <Canvas camera={{ position: [8, 5, 10], fov: 45 }} shadows>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    castShadow
                  />
                  <Environment preset="city" />

                  <PresentationControls global>
                    <HouseModel />
                  </PresentationControls>

                  <OrbitControls autoRotate enablePan={false} />
                  <ContactShadows position={[0, -1.4, 0]} opacity={0.7} />
                </Suspense>
              </Canvas>

              <div className="absolute bottom-8 right-8 bg-[#cddfa0] px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
                <CheckCircle2 size={14} /> 3D Engine Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
