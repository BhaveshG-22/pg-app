'use client'

import { motion } from "framer-motion"
import Image from "next/image"

interface HeroAnimationsProps {
  gridImages: Array<{ id: string; src: string; alt: string }>
}

export function HeroAnimations({ gridImages }: HeroAnimationsProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Desktop Grid Background - Large screens and up */}
      <div className="absolute inset-0 scale-150 -translate-y-32 hidden lg:block" style={{
        transformStyle: 'preserve-3d',
        transform: 'rotateX(20deg) rotateY(0deg) skewX(335deg)',
        width: '150%',
        height: '150%',
        top: '-25%',
        left: '-25%'
      }}>
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="flex gap-2 h-full"
            animate={{
              x: [0, -1000],
              y: [100, -100]
            }}
            transition={{
              duration: 120,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            {Array.from({ length: 10 }).map((_, sectionIdx) => (
              <div key={sectionIdx} className="flex-shrink-0 w-[2400px] h-full">
                <div className="grid w-full h-full overflow-hidden" style={{
                  gridTemplateColumns: 'repeat(18, 1fr)',
                  gridTemplateRows: 'repeat(8, 1fr)',
                  gap: '4px'
                }}>
                  {gridImages.slice(sectionIdx * 36, (sectionIdx * 36) + 144).map((image) => (
                    <div
                      key={`${sectionIdx}-${image.id}`}
                      className="w-full h-full overflow-hidden"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={100}
                        height={120}
                        className="w-full h-full object-cover rounded-sm opacity-90"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile and Tablet Background - Up to large screens */}
      <div className="absolute inset-0 lg:hidden overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: 'scale(1.1) rotate(6deg)',
            top: '-20%',
            left: '-20%',
            right: '-20%',
            bottom: '-20%'
          }}
        >
          {/* Multiple rows with different speeds for depth */}
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <motion.div
              key={rowIdx}
              className="flex gap-2 w-max"
              animate={{
                x: rowIdx % 2 === 0 ? [0, -1200] : [-1200, 0]
              }}
              transition={{
                duration: 80 + rowIdx * 15,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
              style={{
                position: 'absolute',
                top: `${rowIdx * 10}%`,
                left: rowIdx % 2 === 0 ? '0%' : '-50%'
              }}
            >
              {gridImages.slice(rowIdx * 6, (rowIdx * 6) + 12).map((image, imgIdx) => (
                <div
                  key={`mobile-row-${rowIdx}-img-${imgIdx}`}
                  className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 overflow-hidden rounded-xl shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover opacity-50"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {gridImages.slice(rowIdx * 6, (rowIdx * 6) + 12).map((image, imgIdx) => (
                <div
                  key={`mobile-row-${rowIdx}-img-dup-${imgIdx}`}
                  className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 overflow-hidden rounded-xl shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover opacity-50"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FloatingElements() {
  // Predefined positions to avoid hydration issues
  const positions = [
    { x: 10, y: 20 }, { x: 80, y: 15 }, { x: 20, y: 80 }, { x: 90, y: 60 },
    { x: 30, y: 40 }, { x: 70, y: 85 }, { x: 15, y: 70 }, { x: 85, y: 25 },
    { x: 50, y: 10 }, { x: 60, y: 90 }, { x: 25, y: 50 }, { x: 75, y: 35 }
  ]
  
  const durations = [18, 22, 20, 25, 17, 23, 19, 24, 21, 26, 16, 27]

  return (
    <div className="absolute inset-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 120, 0],
          }}
          transition={{
            duration: durations[i],
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export function AnimatedGradient() {
  return (
    <motion.div
      className="absolute inset-0 opacity-80"
      animate={{
        background: [
          "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 40% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)"
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}