import React, { useState } from 'react';

const CryptographyTypes = () => {
  const [activeMode, setActiveMode] = useState('Symmetric');

  const modes = [
    { 
      id: 'Symmetric', 
      name: 'Symmetric Cryptography', 
      desc: 'Uses a single shared secret key for both encryption and decryption. Fast and efficient, but requires secure key distribution.' 
    },
    { 
      id: 'Asymmetric', 
      name: 'Asymmetric Cryptography', 
      desc: 'Uses a mathematically linked key pair: a public key for encryption and a private key for decryption. Solves the key distribution problem.' 
    }
  ];

  // Helper SVG Components
  const TxtDoc = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-30" y="-40" width="60" height="80" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <polygon points="10,-40 30,-20 30,-40" fill="#64748B" />
      <rect x="-20" y="10" width="40" height="20" rx="2" fill="#10B981" />
      <text x="0" y="24" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">TXT</text>
    </g>
  );

  const CipherDoc = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-30" y="-40" width="60" height="80" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <line x1="-15" y1="-10" x2="15" y2="-10" stroke="#94A3B8" strokeWidth="2" />
      <line x1="-15" y1="0" x2="15" y2="0" stroke="#94A3B8" strokeWidth="2" />
      <line x1="-15" y1="10" x2="5" y2="10" stroke="#94A3B8" strokeWidth="2" />
      <line x1="-15" y1="20" x2="15" y2="20" stroke="#94A3B8" strokeWidth="2" />
    </g>
  );

  const PurpleLock = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y="-10" width="40" height="30" rx="4" fill="#A855F7" />
      <path d="M -10 -10 V -20 A 10 10 0 0 1 10 -20 V -10" fill="none" stroke="#A855F7" strokeWidth="4" />
      <circle cx="0" cy="0" r="3" fill="#fff" />
      <path d="M -2 0 L -3 10 L 3 10 L 2 0 Z" fill="#fff" />
    </g>
  );

  const StyledKey = ({ x, y, color = "#EAB308", rotation = 0 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <rect x="-15" y="-15" width="35" height="30" fill="#050B14" />
      <circle cx="-10" cy="0" r="6" fill="#050B14" stroke={color} strokeWidth="3" />
      <line x1="-4" y1="0" x2="15" y2="0" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="0" x2="8" y2="6" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="0" x2="12" y2="6" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  );



  const SymTopRightDeco = ({ x, y }) => (
    <g transform={`translate(${x}, ${y}) scale(0.9)`}>
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="#10B981" strokeWidth="2" />
      <circle cx="-25" cy="0" r="2" fill="#10B981" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="#10B981" strokeWidth="2" />
      <circle cx="25" cy="0" r="2" fill="#10B981" />
      <rect x="-15" y="-10" width="30" height="20" fill="#3B82F6" rx="3" />
      <path d="M -7 -10 V -15 A 7 7 0 0 1 7 -15 V -10" fill="none" stroke="#3B82F6" strokeWidth="3" />
    </g>
  );

  const AsymTopLeftDeco = ({ x, y }) => (
    <g transform={`translate(${x}, ${y}) scale(0.9)`}>
      <rect x="-20" y="-25" width="30" height="40" fill="#334155" rx="3" />
      <text x="-5" y="-10" fill="#EAB308" fontSize="10" textAnchor="middle">0101</text>
      <text x="-5" y="0" fill="#EAB308" fontSize="10" textAnchor="middle">1010</text>
      <rect x="-25" y="0" width="20" height="15" fill="#F59E0B" rx="2" />
      <path d="M -20 0 V -5 A 5 5 0 0 1 -10 -5 V 0" fill="none" stroke="#F59E0B" strokeWidth="2" />
    </g>
  );

  const AsymTopRightDeco = ({ x, y }) => (
    <g transform={`translate(${x}, ${y}) scale(0.9)`}>
      <rect x="-20" y="-15" width="40" height="30" fill="#4F46E5" rx="4" />
      <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#818CF8" strokeWidth="2" />
      <circle cx="10" cy="10" r="8" fill="#A855F7" />
      <circle cx="10" cy="10" r="4" fill="none" stroke="#fff" strokeWidth="2" />
      <line x1="14" y1="14" x2="18" y2="18" stroke="#fff" strokeWidth="2" />
    </g>
  );

  return (
    <section className="view-section active">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <h2>Cryptography Types</h2>
        <p>
          Encryption algorithms generally fall into two main categories based on how keys are used:
          <strong> Symmetric</strong> and <strong>Asymmetric</strong>. Each approach has unique strengths and use cases in modern security architecture.
        </p>
      </div>

      <div className="mode-tabs">
        {modes.map((mode) => (
          <button 
            key={mode.id}
            className={`mode-tab ${activeMode === mode.id ? 'active' : ''}`} 
            onClick={() => setActiveMode(mode.id)}
          >
            {mode.name}
          </button>
        ))}
      </div>

      <div className="mode-info" style={{ textAlign: 'center', marginBottom: '10px', padding: '0 20px' }}>
        <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', marginBottom: '10px', marginTop: 0 }}>
          {modes.find(m => m.id === activeMode)?.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '900px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {modes.find(m => m.id === activeMode)?.desc}
        </p>
      </div>

      <div className="flowchart-scale-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '40px' }}>
        <div style={{ width: '1200px', maxWidth: '100%', height: '510px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          <div style={{ width: '1200px', height: '600px', position: 'absolute', top: 0, background: '#050B14', transform: 'scale(0.85)', transformOrigin: 'top center', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            
            {/* Title Header matching Block Cipher Modes styling */}
            <div style={{ position: 'absolute', top: '25px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ background: '#3B0764', border: '1px solid #A855F7', padding: '8px 30px', borderRadius: '8px', color: '#D8B4FE', fontSize: '20px', fontWeight: 'bold' }}>
                {activeMode} Encryption
              </div>
            </div>

            <svg width="1200" height="600" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
              <defs>
                <style>
                  {`
                    @keyframes dashFlow {
                      to { stroke-dashoffset: -14; }
                    }
                    .sym-line { stroke: #A855F7; stroke-width: 3; stroke-dasharray: 8,6; fill: none; animation: dashFlow 1s linear infinite; }
                    .asym-red { stroke: #EF4444; stroke-width: 3; stroke-dasharray: 8,6; fill: none; animation: dashFlow 1s linear infinite; }
                    .asym-purple { stroke: #A855F7; stroke-width: 3; stroke-dasharray: 8,6; fill: none; animation: dashFlow 1s linear infinite; }
                    .asym-yellow { stroke: #EAB308; stroke-width: 3; stroke-dasharray: 8,6; fill: none; animation: dashFlow 1s linear infinite; }
                  `}
                </style>
                <marker id="arrowSym" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#A855F7" />
                </marker>
                <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#EF4444" />
                </marker>
                <marker id="arrowYellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#EAB308" />
                </marker>
              </defs>

              {/* === SYMMETRIC MODE === */}
              {activeMode === 'Symmetric' && (
                <g>
                  {/* Top Key Routing */}
                  <polyline points="600,130 600,150 400,150 400,370" className="sym-line" markerEnd="url(#arrowSym)" />
                  <polyline points="600,130 600,150 800,150 800,370" className="sym-line" markerEnd="url(#arrowSym)" />

                  {/* Main Row Routing */}
                  <line x1="240" y1="400" x2="365" y2="400" className="sym-line" markerEnd="url(#arrowSym)" />
                  <line x1="435" y1="400" x2="560" y2="400" className="sym-line" markerEnd="url(#arrowSym)" />
                  <line x1="640" y1="400" x2="765" y2="400" className="sym-line" markerEnd="url(#arrowSym)" />
                  <line x1="835" y1="400" x2="960" y2="400" className="sym-line" markerEnd="url(#arrowSym)" />

                  {/* Top Keys */}
                  <StyledKey x={600} y={130} rotation={90} color="#EAB308" />
                  <text x="600" y="190" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Same Key</text>

                  {/* Vertical Keys */}
                  <StyledKey x={400} y={250} rotation={90} color="#EAB308" />
                  <text x="320" y="255" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>
                  
                  <StyledKey x={800} y={250} rotation={90} color="#EAB308" />
                  <text x="880" y="255" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>

                  {/* Decorator Icons */}
                  <AsymTopLeftDeco x={200} y={180} />
                  <text x="200" y="240" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>

                  <SymTopRightDeco x={1000} y={180} />
                  <text x="1000" y="240" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>
                </g>
              )}

              {/* === ASYMMETRIC MODE === */}
              {activeMode === 'Asymmetric' && (
                <g>
                  {/* Top Key Routing */}
                  <polyline points="550,130 550,150 400,150 400,370" className="asym-purple" markerEnd="url(#arrowSym)" />
                  <polyline points="650,130 650,150 800,150 800,370" className="asym-yellow" markerEnd="url(#arrowYellow)" />

                  {/* Main Row Routing */}
                  <line x1="240" y1="400" x2="365" y2="400" className="asym-red" markerEnd="url(#arrowRed)" />
                  <line x1="435" y1="400" x2="560" y2="400" className="asym-red" markerEnd="url(#arrowRed)" />
                  <line x1="640" y1="400" x2="765" y2="400" className="asym-red" markerEnd="url(#arrowRed)" />
                  <line x1="835" y1="400" x2="960" y2="400" className="asym-red" markerEnd="url(#arrowRed)" />

                  {/* Top Keys */}
                  <StyledKey x={550} y={130} rotation={90} color="#A855F7" />
                  <StyledKey x={650} y={130} rotation={90} color="#EAB308" />
                  <text x="600" y="190" fill="#94A3B8" fontSize="14" fontWeight="bold" textAnchor="middle">Different Key</text>

                  {/* Vertical Keys */}
                  <StyledKey x={400} y={250} rotation={90} color="#A855F7" />
                  <text x="320" y="255" fill="#A855F7" fontSize="14" fontWeight="bold" textAnchor="middle">Public Key</text>
                  
                  <StyledKey x={800} y={250} rotation={90} color="#EAB308" />
                  <text x="880" y="255" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>

                  {/* Decorator Icons */}
                  <AsymTopLeftDeco x={200} y={180} />
                  <text x="200" y="240" fill="#A855F7" fontSize="14" fontWeight="bold" textAnchor="middle">Public Key</text>

                  <AsymTopRightDeco x={1000} y={180} />
                  <text x="1000" y="240" fill="#EAB308" fontSize="14" fontWeight="bold" textAnchor="middle">Private Key</text>
                </g>
              )}

              {/* COMMON MAIN ROW ELEMENTS (Shared Layout) */}
              {/* Process Titles */}
              <text x="400" y="450" fill="#10B981" fontSize="20" fontWeight="bold" textAnchor="middle" letterSpacing="1">ENCRYPTION</text>
              <text x="800" y="450" fill="#38BDF8" fontSize="20" fontWeight="bold" textAnchor="middle" letterSpacing="1">DECRYPTION</text>

              <TxtDoc x={200} y={400} />
              <text x="200" y="470" fill="#94A3B8" fontSize="16" fontWeight="bold" textAnchor="middle">Plain Text</text>
              <text x="200" y="495" fill="#10B981" fontSize="14" fontStyle="italic" textAnchor="middle">"Hello"</text>

              <PurpleLock x={400} y={400} />

              <CipherDoc x={600} y={400} />
              <text x="600" y="470" fill="#94A3B8" fontSize="16" fontWeight="bold" textAnchor="middle">Cipher Text</text>
              <text x="600" y="495" fill="#F59E0B" fontSize="14" fontStyle="italic" textAnchor="middle">"4rhej32"</text>

              <PurpleLock x={800} y={400} />

              <TxtDoc x={1000} y={400} />
              <text x="1000" y="470" fill="#94A3B8" fontSize="16" fontWeight="bold" textAnchor="middle">Plain Text</text>
              <text x="1000" y="495" fill="#10B981" fontSize="14" fontStyle="italic" textAnchor="middle">"Hello"</text>

            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptographyTypes;
