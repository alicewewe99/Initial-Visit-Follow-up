// Playful Mario / Yoshi Coin Sound via Web Audio API (offline-safe, zero network lag)
let audioCtx: AudioContext | null = null;

export function playEffect() {
  // Trigger light haptic vibration if available
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(50);
    } catch {
      // ignore
    }
  }

  // Synthesize iconic two-tone coin sound (B5 -> E6)
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    // B5 note ~987.77 Hz for 0.08s, then jumps to E6 note ~1318.51 Hz for 0.35s
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    gain.gain.setValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  } catch {
    // Fallback to audio URL
    try {
      const audio = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch {
      // ignore
    }
  }
}
