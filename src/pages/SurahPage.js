import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { ChevronUp } from 'lucide-react';
import './SurahPage.css';

function SurahPage() {
  const { nomor } = useParams();
  const location = useLocation();
  const [surah, setSurah] = useState(null);
  const [fontSize, setFontSize] = useState(36);
  const [murottalVersion, setMurottalVersion] = useState('05');
  const [autoPlayNextSurah, setAutoPlayNextSurah] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then(res => res.json())
      .then(data => setSurah(data.data));
  }, [nomor]);

  useEffect(() => {
    if (surah && new URLSearchParams(location.search).get('autoplay') === 'true') {
      const firstAyatNomor = surah.ayat[0].nomorAyat;
      const firstAudio = audioRefs.current[firstAyatNomor];
      if (firstAudio) {
        firstAudio.play();
        setPlayingAyat(firstAyatNomor);
        firstAudio.onended = () => {
          playNextAudio(surah, firstAyatNomor);
        };
      }
    }
  }, [surah, location.search, audioRefs, playNextAudio, setPlayingAyat]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!surah) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <h2>{surah.namaLatin} ({surah.nama})</h2>
      <p>Jumlah Ayat: {surah.jumlahAyat}</p>

      <div className="controls">
        <div className="font-size-control">
          <label>Ukuran Font Arab: {fontSize}px</label>
          <input
            type="range"
            min="24"
            max="60"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
        </div>

        <div className="murottal-control">
          <label>Pilih Murottal:</label>
          <select value={murottalVersion} onChange={(e) => setMurottalVersion(e.target.value)}>
            {Object.entries(qariList).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div className="autoplay-next-control">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={autoPlayNextSurah}
              onChange={() => setAutoPlayNextSurah(!autoPlayNextSurah)}
            />
            Auto Play Surah Berikutnya
          </label>
        </div>
      </div>

      <ul>
        {surah.ayat.map((ayat) => (
          <li key={ayat.nomorAyat}>
            <strong>{ayat.nomorAyat}</strong>.
            <div className="ayat-arab" style={{ fontSize: `${fontSize}px` }}>
              {ayat.teksArab}
            </div>
            <em>{ayat.teksIndonesia}</em>
            <br />
            <button
              className={`audio-button ${playingAyat === ayat.nomorAyat ? 'playing' : ''}`}
              onClick={() => handleToggleAudio(surah, ayat.nomorAyat)}
            >
              <span className="button-icon">
                {playingAyat === ayat.nomorAyat ? '🔄' : '▶️'}
              </span>
              {playingAyat === ayat.nomorAyat ? ' Playing' : ' Play'}
            </button>
            <audio
              ref={(el) => (audioRefs.current[ayat.nomorAyat] = el)}
              src={ayat.audio[murottalVersion]}
            />
          </li>
        ))}
      </ul>

      <Link className="back-button" to="/">Kembali</Link>

      {showBackToTop && (
        <button className={`back-to-top ${showBackToTop ? 'show' : ''}`} onClick={scrollToTop}>
        <ChevronUp size={22} />
      </button>
      
      )}
    </div>
  );
}

export default SurahPage;
