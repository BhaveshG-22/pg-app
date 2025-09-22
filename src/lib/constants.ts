import { Monitor, Smartphone, User } from 'lucide-react'

// Output size options
export const OUTPUT_SIZES = {
  'SQUARE': {
    name: 'Square',
    description: 'Profile / Default Preset',
    dimensions: '1080 × 1080 px',
    details: 'Best for social media avatars (LinkedIn, Instagram, etc.). Clean, balanced framing.',
    aspectRatio: 'aspect-square',
    icon: Monitor
  },
  'PORTRAIT': {
    name: 'Portrait',
    description: 'Professional / LinkedIn-style',
    dimensions: '1080 × 1350 px',
    details: 'Ideal for resume/profile pictures with headroom. Looks sharp on most platforms.',
    aspectRatio: 'aspect-[4/5]',
    icon: User
  },
  'VERTICAL': {
    name: 'Vertical',
    description: 'Full-body or Glow-Up Style',
    dimensions: '1080 × 1920 px',
    details: 'Perfect for glow-up, full-body edits, stories, or mobile wallpapers.',
    aspectRatio: 'aspect-[9/16]',
    icon: Smartphone
  },
  'LANDSCAPE': {
    name: 'Landscape',
    description: 'Wide / Desktop Wallpaper',
    dimensions: '1920 × 1080 px',
    details: 'Perfect for wide scenes, desktop wallpapers, or cinematic compositions.',
    aspectRatio: 'aspect-[16/9]',
    icon: Monitor
  },
  'STANDARD': {
    name: 'Standard',
    description: 'Classic 4:3 Format',
    dimensions: '1440 × 1080 px',
    details: 'Traditional photo format, great for balanced compositions.',
    aspectRatio: 'aspect-[4/3]',
    icon: Monitor
  }
}

export type OutputSize = keyof typeof OUTPUT_SIZES