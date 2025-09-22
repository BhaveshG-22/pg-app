'use client';

import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface StudioHeaderProps {
  presetName: string;
  presetEmoji: string;
  userCredits: number;
  creditCost: number;
}

export function StudioHeader({
  presetName,
  presetEmoji,
  userCredits,
  creditCost,
}: StudioHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-muted/50 border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-xl font-medium text-gray-300 flex items-center gap-2">
              {presetEmoji} Ready to transform with {presetName}?
            </h1>
            <p className="text-sm text-gray-400">
              Customize your settings and generate amazing results
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-300">
              {userCredits} Credits Left
            </span>
          </div>
          <div className="text-sm text-gray-400">
            This preset costs <span className="text-white font-medium">{creditCost} credit{creditCost > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </header>
  );
}