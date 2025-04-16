import React from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SurahPage from './pages/SurahPage';
import TafsirPage from './pages/TafsirPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <div>
        <h1>QURAN-KU</h1>
        <SearchBar />
        <Routes>
          <Route path="/surah/:nomor" element={<SurahPage />} />
          <Route path="/tafsir/:nomor" element={<TafsirPage />} />
        </Routes>
      </div>
  </BrowserRouter>
);
