"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Download, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedImage {
  url: string;
  id?: string;
  aspectRatio?: string;
}

interface GeneratedImagesDisplayProps {
  images: GeneratedImage[];
  onDownload: (imageUrl: string, index: number) => void;
  className?: string;
}

export default function GeneratedImagesDisplay({
  images,
  onDownload,
  className
}: GeneratedImagesDisplayProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const navigateModal = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;

    if (direction === 'prev') {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    } else {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  if (images.length === 0) {
    return (
      <div className={cn("bg-gray-800/50 rounded-lg p-4 sm:p-8 text-center", className)}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Your Generated Images</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Images saved for 7 days. Upgrade to keep forever!</p>
            <p className="text-gray-500 text-xs mt-2">Generate your first masterpiece!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("bg-gray-800/50 rounded-lg p-3 sm:p-4", className)}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-medium text-white">Your Generated Images</h3>
          <span className="text-xs sm:text-sm text-gray-400">{images.length} image{images.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-blue-500"
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.url}
                alt={`Generated image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1 sm:space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className="bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(image.url, index);
                  }}
                  className="bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {/* Image number indicator */}
              <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black/70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-2 sm:mt-3 text-center">
          Images saved for 7 days. Upgrade to keep forever!
        </p>
      </div>

      {/* Full Screen Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[95vh] sm:max-h-[90vh] w-full mx-2 sm:mx-4">
            {/* Close button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10"
                  onClick={() => navigateModal('prev')}
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10"
                  onClick={() => navigateModal('next')}
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}

            {/* Main image */}
            <div className="relative aspect-square w-full max-h-[75vh] sm:max-h-[80vh]">
              <Image
                src={images[selectedIndex].url}
                alt={`Generated image ${selectedIndex + 1}`}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 640px) 95vw, 90vw"
                priority
              />
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-4">
              <span className="text-white text-xs sm:text-sm">
                {selectedIndex + 1} of {images.length}
              </span>
              <Button
                size="sm"
                onClick={() => onDownload(images[selectedIndex].url, selectedIndex)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}