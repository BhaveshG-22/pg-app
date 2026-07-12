"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  priority?: boolean
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Original photo",
  afterAlt = "Preset applied",
  beforeLabel = "Original",
  afterLabel = "After · this preset",
  priority = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [interacted, setInteracted] = useState(false)
  const [beforeError, setBeforeError] = useState(false)
  const [afterError, setAfterError] = useState(false)
  const dragging = useRef(false)

  const clamp = (p: number) => Math.max(3, Math.min(97, p))

  const posFromClientX = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect()
    return clamp(((clientX - rect.left) / rect.width) * 100)
  }

  // Reset the "seen it" state and re-run the intro peek whenever the pair changes.
  useEffect(() => {
    setBeforeError(false)
    setAfterError(false)
    setPos(50)
    setInteracted(false)
  }, [beforeSrc, afterSrc])

  // Intro peek: 50 -> 26 -> 74 -> 50, once, unless the user interacts or reduced motion is set.
  useEffect(() => {
    if (interacted) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    let stopped = false
    const sequence: [number, number, number][] = [
      [600, 50, 26],
      [900, 26, 74],
      [700, 74, 50],
    ]
    let step = 0

    const runStep = () => {
      if (stopped || step >= sequence.length) return
      const [duration, from, to] = sequence[step++]
      const start = performance.now()
      const frame = (now: number) => {
        if (stopped) return
        const t = Math.min(1, (now - start) / duration)
        const eased = 0.5 - 0.5 * Math.cos(Math.PI * t)
        setPos(from + (to - from) * eased)
        if (t < 1) {
          requestAnimationFrame(frame)
        } else {
          runStep()
        }
      }
      requestAnimationFrame(frame)
    }

    const id = window.setTimeout(runStep, 700)
    return () => {
      stopped = true
      window.clearTimeout(id)
    }
    // Only replay the peek when the pair changes (interacted resets it above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeSrc, afterSrc, interacted])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    setInteracted(true)
    setPos(posFromClientX(e.clientX))
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    setPos(posFromClientX(e.clientX))
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  return (
    <div
      ref={ref}
      className="compare"
      style={{ ["--pos" as string]: `${pos}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {!afterError ? (
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          priority={priority}
          sizes="(max-width: 1020px) 100vw, 60vw"
          className="layer after"
          draggable={false}
          onError={() => setAfterError(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={afterSrc} alt={afterAlt} className="layer after" draggable={false} />
      )}

      {!beforeError ? (
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          priority={priority}
          sizes="(max-width: 1020px) 100vw, 60vw"
          className="layer before"
          draggable={false}
          onError={() => setBeforeError(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={beforeSrc} alt={beforeAlt} className="layer before" draggable={false} />
      )}

      <span className="tag before-tag">{beforeLabel}</span>
      <span className="tag after-tag">{afterLabel}</span>
      <div className="divider" aria-hidden />
      <button
        type="button"
        className={"grip" + (interacted ? "" : " hint")}
        role="slider"
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setPos((p) => clamp(p - 3))
            setInteracted(true)
            e.preventDefault()
          }
          if (e.key === "ArrowRight") {
            setPos((p) => clamp(p + 3))
            setInteracted(true)
            e.preventDefault()
          }
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6-5 6 5 6M15 6l5 6-5 6" />
        </svg>
      </button>
    </div>
  )
}
