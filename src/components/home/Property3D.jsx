"use client";

import React, { Suspense } from "react";
import { Manrope } from "next/font/google";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import { Box, Rotate3d, ZoomIn, Sparkles, MousePointer2, CheckCircle2 } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


const HouseModel = () => {
  return (
    <group position={[0, -1.5, 0]}>
      {/*  (Dark Floor Base) */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>

      {/* (Modern White Plaster) */}
      <mesh position={[0.5, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.8, 3.5]} />
        <meshStandardMaterial color="#fdfdfd" roughness={0.3} metalness={0.1} />
      </mesh>

      {/*  (Wooden Accent Wall) */}
      <mesh position={[-1.8, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.8, 3.6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.8} />
      </mesh>

      {/*(Flat Modern Roof) */}
      <mesh position={[0, 3.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 0.2, 4.5]} />
        <meshStandardMaterial color="#151515" roughness={0.8} />
      </mesh>

      {/* (Large Glass Facade) */}
      <mesh position={[0.5, 1.6, 1.76]}>
        <boxGeometry args={[3.8, 2.6, 0.05]} />
        <meshPhysicalMaterial color="#9fd3e6" transmission={0.9} opacity={0.4} transparent roughness={0.1} metalness={0.6} />
      </mesh>

      {/* (Glass Window Frame) */}
      <mesh position={[0.5, 1.6, 1.78]} castShadow>
        <boxGeometry args={[3.9, 2.7, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" wireframe={true} />
      </mesh>

      {/*  (Modern Wood Door) */}
      <mesh position={[-0.8, 1.1, 1.8]} castShadow>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial color="#2c1e16" roughness={0.8} />
      </mesh>

      {/*  (Pathway) */}
      <mesh position={[-0.8, 0.15, 3.2]} receiveShadow>
        <boxGeometry args={[1.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#444444" roughness={0.9} />
      </mesh>

      {/*  (Decorative Bush 1) */}
      <mesh position={[2.2, 0.5, 2.0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>

      {/*  (Decorative Bush 2) */}
      <mesh position={[2.8, 0.4, 1.5]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>
    </group>
  );
};

export default function Property3D() {
  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#cddfa0]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Content  */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-8">
              <Rotate3d size={14} /> 360° Visual Tour
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight leading-[1.1]">
              Reimagine <span className="text-[#cddfa0] italic font-light">Space</span> in 3D
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg">
              Experience the future of real estate. Inspect textures, dimensions, and architectural details in our custom-built interactive environment.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Box size={18}/>, title: "Architectural Precision", desc: "View accurate dimensions and structures." },
                { icon: <ZoomIn size={18}/>, title: "Interactive Control", desc: "Drag to rotate, scroll to zoom." },
                { icon: <Sparkles size={18}/>, title: "AI-Powered Lighting", desc: "Realistic lighting and shadow effects." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-[#cddfa0]/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#cddfa0]/10 flex items-center justify-center text-[#cddfa0] group-hover:bg-[#cddfa0] group-hover:text-[#0f2e28] transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">{item.title}</h4>
                    <p className="text-white/30 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 3D Visualizer Side */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            {/* Lens Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white blur-[100px] opacity-20 pointer-events-none z-10"></div>

            <div className="relative w-full aspect-square md:aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-[#081d19] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              
              {/* Instruction Badge */}
              <div className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-[#0f2e28]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
                <MousePointer2 size={14} className="text-[#cddfa0]" /> Click & Drag to Explore
              </div>

              {/* --- React Three Fiber Canvas --- */}
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [8, 5, 10], fov: 45 }} shadows>
                  <Suspense fallback={null}>
                    
                    {/* Lights */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
                    <pointLight position={[-10, 5, -10]} intensity={1} color="#cddfa0" />

                    {/* Environment/Reflection */}
                    <Environment preset="city" />

                    {/* Model & Controls */}
                    <PresentationControls 
                      global 
                      rotation={[0, -Math.PI / 4, 0]} 
                      polar={[-Math.PI / 3, Math.PI / 3]} 
                      azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
                      config={{ mass: 2, tension: 400 }}
                    >
                      <HouseModel />
                    </PresentationControls>

                    <OrbitControls 
                      enableZoom={true} 
                      enablePan={false} 
                      autoRotate 
                      autoRotateSpeed={1} 
                      maxPolarAngle={Math.PI / 2} 
                      minDistance={5} 
                      maxDistance={15} 
                    />

                    {/* Beautiful Floor Shadows */}
                    <ContactShadows position={[0, -1.4, 0]} opacity={0.7} scale={20} blur={2} far={4} />

                  </Suspense>
                </Canvas>
              </div>

              {/* Ready Badge */}
              <div className="absolute bottom-8 right-8 z-20">
                <div className="bg-[#cddfa0] text-[#0f2e28] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_20px_rgba(205,223,160,0.3)]">
                  <CheckCircle2 size={14} /> 3D Engine Active
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}