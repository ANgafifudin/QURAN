import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SurahSearchBox.module.css';

function SurahSearchBox() {
  const [allSurah, setAllSurah] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then(res => res.json())
      .then(data => setAllSurah(data.data));
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value.length > 0) {
      const filtered = allSurah.filter(s =>
        s.namaLatin.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSurah = (nomor) => {
    navigate(`/surat/${nomor}`);
    setSearchText('');
    setSuggestions([]);
  };

  return (
    <div className={styles.searchControl}>
      <input
        type="text"
        placeholder="Cari nama surah..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {suggestions.map((s) => (
            <li key={s.nomor} onClick={() => handleSelectSurah(s.nomor)}>
              {s.namaLatin}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SurahSearchBox;
