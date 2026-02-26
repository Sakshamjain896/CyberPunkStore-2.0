import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [showScanlines, setShowScanlines] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState('medium');

  // Load settings from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('neondream_settings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setTheme(settings.theme || 'dark');
      setAudioEnabled(settings.audioEnabled ?? true);
      setMusicVolume(settings.musicVolume ?? 0.3);
      setSfxVolume(settings.sfxVolume ?? 0.5);
      setShowScanlines(settings.showScanlines ?? true);
      setGlitchIntensity(settings.glitchIntensity || 'medium');
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      theme,
      audioEnabled,
      musicVolume,
      sfxVolume,
      showScanlines,
      glitchIntensity,
    };
    localStorage.setItem('neondream_settings', JSON.stringify(settings));
  }, [theme, audioEnabled, musicVolume, sfxVolume, showScanlines, glitchIntensity]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  // Toggle scanlines
  const toggleScanlines = () => {
    setShowScanlines(prev => !prev);
  };

  // Update music volume
  const updateMusicVolume = (volume) => {
    setMusicVolume(Math.max(0, Math.min(1, volume)));
  };

  // Update SFX volume
  const updateSfxVolume = (volume) => {
    setSfxVolume(Math.max(0, Math.min(1, volume)));
  };

  // Update glitch intensity
  const updateGlitchIntensity = (intensity) => {
    if (['low', 'medium', 'high'].includes(intensity)) {
      setGlitchIntensity(intensity);
    }
  };

  const value = {
    theme,
    audioEnabled,
    musicVolume,
    sfxVolume,
    showScanlines,
    glitchIntensity,
    toggleTheme,
    toggleAudio,
    toggleScanlines,
    updateMusicVolume,
    updateSfxVolume,
    updateGlitchIntensity,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
