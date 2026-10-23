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

  public seek(seconds: number) {
    this.audio.currentTime = seconds
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
