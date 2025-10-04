'use client'

import { X, AlertCircle, CreditCard, Sparkles } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'error' | 'warning' | 'info'
  actionButton?: {
    text: string
    onClick: () => void
  }
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'error',
  actionButton
}: ErrorModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-400" />
      case 'info':
        return <CreditCard className="h-5 w-5 text-blue-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-red-400" />
    }
  }

  const getAccentColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20'
      default:
        return 'bg-red-500/10 border-red-500/20'
    }
  }

  const getIconBg = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/20'
      case 'info':
        return 'bg-blue-500/20'
      default:
        return 'bg-red-500/20'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${getIconBg()}`}>
              {getIcon()}
            </div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3a3a] rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className={`rounded-xl p-4 border ${getAccentColor()}`}>
            <div className="text-sm whitespace-pre-line leading-relaxed space-y-3">
              {message.split('\n\n').map((paragraph, index) => (
                <div key={index} className="text-gray-300">
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex}>
                      {line.includes('💳') ? (
                        <div className="font-semibold text-white mb-2">{line}</div>
                      ) : line.startsWith('•') ? (
                        <div className="flex items-start gap-2 ml-2">
                          <span className="text-gray-500 mt-0.5">•</span>
                          <span className="text-gray-300">{line.substring(1).trim()}</span>
                        </div>
                      ) : (
                        <div className={line.trim() ? '' : 'h-2'}>{line}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {actionButton.text}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 py-3 px-4 rounded-xl transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}