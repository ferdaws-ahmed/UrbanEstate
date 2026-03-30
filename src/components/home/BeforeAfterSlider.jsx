"use client";

import React, { useRef, useEffect, useState } from "react";
import { Manrope } from "next/font/google";
import { Cpu, Scan, UploadCloud, ImageIcon, Loader2, Wand2, ZoomIn, ZoomOut, AlertTriangle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// ─── Gemini API Keys ───
const GEMINI_API_KEYS = [
  "AIzaSyA-rc3Cb3ECsd89Ff8wxVdgHj3igg4uk2Y",
  "AIzaSyCbEE5qPJwZ5aMGbQtCcndO6_bX9tIMpwk",
  "AIzaSyBTHSORGHoaz70CJI1p5gfDLcz5kttk9ZI"
];
let currentGeminiIndex = 0;

// ─── Stability API Keys ───
const STABILITY_API_KEYS = [
  "sk-uEibepAZ2e9ITIORZ6qkhLKgmVcbZUqe8oI7ORcluPTua6dI",
  "sk-0MJEqbnx8w5WAAB5gtQfVl2T61pSgHdGgZeY28CfbWruDKSi",
  "sk-g1LV6mEoCqYBORfahQUMRfbGOTc0diYKoaGbVJuJ3Fu3qt4v",
  "sk-r7HI182eGrR3uZzxKXScOKsLe0Ipt4fcBwEaSH0EXC4BKPEx",
  "sk-eYXVB09ubAYKjp0fOMCU4QdsULstza10KUMTmtuNzCXtWBfp",
  "sk-Xlhyyz8U8zyUTrAjwnDt658zIv4zWDFUOZ7da28c0QxY7Vll",
  "sk-Iz7MBJuedgr3U0SoHwEguOdSqwXZ2B8y7WBONowVgxCW1gMc",
  "sk-i8f97qWvES9TonvAuO3v5lzr9Pai7npgTsEaM8h9upDBGeRI",
  "sk-azLqKG6t1lSZjsvFi0KnQPkACmfsMEuU2SvZN3hJ2w39qQaw"
];
let currentStabilityIndex = 0;

// Helper: Convert Blob URL to Base64
const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

// Helper: Resize to keep payload safe and fast
const ensureSafeImageSize = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const MAX_SIZE = 1024; // SD3 works best exactly at or under 1024
      let width = img.width;
      let height = img.height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9)); 
      } else {
        resolve(base64Str);
      }
    };
  });
};

export default function FuturisticAIStaging() {
  const containerRef = useRef(null);
  const dataTextRef = useRef(null);
  const fileInputRef = useRef(null);

  const [beforeImg, setBeforeImg] = useState(null);
  const [afterImg, setAfterImg] = useState(null); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("Waiting for Input...");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!containerRef.current || !afterImg) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      containerRef.current.style.setProperty("--x", `${x}px`);
      containerRef.current.style.setProperty("--y", `${y}px`);

      if (dataTextRef.current) {
        dataTextRef.current.innerText = `SCAN DATA // X: ${Math.round(x)} Y: ${Math.round(y)} // ZOOM: ${Math.round(zoom * 100)}%`;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("pointermove", handlePointerMove);
      const rect = container.getBoundingClientRect();
      container.style.setProperty("--x", `${rect.width / 2}px`);
      container.style.setProperty("--y", `${rect.height / 2}px`);
    }

    return () => {
      if (container) container.removeEventListener("pointermove", handlePointerMove);
    };
  }, [afterImg, zoom]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBeforeImg(url);
      setAfterImg(null); 
      setZoom(1);
      setErrorMsg("");
      setStatusText("Ready to Scan");
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const getGeminiSubject = async (base64Image) => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[currentGeminiIndex]);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const base64Data = base64Image.split(',')[1]; 
      const mimeType = base64Image.split(';')[0].split(':')[1];

      const prompt = `Identify the main subject in this image in exactly one word. For example: 'dog', 'house', 'car'.`;
      const imageParts = [{ inlineData: { data: base64Data, mimeType: mimeType } }];
      
      const result = await model.generateContent([prompt, ...imageParts]);
      return result.response.text().trim().replace(/[^a-zA-Z]/g, '').toLowerCase() || "scene";

    } catch (error) {
      console.warn("Gemini limit reached, falling back safely.");
      currentGeminiIndex = (currentGeminiIndex + 1) % GEMINI_API_KEYS.length;
      return "scene"; 
    }
  };

  const generateRealStagedImage = async (base64Image, subject, retryCount = 0) => {
    try {
      const safeBase64 = await ensureSafeImageSize(base64Image);
      const pureBase64Data = safeBase64.replace(/^data:image\/\w+;base64,/, "");

      const formData = new FormData();
      const byteCharacters = atob(pureBase64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      
      // THE FIX: SD3 requires "mode" to be specified for Image-to-Image
      formData.append('mode', 'image-to-image');
      formData.append('image', blob);
      
      formData.append('prompt', `A hyper-realistic, year 2099 cyberpunk version of a ${subject}, glowing neon lights, holographic interfaces, ultra-futuristic sleek metallic design, high-tech sci-fi environment, 8k resolution, Unreal Engine 5 render, spectacular cinematic lighting`);
      formData.append('strength', '0.78'); 
      formData.append('output_format', 'png');

      // THE FIX: Correct endpoint for SD3 Image-to-Image
      const response = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${STABILITY_API_KEYS[currentStabilityIndex]}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      if (data.image) {
          return `data:image/png;base64,${data.image}`;
      } else {
          throw new Error("No image generated.");
      }
    } catch (error) {
      if (retryCount < STABILITY_API_KEYS.length - 1) {
        console.warn(`Stability Key ${currentStabilityIndex + 1} failed. Trying next key...`);
        currentStabilityIndex = (currentStabilityIndex + 1) % STABILITY_API_KEYS.length;
        return await generateRealStagedImage(base64Image, subject, retryCount + 1);
      } else {
        throw new Error("All Stability API keys failed. Check API dashboard.");
      }
    }
  };

  const processImage = async () => {
    if (!beforeImg) return;
    setIsGenerating(true);
    setErrorMsg("");
    setStatusText("Analyzing Image via AI...");

    try {
      const originalBase64 = await urlToBase64(beforeImg);
      
      const subject = await getGeminiSubject(originalBase64);
      setStatusText(`Target: ${subject.toUpperCase()}. Crafting 2099 Design...`);
      
      const newFuturisticImage = await generateRealStagedImage(originalBase64, subject);
      
      setAfterImg(newFuturisticImage); 
      setStatusText("SCAN ACTIVE");

    } catch (error) {
      console.error("AI Generation Failed:", error);
      setErrorMsg(error.message || "Failed to generate AI image. Try a different image.");
      setStatusText("ERROR: GENERATION FAILED");
      setAfterImg(null); 
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className={`w-full py-16 px-4 md:px-8 lg:px-12 bg-[#0f2e28] relative overflow-hidden min-h-screen ${manrope.className}`}>
      
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#cddfa0]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <style dangerouslySetInnerHTML={{__html: `
        .ai-scanner-container { --x: 50%; --y: 50%; touch-action: none; overflow: hidden; }
        .ai-diamond-clip {
          clip-path: polygon(var(--x) calc(var(--y) - 250px), calc(var(--x) + 250px) var(--y), var(--x) calc(var(--y) + 250px), calc(var(--x) - 250px) var(--y));
        }
        .ai-diamond-border {
          position: absolute; left: var(--x); top: var(--y); width: 500px; height: 500px;
          transform: translate(-50%, -50%) rotate(45deg); border: 2px solid #cddfa0;
          box-shadow: 0 0 30px rgba(205,223,160,0.6), inset 0 0 30px rgba(205,223,160,0.4); pointer-events: none; z-index: 30;
          background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(205,223,160,0.05) 10px, rgba(205,223,160,0.05) 20px);
        }
        .ai-crosshair { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); pointer-events: none; z-index: 40; color: #cddfa0; }
        .animate-spin-slow { animation: spin 6s linear infinite; }
      `}} />

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col gap-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#081d19]/60 p-6 rounded-[2rem] border border-[#cddfa0]/10 backdrop-blur-md">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.3em] text-[10px] uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-4 shadow-[0_0_20px_rgba(205,223,160,0.1)]">
              <Cpu size={14} /> True AI Img2Img Engine
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              Futuristic <span className="text-[#cddfa0] italic font-light">Transformation</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
              Upload any image. Our AI will automatically cycle through backup servers if needed and completely overhaul your image into a breathtaking 2099 cyberpunk design.
            </p>
            {errorMsg && (
                <div className="mt-3 text-red-400 text-sm flex items-start lg:items-center justify-center lg:justify-start gap-2 bg-red-900/20 py-2 px-4 rounded-lg border border-red-500/20 overflow-hidden break-words">
                    <AlertTriangle size={16} className="shrink-0" /> <span className="text-xs">{errorMsg}</span>
                </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-[#cddfa0]/50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <UploadCloud size={18} className="text-[#cddfa0]" /> Upload Image
            </button>

            <button 
              onClick={processImage}
              disabled={isGenerating || !beforeImg}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                isGenerating || !beforeImg
                  ? 'bg-emerald-900/50 text-[#cddfa0]/50 cursor-not-allowed border border-[#cddfa0]/20'
                  : 'bg-gradient-to-r from-[#cddfa0] to-[#b4c786] text-[#0f2e28] hover:scale-105 shadow-[0_0_20px_rgba(205,223,160,0.4)]'
              }`}
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> Upgrading Design...</>
              ) : (
                <><Wand2 size={18} /> Generate Future</>
              )}
            </button>
          </div>
        </div>

        <div className="w-full relative group">
          {beforeImg && (
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
              <button onClick={handleZoomIn} className="p-2 md:p-3 bg-[#081d19]/90 border border-[#cddfa0]/30 rounded-full text-[#cddfa0] hover:bg-[#cddfa0]/20 transition-all shadow-lg backdrop-blur-md">
                <ZoomIn size={18} />
              </button>
              <button onClick={handleZoomOut} className="p-2 md:p-3 bg-[#081d19]/90 border border-[#cddfa0]/30 rounded-full text-[#cddfa0] hover:bg-[#cddfa0]/20 transition-all shadow-lg backdrop-blur-md">
                <ZoomOut size={18} />
              </button>
            </div>
          )}

          <div className="p-2 lg:p-3 bg-[#081d19]/80 backdrop-blur-xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden w-full">
            
            <div className="absolute top-6 left-6 right-6 md:left-8 md:right-8 z-50 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-400' : (afterImg ? 'bg-green-400' : 'bg-[#ef4444]')} ${isGenerating ? 'animate-pulse' : ''}`}></div>
                <span className="text-white/80 text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-md">
                  {statusText}
                </span>
              </div>
              {afterImg && !isGenerating && (
                <div ref={dataTextRef} className="text-[#cddfa0] text-[9px] md:text-[10px] font-mono tracking-widest bg-black/60 px-3 py-1 rounded border border-white/10 backdrop-blur-sm hidden sm:block">
                  SCAN DATA // X: 000 Y: 000 // ZOOM: {Math.round(zoom * 100)}%
                </div>
              )}
            </div>

            <div 
              ref={containerRef}
              className={`ai-scanner-container relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] rounded-[2rem] bg-black transition-all duration-500 ${!afterImg ? 'cursor-default' : 'cursor-none'}`}
            >
              <div 
                className="w-full h-full origin-center transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoom})` }}
              >
                {beforeImg ? (
                  <img src={beforeImg} alt="Original Upload" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#cddfa0]/50 border-2 border-dashed border-[#cddfa0]/20 rounded-[2rem] m-4">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p className="font-semibold tracking-widest uppercase text-xs text-center px-4">Waiting for Image Input</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 z-40 bg-[#0f2e28]/90 backdrop-blur-md flex flex-col items-center justify-center">
                    <Scan size={64} className="text-[#cddfa0] animate-spin-slow mb-6" />
                    <div className="text-[#cddfa0] font-mono text-sm tracking-[0.3em] uppercase animate-pulse text-center px-4">{statusText}</div>
                  </div>
                )}

                {!isGenerating && afterImg && (
                  <div className="ai-diamond-clip absolute inset-0 w-full h-full pointer-events-none z-20">
                    <img src={afterImg} alt="AI Generated Futuristic Version" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                  </div>
                )}
              </div>

              {!isGenerating && afterImg && (
                <>
                  <div className="ai-diamond-border transition-transform duration-75 ease-out"></div>
                  <div className="ai-crosshair">
                    <Scan size={40} className="animate-spin-slow opacity-80" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}