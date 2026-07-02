import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [showManual, setShowManual] = useState(false);

  return (
    <>
      <header className="top-header">
          <Link to="/" className="brand">
              <div className="brand-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
              </div>
              <div className="brand-info">
                  <h1>EnigmaClass</h1>
                  <p>Visualize the science of secrecy</p>
              </div>
          </Link>
          <button className="user-manual-btn" onClick={() => setShowManual(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              User Manual
          </button>
      </header>

      {showManual && (
        <div className="modal-overlay" onClick={() => setShowManual(false)}>
          <div className="manual-modal" onClick={e => e.stopPropagation()}>
            <div className="manual-header">
                <h2>User Manual & Navigation Guide</h2>
                <button className="close-modal" onClick={() => setShowManual(false)}>&times;</button>
            </div>
            <div className="manual-content">
                <p>Welcome to the <strong>EnigmaClass</strong> cryptosystem simulator. Please review these navigation points to make the most of your experience:</p>
                <ul>
                    <li><strong>1. Global Menu:</strong> Look to the left sidebar to select your desired cryptographic algorithm.</li>
                    <li><strong>2. Classical vs Modern:</strong> Ciphers are grouped by their historical era (Classical vs Modern).</li>
                    <li><strong>3. Mode Tabs:</strong> The top center of your screen features two large tabs: Encryption and Decryption. Clicking these tabs instantly swaps your workspace.</li>
                    <li><strong>4. Independent Parameters:</strong> Both Encryption and Decryption modes have their own independent parameter inputs.</li>
                    <li><strong>5. Default Values:</strong> We provide standard default values (e.g., P=23, Q=11 for RSA) so you can test immediately.</li>
                    <li><strong>6. Customizing Keys:</strong> Feel free to change shifts, keywords, matrix cells, or primes to test the limits of the algorithms. Certain ciphers like the Hill Cipher require specific mathematical properties (e.g., an invertible matrix mod 26).</li>
                    <li><strong>7. Running Animations:</strong> Input your parameters and click the primary glowing action button (e.g. 'Encrypt', 'Simulate Key Exchange') at the bottom of the workspace.</li>
                    <li><strong>8. Step-by-step Execution:</strong> EnigmaClass doesn't just give answers; it animates the math step-by-step in an interactive classroom view.</li>
                    <li><strong>9. Animation Controls:</strong> Use the <strong>Previous</strong> and <strong>Next</strong> arrows to manually step through the algorithm. </li>
                    <li><strong>10. Auto Scroll:</strong> Toggle the <strong>▶ AUTO SCROLL</strong> button to let the simulation play automatically.</li>
                    <li><strong>11. Simulation State:</strong> The top tracker row will show when a simulation is 'Running' or 'Complete'. You can halt it anytime with the <strong>Stop Simulation</strong> button.</li>
                    <li><strong>12. Final Result:</strong> Once the animation concludes, the final ciphertext, plaintext, or shared secret will illuminate in a neon output box.</li>
                    <li><strong>13. Brand Reset:</strong> Clicking the EnigmaClass logo in the top-left will instantly reset your view back to the Caesar Cipher.</li>
                    <li><strong>14. Re-running:</strong> If you want to run a different text, just change the inputs and click the action button again.</li>
                </ul>
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex' }}>
                <button className="btn-primary" onClick={() => setShowManual(false)} style={{ width: 'auto', padding: '10px 24px' }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
