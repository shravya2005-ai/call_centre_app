// Web Audio API Sound Generator for authentic telephony audio feedback
class TelephonyAudio {
  constructor() {
    this.ctx = null;
    this.ringInterval = null;
    this.ringOscillators = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // DTMF standard frequencies
  playDtmf(digit) {
    try {
      this.init();
      if (!this.ctx) return;

      const dtmfFreqs = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        '4': [770, 1209],
        '5': [770, 1336],
        '6': [770, 1477],
        '7': [852, 1209],
        '8': [852, 1336],
        '9': [852, 1477],
        '*': [941, 1209],
        '0': [941, 1336],
        '#': [941, 1477],
      };

      const freqs = dtmfFreqs[digit] || [700, 1200];
      const now = this.ctx.currentTime;
      const duration = 0.15;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.frequency.setValueAtTime(freqs[1], now);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  // Realistic Telephone Ringback tone (400Hz + 450Hz cadence)
  startRingback() {
    this.stopRingback();
    try {
      this.init();
      if (!this.ctx) return;

      const playBurst = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const burstDuration = 1.2;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc1.frequency.setValueAtTime(400, now);
        osc2.frequency.setValueAtTime(450, now);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.setValueAtTime(0.08, now + burstDuration - 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + burstDuration);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + burstDuration);
        osc2.stop(now + burstDuration);
      };

      playBurst();
      this.ringInterval = setInterval(() => {
        playBurst();
      }, 3000);
    } catch (e) {
      console.warn('Ringback error', e);
    }
  }

  stopRingback() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Pleasant connection chime
  playConnectChime() {
    this.stopRingback();
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Connect chime error', e);
    }
  }

  // End call disconnect tone
  playHangupTone() {
    this.stopRingback();
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(425, now);
      osc.frequency.setValueAtTime(320, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Hangup tone error', e);
    }
  }
}

export const telephonySound = new TelephonyAudio();
