import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Sparkles, 
  Brain, 
  Zap, 
  Activity, 
  Music, 
  CloudRain, 
  Waves, 
  Info, 
  Sliders, 
  SkipForward, 
  SkipBack,
  RotateCcw,
  Check,
  Radio,
  Trees
} from 'lucide-react';

export interface FocusTrack {
  id: string;
  name: string;
  category: 'binaural' | 'lofi' | 'ambient';
  categoryLabel: string;
  waveTag: string;
  frequencyText: string;
  baseFreq: number; // Hz (Carrier)
  beatFreq: number; // Difference Hz (for binaural effect)
  ambientType: 'none' | 'brown' | 'rain' | 'tape' | 'drone';
  description: string;
  benefits: string[];
  recommendedSubjects: string;
  colorScheme: {
    accent: string;
    border: string;
    badge: string;
    glow: string;
  };
}

export const CURATED_TRACKS: FocusTrack[] = [
  {
    id: 'alpha-flow',
    name: 'امواج آلفا (Alpha Flow - 10Hz)',
    category: 'binaural',
    categoryLabel: 'امواج مغزی بینورال',
    waveTag: 'آلفا ۱۰ هرتز',
    frequencyText: 'پایه: ۲۱۰Hz | تفاضل گوش‌ها: ۱۰Hz',
    baseFreq: 210,
    beatFreq: 10,
    ambientType: 'none',
    description: 'تحریک ریتم آلفای مغزی؛ ایجاد حالت آرامش هشیار (Relaxed Alertness) و حذف استرس مطالعه.',
    benefits: ['جذب بدون تقلا مطالب سنگین', 'کاهش کورتیزول و اضطراب آزمون', 'حفظ انرژی شناختی برای ساعات طولانی'],
    recommendedSubjects: 'زیست‌شناسی، شیمی، درک مطلب ادبیات و فلسفه',
    colorScheme: {
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      glow: 'shadow-amber-500/10'
    }
  },
  {
    id: 'beta-intellect',
    name: 'امواج بتا (Beta Focus - 18Hz)',
    category: 'binaural',
    categoryLabel: 'امواج مغزی بینورال',
    waveTag: 'بتا ۱۸ هرتز',
    frequencyText: 'پایه: ۲۲۰Hz | تفاضل گوش‌ها: ۱۸Hz',
    baseFreq: 220,
    beatFreq: 18,
    ambientType: 'none',
    description: 'فرکانس هشیاری منطقی، تمرکز لیزری و افزایش سرعت محاسبات تحلیلی مغز.',
    benefits: ['تسریع سرعت استدلال ریاضی', 'کاهش خطاهای بی‌دقتی محاسباتی', 'غلبه بر خواب‌آلودگی بعدازظهر'],
    recommendedSubjects: 'ریاضیات، هندسه، فیزیک، مسائل ژنتیک و شیمی محاسباتی',
    colorScheme: {
      accent: 'text-sky-400',
      border: 'border-sky-500/40',
      badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      glow: 'shadow-sky-500/10'
    }
  },
  {
    id: 'theta-recall',
    name: 'امواج تتا (Theta Memory - 6Hz)',
    category: 'binaural',
    categoryLabel: 'امواج مغزی بینورال',
    waveTag: 'تتا ۶ هرتز',
    frequencyText: 'پایه: ۱۹۰Hz | تفاضل گوش‌ها: ۶Hz',
    baseFreq: 190,
    beatFreq: 6,
    ambientType: 'none',
    description: 'دسترسی به لایه‌های عمیق نوروپلاستیسیتی و کدگذاری داده‌ها در هیپوکامپ مغز.',
    benefits: ['تثبیت فلش‌کارت‌ها در حافظه بلندمدت', 'تسریع مرورهای ابینگهاوس', 'اتصال مفاهیم پراکنده به یکدیگر'],
    recommendedSubjects: 'حفظیات تاریخ، لغات زبان انگلیسی/عربی، فرمول‌ها و نکات آزمون',
    colorScheme: {
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-emerald-500/10'
    }
  },
  {
    id: 'gamma-peak',
    name: 'امواج گاما (Gamma Peak - 40Hz)',
    category: 'binaural',
    categoryLabel: 'امواج مغزی بینورال',
    waveTag: 'گاما ۴۰ هرتز',
    frequencyText: 'پایه: ۲۴۰Hz | تفاضل گوش‌ها: ۴۰Hz',
    baseFreq: 240,
    beatFreq: 40,
    ambientType: 'none',
    description: 'بالاترین تراز همگام‌سازی نیمکره‌های مغزی برای حل تست‌های چندوجهی و آزمون‌های جامع.',
    benefits: ['یکپارچه‌سازی همزمان داده‌های مختلف', 'افزایش تمرکز در آزمون‌های آزمایشی', 'تحلیل تست‌های ترکیبی دشوار'],
    recommendedSubjects: 'آزمون‌های جامع زمان‌دار، جمع‌بندی کنکور، سوالات سخت تیزهوشان',
    colorScheme: {
      accent: 'text-purple-400',
      border: 'border-purple-500/40',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      glow: 'shadow-purple-500/10'
    }
  },
  {
    id: 'lofi-study-chords',
    name: 'لوفای پیانو و نوار کاست (Warm Lo-Fi Study)',
    category: 'lofi',
    categoryLabel: 'موسیقی لوفای آرامش‌بخش',
    waveTag: 'هارمونی آرام Dm9',
    frequencyText: 'پدهای ملودیک پیانو لوفای + نویز نوار وینیل',
    baseFreq: 0,
    beatFreq: 0,
    ambientType: 'tape',
    description: 'توالی آکوردهای گرم و ملودیک نئوسول لوفای با پدهای آرام و بافت آنالوگ نوار کاست برای خلوت مطالعه.',
    benefits: ['ایجاد فضای صوتی دنج و بدون کلام', 'جلوگیری از انحراف توجه به افکار مزاحم', 'افزایش تاب‌آوری برای مطالعه طولانی'],
    recommendedSubjects: 'مطالعه روزمره تمام دروس، خلاصه‌نویسی و حل تست‌های طبقه‌بندی شده',
    colorScheme: {
      accent: 'text-rose-400',
      border: 'border-rose-500/40',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      glow: 'shadow-rose-500/10'
    }
  },
  {
    id: 'rain-brown-noise',
    name: 'نویز قهوه‌ای عمیق و باران (Deep Brown Noise)',
    category: 'ambient',
    categoryLabel: 'عایق صوتی و ضد حواس‌پرتی',
    waveTag: 'طیف فرکانسی Brown',
    frequencyText: 'فرکانس‌های بم کاهنده حواس‌پرتی + قطرات باران',
    baseFreq: 0,
    beatFreq: 0,
    ambientType: 'brown',
    description: 'مسدودسازی نویز محیط خانه (صدای تلویزیون، رفت‌وآمد و مکالمات) با استفاده از نویز قهوه‌ای علمی.',
    benefits: ['پوشش ۹۰٪ صداهای محیطی مزاحم', 'افزایش چشمگیر فوکوس در افراد دارای ADHD', 'تنظیم ریتم تنفس و آرامش اعصاب'],
    recommendedSubjects: 'مطالعه در محیط‌های شلوغ یا آپارتمانی، حل تمرین‌های طولانی',
    colorScheme: {
      accent: 'text-teal-400',
      border: 'border-teal-500/40',
      badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      glow: 'shadow-teal-500/10'
    }
  },
  {
    id: 'cosmic-drone',
    name: 'امبینت خلأ کیهانی (Deep Space Drone)',
    category: 'ambient',
    categoryLabel: 'امبینت غوطه‌وری صوتی',
    waveTag: 'هارمونیک ۱۱۰ هرتز',
    frequencyText: 'پدهای طنین‌انداز بم + فضای استریو سه‌بعدی',
    baseFreq: 110,
    beatFreq: 4,
    ambientType: 'drone',
    description: 'امبینت پهناور و ملایم با اکوی عمیق کیهانی، ایده‌آل برای مطالعه شبانه در سکوت مطلق.',
    benefits: ['ورود به وضعیت غرقگی شناختی (Flow State)', 'آرامش ذهن‌های پرمشغله', 'حذف احساس تنهایی هنگام مطالعه شبانه'],
    recommendedSubjects: 'مطالعه شبانه، آزمون‌های شبیه‌ساز و رسم نمودارهای مفهومی',
    colorScheme: {
      accent: 'text-indigo-400',
      border: 'border-indigo-500/40',
      badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      glow: 'shadow-indigo-500/10'
    }
  }
];

interface FocusAudioPlayerProps {
  isFocusModeActive: boolean;
  onToggleFocusMode: (active: boolean) => void;
  pomoPhase?: 'study' | 'recall' | 'break';
  isPomoRunning?: boolean;
  onOpenAmbientSoundscape?: () => void;
}

export const FocusAudioPlayer: React.FC<FocusAudioPlayerProps> = ({
  isFocusModeActive,
  onToggleFocusMode,
  pomoPhase = 'study',
  isPomoRunning = false,
  onOpenAmbientSoundscape
}) => {
  // Settings State
  const [selectedTrackId, setSelectedTrackId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rahbord_focus_selected_track');
      return saved || 'alpha-flow';
    } catch {
      return 'alpha-flow';
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(75);
  const [binauralVolume, setBinauralVolume] = useState<number>(70);
  const [ambientVolume, setAmbientVolume] = useState<number>(45);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'binaural' | 'lofi' | 'ambient'>('all');
  const [syncWithPomodoro, setSyncWithPomodoro] = useState<boolean>(true);
  const [showAdvancedMixer, setShowAdvancedMixer] = useState<boolean>(false);

  // Audio Graph Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const binauralGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lofiChordTimerRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Visualizer Bars State
  const [frequencyBars, setFrequencyBars] = useState<number[]>(new Array(16).fill(10));

  const currentTrack = useMemo(() => {
    return CURATED_TRACKS.find(t => t.id === selectedTrackId) || CURATED_TRACKS[0];
  }, [selectedTrackId]);

  // Save selection
  useEffect(() => {
    try {
      localStorage.setItem('rahbord_focus_selected_track', selectedTrackId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedTrackId]);

  // Ensure Audio Context
  const getOrCreateAudioContext = (): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      
      const master = ctx.createGain();
      master.gain.setValueAtTime((isMuted ? 0 : masterVolume / 100), ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const binauralGain = ctx.createGain();
      binauralGain.gain.setValueAtTime(binauralVolume / 100, ctx.currentTime);

      const ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(ambientVolume / 100, ctx.currentTime);

      binauralGain.connect(analyser);
      ambientGain.connect(analyser);
      analyser.connect(master);
      master.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;
      binauralGainRef.current = binauralGain;
      ambientGainRef.current = ambientGain;
    }
    return audioCtxRef.current;
  };

  // Generate Authentic Brown Noise buffer (Scientifically calibrated for focus)
  const createBrownNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 4; // 4 seconds looped
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 2.8; // boost output
      }
    }
    return buffer;
  };

  // Generate Lo-Fi Tape / Vinyl Warmth noise buffer
  const createTapeNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Soft pink noise with occasional tiny vinyl pops
        const crackle = Math.random() < 0.0008 ? (Math.random() * 0.4 - 0.2) : 0;
        data[i] = (Math.random() * 0.05 - 0.025) + crackle;
      }
    }
    return buffer;
  };

  // Stop All Current Audio Generators cleanly
  const stopAudioGenerators = () => {
    if (oscLeftRef.current) {
      try { oscLeftRef.current.stop(); oscLeftRef.current.disconnect(); } catch {}
      oscLeftRef.current = null;
    }
    if (oscRightRef.current) {
      try { oscRightRef.current.stop(); oscRightRef.current.disconnect(); } catch {}
      oscRightRef.current = null;
    }
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); noiseSourceRef.current.disconnect(); } catch {}
      noiseSourceRef.current = null;
    }
    if (lofiChordTimerRef.current) {
      clearInterval(lofiChordTimerRef.current);
      lofiChordTimerRef.current = null;
    }
  };

  // Start sound graph for a track
  const startAudioGraph = (track: FocusTrack) => {
    const ctx = getOrCreateAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    stopAudioGenerators();

    const now = ctx.currentTime;

    // 1. Setup Binaural Beat or Drone
    if (track.baseFreq > 0) {
      const merger = ctx.createChannelMerger(2);

      // Left Channel Oscillator
      const oscL = ctx.createOscillator();
      oscL.type = track.category === 'ambient' ? 'triangle' : 'sine';
      oscL.frequency.setValueAtTime(track.baseFreq, now);

      const gainL = ctx.createGain();
      gainL.gain.setValueAtTime(0.3, now);
      oscL.connect(gainL);
      gainL.connect(merger, 0, 0); // Output 0 to channel 0 (Left ear)

      // Right Channel Oscillator (Carrier + Beat difference)
      const oscR = ctx.createOscillator();
      oscR.type = track.category === 'ambient' ? 'triangle' : 'sine';
      oscR.frequency.setValueAtTime(track.baseFreq + track.beatFreq, now);

      const gainR = ctx.createGain();
      gainR.gain.setValueAtTime(0.3, now);
      oscR.connect(gainR);
      gainR.connect(merger, 0, 1); // Output 0 to channel 1 (Right ear)

      if (binauralGainRef.current) {
        merger.connect(binauralGainRef.current);
      }

      oscL.start();
      oscR.start();

      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
    }

    // 2. Setup Ambient Noise / Lo-Fi Layer
    if (track.ambientType === 'brown' || track.ambientType === 'rain') {
      const brownBuffer = createBrownNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = brownBuffer;
      noiseSource.loop = true;

      // Filter: warm low-pass for rain/brown focus
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(track.ambientType === 'rain' ? 850 : 420, now);

      noiseSource.connect(filter);
      if (ambientGainRef.current) {
        filter.connect(ambientGainRef.current);
      }

      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    } else if (track.ambientType === 'tape') {
      const tapeBuffer = createTapeNoiseBuffer(ctx);
      const tapeSource = ctx.createBufferSource();
      tapeSource.buffer = tapeBuffer;
      tapeSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1.2, now);

      tapeSource.connect(filter);
      if (ambientGainRef.current) {
        filter.connect(ambientGainRef.current);
      }

      tapeSource.start();
      noiseSourceRef.current = tapeSource;

      // Lo-Fi Warm Chord Progression generator: Dm9 -> G13 -> Cmaj9 -> Am7
      const loFiChords = [
        [146.83, 220.00, 261.63, 329.63, 392.00], // Dm9 (D3, A3, C4, E4, G4)
        [196.00, 246.94, 329.63, 392.00, 440.00], // G13 (G3, B3, E4, G4, A4)
        [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9 (C3, G3, B3, D4, G4)
        [110.00, 164.81, 220.00, 261.63, 329.63]  // Am7 (A2, E3, A3, C4, E4)
      ];

      let chordIndex = 0;
      const playWarmChord = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const currentAudioCtx = audioCtxRef.current;
        const chordTime = currentAudioCtx.currentTime;
        const chordNotes = loFiChords[chordIndex % loFiChords.length];
        chordIndex++;

        chordNotes.forEach((freq, idx) => {
          try {
            const chordOsc = currentAudioCtx.createOscillator();
            chordOsc.type = idx === 0 ? 'sine' : 'triangle';
            chordOsc.frequency.setValueAtTime(freq, chordTime);

            // subtle detune for vintage tape vibrato
            chordOsc.detune.setValueAtTime((Math.random() - 0.5) * 8, chordTime);

            const chordFilter = currentAudioCtx.createBiquadFilter();
            chordFilter.type = 'lowpass';
            chordFilter.frequency.setValueAtTime(650, chordTime);

            const chordEnv = currentAudioCtx.createGain();
            chordEnv.gain.setValueAtTime(0.001, chordTime);
            chordEnv.gain.linearRampToValueAtTime(0.06 / chordNotes.length, chordTime + 1.2);
            chordEnv.gain.exponentialRampToValueAtTime(0.001, chordTime + 4.8);

            chordOsc.connect(chordFilter);
            chordFilter.connect(chordEnv);
            if (binauralGainRef.current) {
              chordEnv.connect(binauralGainRef.current);
            }

            chordOsc.start(chordTime);
            chordOsc.stop(chordTime + 5.0);
          } catch {}
        });
      };

      playWarmChord();
      lofiChordTimerRef.current = setInterval(playWarmChord, 4800);
    } else if (track.ambientType === 'drone') {
      const brownBuffer = createBrownNoiseBuffer(ctx);
      const droneNoise = ctx.createBufferSource();
      droneNoise.buffer = brownBuffer;
      droneNoise.loop = true;

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(280, now);

      droneNoise.connect(subFilter);
      if (ambientGainRef.current) {
        subFilter.connect(ambientGainRef.current);
      }
      droneNoise.start();
      noiseSourceRef.current = droneNoise;
    }
  };

  // Handle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      stopAudioGenerators();
      setIsPlaying(false);
    } else {
      if (!isFocusModeActive) {
        onToggleFocusMode(true);
      }
      startAudioGraph(currentTrack);
      setIsPlaying(true);
    }
  };

  // Sync Focus Mode master toggle
  useEffect(() => {
    if (!isFocusModeActive && isPlaying) {
      stopAudioGenerators();
      setIsPlaying(false);
    } else if (isFocusModeActive && !isPlaying) {
      startAudioGraph(currentTrack);
      setIsPlaying(true);
    }
  }, [isFocusModeActive]);

  // Track change while playing
  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    const newTrack = CURATED_TRACKS.find(t => t.id === trackId);
    if (newTrack && isPlaying) {
      startAudioGraph(newTrack);
    }
  };

  // Next / Previous track
  const handleNextTrack = () => {
    const currentIndex = CURATED_TRACKS.findIndex(t => t.id === selectedTrackId);
    const nextIndex = (currentIndex + 1) % CURATED_TRACKS.length;
    handleSelectTrack(CURATED_TRACKS[nextIndex].id);
  };

  const handlePrevTrack = () => {
    const currentIndex = CURATED_TRACKS.findIndex(t => t.id === selectedTrackId);
    const prevIndex = (currentIndex - 1 + CURATED_TRACKS.length) % CURATED_TRACKS.length;
    handleSelectTrack(CURATED_TRACKS[prevIndex].id);
  };

  // Volume Updates in real time
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : masterVolume / 100;
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume, isMuted]);

  useEffect(() => {
    if (binauralGainRef.current && audioCtxRef.current) {
      binauralGainRef.current.gain.setTargetAtTime(binauralVolume / 100, audioCtxRef.current.currentTime, 0.05);
    }
  }, [binauralVolume]);

  useEffect(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      ambientGainRef.current.gain.setTargetAtTime(ambientVolume / 100, audioCtxRef.current.currentTime, 0.05);
    }
  }, [ambientVolume]);

  // Pomodoro Smart Sync: Auto pause when break starts, auto resume when study phase starts
  useEffect(() => {
    if (!syncWithPomodoro) return;

    if (pomoPhase === 'break' && isPlaying) {
      // Pause smoothly
      stopAudioGenerators();
      setIsPlaying(false);
    } else if (pomoPhase === 'study' && isPomoRunning && !isPlaying && isFocusModeActive) {
      // Auto-resume during active study
      startAudioGraph(currentTrack);
      setIsPlaying(true);
    }
  }, [pomoPhase, isPomoRunning, syncWithPomodoro]);

  // Animated Visualizer Loop
  useEffect(() => {
    const updateVisualizer = () => {
      if (isPlaying && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sample 16 points across frequency range
        const step = Math.floor(dataArray.length / 16);
        const heights: number[] = [];
        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          // Scale between 12% and 95%
          const pct = Math.max(12, Math.min(95, Math.round((val / 255) * 100)));
          heights.push(pct);
        }
        setFrequencyBars(heights);
      } else {
        // Subtle resting idle wave
        setFrequencyBars([15, 22, 18, 25, 30, 24, 20, 16, 22, 28, 35, 26, 20, 18, 14, 12]);
      }
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioGenerators();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  const filteredTracks = useMemo(() => {
    if (filterCategory === 'all') return CURATED_TRACKS;
    return CURATED_TRACKS.filter(t => t.category === filterCategory);
  }, [filterCategory]);

  return (
    <div className="space-y-6">
      {/* Top Embedded Player Card */}
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-6 sm:p-8 ${
        isFocusModeActive 
          ? 'bg-slate-900/95 border-amber-500/50 shadow-2xl shadow-amber-500/10' 
          : 'bg-slate-900/80 border-slate-800 shadow-xl'
      }`}>
        {/* Ambient Top Glow */}
        {isFocusModeActive && (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 space-y-6">
          {/* Header & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-amber-400/50 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    پخش‌کننده صوتی تمرکز عمیق (Focus Sound Engine)
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isPlaying 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {isPlaying ? 'در حال پخش آنلاین' : 'متوقف'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  امواج بینورال سنتز شده (تفاضل فازی استریو) + بافت لوفای و نویز قهوه‌ای جهت ایزولاسیون کامل حواس
                </p>
              </div>
            </div>

            {/* Main Focus Mode Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-300">
                حالت تمرکز عمیق:
              </span>
              <button
                type="button"
                onClick={() => onToggleFocusMode(!isFocusModeActive)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  isFocusModeActive ? 'bg-amber-400' : 'bg-slate-700'
                }`}
                title={isFocusModeActive ? 'غیرفعال‌سازی حالت تمرکز' : 'فعال‌سازی حالت تمرکز'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                    isFocusModeActive ? 'translate-x-1' : 'translate-x-7'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Current Playing Track Banner & Visualizer */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentTrack.colorScheme.badge}`}>
                    {currentTrack.waveTag}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {currentTrack.frequencyText}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{currentTrack.name}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {currentTrack.description}
                </p>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-end justify-center md:justify-end gap-1 h-14 px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800/80 min-w-[200px]">
                {frequencyBars.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isPlaying
                        ? i % 3 === 0 
                          ? 'bg-amber-400' 
                          : i % 2 === 0 
                            ? 'bg-emerald-400' 
                            : 'bg-sky-400'
                        : 'bg-slate-700 opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Playback Controls & Quick Sliders */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-850">
              {/* Transport Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrevTrack}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="ترک قبلی"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-950" />
                      <span>توقف پخش</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>پخش موج تمرکز</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="ترک بعدی"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowAdvancedMixer(!showAdvancedMixer)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border transition-colors cursor-pointer ${
                    showAdvancedMixer 
                      ? 'bg-slate-800 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تنظیم لایه‌های صوتی</span>
                </button>

                {onOpenAmbientSoundscape && (
                  <button
                    onClick={onOpenAmbientSoundscape}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 transition-colors cursor-pointer"
                    title="کنترل پنل چشم‌انداز صوتی طبیعت"
                  >
                    <Trees className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">چشم‌انداز صوتی طبیعت (باران، جنگل...)</span>
                  </button>
                )}
              </div>

              {/* Master Volume */}
              <div className="flex items-center gap-2.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  title={isMuted ? 'لغو بی‌صدا' : 'بی‌صدا کردن'}
                >
                  {isMuted || masterVolume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : masterVolume < 40 ? (
                    <Volume1 className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-amber-400" />
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
                  className="w-20 sm:w-28 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  title="بلندی صدای کلی"
                />
                <span className="text-[11px] font-mono text-slate-400 w-8 text-left">
                  {isMuted ? '0%' : `${masterVolume}%`}
                </span>
              </div>
            </div>

            {/* Advanced Mixer Panel (Slide Down) */}
            {showAdvancedMixer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                {/* Binaural Beat Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-amber-400" />
                      <span>حجم موج بینورال (Carrier + Tone):</span>
                    </span>
                    <span className="font-mono text-amber-300">{binauralVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={binauralVolume}
                    onChange={(e) => setBinauralVolume(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    تنظیم شدت فرکانس محرک امواج مغزی
                  </span>
                </div>

                {/* Ambient Layer Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                      <span>حجم لایه امبینت و باران (Noise Layer):</span>
                    </span>
                    <span className="font-mono text-sky-300">{ambientVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambientVolume}
                    onChange={(e) => setAmbientVolume(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    پوشش‌دهی صداهای مزاحم محیط و ایجاد اتمسفر
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Smart Study Features Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Sync with Pomodoro option */}
            <div 
              onClick={() => setSyncWithPomodoro(!syncWithPomodoro)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                syncWithPomodoro ? 'border-amber-400 bg-amber-400/20 text-amber-400' : 'border-slate-700'
              }`}>
                {syncWithPomodoro && <Check className="w-3 h-3" />}
              </div>
              <div>
                <span className="font-semibold text-white block">همگام‌سازی خودکار با تایمر پومودورو</span>
                <span className="text-[11px] text-slate-400">
                  موسیقی در فاز استراحت خودکار متوقف و با شروع مجدد فاز مطالعه پخش می‌شود
                </span>
              </div>
            </div>

            {/* Headphone Scientific Notice */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/15 border border-amber-900/30 text-amber-200/90">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] leading-relaxed">
                <strong>الزام هدفون استریو:</strong> برای دریافت امواج بینورال حتماً از هدفون استفاده کنید، چون گوش چپ و راست باید فرکانس‌های مجزا دریافت کنند.
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">دسته‌بندی:</span>
            {[
              { id: 'all', label: 'همه فرکانس‌ها' },
              { id: 'binaural', label: 'امواج بینورال مغز' },
              { id: 'lofi', label: 'لوفای پیانو مطالعه' },
              { id: 'ambient', label: 'عایق صوتی و نویز قهوه‌ای' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Curated Tracks List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTracks.map(track => {
              const isSelected = track.id === selectedTrackId;
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`group relative p-4 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-950 border-amber-400 ring-1 ring-amber-400/40 shadow-lg ${track.colorScheme.glow}`
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Wave Tag + Category */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${track.colorScheme.badge}`}>
                        {track.waveTag}
                      </span>
                      {isSelected && isPlaying ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 animate-pulse">
                          <Radio className="w-3 h-3" />
                          <span>در حال پخش</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          {track.categoryLabel}
                        </span>
                      )}
                    </div>

                    {/* Track Title */}
                    <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {track.name}
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  {/* Subject Tag & Quick Selection Action */}
                  <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate max-w-[170px]" title={track.recommendedSubjects}>
                      📌 {track.recommendedSubjects}
                    </span>
                    <span className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {isSelected ? 'انتخاب شده' : 'انتخاب ترک'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
