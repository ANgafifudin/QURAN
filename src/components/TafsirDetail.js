import React from 'react';

function TafsirDetail({ data }) {
  return (
    <div className="tafsir-detail">
      <h2>Tafsir Surat {data.namaLatin}</h2>
      {data.tafsir.map((t) => (
        <div key={t.ayat}>
          <h4>Ayat {t.ayat}</h4>
          <p>{t.teks}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default TafsirDetail;
