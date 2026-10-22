export class AudioEngine {
  private audio = new Audio()
  private abortController = new AbortController()
  private cancelPendingSeek: (() => void) | null = null

  constructor(volume: number) {
    this.audio.volume = volume
  }

  public get error() {
    return this.audio.error
  }

  public get currentTime() {
    return this.audio.currentTime
  }

  public get volume() {
    return this.audio.volume
  }

  public setSrc(src: string) {
    this.cancelPendingSeek?.()
    this.audio.src = src
  }

  public async play() {
    try {
      await this.audio.play()
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      throw e
    }
  }

  public pause() {
    this.audio.pause()
  }

  public subscribe<K extends keyof HTMLMediaElementEventMap>(
    eventName: K,
    callback: (event: HTMLMediaElementEventMap[K]) => void,
  ) {
    this.audio.addEventListener(eventName, callback, {
      signal: this.abortController.signal,
    })

    return () => {
      this.audio.removeEventListener(eventName, callback)
    }
  }

  public seek(seconds: number): Promise<number> {
    this.cancelPendingSeek?.()

    const duration = this.audio.duration
    const maxTime = Number.isFinite(duration) ? duration : Number.POSITIVE_INFINITY
    const target = Math.min(Math.max(0, seconds), maxTime)

    return new Promise((resolve, reject) => {
      let timeout: number

      const cleanup = () => {
        this.audio.removeEventListener('seeked', handleSeeked)
        this.audio.removeEventListener('error', handleError)
        if (timeout !== undefined) clearTimeout(timeout)
        if (this.cancelPendingSeek === cancel) this.cancelPendingSeek = null
      }

      const finish = (callback: () => void) => {
        cleanup()
        callback()
      }

      const handleSeeked = () => {
        if (this.audio.seeking) return
        if (Math.abs(this.audio.currentTime - target) > 0.5) {
          finish(() => reject(new Error('Audio seek did not reach the requested position')))
          return
        }
        finish(() => resolve(this.audio.currentTime))
      }

      const handleError = () => {
        finish(() => reject(new Error('Audio seek failed')))
      }

      const cancel = () => {
        finish(() => reject(new DOMException('Audio seek was cancelled', 'AbortError')))
      }

      this.cancelPendingSeek = cancel
      this.audio.addEventListener('seeked', handleSeeked)
      this.audio.addEventListener('error', handleError)

      try {
        this.audio.currentTime = target
      } catch (error) {
        finish(() => reject(error))
        return
      }

      if (!this.audio.seeking && Math.abs(this.audio.currentTime - target) <= 0.05) {
        finish(() => resolve(this.audio.currentTime))
        return
      }

      timeout = setTimeout(() => {
        finish(() => reject(new Error('Audio seek timed out')))
      }, 5000)
    })
  }

  public setVolume(volume: number) {
    this.audio.volume = volume
  }

  public destroy() {
    this.cancelPendingSeek?.()
    this.abortController.abort()
    this.abortController = new AbortController()

    this.audio.pause()
    this.audio.removeAttribute('src')
    this.audio.load()
  }
}
