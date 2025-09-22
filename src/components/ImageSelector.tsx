'use client';

import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserImage } from '@/types/preset';

interface ImageSelectorProps {
  userImages: UserImage[];
  selectedImageId: string | null;
  onImageSelect: (imageId: string) => void;
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageSelector({
  userImages,
  selectedImageId,
  onImageSelect,
  onImageUpload,
  className,
}: ImageSelectorProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      setUploadMode(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      setUploadMode(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-300">Select Image</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadMode(!uploadMode)}
        >
          {uploadMode ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Upload New
            </>
          )}
        </Button>
      </div>

      {uploadMode ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
            dragActive
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-gray-600 hover:border-gray-500'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">
              Upload your image
            </h4>
            <p className="text-gray-400 mb-4">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or WebP • Max 10MB • Best results with high-res images
            </p>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {userImages.length > 0 ? (
            <>
              <p className="text-sm text-gray-400">
                Choose from your uploaded images ({userImages.length} available)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {userImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => onImageSelect(image.id)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105',
                      selectedImageId === image.id
                        ? 'border-primary ring-2 ring-primary/50 shadow-lg'
                        : 'border-gray-600 hover:border-gray-500'
                    )}
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageId === image.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">
                        {image.fileName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-medium text-gray-300 mb-2">
                No images uploaded yet
              </h4>
              <p className="text-gray-400 mb-4">
                Upload your first image to get started
              </p>
              <Button
                onClick={() => setUploadMode(true)}
                className="mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}