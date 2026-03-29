'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Image as ImageIcon, Info } from 'lucide-react';
import { useTheme } from "@/src/components/Theme/ThemeContext";

const MediaUpload = ({ images, updateImages }) => {
  const { isDark } = useTheme();
  const [isUploading, setIsUploading] = useState(false);

  // ImgBB Upload Function
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    
    // আপনার .env ফাইল থেকে API Key নেওয়া হচ্ছে
    const apiKey = process.env.NEXT_PUBLIC_IMG_BB_API; 

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.data.url; // পার্মানেন্ট URL
      }
      return null;
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsUploading(true);
    
    // সব ফাইল লুপ চালিয়ে ImgBB তে পাঠানো হচ্ছে
    const uploadPromises = acceptedFiles.map(file => uploadToImgBB(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    // শুধু সফল URL গুলো ফিল্টার করা হচ্ছে
    const validUrls = uploadedUrls.filter(url => url !== null);

    // আগের ইমেজের সাথে নতুন URL গুলো যোগ করা হচ্ছে
    updateImages([...images, ...validUrls]);
    setIsUploading(false);
  }, [images, updateImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    disabled: isUploading // আপলোড চলাকালীন ড্রপজোন বন্ধ থাকবে
  });

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    updateImages(updatedImages);
  };

  return (
    <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group/section shadow-2xl ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]/30 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
      
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/section:scale-110 transition-transform duration-500 ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
            <svg className="w-6 h-6 text-teal-600 dark:text-[#cddfa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Property Media
          </h2>
        </div>
        <p className={`text-base ml-16 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Upload high-quality images. The first image will be your property's primary cover.
        </p>
      </div>

      <div className="space-y-10">
        {/* DRAG & DROP ZONE */}
        <div 
          {...getRootProps()} 
          className={`
            relative cursor-pointer py-20 px-8 border-4 border-dashed rounded-[2.5rem] transition-all duration-700
            flex flex-col items-center justify-center text-center group/dropzone
            ${isDragActive 
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 scale-[0.98]' 
              : (isDark ? 'border-[#1a4a40]/30 hover:border-teal-700 bg-[#061510]' : 'border-slate-200 hover:border-teal-400 bg-white shadow-inner')
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div className={`absolute inset-0 border-4 rounded-full ${isDark ? 'border-teal-900/30' : 'border-teal-100'}`}></div>
                <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
              </div>
              <p className="text-teal-600 dark:text-[#cddfa0] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Processing Media...</p>
            </div>
          ) : (
            <>
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group-hover/dropzone:scale-110 group-hover/dropzone:rotate-3 transition-all duration-500 ${isDark ? 'bg-[#1a4a40] shadow-none' : 'bg-slate-50 shadow-slate-200 border border-slate-100'}`}>
                <ImageIcon className="w-12 h-12 text-teal-600 dark:text-[#cddfa0]" />
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-tight mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {isDragActive ? "Drop them here" : "Drag & Drop Images"}
              </h3>
              <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                or click to browse your files
              </p>
            </>
          )}
        </div>

        {/* PREVIEW GRID */}
        <AnimatePresence>
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {images.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 30 }}
                  className={`relative group aspect-square rounded-[2rem] overflow-hidden border-4 shadow-2xl ${isDark ? 'border-[#1a4a40]' : 'border-white'}`}
                >
                  <img 
                    src={url} 
                    alt={`Property ${index}`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-4 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-all transform hover:scale-110 hover:rotate-90 border border-white/20"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-teal-500 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                      Cover Image
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* INFO BOX */}
        <div className={`flex items-start gap-6 p-8 rounded-[2rem] border-2 ${isDark ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100 shadow-sm'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isDark ? 'bg-[#0b1f1a]' : 'bg-white border border-blue-100'}`}>
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`text-xs leading-relaxed font-medium ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
            <span className={`font-black uppercase tracking-[0.2em] block mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Media Guidelines</span>
            Supported formats: <span className="font-black">JPG, PNG, WEBP</span>. Maximum size: <span className="font-black">5MB</span> per image. 
            For professional results, use landscape orientation (16:9) and high-resolution photos.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;