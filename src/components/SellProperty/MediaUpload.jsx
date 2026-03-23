'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Image as ImageIcon, Info } from 'lucide-react';

const MediaUpload = ({ images, updateImages }) => {
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
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
      
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Property Media</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload high-quality images. First image will be the cover.
        </p>
      </div>

      <div className="space-y-6">
        {/* DRAG & DROP ZONE */}
        <div 
          {...getRootProps()} 
          className={`
            relative cursor-pointer py-12 px-4 border-2 border-dashed rounded-2xl transition-all duration-300
            flex flex-col items-center justify-center text-center
            ${isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <p className="text-blue-500 font-medium">Uploading to ImgBB...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {isDragActive ? "Drop to upload" : "Drag & drop or click to upload"}
              </h3>
            </>
          )}
        </div>

        {/* IMAGE PREVIEW GRID */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img src={url} alt="property" className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded uppercase">
                      Cover
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl flex items-center gap-3">
        <Info className="w-5 h-5 text-blue-500" />
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Tip: Once uploaded, these images are hosted permanently and ready for your listing.
        </p>
      </div>
    </div>
  );
};

export default MediaUpload;