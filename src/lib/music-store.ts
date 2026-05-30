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
    _tracks = tracks;
    if (audio && _isPlaying && !audio.paused) return;
    _index = 0;
    if (audio && audio.src !== tracks[0]?.src) {
      audio.muted = _isMuted;
      loadTrack();
      audio.volume = 0;
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
    }
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
