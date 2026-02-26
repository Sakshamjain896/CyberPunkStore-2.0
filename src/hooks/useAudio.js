import { useRef, useEffect } from 'react';

export const useAudio = () => {
  const audioCtxRef = useRef(null);
  const sfxGainRef = useRef(null);
  const voiceGainRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    sfxGainRef.current = audioCtxRef.current.createGain();
    sfxGainRef.current.gain.value = 0.5;
    sfxGainRef.current.connect(audioCtxRef.current.destination);
    
    voiceGainRef.current = audioCtxRef.current.createGain();
    voiceGainRef.current.gain.value = 1.0;
    voiceGainRef.current.connect(audioCtxRef.current.destination);

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playCoinSound = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(sfxGainRef.current);
    osc.start(now);
    osc.stop(now + 0.5);
  };

  const playErrorSound = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(sfxGainRef.current);
    osc.start(now);
    osc.stop(now + 0.3);
  };

  const playKeySound = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.05);
    
    osc.connect(gain);
    gain.connect(sfxGainRef.current);
    osc.start(now);
    osc.stop(now + 0.05);
  };

  const playGlitchSound = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(sfxGainRef.current);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  const speakSystem = (text) => {
    if (!window.speechSynthesis) return;
    
    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech and wait a bit
    synth.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      utterance.volume = 1.0;
      
      const voices = synth.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice, otherwise use the first one
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        utterance.voice = englishVoice || voices[0];
      }
      
      synth.speak(utterance);
    }, 100);
  };

  return {
    playCoinSound,
    playErrorSound,
    playKeySound,
    playGlitchSound,
    speakSystem
  };
};
