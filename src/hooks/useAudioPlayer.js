import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAudioPlayer = (autoPlayNextSurah = true) => {
  const [playingAyat, setPlayingAyat] = useState(null);
  const audioRefs = useRef({});
  const navigate = useNavigate();

  const safePlay = async (audioElement) => {
    if (!audioElement) return;
    try {
      await audioElement.play();
    } catch (err) {
      console.error('Audio play error:', err);
    }
  };

  const stopAllAudio = () => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const playNextAudio = useCallback((surah, currentAyatNomor) => {
    const ayatList = surah.ayat;
    const currentIndex = ayatList.findIndex(a => a.nomorAyat === currentAyatNomor);

    if (currentIndex !== -1 && currentIndex + 1 < ayatList.length) {
      const nextAyatNomor = ayatList[currentIndex + 1].nomorAyat;
      const nextAudio = audioRefs.current[nextAyatNomor];
      if (nextAudio) {
        stopAllAudio();
        safePlay(nextAudio);
        setPlayingAyat(nextAyatNomor);
        nextAudio.onended = () => playNextAudio(surah, nextAyatNomor);
      } else {
        setPlayingAyat(null);
      }
    } else {
      // Kalau ayat habis, lanjut surah kalau opsi aktif
      if (autoPlayNextSurah) {
        const nextSurahNomor = parseInt(surah.nomor) + 1;
        if (nextSurahNomor <= 114) {
          navigate(`/surah/${nextSurahNomor}?autoplay=true`);
        } else {
          setPlayingAyat(null);
        }
      } else {
        setPlayingAyat(null);
      }
    }
  }, [autoPlayNextSurah, navigate]);

  const handleToggleAudio = (surah, ayatNomor) => {
    const currentAudio = audioRefs.current[ayatNomor];

    if (playingAyat === ayatNomor) {
      currentAudio.pause();
      setPlayingAyat(null);
    } else {
      stopAllAudio();
      safePlay(currentAudio);
      setPlayingAyat(ayatNomor);

      currentAudio.onended = () => {
        playNextAudio(surah, ayatNomor);
      };
    }
  };

  return {
    audioRefs,
    playingAyat,
    setPlayingAyat,
    handleToggleAudio,
    playNextAudio,
    stopAllAudio
  };
};
