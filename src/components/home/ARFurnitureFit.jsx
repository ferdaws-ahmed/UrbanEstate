"use client";

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Html, Environment, ContactShadows } from '@react-three/drei';

// --- সুন্দর এবং রিয়েলিস্টিক 3D রুম ---
const RoomEnvironment = () => {
  return (
    <group>
      {/* কাঠের মেঝে (Wooden Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial color="#5c4033" roughness={0.4} metalness={0.1} clearcoat={0.3} />
      </mesh>
      
      {/* পেছনের দেয়াল (Cream White Wall) */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#f0efe9" roughness={0.9} />
      </mesh>
      
      {/* বাম দিকের দেয়াল */}
      <mesh position={[-10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#e8e7e0" roughness={0.9} />
      </mesh>
      
      {/* ডান দিকের দেয়াল */}
      <mesh position={[10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#e8e7e0" roughness={0.9} />
      </mesh>

      {/* দেয়ালের নিচের বর্ডার (Baseboard) - রিয়েলিস্টিক লুকের জন্য */}
      <mesh position={[0, 0.25, -9.7]} receiveShadow>
        <boxGeometry args={[20, 0.5, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[-9.7, 0.25, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.5, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
};

export default function ARFurnitureFit() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('Sofa');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [transformMode, setTransformMode] = useState('translate');
  const [isClient, setIsClient] = useState(false);
  
  const meshRefs = useRef({});

  // আপনার API Key (Base64 দিয়ে লুকানো)
  const SECRET_KEY = typeof window !== 'undefined' ? atob('MWM5MjBhOTc1M2Q0NDEwMzkxMDc1ZDBhYzExM2RlY2U=') : '';

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('myRealisticRoom');
    if (saved) setItems(JSON.parse(saved));
    searchReal3DModels({ preventDefault: () => {} });
  }, []);

  // Sketchfab API থেকে সার্চ
  const searchReal3DModels = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.sketchfab.com/v3/search?type=models&downloadable=true&q=${searchQuery}`, {
        headers: { 'Authorization': `Token ${SECRET_KEY}` }
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // রুমে আইটেম যোগ করা
  const handleAddItem = (modelData) => {
    // API থেকে আসা নাম অনুযায়ী ক্যাটাগরি ডিটেক্ট করা
    const nameStr = modelData.name.toLowerCase();
    let type = 'Generic';
    if (nameStr.includes('bed')) type = 'Bed';
    else if (nameStr.includes('sofa') || nameStr.includes('chair')) type = 'Sofa';
    else if (nameStr.includes('table') || nameStr.includes('desk')) type = 'Table';
    else if (nameStr.includes('plant') || nameStr.includes('tree')) type = 'Plant';
    else if (nameStr.includes('car') || nameStr.includes('vehicle')) type = 'Car';

    const newItem = {
      id: `item_${Date.now()}`,
      name: modelData.name,
      type: type,
      color: '#333333', // ডিফল্ট প্রিমিয়াম কালার
      position: [0, 0, 0], 
      rotation: [0, 0, 0]
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleRemoveSingleItem = () => {
    if (selectedId) {
      setItems(items.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleSaveDesign = () => {
    const finalLayout = items.map((item) => {
      const mesh = meshRefs.current[item.id];
      return {
        ...item,
        position: mesh ? [mesh.position.x, mesh.position.y, mesh.position.z] : item.position,
        rotation: mesh ? [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z] : item.rotation,
      };
    });
    localStorage.setItem('myRealisticRoom', JSON.stringify(finalLayout));
    alert("রুমের ডিজাইন সেভ হয়েছে!");
  };

  const handleClearDesign = () => {
    if(confirm("পুরো রুম খালি করতে চান?")) {
      setItems([]);
      localStorage.removeItem('myRealisticRoom');
      setSelectedId(null);
    }
  };

  // --- হাই-কোয়ালিটি রিয়েলিস্টিক 3D মেটেরিয়াল ---
  const renderRealisticModel = (type) => {
    // প্রিমিয়াম মেটেরিয়াল সেটিংস
    const fabricMaterial = <meshPhysicalMaterial color="#2c3e50" roughness={0.8} clearcoat={0.1} />;
    const woodMaterial = <meshPhysicalMaterial color="#8B4513" roughness={0.6} metalness={0.1} clearcoat={0.2} />;
    const metalMaterial = <meshPhysicalMaterial color="#bdc3c7" roughness={0.2} metalness={0.8} clearcoat={0.5} />;
    const mattressMaterial = <meshPhysicalMaterial color="#ffffff" roughness={0.9} />;

    switch (type) {
      case 'Bed':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[2.2, 0.4, 3.2]} />{woodMaterial}</mesh>
            <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[2, 0.4, 3]} />{mattressMaterial}</mesh>
            <mesh position={[0, 0.7, -1.4]} castShadow><boxGeometry args={[2.2, 1, 0.2]} />{woodMaterial}</mesh>
            <mesh position={[-0.5, 0.55, -1.1]} castShadow><boxGeometry args={[0.7, 0.15, 0.5]} />{fabricMaterial}</mesh>
            <mesh position={[0.5, 0.55, -1.1]} castShadow><boxGeometry args={[0.7, 0.15, 0.5]} />{fabricMaterial}</mesh>
          </group>
        );
      case 'Sofa':
        return (
          <group position={[0, 0.3, 0]}>
            <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[2.5, 0.6, 1.2]} />{fabricMaterial}</mesh>
            <mesh position={[0, 0.6, -0.4]} castShadow><boxGeometry args={[2.5, 0.8, 0.4]} />{fabricMaterial}</mesh>
            <mesh position={[-1.15, 0.4, 0.1]} castShadow><boxGeometry args={[0.3, 0.4, 1.1]} />{woodMaterial}</mesh>
            <mesh position={[1.15, 0.4, 0.1]} castShadow><boxGeometry args={[0.3, 0.4, 1.1]} />{woodMaterial}</mesh>
          </group>
        );
      case 'Table':
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[2.5, 0.1, 1.5]} />{woodMaterial}</mesh>
            <mesh position={[-1.1, 0.6, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.2]} />{metalMaterial}</mesh>
            <mesh position={[1.1, 0.6, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.2]} />{metalMaterial}</mesh>
            <mesh position={[-1.1, 0.6, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.2]} />{metalMaterial}</mesh>
            <mesh position={[1.1, 0.6, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.2]} />{metalMaterial}</mesh>
          </group>
        );
      case 'Car':
        return (
          <group position={[0, 0.4, 0]}>
            <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[2, 0.5, 4]} />{metalMaterial}</mesh>
            <mesh position={[0, 0.5, -0.2]} castShadow><boxGeometry args={[1.6, 0.5, 2]} /><meshPhysicalMaterial color="#111" roughness={0.1} clearcoat={1} /></mesh>
          </group>
        );
      default:
        // আননোন মডেলের জন্য একটি সুন্দর ডিসপ্লে বক্স
        return (
          <group position={[0, 0.5, 0]}>
            <mesh castShadow><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#3498db" roughness={0.2} metalness={0.5} clearcoat={0.8} /></mesh>
          </group>
        );
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] md:h-[800px] w-full bg-gray-900 text-white rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      
      {/* বাম দিকের কন্ট্রোল প্যানেল */}
      <div className="w-full md:w-1/3 bg-gray-800 p-5 flex flex-col z-10 border-r border-gray-700">
        <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-3 mb-4">গ্লোবাল 3D মার্কেট</h2>
        
        {/* সার্চ বার */}
        <form onSubmit={searchReal3DModels} className="mb-4 relative flex gap-2">
          <input 
            type="text" 
            placeholder="Search internet (eg: Sofa, Car)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            খুঁজুন
          </button>
        </form>

        {/* API রেজাল্ট */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[250px] md:max-h-full">
          {isLoading ? (
            <div className="text-center text-blue-400 font-bold mt-10 animate-pulse">ইন্টারনেট থেকে খোঁজা হচ্ছে...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((model) => (
              <div key={model.uid} className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all group">
                <img src={model.thumbnails?.images[0]?.url} alt={model.name} className="w-full h-32 object-cover opacity-90 group-hover:opacity-100" />
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-100 truncate">{model.name}</h3>
                  <button onClick={() => handleAddItem(model)} className="mt-3 w-full py-2 bg-blue-600/20 text-blue-400 rounded text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                    + রুমে বসান
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-5">কিছু পাওয়া যায়নি।</p>
          )}
        </div>

        {/* টুলস */}
        {selectedId && (
          <div className="mt-4 p-4 bg-gray-700 rounded-xl border border-gray-600">
            <h3 className="font-bold text-blue-400 mb-3 text-sm">ডিজাইন টুলস:</h3>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setTransformMode('translate')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${transformMode === 'translate' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>Move</button>
              <button onClick={() => setTransformMode('rotate')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${transformMode === 'rotate' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>Rotate</button>
            </div>
            <button onClick={handleRemoveSingleItem} className="w-full py-2 bg-red-500/80 text-white rounded-lg font-bold hover:bg-red-500">
              Remove Item
            </button>
          </div>
        )}

        {/* সেভ ও ডিলিট */}
        <div className="mt-4 pt-4 border-t border-gray-600 flex flex-col gap-2">
          <button onClick={handleSaveDesign} className="w-full p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all">
            💾 Save Room
          </button>
          <button onClick={handleClearDesign} className="w-full p-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all">
            🗑️ Clear Room
          </button>
        </div>
      </div>

      {/* ডান দিকের 3D রিয়েলিস্টিক ক্যানভাস */}
      <div className="w-full md:w-2/3 h-[400px] md:h-full relative bg-[#1a1a1a] cursor-crosshair">
        <Canvas camera={{ position: [0, 6, 12], fov: 50 }} onPointerMissed={(e) => { if(e.type === 'click') setSelectedId(null); }} shadows>
          <Suspense fallback={<Html center><div className="text-blue-400 font-bold text-xl">Loading Room...</div></Html>}>
            
            <Environment preset="apartment" />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffdcb4" />

            <RoomEnvironment />

            {/* বাস্তবসম্মত শ্যাডো (Contact Shadows) */}
            <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} far={4} />

            {items.map((item) => (
              <group
                key={item.id}
                ref={(el) => (meshRefs.current[item.id] = el)}
                position={item.position}
                rotation={item.rotation}
                onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
              >
                {renderRealisticModel(item.type)}

                {selectedId === item.id && (
                  <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.5, 1.8, 64]} />
                    <meshBasicMaterial color="#3498db" opacity={0.8} transparent />
                  </mesh>
                )}
              </group>
            ))}

            {selectedId && meshRefs.current[selectedId] && (
              <TransformControls object={meshRefs.current[selectedId]} mode={transformMode} showY={transformMode === 'rotate'} />
            )}

            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={3} maxDistance={25} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}