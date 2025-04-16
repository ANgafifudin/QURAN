import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [inputSurah, setInputSurah] = useState('');
  const [inputAyat, setInputAyat] = useState('');
  const [surahList, setSurahList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then(res => res.json())
      .then(data => setSurahList(data.data));
  }, []);

  const handleSearch = () => {
    if (!inputSurah) return alert("Masukkan nomor surat!");
    const url = inputAyat
      ? `/surah/${inputSurah}?ayat=${inputAyat}`
      : `/surah/${inputSurah}`;
    navigate(url);
  };

  const handleTafsir = () => {
    if (!inputSurah) return alert("Masukkan nomor surat!");
    const url = inputAyat
      ? `/tafsir/${inputSurah}?ayat=${inputAyat}`
      : `/tafsir/${inputSurah}`;
    navigate(url);
  };

  const handleDropdownChange = (e) => {
    setInputSurah(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input 
          type="number"
          placeholder="Nomor Surat..."
          value={inputSurah}
          onChange={(e) => setInputSurah(e.target.value)}
        />
        <select onChange={handleDropdownChange} value={inputSurah}>
          <option value="">Pilih Surat...</option>
          {surahList.map((surah) => (
            <option key={surah.nomor} value={surah.nomor}>
              {surah.nomor}. {surah.namaLatin} ({surah.arti})
            </option>
          ))}
        </select>
        <input 
          type="number"
          placeholder="Nomor Ayat (opsional)..."
          value={inputAyat}
          onChange={(e) => setInputAyat(e.target.value)}
          style={{ width: '160px' }}
        />
        <button onClick={handleSearch}>Cari Ayat</button>
        <button onClick={handleTafsir}>Cari Tafsir</button>
      </div>
    </div>
  );
}

export default SearchBar;
