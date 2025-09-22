'use client';

import { useState } from 'react';
import { Eye, EyeOff, ImageIcon, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserImage, AspectRatio } from '@/types/preset';

interface PreviewPanelProps {
  selectedImage: UserImage | null;
  generatedImageUrl: string | null;
  aspectRatio: AspectRatio;
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  className?: string;
}

export function PreviewPanel({
  selectedImage,
  generatedImageUrl,
  aspectRatio,
  isGenerating,
  progress,
  currentStep,
  className,
}: PreviewPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const getAspectRatioClasses = (ratio: AspectRatio) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '3:2':
        return 'aspect-[3/2]';
      case '2:3':
        return 'aspect-[2/3]';
      case '16:9':
        return 'aspect-video';
      case '9:16':
        return 'aspect-[9/16]';
      default:
        return 'aspect-square';
    }
  };

  const tips = [
    '💡 Use high-resolution images for best results',
    '🎨 Experiment with different aspect ratios',
    '✨ Try adjusting the style intensity',
    '🔍 Clear, well-lit photos work best',
    '🎭 Consider the mood you want to convey',
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-300">
            {generatedImageUrl ? 'Preview' : 'Live Preview'}
          </h3>
          {generatedImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-2"
            >
              {showOriginal ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Show Result
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Original
                </>
              )}
            </Button>
          )}
        </div>

        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          {selectedImage ? (
            <div className={cn('relative w-full max-w-md mx-auto', getAspectRatioClasses(aspectRatio))}>
              <img
                src={
                  generatedImageUrl && !showOriginal
                    ? generatedImageUrl
                    : selectedImage.url
                }
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center max-w-xs px-4">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-white/20 border-t-primary rounded-full animate-spin mx-auto" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium">
                          {currentStep}
                        </span>
                        <span className="text-primary font-bold text-sm">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-yellow-500 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-300">
                      Creating your masterpiece...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-medium mb-2">No image selected</h4>
                <p className="text-sm">
                  Select or upload an image to see a preview
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Original:</span>
              <span className="text-gray-300">
                {selectedImage.width} × {selectedImage.height}px
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Output:</span>
              <span className="text-gray-300">
                {aspectRatio} aspect ratio
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-muted/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-300">Tips for Better Results</h3>
        </div>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm text-gray-400 leading-relaxed">
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}