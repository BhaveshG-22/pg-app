"use client"

import React from 'react'

interface CreditsBatteryProps {
  credits: number
  maxCredits: number
  className?: string
}

export function CreditsBattery({ credits, maxCredits, className = '' }: CreditsBatteryProps) {
  const percentage = Math.min(Math.max((credits / maxCredits) * 100, 0), 100)

  const getBatteryColor = () => {
    if (percentage > 60) return 'bg-green-500'
    if (percentage > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBatteryBorder = () => {
    if (percentage > 60) return 'border-green-500/30'
    if (percentage > 30) return 'border-yellow-500/30'
    return 'border-red-500/30'
  }

  return (
    <div className={`group relative flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/20"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`}
                className="text-green-500 transition-all duration-500"
              />
            </svg>
            <span className="absolute text-xs font-medium text-sidebar-foreground">
              {credits > 999 ? '999+' : credits}
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Credits: {credits}/{maxCredits}
      </div>
    </div>
  )
}