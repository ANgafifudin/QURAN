import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './TafsirPage.css';

function TafsirPage() {
  const { nomor } = useParams();
  const [searchParams] = useSearchParams();
  const initialAyat = searchParams.get('ayat') || '';

  const [tafsir, setTafsir] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [headingSize, setHeadingSize] = useState(28);
  const [ayatNumberSize, setAyatNumberSize] = useState(18);
  const [searchAyat, setSearchAyat] = useState(initialAyat);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/tafsir/${nomor}`)
      .then(res => res.json())
      .then(data => setTafsir(data.data));
  }, [nomor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
    document.documentElement.style.setProperty('--font-size-heading', `${headingSize}px`);
    document.documentElement.style.setProperty('--font-size-ayat-number', `${ayatNumberSize}px`);
  }, [fontSize, headingSize, ayatNumberSize]);

  if (!tafsir) return <div>Loading...</div>;

  const filteredTafsir = searchAyat
    ? tafsir.tafsir.filter((ayat) => ayat.ayat === Number(searchAyat))
    : tafsir.tafsir;

  return (
    <div className="tafsir-container">
      <h2 style={{ fontSize: `var(--font-size-heading)` }}>
        Tafsir {tafsir.namaLatin}
      </h2>

      {/* Search ayat */}
      <div className="search-ayat">
        <input
          type="number"
          placeholder="Cari nomor ayat..."
          value={searchAyat}
          onChange={(e) => setSearchAyat(e.target.value)}
        />
        {searchAyat && filteredTafsir.length === 0 && (
          <p>Ayat {searchAyat} tidak ditemukan.</p>
        )}
      </div>

      {/* Font sliders */}
      <div className="font-slider">
        <label>Ukuran Judul: {headingSize}px</label>
        <input
          type="range"
          min="20"
          max="36"
          value={headingSize}
          onChange={(e) => setHeadingSize(e.target.value)}
        />
      </div>

      <div className="font-slider">
        <label>Ukuran Nomor Ayat: {ayatNumberSize}px</label>
        <input
          type="range"
          min="14"
          max="28"
          value={ayatNumberSize}
          onChange={(e) => setAyatNumberSize(e.target.value)}
        />
      </div>

      <div className="font-slider">
        <label>Ukuran Teks Tafsir: {fontSize}px</label>
        <input
          type="range"
          min="14"
          max="28"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>

      {/* Daftar tafsir */}
      <ul>
        {filteredTafsir.map((ayat) => (
          <li key={ayat.ayat}>
            <strong style={{ fontSize: `var(--font-size-ayat-number)` }}>
              Ayat {ayat.ayat}
            </strong>{' '}
            <span style={{ fontSize: `var(--font-size-base)` }}>{ayat.teks}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TafsirPage;
