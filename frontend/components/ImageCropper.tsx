import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/utils/cropImage';
import { X, Check } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[var(--color-bg-primary)] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="font-bold text-lg font-display">Adjust Profile Photo</h3>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative w-full h-[300px] sm:h-[400px] bg-black/50">
          {React.createElement(Cropper as any, {
            image: imageSrc,
            crop: crop,
            zoom: zoom,
            aspect: 1,
            cropShape: "round",
            showGrid: false,
            onCropChange: setCrop,
            onCropComplete: onCropCompleteHandler,
            onZoomChange: setZoom
          })}
        </div>
        
        <div className="p-4 border-t border-white/10 space-y-4 bg-white/5">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-[var(--color-accent)] hover:opacity-90 text-white transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Check size={16} /> Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
