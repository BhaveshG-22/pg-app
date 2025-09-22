"use client";

import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";

type CardProps = {
  imageUrl: string;
  avatarUrl: string;
  name: string;
  likes: number;
  reposts: number;
  height?: string;
  fadeBottom?: boolean;
  style?: React.CSSProperties;
};

export default function Card({
  imageUrl,
  avatarUrl,
  name,
  likes,
  reposts,
  height = "h-[360px]",
  fadeBottom = false,
  style,
}: CardProps) {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="bg-black rounded-lg overflow-hidden w-full text-white relative" style={style}>
      <div className="relative">
        {imageError ? (
          <div className={`w-full ${height} bg-gray-800 rounded-lg flex items-center justify-center`}>
            <div className="text-center text-gray-400">
              <div className="text-sm">Image failed to load</div>
              <div className="text-xs mt-1">Check network connection</div>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="card"
            className={`w-full ${height} object-cover rounded-lg`}
            onError={() => setImageError(true)}
            onLoad={() => console.log('Image loaded:', imageUrl)}
          />
        )}
        {fadeBottom && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        )}
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {avatarError ? (
            <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs text-gray-400">{name.charAt(0)}</span>
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          )}
          <span className="text-sm font-medium">{name}</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 hover:text-yellow-400 cursor-pointer transition-colors" />
            <span>{reposts}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 hover:text-red-500 hover:fill-red-500 cursor-pointer transition-all duration-300 ease-in-out" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}