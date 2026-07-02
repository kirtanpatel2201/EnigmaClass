import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import CaesarCipher from './pages/CaesarCipher';
import VigenereCipher from './pages/VigenereCipher';
import HillCipher from './pages/HillCipher';
import RailFenceCipher from './pages/RailFenceCipher';
import PlayfairCipher from './pages/PlayfairCipher';
import OtpCipher from './pages/OtpCipher';
import RsaCipher from './pages/RsaCipher';
import DhCipher from './pages/DhCipher';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/caesar" replace />} />
            <Route path="/caesar" element={<CaesarCipher />} />
            <Route path="/vigenere" element={<VigenereCipher />} />
            <Route path="/hill" element={<HillCipher />} />
            <Route path="/railfence" element={<RailFenceCipher />} />
            <Route path="/playfair" element={<PlayfairCipher />} />
            <Route path="/otp" element={<OtpCipher />} />
            <Route path="/rsa" element={<RsaCipher />} />
            <Route path="/dh" element={<DhCipher />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
