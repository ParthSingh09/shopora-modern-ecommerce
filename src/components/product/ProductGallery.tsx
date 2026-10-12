import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-shopora-card border transition-all shrink-0 p-1 ${
              selectedImage === idx
                ? 'border-shopora-accent shadow-glow-accent scale-105'
                : 'border-shopora-border hover:border-slate-500 opacity-70 hover:opacity-100'
            }`}
            aria-label={`View angle ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 aspect-square sm:aspect-[4/3] md:aspect-square bg-shopora-card rounded-2xl border border-shopora-border overflow-hidden flex items-center justify-center group">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Verification Tag */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200">
          <ShieldCheck className="w-4 h-4 text-shopora-accent" />
          <span>PHYSICAL VAULT VERIFIED</span>
        </div>

        {/* Image index badge */}
        <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};
