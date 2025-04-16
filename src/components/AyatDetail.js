import React from 'react';

function AyatDetail({ data }) {
  return (
    <div className="ayat-detail">
      <h2>{data.namaLatin}</h2>
      {data.ayat.map((a) => (
        <div key={a.nomorAyat}>
          <p className="arab">{a.teksArab}</p>
          <p className="latin">{a.teksLatin}</p>
          <p className="terjemahan">{a.teksIndonesia}</p>
          <audio controls src={a.audio["05"]}></audio>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AyatDetail;
