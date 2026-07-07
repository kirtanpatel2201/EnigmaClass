import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DigitalSignature = () => {
  const [activeNode, setActiveNode] = useState('Original Data');

  const getGlow = (nodeName) => {
    const isSelected = activeNode === nodeName;
    return isSelected ? { filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))', cursor: 'pointer' } : { cursor: 'pointer' };
  };

  const getGlowStyle = (nodeName) => {
    const isSelected = activeNode === nodeName;
    return isSelected ? { stroke: '#10b981', strokeWidth: 3, filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' } : {};
  };

  const DocIcon = ({ x, y, label, nodeName }) => {
    const dynamicStyle = getGlowStyle(nodeName);
    return (
      <motion.g 
        transform={`translate(${x}, ${y})`} 
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        <rect x="-30" y="-40" width="60" height="80" rx="4" fill="#0C4A6E" stroke={dynamicStyle.stroke || "#38BDF8"} strokeWidth={dynamicStyle.strokeWidth || 2} />
        <polygon points="10,-40 30,-20 30,-40" fill="#38BDF8" />
        <text x="0" y="5" fill="#E0F2FE" fontSize="12" fontWeight="bold" textAnchor="middle">{label}</text>
      </motion.g>
    );
  };

  const StyledKey = ({ x, y, color = "#EAB308", rotation = 0, label, nodeName }) => {
    const dynamicStyle = getGlowStyle(nodeName);
    return (
      <motion.g 
        transform={`translate(${x}, ${y}) rotate(${rotation})`}
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        <rect x="-15" y="-15" width="35" height="30" fill="#050B14" />
        <circle cx="-10" cy="0" r="6" fill="#050B14" stroke={dynamicStyle.stroke || color} strokeWidth={dynamicStyle.strokeWidth || 3} />
        <line x1="-4" y1="0" x2="15" y2="0" stroke={dynamicStyle.stroke || color} strokeWidth={dynamicStyle.strokeWidth || 3} strokeLinecap="round" />
        <line x1="8" y1="0" x2="8" y2="6" stroke={dynamicStyle.stroke || color} strokeWidth={dynamicStyle.strokeWidth || 3} strokeLinecap="round" />
        <line x1="12" y1="0" x2="12" y2="6" stroke={dynamicStyle.stroke || color} strokeWidth={dynamicStyle.strokeWidth || 3} strokeLinecap="round" />
        <text x={0} y={30} fill={color} fontSize="12" fontWeight="bold" textAnchor="middle" transform={`rotate(${-rotation})`}>{label}</text>
      </motion.g>
    );
  };

  const ProcessNode = ({ x, y, width, height, text, colorCode, nodeName }) => {
    let fill, stroke;
    if (colorCode === 'hash') { fill = "#14532D"; stroke = "#4ADE80"; }
    else if (colorCode === 'crypto') { fill = "#4C1D95"; stroke = "#C084FC"; }
    else if (colorCode === 'compare') { fill = "#334155"; stroke = "#94A3B8"; }
    else if (colorCode === 'data') { fill = "#78350F"; stroke = "#FBBF24"; }

    const dynamicStyle = getGlowStyle(nodeName);

    return (
      <motion.g 
        transform={`translate(${x}, ${y})`}
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        <rect x={-width/2} y={-height/2} width={width} height={height} rx="6" fill={fill} stroke={dynamicStyle.stroke || stroke} strokeWidth={dynamicStyle.strokeWidth || 2} />
        <text x="0" y="5" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">{text}</text>
      </motion.g>
    );
  };

  return (
    <section className="view-section active">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <h2>Digital Signature Process</h2>
        <p>
          A digital signature proves the authenticity and integrity of a message. The sender hashes the data 
          and encrypts the hash with their private key. The receiver decrypts it using the sender's public key and verifies the hash.
        </p>
      </div>

      <div className="flowchart-scale-wrapper" style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', margin: '0 auto', padding: '0 20px', marginTop: '20px' }}>
          
          <div style={{ width: '800px', height: '448px', flexShrink: 0 }}>
            <div style={{ width: '1250px', height: '700px', position: 'relative', background: '#050B14', transform: 'scale(0.64)', transformOrigin: 'top left', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              
              <svg width="1250" height="700" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <style>
                    {`
                      @keyframes flowAnim {
                        to { stroke-dashoffset: -14; }
                      }
                      .ds-line { stroke: #94A3B8; stroke-width: 2; fill: none; stroke-dasharray: 8,6; animation: flowAnim 1s linear infinite; }
                      .ds-line-solid { stroke: #94A3B8; stroke-width: 2; fill: none; }
                    `}
                  </style>
                  <marker id="ds-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#94A3B8" />
                  </marker>
                </defs>

                <g transform="translate(100, 50)">
                  <rect width={350} height={550} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                  <text x="20" y="30" fill="#64748B" fontSize="16" fontWeight="bold">SENDER (SIGNING)</text>
                </g>

                <g transform="translate(750, 50)">
                  <rect width={450} height={550} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                  <text x="20" y="30" fill="#64748B" fontSize="16" fontWeight="bold">RECEIVER (VERIFICATION)</text>
                </g>

                <DocIcon x={275} y={120} label="Data" nodeName="Original Data" />
                <line x1="275" y1="160" x2="275" y2="210" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={275} y={235} width={140} height={50} text="Hash Function" colorCode="hash" nodeName="Sender Hash Function" />
                <line x1="275" y1="260" x2="275" y2="310" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={275} y={335} width={120} height={50} text="Hash Digest" colorCode="data" nodeName="Hash Digest" />
                <line x1="275" y1="360" x2="275" y2="410" className="ds-line" markerEnd="url(#ds-arrow)" />
                <StyledKey x={150} y={435} color="#EAB308" label="Private Key" nodeName="Private Key" />
                <line x1="170" y1="435" x2="200" y2="435" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={275} y={435} width={150} height={50} text="Encrypt (Sign)" colorCode="crypto" nodeName="Encrypt (Sign)" />
                <line x1="275" y1="460" x2="275" y2="520" className="ds-line" markerEnd="url(#ds-arrow)" />
                <DocIcon x={275} y={550} label="Signature" nodeName="Generated Signature" />

                <g transform="translate(480, 100)">
                  <rect width={180} height={480} fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4,4" rx="8" />
                  <text x="90" y="-15" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle">Insecure Network</text>
                </g>

                <polyline points="305,120 550,120 550,210 820,210" className="ds-line" markerEnd="url(#ds-arrow)" />
                <text x="430" y="110" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle">Original Data</text>

                <polyline points="305,550 590,550 590,250 1020,250" className="ds-line" markerEnd="url(#ds-arrow)" />
                <text x="450" y="540" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle">Digital Signature</text>

                <DocIcon x={850} y={230} label="Data" nodeName="Received Data" />
                <DocIcon x={1050} y={230} label="Signature" nodeName="Received Signature" />

                <line x1="850" y1="270" x2="850" y2="330" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={850} y={355} width={140} height={50} text="Hash Function" colorCode="hash" nodeName="Receiver Hash Function" />
                <line x1="850" y1="380" x2="850" y2="430" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={850} y={455} width={120} height={50} text="Computed Hash" colorCode="data" nodeName="Computed Hash" />

                <line x1="1050" y1="270" x2="1050" y2="330" className="ds-line" markerEnd="url(#ds-arrow)" />
                
                <StyledKey x={1170} y={355} color="#A855F7" rotation={180} label="Public Key" nodeName="Public Key" />
                <line x1="1145" y1="355" x2="1130" y2="355" className="ds-line" markerEnd="url(#ds-arrow)" />
                
                <ProcessNode x={1050} y={355} width={160} height={50} text="Decrypt (Verify)" colorCode="crypto" nodeName="Decrypt (Verify)" />
                <line x1="1050" y1="380" x2="1050" y2="430" className="ds-line" markerEnd="url(#ds-arrow)" />
                <ProcessNode x={1050} y={455} width={120} height={50} text="Received Hash" colorCode="data" nodeName="Decrypted Hash" />

                <line x1="850" y1="480" x2="850" y2="520" className="ds-line" />
                <line x1="1050" y1="480" x2="1050" y2="520" className="ds-line" />
                <polyline points="850,520 950,520 950,535" className="ds-line" markerEnd="url(#ds-arrow)" />
                <polyline points="1050,520 950,520" className="ds-line" />

                <ProcessNode x={950} y={560} width={100} height={50} text="Compare" colorCode="compare" nodeName="Compare" />

                <line x1="950" y1="585" x2="950" y2="630" className="ds-line-solid" markerEnd="url(#ds-arrow)" />
                
                <motion.g 
                  transform="translate(880, 630)"
                  onClick={() => setActiveNode('Signature Valid')}
                  style={getGlow('Signature Valid')}
                >
                  <rect width={140} height={40} fill="#050B14" stroke={activeNode === 'Signature Valid' ? '#10b981' : '#10B981'} strokeWidth={activeNode === 'Signature Valid' ? 3 : 2} rx="4" />
                  <text x="70" y="25" fill="#10B981" fontSize="14" fontWeight="bold" textAnchor="middle">Signature Valid</text>
                </motion.g>

              </svg>
            </div>
          </div>

          <div style={{ flex: '0 0 350px', position: 'sticky', top: '20px' }}>
            <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Click any operator or box in the diagram to learn about its exact role.</p>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '12px', marginTop: 0, fontSize: '1.2rem' }}>{activeNode}</h3>
              
              {activeNode === 'Original Data' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The raw electronic document or file the sender wishes to sign.<br/><br/><strong>Why it matters:</strong> This is the payload. A digital signature is securely bound to this exact sequence of bytes. If this document is modified by even a single character, the signature will break.</p>}
              {activeNode === 'Sender Hash Function' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A cryptographic hashing algorithm (like SHA-256) used by the sender.<br/><br/><strong>Why it matters:</strong> We don't encrypt the entire document with the private key because asymmetric encryption is incredibly slow. Instead, we condense the document into a small, fixed-size mathematical fingerprint (the hash) and encrypt that.</p>}
              {activeNode === 'Hash Digest' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The resulting fingerprint of the original document.<br/><br/><strong>Why it matters:</strong> This digest uniquely represents the document. The goal of the signature is to securely transmit this digest so the receiver can prove it hasn't changed.</p>}
              {activeNode === 'Private Key' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The sender's mathematically linked secret key. Known only to them.<br/><br/><strong>Why it matters:</strong> This provides non-repudiation. Because only the sender possesses this key, any data encrypted by it absolutely, provably originated from them.</p>}
              {activeNode === 'Encrypt (Sign)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The asymmetric encryption algorithm (like RSA or ECDSA) applying the Private Key to the Hash Digest.<br/><br/><strong>Why it matters:</strong> This is the literal act of "signing". It locks the document's fingerprint inside a cryptographic vault that can only be unlocked by the sender's public key.</p>}
              {activeNode === 'Generated Signature' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The resulting encrypted hash digest.<br/><br/><strong>Why it matters:</strong> This block of data is appended to the original document and sent across the network. It travels alongside the plaintext data as the proof of authenticity.</p>}
              
              {activeNode === 'Received Data' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The document after it has traversed the insecure network.<br/><br/><strong>Why it matters:</strong> The receiver cannot blindly trust this document. An attacker might have intercepted the transmission and modified the contents.</p>}
              {activeNode === 'Received Signature' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The signature block that accompanied the received document.<br/><br/><strong>Why it matters:</strong> This contains the sender's original, locked hash digest. It is the key to proving the document is unaltered.</p>}
              {activeNode === 'Receiver Hash Function' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The exact same cryptographic hashing algorithm used by the sender.<br/><br/><strong>Why it matters:</strong> The receiver must independently recalculate the fingerprint of the received document to see what it *currently* hashes to.</p>}
              {activeNode === 'Computed Hash' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The receiver's newly calculated fingerprint of the document they just downloaded.<br/><br/><strong>Why it matters:</strong> If the document was altered in transit, this Computed Hash will be entirely different from the original sender's hash.</p>}
              {activeNode === 'Public Key' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The sender's publicly distributed, mathematically linked key.<br/><br/><strong>Why it matters:</strong> Anyone can possess this key. Its sole mathematical purpose is to decrypt data that was encrypted by the corresponding private key.</p>}
              {activeNode === 'Decrypt (Verify)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The asymmetric decryption process applied to the received signature using the public key.<br/><br/><strong>Why it matters:</strong> If the decryption succeeds, it proves mathematically that the signature was created by the owner of the private key (Authenticity). It unlocks the vault to reveal the sender's original Hash Digest.</p>}
              {activeNode === 'Decrypted Hash' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The original sender's Hash Digest, recovered from the signature.<br/><br/><strong>Why it matters:</strong> This is what the document *should* look like, according to the sender.</p>}
              {activeNode === 'Compare' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A strict byte-for-byte comparison.<br/><br/><strong>Why it matters:</strong> The algorithm checks if the receiver's independently **Computed Hash** perfectly matches the sender's **Decrypted Hash**.</p>}
              {activeNode === 'Signature Valid' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The final validation state indicating a perfect match.<br/><br/><strong>Why it matters:</strong> If they match, the signature is valid. This guarantees two things: (1) The document was absolutely signed by the sender (Authenticity) and (2) The document has not been altered by a single byte since it was signed (Integrity).</p>}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalSignature;
