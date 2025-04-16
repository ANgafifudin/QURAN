import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [input, setInput] = useState('');
  const [surahList, setSurahList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then(res => res.json())
      .then(data => setSurahList(data.data));
  }, []);

  const handleSearch = () => {
    if (!input) return alert("Masukkan nomor surat!");
    navigate(`/surah/${input}`);
  };

  const handleTafsir = () => {
    if (!input) return alert("Masukkan nomor surat!");
    navigate(`/tafsir/${input}`);
  };

  const handleDropdownChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input 
          type="number"
          placeholder="Masukkan nomor surat..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select onChange={handleDropdownChange} value={input}>
          <option value="">Pilih Surat...</option>
          {surahList.map((surah) => (
            <option key={surah.nomor} value={surah.nomor}>
              {surah.nomor}. {surah.namaLatin} ({surah.arti})
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Cari Ayat</button>
        <button onClick={handleTafsir}>Cari Tafsir</button>
      </div>
    </div>
  );
}

export default SearchBar;
