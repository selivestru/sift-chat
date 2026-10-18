import { cn } from 'cn'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

import { clamp } from '../utils/clamp'
import { formatTime } from '../utils/formatTime'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

export type SliderUpdateMode = 'onRelease' | 'onDrag'

export interface SliderProps {
  value: number | null | undefined
  onValueChange: (value: number) => void
  updateMode?: SliderUpdateMode
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-valuetext'?: string
}

export const Slider = ({
  value,
  onValueChange,
  updateMode = 'onDrag',
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Slider',
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
}: SliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)
  const [dragValue, setDragValue] = useState<number | null>(null)
  const [pendingValue, setPendingValue] = useState<number | null>(null)
  const [hoverPercent, setHoverPercent] = useState<number | null>(null)
  const [cursorX, setCursorX] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const isDisabled = disabled || value == null
  const showsTimeTooltip = updateMode === 'onRelease' && !isDisabled
  const safeMin = Number.isFinite(min) ? min : 0
  const safeMax = Number.isFinite(max) ? Math.max(safeMin, max) : safeMin
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1
  const safeValue = clamp(
    value != null && Number.isFinite(value) ? value : safeMin,
    safeMin,
    safeMax,
  )
  const displayedValue = dragValue ?? pendingValue ?? safeValue
  const range = safeMax - safeMin
  const currentPercent = range === 0 ? 0 : ((displayedValue - safeMin) / range) * 100
  const isActive = isHovered || dragValue !== null || pendingValue !== null

  useEffect(() => {
    if (pendingValue === null) return

    const tolerance = Math.max(1e-6, safeStep * 1e-6)
    if (Math.abs(safeValue - pendingValue) <= tolerance) {
      // oxlint-disable-next-line react/set-state-in-effect
      setPendingValue(null)
    }
  }, [pendingValue, safeStep, safeValue])

  const snapValue = (nextValue: number) => {
    const clampedValue = clamp(nextValue, safeMin, safeMax)
    const snappedValue = safeMin + Math.round((clampedValue - safeMin) / safeStep) * safeStep
    return clamp(Number(snappedValue.toPrecision(12)), safeMin, safeMax)
  }

  const getValueAtPosition = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || range === 0) return safeMin

    const percent = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snapValue(safeMin + percent * range)
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

  const updateDragValue = (nextValue: number) => {
    setDragValue(nextValue)
    if (updateMode === 'onDrag') onValueChange(nextValue)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled || (event.pointerType === 'mouse' && event.button !== 0)) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    draggingRef.current = true

    const nextValue = getValueAtPosition(event.clientX)
    setDragValue(nextValue)
    setHoverPercent(null)
    if (event.pointerType !== 'touch') setCursorX(event.clientX)
    if (updateMode === 'onDrag') onValueChange(nextValue)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return

    if (draggingRef.current) {
      if (event.pointerType !== 'touch') setCursorX(event.clientX)
      updateDragValue(getValueAtPosition(event.clientX))
      return
    }

    if (event.pointerType !== 'touch') {
      const pointerOverTrack = isPointerOverTrack(event.clientX, event.clientY)
      setIsHovered(pointerOverTrack)
      setHoverPercent(pointerOverTrack ? getPercentAtPosition(event.clientX) : null)
      if (pointerOverTrack) setCursorX(event.clientX)
    }
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>, shouldCommit: boolean) => {
    if (!draggingRef.current) return

    const finalValue = getValueAtPosition(event.clientX)
    draggingRef.current = false
    setDragValue(null)

    if (shouldCommit && updateMode === 'onRelease') {
      setPendingValue(finalValue)
      onValueChange(finalValue)
    }

    const pointerIsOverTrack = isPointerOverTrack(event.clientX, event.clientY)
    setIsHovered(pointerIsOverTrack)
    setHoverPercent(pointerIsOverTrack ? getPercentAtPosition(event.clientX) : null)
    if (pointerIsOverTrack && event.pointerType !== 'touch') setCursorX(event.clientX)
  }

  const previewStart =
    hoverPercent === null ? currentPercent : Math.min(currentPercent, hoverPercent)
  const previewWidth = hoverPercent === null ? 0 : Math.abs(currentPercent - hoverPercent)
  const tooltipValue =
    dragValue ??
    (hoverPercent === null ? safeValue : snapValue(safeMin + (hoverPercent / 100) * range))
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
    <Tooltip
      disabled={!showsTimeTooltip}
      trackCursorAxis="none"
      open={showsTimeTooltip && cursorX !== null && (hoverPercent !== null || dragValue !== null)}
    >
      <TooltipTrigger
        disabled
        render={
          <div
            ref={trackRef}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
            role="slider"
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-valuemin={safeMin}
            aria-valuemax={safeMax}
            aria-valuenow={displayedValue}
            aria-valuetext={ariaValueText}
            aria-disabled={isDisabled}
            className={cn(
              'relative flex h-4.5 w-full touch-none items-center outline-none select-none',
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              className,
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => finishDrag(event, true)}
            onPointerCancel={(event) => finishDrag(event, false)}
            onPointerEnter={(event) => {
              if (isDisabled || event.pointerType === 'touch') return
              const pointerOverTrack = isPointerOverTrack(event.clientX, event.clientY)
              setIsHovered(pointerOverTrack)
              if (pointerOverTrack) setCursorX(event.clientX)
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
              {hoverPercent !== null && !isDisabled && dragValue === null && (
                <span
                  style={{ left: `${previewStart}%`, width: `${previewWidth}%` }}
                  className="absolute top-0 h-full bg-white"
                />
              )}
              <span
                style={{ width: `${currentPercent}%` }}
                className={cn('absolute top-0 left-0 h-full', isActive ? 'bg-primary' : 'bg-white')}
              />
              {isActive && (
                <span
                  style={{ left: `${currentPercent}%` }}
                  className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-white"
                />
              )}
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
        {formatTime(tooltipValue)}
      </TooltipContent>
    </Tooltip>
  )
}
