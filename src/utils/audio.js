// ==============================================================================
// 🎵 CUTE WEB AUDIO API SOUND EFFECTS (No external files needed)
// ==============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playEat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Crunch munch sound sequence
    const times = [0, 0.08, 0.16];
    times.forEach((t) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400 + Math.random() * 200, this.ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + t + 0.06);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + t);
      osc.stop(this.ctx.currentTime + t + 0.07);
    });
  }

  playPet() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // High sweet chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playClean() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Brush sweep & sparkle
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.13);
    });
  }

  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Classic 8-bit coin sound (B5 -> E6)
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Joyful fanfare: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.3);
    });
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playNotification() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Two pleasant bell dings
    [880, 1174.66].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.3);
    });
  }

  playPrank() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Cartoon squish sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playDrink() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Refreshing liquid bubble / gulp sound
    const bubbles = [260, 340, 420];
    bubbles.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const t = this.ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.06);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  playWaterPlant() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Water droplet sprinkle sound
    const drops = [520, 680, 840, 1020];
    drops.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const t = this.ctx.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.05);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  playGashaponRoll() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Mechanical crank & ticking ball roll
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      const t = this.ctx.currentTime + i * 0.09;
      osc.frequency.setValueAtTime(450 + i * 50, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  playPurchase() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Register chime: E5 -> G#5 -> B5
    const freqs = [659.25, 830.61, 987.77];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const t = this.ctx.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  // 🪜 เสียงวิ่งขึ้นบันไดกรง (Pitter-patter ascending steps)
  playClimbStairs() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const steps = [350, 420, 520, 659];
    steps.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      const t = this.ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.04);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    });
  }

  // 🛝 เสียงสไลเดอร์วนลงมาชั้นล่าง (Whimsical slide whoosh)
  playSlideDown() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // 🔭 เสียงส่องกล้องดูดาวบนชั้น 2 (Celestial sparkle chime)
  playStargaze() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const t = this.ctx.currentTime + idx * 0.06;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // 🛋️ เสียงนอนไกวเปลชั้นลอย (Gentle soothing lullaby chime)
  playHammock() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 554.37];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const t = this.ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.24);
    });
  }
}

export const sound = new SoundFX();
