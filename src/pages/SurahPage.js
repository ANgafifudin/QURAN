import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { ChevronUp } from 'lucide-react';
import styles from './SurahPage.module.css';

function SurahPage() {
  const { nomor } = useParams();
  const location = useLocation();

  const [surah, setSurah] = useState(null);
  const [fontSize, setFontSize] = useState(36);
  const [murottalVersion, setMurottalVersion] = useState('05');
  const [autoPlayNextSurah, setAutoPlayNextSurah] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [highlightedAyat, setHighlightedAyat] = useState(null);
  const [searchText, setSearchText] = useState('');

  const {
    audioRefs,
    playingAyat,
    setPlayingAyat,
    handleToggleAudio,
    playNextAudio
  } = useAudioPlayer(autoPlayNextSurah);

  const qariList = {
    '01': 'Abdullah Al-Matrood',
    '02': 'Abdurrahman As-Sudais',
    '03': 'Mishary Rashid Alafasy',
    '04': 'Saad Al-Ghamdi',
    '05': 'Misyari Rasyid (HQ)'
  };

  const highlightAyat = (ayatNomor) => {
    setHighlightedAyat(ayatNomor);
    setTimeout(() => setHighlightedAyat(null), 3000);
  };

  const handlePlayAyat = (ayatNomor) => {
    handleToggleAudio(surah, ayatNomor);
    highlightAyat(ayatNomor);
  };

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then(res => res.json())
      .then(data => setSurah(data.data));
  }, [nomor]);

  // Auto-play saat pertama load dengan ?autoplay=true
  useEffect(() => {
    if (surah && new URLSearchParams(location.search).get('autoplay') === 'true') {
      const firstAyat = surah.ayat[0].nomorAyat;
      const firstAudio = audioRefs.current[firstAyat];
      if (firstAudio) {
        firstAudio.play();
        setPlayingAyat(firstAyat);
        highlightAyat(firstAyat);
        firstAudio.onended = () => playNextAudio(surah, firstAyat);
      }
    }
  }, [surah, location.search]);

  // Scroll ke ayat tertentu kalau ada query ?ayat= di URL
  useEffect(() => {
    if (surah) {
      const params = new URLSearchParams(location.search);
      const targetAyat = params.get('ayat');
      if (targetAyat) {
        const el = document.getElementById(`ayat-${targetAyat}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          highlightAyat(Number(targetAyat));
        }
      }
    }
  }, [surah, location]);

  // Tampil tombol back to top saat scroll
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll ke ayat yang sedang diputar
  useEffect(() => {
    if (playingAyat && surah) {
      const el = document.getElementById(`ayat-${playingAyat}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightAyat(playingAyat);
      }
    }
  }, [playingAyat, surah]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!surah) return <div>Loading...</div>;

  const filteredAyat = surah.ayat.filter((ayat) =>
    ayat.teksArab.includes(searchText) ||
    ayat.teksIndonesia.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>

      {/* Search bar */}
      <div className={styles.searchControl}>
        <input
          type="text"
          placeholder="Cari teks ayat"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Judul surah */}
      <h2>{surah.namaLatin} ({surah.nama})</h2>
      <p>Jumlah Ayat: {surah.jumlahAyat}</p>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.fontSizeControl}>
          <label>Ukuran Font Arab: {fontSize}px</label>
          <input
            type="range"
            min="24"
            max="60"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>

        <div className={styles.murottalControl}>
          <label>Pilih Murottal:</label>
          <select
            value={murottalVersion}
            onChange={(e) => setMurottalVersion(e.target.value)}
          >
            {Object.entries(qariList).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <label className={styles.autoplayControl}>
          <input
            type="checkbox"
            checked={autoPlayNextSurah}
            onChange={() => setAutoPlayNextSurah(!autoPlayNextSurah)}
          />
          Auto Play Surah Berikutnya
        </label>
      </div>

      {/* List ayat */}
      <ul>
        {filteredAyat.map((ayat) => {
          const isPlaying = playingAyat === ayat.nomorAyat;
          const isHighlighted = highlightedAyat === ayat.nomorAyat;

          return (
            <li
              key={ayat.nomorAyat}
              id={`ayat-${ayat.nomorAyat}`}
              className={isHighlighted ? styles.highlightAyat : ''}
            >
              <strong>{ayat.nomorAyat}</strong>.
              <div
                className={`
                  ${styles.ayatArab}
                  ${isPlaying ? styles.playingAyat : ''}
                  ${isPlaying ? styles.fadeIn : ''}
                `}
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayat.teksArab}
              </div>
              <em>{ayat.teksIndonesia}</em><br />
              <button
                className={`
                  ${styles.audioButton}
                  ${isPlaying ? styles.playing : ''}
                `}
                onClick={() => handlePlayAyat(ayat.nomorAyat)}
              >
                <span className={styles.buttonIcon}>
                  {isPlaying ? '🔄' : '▶️'}
                </span>
                {isPlaying ? ' Playing' : ' Play'}
              </button>
              <audio
                ref={(el) => (audioRefs.current[ayat.nomorAyat] = el)}
                src={ayat.audio[murottalVersion]}
              />
            </li>
          );
        })}
      </ul>

      {/* Tombol ke atas */}
      <button
        className={`
          ${styles.backToTop}
          ${showBackToTop ? styles.show : ''}
        `}
        onClick={scrollToTop}
      >
        <ChevronUp size={22} />
      </button>

    </div>
  );
}

export default SurahPage;
