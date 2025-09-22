'use client';

import { AspectRatio } from '@/types/preset';
import { cn } from '@/lib/utils';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  className?: string;
}

const ratioOptions: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: '1:1', icon: '□' },
  { value: '3:2', label: '3:2', icon: '▭' },
  { value: '2:3', label: '2:3', icon: '▯' },
  { value: '16:9', label: '16:9', icon: '▬' },
  { value: '9:16', label: '9:16', icon: '▮' },
];

export function AspectRatioSelector({
  selectedRatio,
  onRatioChange,
  className,
}: AspectRatioSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-3">
          Aspect Ratio
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {ratioOptions.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => onRatioChange(ratio.value)}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105',
                selectedRatio === ratio.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              )}
            >
              <span className="text-2xl mb-1">{ratio.icon}</span>
              <span className="text-xs font-medium">{ratio.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Choose the aspect ratio for your generated image
        </p>
      </div>
    </div>
  );
}