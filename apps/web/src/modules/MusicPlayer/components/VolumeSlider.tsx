import { cn } from 'cn'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { clamp } from '~/common/utils/clamp'

interface VolumeSliderProps {
  value: number
  onValueChange: (value: number) => void
  className?: string
}

export const VolumeSlider = ({ value, onValueChange, className }: VolumeSliderProps) => {
  const railRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)
  const [dragValue, setDragValue] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const safeValue = clamp(Number.isFinite(value) ? value : 0, 0, 100)
  const displayedValue = dragValue ?? safeValue
  const isActive = isHovered || dragValue !== null

  const getValueAtPosition = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return safeValue

    return Math.round(clamp((clientX - rect.left) / rect.width, 0, 1) * 100)
  }

  const updateValue = (nextValue: number) => {
    const clampedValue = clamp(Math.round(nextValue), 0, 100)
    setDragValue(clampedValue)
    onValueChange(clampedValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextValue: number | null = null

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowLeft':
        nextValue = safeValue - 1
        break
      case 'ArrowUp':
      case 'ArrowRight':
        nextValue = safeValue + 1
        break
      case 'PageDown':
        nextValue = safeValue - 10
        break
      case 'PageUp':
        nextValue = safeValue + 10
        break
      case 'Home':
        nextValue = 0
        break
      case 'End':
        nextValue = 100
        break
      default:
        return
    }

    event.preventDefault()
    onValueChange(clamp(nextValue, 0, 100))
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Volume slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayedValue}
      aria-valuetext={`${displayedValue}%`}
      className={cn(
        'group relative flex h-4.5 w-full touch-none items-center outline-none select-none',
        'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      onKeyDown={handleKeyDown}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return

        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        draggingRef.current = true
        updateValue(getValueAtPosition(event.clientX))
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        if (draggingRef.current) updateValue(getValueAtPosition(event.clientX))
      }}
      onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return
        updateValue(getValueAtPosition(event.clientX))
        draggingRef.current = false
        setDragValue(null)
      }}
      onPointerCancel={() => {
        draggingRef.current = false
        setDragValue(null)
      }}
      onLostPointerCapture={() => {
        draggingRef.current = false
        setDragValue(null)
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setIsHovered(true)
      }}
      onPointerLeave={() => setIsHovered(false)}
    >
      <span
        ref={railRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-white/30"
      >
        <span
          style={{ width: `${displayedValue}%` }}
          className={cn('absolute top-0 left-0 h-full', isActive ? 'bg-primary' : 'bg-white')}
        />
        {isActive && (
          <span
            style={{ left: `${displayedValue}%` }}
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-white"
          />
        )}
      </span>
    </div>
  )
}
