import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurahPage from './pages/SurahPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/surah/:nomor" element={<SurahPage />} />
    </Routes>
  </BrowserRouter>
);
