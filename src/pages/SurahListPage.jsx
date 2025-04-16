import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SurahListPage.module.css';

function SurahListPage() {
  const [surahList, setSurahList] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then(res => res.json())
      .then(data => setSurahList(data.data));
  }, []);

  const filteredSurah = surahList.filter(
    (surah) =>
      surah.namaLatin.toLowerCase().includes(searchText.toLowerCase()) ||
      surah.nomor.toString() === searchText
  );

  return (
    <div className={styles.pageContainer}>
      <h2>Daftar Surah</h2>

      <input
        type="text"
        placeholder="Cari nama atau nomor surah..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.searchInput}
      />

      <ul className={styles.surahList}>
        {filteredSurah.map((surah) => (
          <li key={surah.nomor}>
            <Link to={`/surat/${surah.nomor}`}>
              {surah.nomor}. {surah.namaLatin} ({surah.nama})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SurahListPage;
