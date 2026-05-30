"use client";

type Track = { src: string; cover?: string; title?: string };

type Listener = () => void;

let audio: HTMLAudioElement | null = null;
let _tracks: Track[] = [];
let _index = 0;
let _isPlaying = false;
let _isMuted = false;
let _active = false;
let _releaseTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

function rebuildAudio() {
  if (!audio || !_tracks[_index]) return Promise.reject();
  const src = _tracks[_index].src;
  const wasMuted = _isMuted;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  const a = new Audio(src);
  a.muted = false;
  a.volume = 1;
  a.addEventListener('ended', () => {
    if (_tracks.length > 1) {
      _index = (_index + 1) % _tracks.length;
      if (audio) { audio.src = _tracks[_index].src; audio.load(); }
      audio?.play().then(() => { _isPlaying = true; notify(); }).catch(() => {});
    }
  });
  a.addEventListener('play', () => { _isPlaying = true; notify(); });
  a.addEventListener('pause', () => { _isPlaying = false; notify(); });
  audio = a;
  a.muted = wasMuted;
  return a.play();
}

function ensureAudio() {
  if (typeof window === "undefined") return;
  if (!audio) {
    audio = new Audio();
    audio.addEventListener("ended", () => {
      if (_tracks.length > 1) {
        _index = (_index + 1) % _tracks.length;
        loadTrack();
        audio?.play().then(() => { _isPlaying = true; notify(); }).catch(() => {});
      }
    });
    audio.addEventListener("play", () => { _isPlaying = true; notify(); });
    audio.addEventListener("pause", () => { _isPlaying = false; notify(); });
  }
}

function loadTrack() {
  if (!audio || !_tracks[_index]) return;
  audio.src = _tracks[_index].src;
  audio.load();
}

export const musicStore = {
  init(tracks: Track[]) {
    if (typeof window === "undefined") return;
    ensureAudio();
    const sameTracks = _tracks.length === tracks.length &&
      tracks.every((t, i) => t.src === _tracks[i]?.src);
    _tracks = tracks;
    if (audio && _isPlaying && !audio.paused && sameTracks) return;
    _index = 0;
    if (audio && audio.src !== tracks[0]?.src) {
      audio.muted = _isMuted;
      loadTrack();
      audio.volume = 0;

      const tryPlay = () => {
        if (!audio) return;
        audio.play().then(() => {
          _isPlaying = true;
          notify();
          const start = performance.now();
          const fadeIn = () => {
            if (!audio) return;
            const elapsed = (performance.now() - start) / 1000;
            audio.volume = Math.min(elapsed / 3, 1);
            if (audio.volume < 1) requestAnimationFrame(fadeIn);
          };
          requestAnimationFrame(fadeIn);
        }).catch(() => {});
      };

      tryPlay();

      // WeChat / QQ X5: retry via WeixinJSBridge
      const wx = (window as any).WeixinJSBridge;
      if (wx) wx.invoke('getNetworkType', {}, tryPlay);
      document.addEventListener('WeixinJSBridgeReady', () => {
        (window as any).WeixinJSBridge?.invoke('getNetworkType', {}, tryPlay);
      }, { once: true });
    }
  },

  // Force-play from user gesture (works on all mobile browsers)
  resume() {
    if (!audio || !_tracks[_index]) return;
    audio.muted = true;
    audio.volume = 1;
    audio.play().then(() => {
      if (audio) audio.muted = _isMuted;
    }).catch(() => {
      rebuildAudio().then(() => {
        _isPlaying = true;
        notify();
      }).catch(() => {});
    });
  },

  get tracks() { return _tracks; },
  get index() { return _index; },
  get isPlaying() { return _isPlaying; },
  get isMuted() { return _isMuted; },
  get currentTrack() { return _tracks[_index] ?? _tracks[0]; },
  get audioEl() { return audio; },

  togglePlay() {
    if (!audio) return;
    if (_isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  },

  toggleMute() {
    _isMuted = !_isMuted;
    if (audio) audio.muted = _isMuted;
    notify();
  },

  next() {
    if (_tracks.length <= 1) return;
    _index = (_index + 1) % _tracks.length;
    loadTrack();
    audio?.play().catch(() => {});
    notify();
  },

  prev() {
    if (_tracks.length <= 1) return;
    _index = (_index - 1 + _tracks.length) % _tracks.length;
    loadTrack();
    audio?.play().catch(() => {});
    notify();
  },

  acquire() {
    if (_releaseTimer) { clearTimeout(_releaseTimer); _releaseTimer = null; }
    _active = true;
  },

  release() {
    _active = false;
    if (_releaseTimer) clearTimeout(_releaseTimer);
    _releaseTimer = setTimeout(() => {
      if (!_active && audio && !audio.paused) {
        audio.pause();
        _isPlaying = false;
        notify();
      }
    }, 1000);
  },

  destroy() {
    if (_releaseTimer) clearTimeout(_releaseTimer);
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    _isPlaying = false;
    _active = false;
    notify();
  },

  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
};
