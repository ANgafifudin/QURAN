import React, { useEffect, useState } from 'react';
import './SurahList.css'; // import file CSS-nya

function SurahList({ setSelectedSurah }) {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then(res => res.json())
      .then(data => setSurahs(data.data));
  }, []);

  return (
    <div className="surah-list-container">
      <h2>Daftar Surat</h2>

      <div className="surah-grid">
        {surahs.map((surah) => (
          <div
            key={surah.nomor}
            className="surah-card"
            onClick={() => setSelectedSurah(surah.nomor)}
          >
            <h3>{surah.nomor}. {surah.namaLatin}</h3>
            <p>{surah.nama}</p>
            <p>{surah.jumlahAyat} ayat</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurahList;
