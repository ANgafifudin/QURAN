import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SurahPage from './pages/SurahPage';
import TafsirPage from './pages/TafsirPage';

function App() {
  return (
    <Router>
      <div>
        <h1>QURAN-KU</h1>
        <SearchBar />
        <Routes>
          <Route path="/surah/:nomor" element={<SurahPage />} />
          <Route path="/tafsir/:nomor" element={<TafsirPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
