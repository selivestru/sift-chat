export class AudioEngine {
  private audio = new Audio()
  private abortController = new AbortController()

  constructor() {
    this.audio.volume = 0.5
  }

  public get error() {
    return this.audio.error
  }

  public setSrc(src: string) {
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

  public destroy() {
    this.abortController.abort()
    this.abortController = new AbortController()

    this.audio.pause()
    this.audio.removeAttribute('src')
    this.audio.load()
  }
}
