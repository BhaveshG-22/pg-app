'use client'

import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'

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
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-amber-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-red-500'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-card border border-border w-full max-w-lg rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className={`${getIconColor()} mt-0.5`}>
            {getIcon()}
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold text-foreground leading-none">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <div className="text-sm text-muted-foreground space-y-3">
            {message.split('\n\n').map((paragraph, index) => (
              <div key={index} className="space-y-2">
                {paragraph.split('\n').map((line, lineIndex) => {
                  // Check if it's a section header with emoji
                  const isSectionHeader = /^[📋💳⏳✅🚫]/.test(line) && line.includes(':');

                  if (line.includes('💳') && !isSectionHeader) {
                    return (
                      <div key={lineIndex} className="font-medium text-foreground">
                        {line}
                      </div>
                    );
                  }

                  if (isSectionHeader) {
                    return (
                      <div key={lineIndex} className="font-medium text-foreground pt-2 pb-1 text-sm">
                        {line}
                      </div>
                    );
                  }

                  if (line.startsWith('•')) {
                    return (
                      <div
                        key={lineIndex}
                        className="flex items-start gap-2 py-1 px-2 rounded-md hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-muted-foreground/60 text-[10px] mt-1">●</span>
                        <span className="text-sm text-foreground font-mono flex-1 leading-relaxed">
                          {line.substring(1).trim()}
                        </span>
                      </div>
                    );
                  }

                  if (!line.trim()) {
                    return <div key={lineIndex} className="h-1" />;
                  }

                  return (
                    <p key={lineIndex} className="leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                {actionButton.text}
              </button>
            )}
            <button
              onClick={onClose}
              className={`${actionButton ? 'flex-1' : 'w-full'} border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}