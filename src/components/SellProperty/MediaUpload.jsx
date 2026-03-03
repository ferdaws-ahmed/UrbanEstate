'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MediaUpload Component
 * Features: Multi-image upload, Preview gallery, Drag & Drop, and Remove functionality.
 * Designed with a premium glass-morphism feel for dark/light modes.
 */
const MediaUpload = () => {
  const [images, setImages] = useState([]);

  // Handling file drops
  const onDrop = useCallback((acceptedFiles) => {
    // Standard logic to create preview URLs for selected images
    const newImages = acceptedFiles.map((file) => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  // Remove image from list
  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
      
      {/* SECTION HEADER */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Property Media
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload high-quality images to increase conversion. (Max size: 5MB per image)
        </p>
      </div>

      <div className="space-y-6">
        {/* DRAG & DROP ZONE */}
        <div 
          {...getRootProps()} 
          className={`
            relative cursor-pointer py-12 px-4 border-2 border-dashed rounded-2xl transition-all duration-300
            flex flex-col items-center justify-center text-center
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6.a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {isDragActive ? "Drop the files here" : "Drag & drop or click to upload"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">PNG, JPG, JPEG are supported</p>
        </div>

        {/* IMAGE PREVIEW GRID */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((file, index) => (
                <motion.div
                  key={file.preview || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <img 
                    src={file.preview} 
                    alt="preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  {/* Overlay for actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                  {/* Primary Badge for first image */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded shadow-sm uppercase tracking-tighter">
                      Cover
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* COMPONENT FOOTER */}
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Tip: Landscape photos work best. First image will be used as the listing cover.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;