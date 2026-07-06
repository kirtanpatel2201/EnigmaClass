import React, { useState } from 'react';

const BlockCipherModes = () => {
  const [activeMode, setActiveMode] = useState('ECB');

  const modes = [
    { id: 'ECB', name: 'Electronic Codebook', desc: 'The simplest mode. Each block is encrypted independently. Weakness: Identical plaintext blocks produce identical ciphertext blocks.' },
    { id: 'CBC', name: 'Cipher Block Chaining', desc: 'Each plaintext block is XORed with the previous ciphertext block before being encrypted. Requires an Initialization Vector (IV).' },
    { id: 'CFB', name: 'Cipher Feedback', desc: 'Turns a block cipher into a self-synchronizing stream cipher. The previous ciphertext is encrypted and XORed with plaintext.' },
    { id: 'OFB', name: 'Output Feedback', desc: 'Turns a block cipher into a synchronous stream cipher. It generates keystream blocks which are XORed with plaintext.' },
    { id: 'CTR', name: 'Counter', desc: 'Turns a block cipher into a stream cipher by encrypting successive values of a "counter". Highly parallelizable.' },
  ];

  // Helper for XOR Circles to ensure absolute centering
  const XorCircle = ({ cx, cy }) => (
    <div style={{
      position: 'absolute', top: `${cy - 15}px`, left: `${cx - 15}px`,
      width: '30px', height: '30px', borderRadius: '50%',
      border: '2px solid #64748B', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748B', fontSize: '20px', fontWeight: 'bold', background: '#050B14',
      lineHeight: 1, paddingBottom: '2px'
    }}>
      ⊕
    </div>
  );

  return (
    <section className="view-section active">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <h2>Block Cipher Modes of Operation</h2>
        <p>
          Block ciphers (like AES or DES) encrypt data in fixed-size chunks (e.g., 128-bits). To encrypt messages longer than a single block, 
          we use a <strong>Mode of Operation</strong>. These modes define the cryptographic architecture of how individual blocks are chained or streamed together.
        </p>
      </div>

      <div className="mode-tabs">
        {modes.map((mode) => (
          <button 
            key={mode.id}
            className={`mode-tab ${activeMode === mode.id ? 'active' : ''}`} 
            onClick={() => setActiveMode(mode.id)}
          >
            {mode.id}
          </button>
        ))}
      </div>

      {/* Dynamic Title and Description mapped centrally */}
      <div className="mode-info" style={{ textAlign: 'center', marginBottom: '10px', padding: '0 20px' }}>
        <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', marginBottom: '10px', marginTop: 0 }}>
          {modes.find(m => m.id === activeMode)?.name} ({activeMode})
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '900px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {modes.find(m => m.id === activeMode)?.desc}
        </p>
      </div>

      {/* Flowchart full width area - Expanded spacing with 0.85 scale to prevent scrolling */}
      <div className="flowchart-scale-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '40px' }}>
        <div style={{ width: '1200px', maxWidth: '100%', height: '595px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* Internal canvas is 1200x700 for maximum breathing room, scaled to 595px tall */}
          <div style={{ width: '1200px', height: '700px', position: 'absolute', top: 0, background: '#050B14', transform: 'scale(0.85)', transformOrigin: 'top center', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            
            <svg width="1200" height="700" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
              <defs>
                <marker id="arrowGrey" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 8 3, 0 6" fill="#64748B" />
                </marker>
                <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 8 3, 0 6" fill="#10B981" />
                </marker>
              </defs>

              {/* Distinct Visual Separator between Encrypt and Decrypt */}
              <line x1="40" y1="350" x2="1160" y2="350" stroke="#1E293B" strokeWidth="2" strokeDasharray="8,8" />

              {[200, 600, 1000].map((cx, i) => {
                const nextCx = [600, 1000, null][i];
                return (
                  <g key={`svg-${activeMode}-${i}`}>
                    {/* Key (K) connections - Straight horizontal lines */}
                    <line x1={cx - 85} y1="187.5" x2={cx - 50} y2="187.5" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                    <line x1={cx - 85} y1="527.5" x2={cx - 50} y2="527.5" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />

                    {activeMode === 'ECB' && (
                      <React.Fragment>
                        {/* Encrypt lines */}
                        <line x1={cx} y1="80" x2={cx} y2="165" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="205" x2={cx} y2="290" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Decrypt lines */}
                        <line x1={cx} y1="420" x2={cx} y2="505" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="545" x2={cx} y2="630" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                      </React.Fragment>
                    )}

                    {activeMode === 'CBC' && (
                      <React.Fragment>
                        {/* Encrypt lines */}
                        <line x1={cx} y1="80" x2={cx} y2="105" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="140" x2={cx} y2="165" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="205" x2={cx} y2="290" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Encrypt */}
                        {i === 0 && <path d={`M ${cx - 140} 125 L ${cx - 15} 125`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                        {i < 2 && <path d={`M ${cx} 250 L ${cx + 175} 250 L ${cx + 175} 125 L ${nextCx - 15} 125`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                        
                        {/* Decrypt lines */}
                        <line x1={cx} y1="420" x2={cx} y2="505" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="545" x2={cx} y2="570" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="605" x2={cx} y2="630" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Decrypt */}
                        {i === 0 && <path d={`M ${cx - 140} 590 L ${cx - 15} 590`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                        {i < 2 && <path d={`M ${cx} 465 L ${cx + 175} 465 L ${cx + 175} 590 L ${nextCx - 15} 590`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                      </React.Fragment>
                    )}

                    {activeMode === 'CFB' && (
                      <React.Fragment>
                        {/* Encrypt lines */}
                        <line x1={cx} y1="80" x2={cx} y2="165" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="205" x2={cx} y2="230" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="265" x2={cx} y2="290" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 250 L ${cx - 15} 250`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Encrypt (From C to Next IV) */}
                        {i < 2 && <path d={`M ${cx} 280 L ${cx + 175} 280 L ${cx + 175} 40 L ${nextCx} 40 L ${nextCx} 50`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                        
                        {/* Decrypt lines */}
                        <line x1={cx} y1="420" x2={cx} y2="505" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="545" x2={cx} y2="570" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="605" x2={cx} y2="630" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 590 L ${cx - 15} 590`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Decrypt (From C box bottom to Next IV) - Cleanly goes under P */}
                        {i < 2 && <path d={`M ${cx - 110} 605 L ${cx - 110} 660 L ${cx + 175} 660 L ${cx + 175} 380 L ${nextCx} 380 L ${nextCx} 390`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                      </React.Fragment>
                    )}

                    {activeMode === 'OFB' && (
                      <React.Fragment>
                        {/* Encrypt lines */}
                        <line x1={cx} y1="80" x2={cx} y2="165" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="205" x2={cx} y2="230" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="265" x2={cx} y2="290" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 250 L ${cx - 15} 250`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Encrypt (From Encrypt output to Next IV) */}
                        {i < 2 && <path d={`M ${cx} 220 L ${cx + 175} 220 L ${cx + 175} 40 L ${nextCx} 40 L ${nextCx} 50`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                        
                        {/* Decrypt lines */}
                        <line x1={cx} y1="420" x2={cx} y2="505" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="545" x2={cx} y2="570" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="605" x2={cx} y2="630" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 590 L ${cx - 15} 590`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        {/* Feedback Decrypt (From Encrypt output to Next IV) */}
                        {i < 2 && <path d={`M ${cx} 530 L ${cx + 175} 530 L ${cx + 175} 380 L ${nextCx} 380 L ${nextCx} 390`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />}
                      </React.Fragment>
                    )}

                    {activeMode === 'CTR' && (
                      <React.Fragment>
                        {/* Encrypt lines */}
                        <line x1={cx} y1="80" x2={cx} y2="165" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="205" x2={cx} y2="230" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="265" x2={cx} y2="290" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 250 L ${cx - 15} 250`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        
                        {/* Decrypt lines */}
                        <line x1={cx} y1="420" x2={cx} y2="505" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="545" x2={cx} y2="570" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <line x1={cx} y1="605" x2={cx} y2="630" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                        <path d={`M ${cx - 80} 590 L ${cx - 15} 590`} fill="none" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowGrey)" />
                      </React.Fragment>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Section Headers */}
            <div style={{ position: 'absolute', top: '10px', left: '30px', color: '#10B981', fontSize: '20px', fontWeight: 'bold' }}>Encryption Phase</div>
            <div style={{ position: 'absolute', top: '355px', left: '30px', color: '#38BDF8', fontSize: '20px', fontWeight: 'bold' }}>Decryption Phase</div>

            {/* Ellipses */}
            <div style={{ position: 'absolute', top: '187.5px', left: '800px', transform: 'translate(-50%, -50%)', color: '#EF4444', fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px' }}>...</div>
            <div style={{ position: 'absolute', top: '527.5px', left: '800px', transform: 'translate(-50%, -50%)', color: '#EF4444', fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px' }}>...</div>

            {/* Isolated IV inputs for CBC (left of first block) */}
            {activeMode === 'CBC' && (
              <React.Fragment>
                <div style={{ position: 'absolute', top: '110px', left: '70px', width: '40px', height: '30px', background: '#0B1E36', border: '1px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>IV</div>
                <div style={{ position: 'absolute', top: '575px', left: '70px', width: '40px', height: '30px', background: '#0B1E36', border: '1px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>IV</div>
              </React.Fragment>
            )}

            {/* Mapped Block Elements */}
            {[200, 600, 1000].map((cx, i) => {
              const idx = i === 2 ? 'N' : i + 1;
              
              const topLabelEnc = activeMode === 'CTR' ? `CTR` : activeMode === 'CFB' || activeMode === 'OFB' ? (i === 0 ? 'IV' : 'C') : 'P';
              const topSubEnc = topLabelEnc === 'CTR' || topLabelEnc === 'C' ? <sub style={{ fontSize: '10px', marginLeft: '2px' }}>{topLabelEnc === 'C' ? i : idx}</sub> : (topLabelEnc === 'P' ? <sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub> : null);

              const botLabelEnc = 'C';
              
              const topLabelDec = activeMode === 'CTR' ? `CTR` : activeMode === 'CFB' || activeMode === 'OFB' ? (i === 0 ? 'IV' : 'C') : 'C';
              const topSubDec = topLabelDec === 'CTR' ? <sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub> : (topLabelDec === 'C' && i > 0 && (activeMode === 'CFB' || activeMode === 'OFB') ? <sub style={{ fontSize: '10px', marginLeft: '2px' }}>{i}</sub> : (topLabelDec === 'C' ? <sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub> : null));
              
              const botLabelDec = 'P';

              return (
                <React.Fragment key={`mode-elems-${i}`}>
                  {/* --- ENCRYPTION ROW --- */}
                  {/* Top Box (P, IV, or CTR) */}
                  <div style={{ position: 'absolute', top: '50px', left: `${cx - 60}px`, width: '120px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>
                    {topLabelEnc}{topSubEnc}
                  </div>
                  
                  {/* XOR CBC */}
                  {activeMode === 'CBC' && <XorCircle cx={cx} cy={125} />}
                  
                  {/* Encrypt Box */}
                  <div style={{ position: 'absolute', top: '170px', left: `${cx - 50}px`, width: '100px', height: '35px', background: '#0B1E36', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>Encrypt</div>
                  
                  {/* XOR CFB/OFB/CTR with P left */}
                  {['CFB', 'OFB', 'CTR'].includes(activeMode) && (
                    <React.Fragment>
                      <XorCircle cx={cx} cy={250} />
                      <div style={{ position: 'absolute', top: '235px', left: `${cx - 140}px`, width: '60px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>P<sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub></div>
                    </React.Fragment>
                  )}

                  {/* Bottom Box (C) */}
                  <div style={{ position: 'absolute', top: '295px', left: `${cx - 60}px`, width: '120px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>{botLabelEnc}<sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub></div>
                  
                  {/* Key (K) */}
                  <div style={{ position: 'absolute', top: '187.5px', left: `${cx - 110}px`, transform: 'translate(-50%, -50%)', color: '#fff', fontStyle: 'italic', fontWeight: 'bold' }}>K</div>


                  {/* --- DECRYPTION ROW --- */}
                  {/* Top Box (C, IV, or CTR) */}
                  <div style={{ position: 'absolute', top: '390px', left: `${cx - 60}px`, width: '120px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>
                    {topLabelDec}{topSubDec}
                  </div>
                  
                  {/* Decrypt/Encrypt Box */}
                  <div style={{ position: 'absolute', top: '510px', left: `${cx - 50}px`, width: '100px', height: '35px', background: '#0B1E36', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                    {['CFB', 'OFB', 'CTR'].includes(activeMode) ? 'Encrypt' : 'Decrypt'}
                  </div>
                  
                  {/* XOR CBC */}
                  {activeMode === 'CBC' && <XorCircle cx={cx} cy={590} />}
                  
                  {/* XOR CFB/OFB/CTR with C left */}
                  {['CFB', 'OFB', 'CTR'].includes(activeMode) && (
                    <React.Fragment>
                      <XorCircle cx={cx} cy={590} />
                      <div style={{ position: 'absolute', top: '575px', left: `${cx - 140}px`, width: '60px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>C<sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub></div>
                    </React.Fragment>
                  )}

                  {/* Bottom Box (P) */}
                  <div style={{ position: 'absolute', top: '635px', left: `${cx - 60}px`, width: '120px', height: '30px', background: '#0B1E36', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontStyle: 'italic' }}>{botLabelDec}<sub style={{ fontSize: '10px', marginLeft: '2px' }}>{idx}</sub></div>
                  
                  {/* Key (K) */}
                  <div style={{ position: 'absolute', top: '527.5px', left: `${cx - 110}px`, transform: 'translate(-50%, -50%)', color: '#fff', fontStyle: 'italic', fontWeight: 'bold' }}>K</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockCipherModes;
