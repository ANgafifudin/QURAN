import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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

  // Fetch data surat
  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then(res => res.json())
      .then(data => setSurah(data.data));
  }, [nomor]);

  // Autoplay saat buka halaman dengan ?autoplay=true
  useEffect(() => {
    if (surah && new URLSearchParams(location.search).get('autoplay') === 'true') {
      const firstAyatNomor = surah.ayat[0].nomorAyat;
      const firstAudio = audioRefs.current[firstAyatNomor];
      if (firstAudio) {
        firstAudio.play();
        setPlayingAyat(firstAyatNomor);
        highlightAyat(firstAyatNomor);
        firstAudio.onended = () => playNextAudio(surah, firstAyatNomor);
      }
    }
  }, [surah, location.search, audioRefs, setPlayingAyat, playNextAudio]);

  // Scroll ke ayat target jika ada query ?ayat=...
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

  // Show tombol back to top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!surah) return <div>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
      <h2>{surah.namaLatin} ({surah.nama})</h2>
      <p>Jumlah Ayat: {surah.jumlahAyat}</p>

      <div className={styles.controls}>
        <div className={styles.fontSizeControl}>
          <label>Ukuran Font Arab: {fontSize}px</label>
          <input type="range" min="24" max="60" value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))} />
        </div>

        <div className={styles.murottalControl}>
          <label>Pilih Murottal:</label>
          <select value={murottalVersion} onChange={(e) => setMurottalVersion(e.target.value)}>
            {Object.entries(qariList).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <label className={styles.autoplayControl}>
          <input type="checkbox"
            checked={autoPlayNextSurah}
            onChange={() => setAutoPlayNextSurah(!autoPlayNextSurah)} />
          Auto Play Surah Berikutnya
        </label>
      </div>

      <ul>
        {surah.ayat.map((ayat) => (
          <li key={ayat.nomorAyat}
              id={`ayat-${ayat.nomorAyat}`}
              className={highlightedAyat === ayat.nomorAyat ? styles.highlightAyat : ''}>
            <strong>{ayat.nomorAyat}</strong>.
            <div className={`${styles.ayatArab} ${playingAyat === ayat.nomorAyat ? styles.playingAyat : ''}`}
                 style={{ fontSize: `${fontSize}px` }}>
              {ayat.teksArab}
            </div>
            <em>{ayat.teksIndonesia}</em><br />
            <button className={`${styles.audioButton} ${playingAyat === ayat.nomorAyat ? styles.playing : ''}`}
                    onClick={() => handlePlayAyat(ayat.nomorAyat)}>
              <span className={styles.buttonIcon}>
                {playingAyat === ayat.nomorAyat ? '🔄' : '▶️'}
              </span>
              {playingAyat === ayat.nomorAyat ? ' Playing' : ' Play'}
            </button>
            <audio ref={(el) => (audioRefs.current[ayat.nomorAyat] = el)}
                   src={ayat.audio[murottalVersion]} />
          </li>
        ))}
      </ul>

      <Link to="/" className={styles.backButton}>Kembali</Link>

      <button className={`${styles.backToTop} ${showBackToTop ? styles.show : ''}`}
              onClick={scrollToTop}>
        <ChevronUp size={22} />
      </button>
    </div>
  );
}

export default SurahPage;
