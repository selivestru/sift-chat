import { Tooltip, cn } from '@heroui/react'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { clamp } from '~/common/utils/clamp'

import { formatPlaybackTime } from '../utils/formatPlaybackTime'

interface PlaybackSliderProps {
  value: number
  duration: number | null
  onSeek: (seconds: number) => void
  onPreviewChange: (seconds: number | null) => void
}

export const PlaybackSlider = ({
  value,
  duration,
  onSeek,
  onPreviewChange,
}: PlaybackSliderProps) => {
  const railRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)
  const keyboardInteractionRef = useRef(false)
  const previewValueRef = useRef<number | null>(null)
  const [previewValue, setPreviewValue] = useState<number | null>(null)
  const [tooltipTime, setTooltipTime] = useState<number | null>(null)
  const [tooltipCrossOffset, setTooltipCrossOffset] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const isEnabled = duration !== null && Number.isFinite(duration) && duration > 0
  const safeDuration = isEnabled ? duration : 0
  const safeValue = isEnabled ? clamp(Number.isFinite(value) ? value : 0, 0, safeDuration) : 0
  const displayedValue = previewValue ?? safeValue
  const isActive = isHovered || isFocused || previewValue !== null

  const updatePreviewValue = (nextValue: number | null) => {
    previewValueRef.current = nextValue
    setPreviewValue(nextValue)
    onPreviewChange(nextValue)
  }

  const getValueAtPosition = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || !isEnabled) return safeValue

    const progress = clamp((clientX - rect.left) / rect.width, 0, 1)
    return clamp(Math.round(progress * safeDuration), 0, safeDuration)
  }

  const updateTooltipFromPointer = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return

    const x = clamp(clientX - rect.left, 0, rect.width)
    setTooltipCrossOffset(x - rect.width / 2)
    setTooltipTime(getValueAtPosition(clientX))
  }

  const updateTooltipFromValue = (time: number) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || !isEnabled) return

    setTooltipCrossOffset((time / safeDuration) * rect.width - rect.width / 2)
    setTooltipTime(time)
  }

  const cancelInteraction = () => {
    draggingRef.current = false
    keyboardInteractionRef.current = false
    updatePreviewValue(null)

    if (!isHovered && !isFocused) setIsTooltipOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isEnabled) return

    let nextValue: number | null = null
    const currentValue = previewValueRef.current ?? safeValue

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = currentValue - 5
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = currentValue + 5
        break
      case 'PageDown':
        nextValue = currentValue - 10
        break
      case 'PageUp':
        nextValue = currentValue + 10
        break
      case 'Home':
        nextValue = 0
        break
      case 'End':
        nextValue = safeDuration
        break
      default:
        return
    }

    event.preventDefault()
    keyboardInteractionRef.current = true
    const clampedValue = clamp(nextValue, 0, safeDuration)
    updatePreviewValue(clampedValue)
    updateTooltipFromValue(clampedValue)
    setIsTooltipOpen(true)
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!keyboardInteractionRef.current) return

    if (
      ![
        'ArrowLeft',
        'ArrowDown',
        'ArrowRight',
        'ArrowUp',
        'PageDown',
        'PageUp',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      return
    }

    event.preventDefault()
    const nextValue = previewValueRef.current
    if (nextValue !== null) onSeek(nextValue)

    keyboardInteractionRef.current = false
    updatePreviewValue(null)
    if (nextValue !== null) updateTooltipFromValue(nextValue)
  }

  return (
    <Tooltip isOpen={isTooltipOpen} onOpenChange={setIsTooltipOpen} delay={0}>
      <Tooltip.Trigger
        role="slider"
        tabIndex={isEnabled ? 0 : -1}
        aria-label="Playback progress"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-valuenow={displayedValue}
        aria-valuetext={
          isEnabled
            ? `${formatPlaybackTime(displayedValue)} of ${formatPlaybackTime(safeDuration)}`
            : '--:--'
        }
        aria-disabled={!isEnabled}
        className={cn(
          'group relative flex h-4.5 min-w-0 flex-1 touch-none items-center outline-none select-none',
          isEnabled
            ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-accent'
            : 'cursor-default',
        )}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (!isEnabled || (event.button !== 0 && event.pointerType === 'mouse')) return

          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          draggingRef.current = true
          keyboardInteractionRef.current = false
          setIsHovered(event.pointerType !== 'touch')

          const nextValue = getValueAtPosition(event.clientX)
          updatePreviewValue(nextValue)
          updateTooltipFromPointer(event.clientX)
          setIsTooltipOpen(true)
        }}
        onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
          if (draggingRef.current) {
            const nextValue = getValueAtPosition(event.clientX)
            updatePreviewValue(nextValue)
            updateTooltipFromPointer(event.clientX)
          } else if (isEnabled && event.pointerType !== 'touch') {
            updateTooltipFromPointer(event.clientX)
          }
        }}
        onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
          if (!draggingRef.current) return

          const nextValue = getValueAtPosition(event.clientX)
          draggingRef.current = false
          updatePreviewValue(nextValue)
          onSeek(nextValue)
          updatePreviewValue(null)
          updateTooltipFromPointer(event.clientX)
          setIsTooltipOpen(event.pointerType !== 'touch' || isFocused)
        }}
        onPointerCancel={cancelInteraction}
        onLostPointerCapture={() => {
          if (draggingRef.current) cancelInteraction()
        }}
        onPointerEnter={(event) => {
          if (!isEnabled || event.pointerType === 'touch') return

          setIsHovered(true)
          updateTooltipFromPointer(event.clientX)
          setIsTooltipOpen(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') return

          setIsHovered(false)
          if (!draggingRef.current && !isFocused) {
            setTooltipTime(null)
            setIsTooltipOpen(false)
          }
        }}
        onFocus={() => {
          if (!isEnabled) return

          setIsFocused(true)
          updateTooltipFromValue(displayedValue)
          setIsTooltipOpen(true)
        }}
        onBlur={() => {
          setIsFocused(false)
          if (keyboardInteractionRef.current) cancelInteraction()
          if (!isHovered && !draggingRef.current) {
            setTooltipTime(null)
            setIsTooltipOpen(false)
          }
        }}
      >
        <span
          ref={railRef}
          className="bg-segment pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2"
        >
          <span
            style={{ width: `${isEnabled ? (displayedValue / safeDuration) * 100 : 0}%` }}
            className={cn('absolute top-0 left-0 h-full', isActive ? 'bg-accent' : 'bg-foreground')}
          />
          {isActive && isEnabled && (
            <span
              style={{ left: `${(displayedValue / safeDuration) * 100}%` }}
              className="bg-foreground absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content placement="top" offset={6} crossOffset={tooltipCrossOffset}>
        {formatPlaybackTime(tooltipTime ?? displayedValue)}
      </Tooltip.Content>
    </Tooltip>
  )
}
