import { cn } from 'cn'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '~/common/ui/Tooltip'
import { clamp } from '~/common/utils/clamp'
import { formatTime } from '~/common/utils/formatTime'

interface PlaybackSliderProps {
  value: number | null
  duration: number
  disabled?: boolean
  isPlaying: boolean
  getCurrentTime: () => number
  onSeek: (seconds: number) => Promise<number>
}

export const PlaybackSlider = ({
  value,
  duration,
  disabled = false,
  isPlaying,
  getCurrentTime,
  onSeek,
}: PlaybackSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)
  const seekRequestRef = useRef(0)
  const [clockTime, setClockTime] = useState(0)
  const [dragValue, setDragValue] = useState<number | null>(null)
  const [pendingValue, setPendingValue] = useState<number | null>(null)
  const [hoverPercent, setHoverPercent] = useState<number | null>(null)
  const [cursorX, setCursorX] = useState<number | null>(null)
  const [tooltipTime, setTooltipTime] = useState(value ?? 0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0
  const isDisabled = disabled || value === null || safeDuration === 0
  const displayedValue = clamp(dragValue ?? pendingValue ?? clockTime, 0, safeDuration)
  const currentPercent = safeDuration === 0 ? 0 : (displayedValue / safeDuration) * 100
  const isActive = isHovered || isFocused || dragValue !== null || pendingValue !== null
  const showsTooltip =
    !isDisabled && cursorX !== null && (hoverPercent !== null || dragValue !== null)

  useEffect(() => {
    if (!isPlaying || isDisabled) return

    let animationFrame = 0

    const updateClock = () => {
      setClockTime(getCurrentTime())

      animationFrame = requestAnimationFrame(updateClock)
    }

    animationFrame = requestAnimationFrame(updateClock)

    return () => cancelAnimationFrame(animationFrame)
  }, [getCurrentTime, isDisabled, isPlaying])

  useEffect(() => {
    return () => {
      seekRequestRef.current += 1
    }
  }, [])

  const getValueAtPosition = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()

    if (!rect || rect.width === 0 || safeDuration === 0) return 0

    return clamp((clientX - rect.left) / rect.width, 0, 1) * safeDuration
  }

  const getPercentAtPosition = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()

    if (!rect || rect.width === 0) return null

    return clamp((clientX - rect.left) / rect.width, 0, 1) * 100
  }

  const isPointerOverTrack = (clientX: number, clientY: number) => {
    const rect = trackRef.current?.getBoundingClientRect()

    return (
      !!rect &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    )
  }

  const submitSeek = (nextValue: number) => {
    const requestId = ++seekRequestRef.current
    const clampedValue = clamp(nextValue, 0, safeDuration)

    setPendingValue(clampedValue)

    onSeek(clampedValue)
      .then((confirmedTime) => {
        if (seekRequestRef.current !== requestId) return

        setClockTime(clamp(confirmedTime, 0, safeDuration))
        setPendingValue(null)
      })
      .catch(() => {
        if (seekRequestRef.current !== requestId) return

        setPendingValue(null)
      })
  }

  const cancelDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    setDragValue(null)
    setHoverPercent(null)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled || (event.pointerType === 'mouse' && event.button !== 0)) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    draggingRef.current = true
    const nextValue = getValueAtPosition(event.clientX)

    setDragValue(nextValue)
    setTooltipTime(nextValue)
    setPendingValue(null)
    setHoverPercent(null)

    if (event.pointerType !== 'touch') setCursorX(event.clientX)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return

    if (draggingRef.current) {
      if (event.pointerType !== 'touch') setCursorX(event.clientX)

      const nextValue = getValueAtPosition(event.clientX)
      setDragValue(nextValue)
      setTooltipTime(nextValue)
      return
    }

    if (event.pointerType !== 'touch') {
      const pointerOverTrack = isPointerOverTrack(event.clientX, event.clientY)
      setIsHovered(pointerOverTrack)
      setHoverPercent(pointerOverTrack ? getPercentAtPosition(event.clientX) : null)

      if (pointerOverTrack) {
        setCursorX(event.clientX)
        setTooltipTime(getValueAtPosition(event.clientX))
      }
    }
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return

    const finalValue = getValueAtPosition(event.clientX)
    draggingRef.current = false

    setDragValue(null)
    setTooltipTime(finalValue)
    submitSeek(finalValue)

    const pointerOverTrack = isPointerOverTrack(event.clientX, event.clientY)
    setIsHovered(pointerOverTrack)
    setHoverPercent(pointerOverTrack ? getPercentAtPosition(event.clientX) : null)

    if (pointerOverTrack && event.pointerType !== 'touch') setCursorX(event.clientX)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return

    let nextValue: number | null = null

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = displayedValue - 5
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = displayedValue + 5
        break
      case 'Home':
        nextValue = 0
        break
      case 'End':
        nextValue = safeDuration
        break
      case 'Escape':
        if (draggingRef.current) {
          event.preventDefault()
          cancelDrag()
        }
        return
      default:
        return
    }

    event.preventDefault()

    submitSeek(nextValue)
  }

  const tooltipAnchor =
    cursorX === null
      ? undefined
      : {
          getBoundingClientRect: () => {
            const rect = railRef.current?.getBoundingClientRect()
            const x = rect ? clamp(cursorX, rect.left, rect.right) : cursorX
            const y = rect ? rect.top + rect.height / 2 : 0
            return new DOMRect(x, y, 0, 0)
          },
        }

  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 tabular-nums">
      <span>{isDisabled ? '--:--' : formatTime(displayedValue)}</span>
      <Tooltip disabled={!showsTooltip} open={showsTooltip} trackCursorAxis="none">
        <TooltipTrigger
          disabled
          render={
            <div
              ref={trackRef}
              role="slider"
              tabIndex={isDisabled ? -1 : 0}
              aria-label="Seek slider"
              aria-valuemin={0}
              aria-valuemax={safeDuration}
              aria-valuenow={displayedValue}
              aria-valuetext={formatTime(displayedValue)}
              aria-disabled={isDisabled}
              className={cn(
                'group relative flex h-4.5 w-full touch-none items-center outline-none select-none',
                isDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary',
              )}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={cancelDrag}
              onLostPointerCapture={cancelDrag}
              onPointerEnter={(event) => {
                if (isDisabled || event.pointerType === 'touch') return
                const pointerOverTrack = isPointerOverTrack(event.clientX, event.clientY)
                setIsHovered(pointerOverTrack)
                if (pointerOverTrack) {
                  setCursorX(event.clientX)
                  setTooltipTime(getValueAtPosition(event.clientX))
                }
                setHoverPercent(pointerOverTrack ? getPercentAtPosition(event.clientX) : null)
              }}
              onPointerLeave={() => {
                setIsHovered(false)
                if (!draggingRef.current) setHoverPercent(null)
              }}
            >
              <span
                ref={railRef}
                className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-visible bg-white/30"
              >
                <span
                  style={{ width: `${currentPercent}%` }}
                  className={cn(
                    'absolute top-0 left-0 h-full',
                    isActive ? 'bg-primary' : 'bg-white',
                  )}
                />
                <span
                  style={{ left: `${currentPercent}%` }}
                  className={cn(
                    'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 bg-white transition-[opacity,scale]',
                    isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
                  )}
                />
              </span>
            </div>
          }
        />
        <TooltipContent
          className="pointer-events-none"
          positionerClassName="pointer-events-none"
          anchor={tooltipAnchor}
          sideOffset={10}
        >
          {formatTime(tooltipTime)}
        </TooltipContent>
      </Tooltip>
      <span>{isDisabled ? '--:--' : formatTime(safeDuration)}</span>
    </div>
  )
}
