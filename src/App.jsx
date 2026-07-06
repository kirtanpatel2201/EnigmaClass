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
import AesCipher from './pages/AesCipher';
import DesCipher from './pages/DesCipher';
import Sha512Cipher from './pages/Sha512Cipher';

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
            <Route path="/aes" element={<AesCipher />} />
            <Route path="/des" element={<DesCipher />} />
            <Route path="/sha512" element={<Sha512Cipher />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
