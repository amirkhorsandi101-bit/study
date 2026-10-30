import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CloudRain, 
  Trees, 
  Wind, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Brain, 
  Layers, 
  Clock, 
  RotateCcw, 
  Headphones, 
  Flame, 
  Waves as WavesIcon, 
  Droplets,
  Bird,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Zap,
  Info
} from 'lucide-react';

export interface SoundEnvironment {
  id: string;
  name: string;
  persianTitle: string;
  category: 'nature' | 'masking' | 'cozy';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  scientificBenefit: string;
  colorScheme: {
    badge: string;
    border: string;
    accent: string;
    glow: string;
    bgHover: string;
  };
  defaultVolume: number;
}

export const SOUND_ENVIRONMENTS: SoundEnvironment[] = [
  {
    id: 'rain',
    name: 'Rain & Thunder',
    persianTitle: 'باران پاییزی و رگبار ملایم',
    category: 'nature',
    icon: CloudRain,
    description: 'صدای ملایم باران با قطرات آب روی شیشه؛ ایجاد پرده صوتی پایدار و ریتم آرام‌بخش قطرات.',
    scientificBenefit: 'کاهش فعالیت سمپاتیک، پایین آوردن فشار خون و کاهش مقاومت روانی شروع درس.',
    colorScheme: {
      badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      border: 'border-sky-500/40',
      accent: 'text-sky-400',
      glow: 'shadow-sky-500/20',
      bgHover: 'hover:border-sky-500/60'
    },
    defaultVolume: 65
  },
  {
    id: 'forest',
    name: 'Forest Canopy',
    persianTitle: 'جنگل بارانی و آواز پرندگان',
    category: 'nature',
    icon: Trees,
    description: 'نسیم در میان شاخ و برگ بلوط‌ها، خش‌خش برگ‌ها و آواز گهگاه پرندگان وحشی در طبیعت.',
    scientificBenefit: 'تحریک تئوری بازیابی توجه (ART) و رفع فرسودگی توجه متمرکز ناشی از ساعات طولانی مطالعه.',
    colorScheme: {
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      bgHover: 'hover:border-emerald-500/60'
    },
    defaultVolume: 60
  },
  {
    id: 'whitenoise',
    name: 'Pure White & Pink Noise',
    persianTitle: 'نویز سفید و عایق آکوستیک',
    category: 'masking',
    icon: Wind,
    description: 'طیف فرکانسی یکدست عایق صدا؛ شبیه جریان ملایم باد پاییزی و آبشار، حذف ۱۰۰٪ مکالمات اتاق.',
    scientificBenefit: 'ایجاد پدیده پوشش فرکانسی (Auditory Masking) و جلوگیری از پرش تمرکز هنگام مکالمه اطرافیان.',
    colorScheme: {
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      border: 'border-cyan-500/40',
      accent: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      bgHover: 'hover:border-cyan-500/60'
    },
    defaultVolume: 50
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    persianTitle: 'امواج آرام و کرانه ساحل',
    category: 'nature',
    icon: WavesIcon,
    description: 'خروش متناوب و ریتمیک امواج دریا هر ۹ ثانیه یک‌بار؛ شبیه‌ساز تنفس دیافراگمی عمیق.',
    scientificBenefit: 'همگام‌سازی نوسانات تنفس با جزر و مد امواج، تسریع ورود به خلسه مطالعه بدون حواس‌پرتی.',
    colorScheme: {
      badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      border: 'border-teal-500/40',
      accent: 'text-teal-400',
      glow: 'shadow-teal-500/20',
      bgHover: 'hover:border-teal-500/60'
    },
    defaultVolume: 55
  },
  {
    id: 'fire',
    name: 'Cozy Campfire',
    persianTitle: 'شومینه هیزمی و ترق‌تروق چوب',
    category: 'cozy',
    icon: Flame,
    description: 'جرقه و ترق‌تروق ملایم چوب بلوط در حال سوختن؛ فضایی گرم، دنج و امن برای مطالعه در شب‌های سرد.',
    scientificBenefit: 'تحریک حس آرامش بیوفیلیک کهن، ایجاد احساس امنیت ذهنی و از بین بردن استرس تپش قلب آزمون.',
    colorScheme: {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/40',
      accent: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      bgHover: 'hover:border-amber-500/60'
    },
    defaultVolume: 45
  },
  {
    id: 'river',
    name: 'Mountain Stream',
    persianTitle: 'رودخانه جاری و سنگریزه‌ها',
    category: 'nature',
    icon: Droplets,
    description: 'جریان مداوم و خنک آب زلال روی سنگ‌های صیقلی کوهستان، یکنواخت و بدون افت و خیز ناگهانی.',
    scientificBenefit: 'بهینه‌سازی امواج تتا و آلفا برای یادگیری پیوسته بدون خستگی لایه قشری مخ.',
    colorScheme: {
      badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      border: 'border-indigo-500/40',
      accent: 'text-indigo-400',
      glow: 'shadow-indigo-500/20',
      bgHover: 'hover:border-indigo-500/60'
    },
    defaultVolume: 50
  }
];

export interface SoundscapePreset {
  id: string;
  title: string;
  description: string;
  activeIds: string[];
  volumes: Record<string, number>;
}

// Presets for quick mood selection
const PRESETS: SoundscapePreset[] = [
  {
    id: 'autumn-study',
    title: 'مطالعه در باران پاییزی',
    description: 'باران شدید + نویز سفید برای ایزولاسیون کامل',
    activeIds: ['rain', 'whitenoise'],
    volumes: { rain: 75, whitenoise: 35 }
  },
  {
    id: 'deep-forest',
    title: 'کتابخانه دنج در جنگل',
    description: 'جنگل و پرندگان + نسیم ملایم رودخانه',
    activeIds: ['forest', 'river'],
    volumes: { forest: 70, river: 45 }
  },
  {
    id: 'night-cabin',
    title: 'خلوت شبانه کنار آتش',
    description: 'آتش هیزمی + باران پشت پنجره',
    activeIds: ['fire', 'rain'],
    volumes: { fire: 65, rain: 40 }
  },
  {
    id: 'pure-shield',
    title: 'عایق کامل صدا (ضد سر و صدا)',
    description: 'نویز سفید ماکسیمم + امواج دریا',
    activeIds: ['whitenoise', 'ocean'],
    volumes: { whitenoise: 80, ocean: 40 }
  }
];

interface AmbientSoundscapeProps {
  onOpenFocusAudio?: () => void;
}

export const AmbientSoundscape: React.FC<AmbientSoundscapeProps> = ({ onOpenFocusAudio }) => {
  // Active environments set
  const [activeEnvs, setActiveEnvs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rahbord_ambient_active_envs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { rain: true, forest: false, whitenoise: false, ocean: false, fire: false, river: false };
  });

  // Volumes for each environment
  const [envVolumes, setEnvVolumes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('rahbord_ambient_volumes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      rain: 65,
      forest: 60,
      whitenoise: 50,
      ocean: 55,
      fire: 45,
      river: 50
    };
  });

  // Global Master Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Binaural Supplement Overlay (Layering with brain waves)
  const [binauralSupplementActive, setBinauralSupplementActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rahbord_binaural_supplement_active');
      return saved === 'true';
    } catch {
      return true;
    }
  });
  const [binauralFrequency, setBinauralFrequency] = useState<'alpha' | 'beta' | 'theta' | 'gamma'>('alpha');
  const [binauralVolume, setBinauralVolume] = useState<number>(40);

  // Auto-off Timer (minutes)
  const [timerDuration, setTimerDuration] = useState<number>(0); // 0 = off, 15, 25, 45, 60
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  // Web Audio Context & Node Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const envGainsRef = useRef<Record<string, GainNode>>({});
  const envNodesRef = useRef<Record<string, any>>({});
  const timerIntervalRef = useRef<any>(null);
  const birdTimerRef = useRef<any>(null);
  const rainDropsTimerRef = useRef<any>(null);
  const fireCrackleTimerRef = useRef<any>(null);
  const binauralNodesRef = useRef<{ oscL?: OscillatorNode; oscR?: OscillatorNode; gain?: GainNode }>({});

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('rahbord_ambient_active_envs', JSON.stringify(activeEnvs));
      localStorage.setItem('rahbord_ambient_volumes', JSON.stringify(envVolumes));
      localStorage.setItem('rahbord_binaural_supplement_active', String(binauralSupplementActive));
    } catch (e) {
      console.error(e);
    }
  }, [activeEnvs, envVolumes, binauralSupplementActive]);

  // Audio Context Initialization
  const getOrCreateAudioContext = (): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();

      const master = ctx.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : masterVolume / 100, ctx.currentTime);
      master.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
    return audioCtxRef.current;
  };

  // Sound Synthesizers for each environment
  // 1. Noise Buffer Generators
  const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown', seconds = 4): AudioBuffer => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'white') {
          data[i] = white * 0.15;
        } else if (type === 'pink') {
          // Paul Kellet's filter method
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        } else {
          // Brown noise
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 1.5;
        }
      }
    }
    return buffer;
  };

  // Stop single sound generator
  const stopEnvGenerator = (id: string) => {
    if (envNodesRef.current[id]) {
      const nodes = envNodesRef.current[id];
      try {
        if (nodes.source) {
          nodes.source.stop();
          nodes.source.disconnect();
        }
        if (nodes.lfo) {
          nodes.lfo.stop();
          nodes.lfo.disconnect();
        }
        if (nodes.gain) {
          nodes.gain.disconnect();
        }
      } catch {}
      delete envNodesRef.current[id];
    }
  };

  // Start specific sound generator
  const startEnvGenerator = (id: string, ctx: AudioContext, master: GainNode) => {
    stopEnvGenerator(id);

    const now = ctx.currentTime;
    const envGain = ctx.createGain();
    const vol = (envVolumes[id] ?? 50) / 100;
    envGain.gain.setValueAtTime(vol, now);
    envGain.connect(master);
    envGainsRef.current[id] = envGain;

    if (id === 'rain') {
      // Pink noise + lowpass + gentle random drop pings
      const pinkBuffer = createNoiseBuffer(ctx, 'pink', 4);
      const source = ctx.createBufferSource();
      source.buffer = pinkBuffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1100, now);

      source.connect(lowpass);
      lowpass.connect(envGain);
      source.start();

      envNodesRef.current[id] = { source, gain: envGain };

      // Periodic random soft rain drop taps
      if (!rainDropsTimerRef.current) {
        rainDropsTimerRef.current = setInterval(() => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !activeEnvs['rain']) return;
          try {
            const dropTime = audioCtxRef.current.currentTime;
            const dropOsc = audioCtxRef.current.createOscillator();
            const dropGain = audioCtxRef.current.createGain();
            const dropFreq = 1600 + Math.random() * 2400; // 1.6k to 4kHz
            dropOsc.frequency.setValueAtTime(dropFreq, dropTime);
            dropOsc.frequency.exponentialRampToValueAtTime(800, dropTime + 0.04);

            dropGain.gain.setValueAtTime(0.001, dropTime);
            dropGain.gain.linearRampToValueAtTime(0.03, dropTime + 0.005);
            dropGain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.04);

            dropOsc.connect(dropGain);
            if (envGainsRef.current['rain']) {
              dropGain.connect(envGainsRef.current['rain']);
            }
            dropOsc.start(dropTime);
            dropOsc.stop(dropTime + 0.05);
          } catch {}
        }, 120);
      }
    } else if (id === 'forest') {
      // Wind breeze through leaves (filtered noise + slow LFO)
      const pinkBuffer = createNoiseBuffer(ctx, 'pink', 5);
      const source = ctx.createBufferSource();
      source.buffer = pinkBuffer;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(750, now);
      bandpass.Q.setValueAtTime(1.5, now);

      // LFO to create wind swell
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, now); // ~8 sec breeze wave
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, now);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      source.connect(bandpass);
      bandpass.connect(envGain);
      source.start();
      lfo.start();

      envNodesRef.current[id] = { source, lfo, gain: envGain };

      // Realistic procedural bird chirping scheduled every 4-8 seconds
      if (!birdTimerRef.current) {
        const scheduleNextBird = () => {
          const delay = 3500 + Math.random() * 4500;
          birdTimerRef.current = setTimeout(() => {
            if (audioCtxRef.current && audioCtxRef.current.state === 'running' && activeEnvs['forest']) {
              playProceduralBirdCall(audioCtxRef.current, envGainsRef.current['forest']);
            }
            scheduleNextBird();
          }, delay);
        };
        scheduleNextBird();
      }
    } else if (id === 'whitenoise') {
      // Pure smooth White & Pink acoustic masking noise
      const whiteBuffer = createNoiseBuffer(ctx, 'white', 3);
      const source = ctx.createBufferSource();
      source.buffer = whiteBuffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1800, now);

      source.connect(lowpass);
      lowpass.connect(envGain);
      source.start();

      envNodesRef.current[id] = { source, gain: envGain };
    } else if (id === 'ocean') {
      // Deep brown noise modulated by slow LFO for wave surges
      const brownBuffer = createNoiseBuffer(ctx, 'brown', 6);
      const source = ctx.createBufferSource();
      source.buffer = brownBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.1, now); // 10 second wave cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(350, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      source.connect(filter);
      filter.connect(envGain);
      source.start();
      lfo.start();

      envNodesRef.current[id] = { source, lfo, gain: envGain };
    } else if (id === 'fire') {
      // Warm low hum + procedural random crackle snaps
      const brownBuffer = createNoiseBuffer(ctx, 'brown', 3);
      const source = ctx.createBufferSource();
      source.buffer = brownBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      source.connect(filter);
      filter.connect(envGain);
      source.start();

      envNodesRef.current[id] = { source, gain: envGain };

      // Wood crackle impulses
      if (!fireCrackleTimerRef.current) {
        fireCrackleTimerRef.current = setInterval(() => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !activeEnvs['fire']) return;
          if (Math.random() < 0.65) {
            try {
              const snapTime = audioCtxRef.current.currentTime;
              const snapOsc = audioCtxRef.current.createOscillator();
              const snapFilter = audioCtxRef.current.createBiquadFilter();
              const snapGain = audioCtxRef.current.createGain();

              snapOsc.type = 'sawtooth';
              snapOsc.frequency.setValueAtTime(1800 + Math.random() * 2200, snapTime);
              snapFilter.type = 'bandpass';
              snapFilter.frequency.setValueAtTime(2400, snapTime);
              snapFilter.Q.setValueAtTime(3.0, snapTime);

              snapGain.gain.setValueAtTime(0.001, snapTime);
              snapGain.gain.linearRampToValueAtTime(0.05 * Math.random(), snapTime + 0.002);
              snapGain.gain.exponentialRampToValueAtTime(0.0001, snapTime + 0.015);

              snapOsc.connect(snapFilter);
              snapFilter.connect(snapGain);
              if (envGainsRef.current['fire']) {
                snapGain.connect(envGainsRef.current['fire']);
              }
              snapOsc.start(snapTime);
              snapOsc.stop(snapTime + 0.02);
            } catch {}
          }
        }, 80);
      }
    } else if (id === 'river') {
      // Pink noise + dual bandpass for burbling water stream
      const pinkBuffer = createNoiseBuffer(ctx, 'pink', 4);
      const source = ctx.createBufferSource();
      source.buffer = pinkBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(1.8, now);

      source.connect(filter);
      filter.connect(envGain);
      source.start();

      envNodesRef.current[id] = { source, gain: envGain };
    }
  };

  // Synthesize bird chirp pattern with gentle musical pitch curves
  const playProceduralBirdCall = (ctx: AudioContext, outputGain?: GainNode) => {
    if (!outputGain) return;
    try {
      const now = ctx.currentTime;
      const numChirps = 2 + Math.floor(Math.random() * 3);
      const baseFreq = 2800 + Math.random() * 800; // 2800Hz - 3600Hz

      for (let i = 0; i < numChirps; i++) {
        const chirpStart = now + i * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Pitch sweep: fast up and down
        osc.frequency.setValueAtTime(baseFreq + (i % 2 === 0 ? 0 : 300), chirpStart);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 1200, chirpStart + 0.04);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, chirpStart + 0.09);

        gain.gain.setValueAtTime(0.0001, chirpStart);
        gain.gain.linearRampToValueAtTime(0.045, chirpStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.1);

        osc.connect(gain);
        gain.connect(outputGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.11);
      }
    } catch {}
  };

  // Binaural Supplement Layer Synthesizer
  const updateBinauralSupplement = (ctx: AudioContext, master: GainNode) => {
    // Clean existing binaural nodes
    if (binauralNodesRef.current.oscL) {
      try { binauralNodesRef.current.oscL.stop(); binauralNodesRef.current.oscL.disconnect(); } catch {}
    }
    if (binauralNodesRef.current.oscR) {
      try { binauralNodesRef.current.oscR.stop(); binauralNodesRef.current.oscR.disconnect(); } catch {}
    }
    if (binauralNodesRef.current.gain) {
      try { binauralNodesRef.current.gain.disconnect(); } catch {}
    }
    binauralNodesRef.current = {};

    if (!binauralSupplementActive || !isPlaying) return;

    const freqs: Record<string, { base: number; diff: number }> = {
      alpha: { base: 210, diff: 10 },
      beta: { base: 220, diff: 18 },
      theta: { base: 190, diff: 6 },
      gamma: { base: 240, diff: 40 }
    };

    const cfg = freqs[binauralFrequency] || freqs.alpha;
    const now = ctx.currentTime;

    const merger = ctx.createChannelMerger(2);
    const bGain = ctx.createGain();
    bGain.gain.setValueAtTime((binauralVolume / 100) * 0.4, now);

    // Left Ear
    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(cfg.base, now);
    const gainL = ctx.createGain();
    gainL.gain.setValueAtTime(0.25, now);
    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    // Right Ear
    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(cfg.base + cfg.diff, now);
    const gainR = ctx.createGain();
    gainR.gain.setValueAtTime(0.25, now);
    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    merger.connect(bGain);
    bGain.connect(master);

    oscL.start();
    oscR.start();

    binauralNodesRef.current = { oscL, oscR, gain: bGain };
  };

  // Start soundscape playback
  const startSoundscape = () => {
    const ctx = getOrCreateAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const master = masterGainRef.current;
    if (!master) return;

    // Start all active environments
    SOUND_ENVIRONMENTS.forEach(env => {
      if (activeEnvs[env.id]) {
        startEnvGenerator(env.id, ctx, master);
      } else {
        stopEnvGenerator(env.id);
      }
    });

    // Start Binaural Supplement if enabled
    updateBinauralSupplement(ctx, master);
    setIsPlaying(true);
  };

  // Stop soundscape playback
  const stopSoundscape = () => {
    SOUND_ENVIRONMENTS.forEach(env => {
      stopEnvGenerator(env.id);
    });

    if (rainDropsTimerRef.current) {
      clearInterval(rainDropsTimerRef.current);
      rainDropsTimerRef.current = null;
    }
    if (birdTimerRef.current) {
      clearTimeout(birdTimerRef.current);
      birdTimerRef.current = null;
    }
    if (fireCrackleTimerRef.current) {
      clearInterval(fireCrackleTimerRef.current);
      fireCrackleTimerRef.current = null;
    }

    if (binauralNodesRef.current.oscL) {
      try { binauralNodesRef.current.oscL.stop(); binauralNodesRef.current.oscL.disconnect(); } catch {}
    }
    if (binauralNodesRef.current.oscR) {
      try { binauralNodesRef.current.oscR.stop(); binauralNodesRef.current.oscR.disconnect(); } catch {}
    }
    binauralNodesRef.current = {};

    setIsPlaying(false);
  };

  const toggleSoundscape = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  // Toggle single environment
  const toggleEnv = (id: string) => {
    const nextState = !activeEnvs[id];
    setActiveEnvs(prev => ({ ...prev, [id]: nextState }));

    if (isPlaying && audioCtxRef.current && masterGainRef.current) {
      if (nextState) {
        startEnvGenerator(id, audioCtxRef.current, masterGainRef.current);
      } else {
        stopEnvGenerator(id);
      }
    }
  };

  // Handle environment volume slider
  const handleEnvVolumeChange = (id: string, val: number) => {
    setEnvVolumes(prev => ({ ...prev, [id]: val }));
    const gainNode = envGainsRef.current[id];
    if (gainNode && audioCtxRef.current) {
      gainNode.gain.setTargetAtTime(val / 100, audioCtxRef.current.currentTime, 0.05);
    }
  };

  // Master volume real-time sync
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : masterVolume / 100;
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume, isMuted]);

  // Binaural volume & frequency sync
  useEffect(() => {
    if (audioCtxRef.current && masterGainRef.current && isPlaying) {
      updateBinauralSupplement(audioCtxRef.current, masterGainRef.current);
    }
  }, [binauralSupplementActive, binauralFrequency, binauralVolume]);

  // Preset Selection
  const applyPreset = (preset: SoundscapePreset) => {
    const newActives: Record<string, boolean> = {
      rain: false, forest: false, whitenoise: false, ocean: false, fire: false, river: false
    };
    preset.activeIds.forEach(id => {
      newActives[id] = true;
    });

    const newVols: Record<string, number> = { ...envVolumes, ...preset.volumes };

    setActiveEnvs(newActives);
    setEnvVolumes(newVols);

    if (isPlaying && audioCtxRef.current && masterGainRef.current) {
      SOUND_ENVIRONMENTS.forEach(env => {
        if (newActives[env.id]) {
          startEnvGenerator(env.id, audioCtxRef.current!, masterGainRef.current!);
          if (envGainsRef.current[env.id]) {
            envGainsRef.current[env.id].gain.setValueAtTime((newVols[env.id] ?? 50) / 100, audioCtxRef.current!.currentTime);
          }
        } else {
          stopEnvGenerator(env.id);
        }
      });
    }
  };

  // Auto-off Timer countdown
  useEffect(() => {
    if (timerDuration > 0 && isPlaying) {
      setTimerRemaining(timerDuration * 60);

      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current);
            stopSoundscape();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimerRemaining(null);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerDuration, isPlaying]);

  // Format seconds MM:SS
  const formatTimer = (totalSeconds: number | null) => {
    if (totalSeconds === null) return '--:--';
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Clean on unmount
  useEffect(() => {
    return () => {
      stopSoundscape();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  const activeCount = useMemo(() => {
    return Object.values(activeEnvs).filter(Boolean).length;
  }, [activeEnvs]);

  return (
    <div className="space-y-8 text-right">
      {/* Top Hero Card: Ambient Soundscape Hub */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 sm:p-8 ${
        isPlaying 
          ? 'bg-slate-900/95 border-emerald-500/50 shadow-2xl shadow-emerald-500/10' 
          : 'bg-slate-900/80 border-slate-800 shadow-xl'
      }`}>
        {/* Glow Effects */}
        {isPlaying && (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                isPlaying 
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-400/30 ring-2 ring-emerald-400/50 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    کنترل پنل چشم‌انداز صوتی طبیعت (Ambient Soundscape)
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isPlaying 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {isPlaying ? `در حال پخش (${activeCount} لایه فعال)` : 'آماده پخش'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  سنتز پیوسته اصوات ارگانیک طبیعت (باران، جنگل، نویز سفید و آبشار) با قابلیت ترکیب همزمان با امواج مغزی بینورال جهت ایزولاسیون کامل حواس.
                </p>
              </div>
            </div>

            {/* Play Button & Master Volume */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              <button
                onClick={toggleSoundscape}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>توقف پخش صدا</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>پخش چشم‌انداز صوتی</span>
                  </>
                )}
              </button>

              {/* Master Volume */}
              <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title={isMuted ? 'لغو بی‌صدا' : 'بی‌صدا'}
                >
                  {isMuted || masterVolume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : masterVolume < 40 ? (
                    <Volume1 className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : masterVolume}
                  onChange={(e) => {
                    setMasterVolume(Number(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-20 sm:w-24 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  title="بلندی صدای کل"
                />
                <span className="text-[11px] font-mono text-slate-400 w-8 text-left">
                  {isMuted ? '0%' : `${masterVolume}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Soundscape Mood Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>فضاهای صوتی پیشنهادی (Quick Presets):</span>
              </span>
              <span className="text-[11px] text-slate-500">انتخاب تک‌کلیک جهت هماهنگی لایه‌ها</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESETS.map(preset => {
                const isSelected = preset.activeIds.every(id => activeEnvs[id]) && 
                  Object.entries(activeEnvs).filter(([id, val]) => val).length === preset.activeIds.length;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 text-white ring-1 ring-emerald-400/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{preset.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supplement Binaural Beats Section (Crucial Feature Requested) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-indigo-950/30 border border-amber-500/30 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      هم‌نوازی با امواج بینورال (Binaural Beats Supplement)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      تقویت امواج مغزی
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                    با فعال‌سازی این گزینه، امواج مغزی بینورال دقیقاً زیر لایه صدای طبیعت (باران یا جنگل) ادغام می‌شوند تا در حین لذت بردن از اتمسفر، امواج آلفا/بتا نیز فعال شوند.
                  </p>
                </div>
              </div>

              {/* Binaural Toggle & Selector */}
              <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: 'alpha', label: 'آلفا (۱۰Hz) آرامش', color: 'text-amber-400' },
                    { id: 'beta', label: 'بتا (۱۸Hz) استدلال', color: 'text-sky-400' },
                    { id: 'theta', label: 'تتا (۶Hz) تثبیت', color: 'text-emerald-400' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBinauralFrequency(b.id as any)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        binauralFrequency === b.id
                          ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                {/* Binaural Volume Slider */}
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={binauralVolume}
                    onChange={(e) => setBinauralVolume(Number(e.target.value))}
                    disabled={!binauralSupplementActive}
                    className="w-16 accent-amber-400 cursor-pointer h-1 bg-slate-800 rounded-lg"
                    title="شدت موج بینورال هم‌نوا"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-6 text-left">{binauralVolume}%</span>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => setBinauralSupplementActive(!binauralSupplementActive)}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                    binauralSupplementActive ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                  title={binauralSupplementActive ? 'غیرفعال‌سازی هم‌نوازی بینورال' : 'فعال‌سازی هم‌نوازی بینورال'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                      binauralSupplementActive ? 'translate-x-1' : 'translate-x-7'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Layer Environment Sound Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>لایه‌های چشم‌انداز صوتی (قابلیت فعال‌سازی همزمان چند لایه):</span>
              </span>
              <span className="text-[11px] text-slate-400">
                هر لایه را روشن کنید و شدت آن را با اسلایدر تنظیم نمایید
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOUND_ENVIRONMENTS.map(env => {
                const isActive = !!activeEnvs[env.id];
                const IconComponent = env.icon;
                const volume = envVolumes[env.id] ?? 50;

                return (
                  <div
                    key={env.id}
                    className={`relative rounded-2xl border p-4.5 transition-all flex flex-col justify-between ${
                      isActive
                        ? `bg-slate-950 border-emerald-400/80 ring-1 ring-emerald-400/30 ${env.colorScheme.glow}`
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{env.persianTitle}</span>
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {env.name}
                            </span>
                          </div>
                        </div>

                        {/* Toggle Checkbox Button */}
                        <button
                          onClick={() => toggleEnv(env.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-400 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                          }`}
                        >
                          {isActive ? 'فعال ✓' : 'روشن کردن'}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed min-h-[38px]">
                        {env.description}
                      </p>

                      {/* Scientific benefit pill */}
                      <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-850 text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-300 font-semibold block mb-0.5">اثر نوروفیزیولوژیک:</span>
                        {env.scientificBenefit}
                      </div>
                    </div>

                    {/* Volume Slider Section */}
                    <div className="mt-4 pt-3 border-t border-slate-850 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-slate-500" />
                          <span>شدت این لایه:</span>
                        </span>
                        <span className="font-mono text-emerald-300 font-bold">{volume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleEnvVolumeChange(env.id, Number(e.target.value))}
                        disabled={!isActive}
                        className={`w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Smart Study Sleep/Focus Timer & Scientific Footnote */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Auto-Off Timer */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>تایمر خاموشی خودکار (Focus Sleep Timer):</span>
                </span>
                {timerRemaining !== null && (
                  <span className="text-xs font-mono font-bold text-sky-400 animate-pulse">
                    {formatTimer(timerRemaining)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { m: 0, label: 'نامحدود' },
                  { m: 15, label: '۱۵ د' },
                  { m: 25, label: '۲۵ د (پومودورو)' },
                  { m: 45, label: '۴۵ د' },
                  { m: 90, label: '۹۰ د (چرخه مغز)' },
                ].map(t => (
                  <button
                    key={t.m}
                    onClick={() => setTimerDuration(t.m)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      timerDuration === t.m
                        ? 'bg-sky-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific Masking Principle */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">قانون علمی رزونانس تصادفی (Stochastic Resonance):</strong> افزودن نویز طبیعی ملایم به محیط مطالعه آستانه شنوایی را پایدار ساخته و نویزهای ناگهانی خانه (زنگ در، صدای تلویزیون یا مکالمه) را در موج صدای پس‌زمینه محو می‌کند تا مدار توجه در کورتکس پیش‌پیشانی دچار انقطاع نشود.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
