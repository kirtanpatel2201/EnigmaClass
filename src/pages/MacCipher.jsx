import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MacCipher = () => {
  const [activeNode, setActiveNode] = useState('Message');

  const getGlow = (nodeName) => {
    const isSelected = activeNode === nodeName;
    return isSelected ? { filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))', cursor: 'pointer' } : { cursor: 'pointer' };
  };

  const getGlowStroke = (nodeName, defaultStroke) => {
    return activeNode === nodeName ? '#10b981' : defaultStroke;
  };

  const getGlowSW = (nodeName) => activeNode === nodeName ? 3 : 2;

  const RectNode = ({ x, y, width, height, text, type, rx = 6, nodeName }) => {
    let fill, stroke, textColor = "#fff";
    if (type === 'message') { fill = "#0C4A6E"; stroke = "#38BDF8"; textColor = "#E0F2FE"; }
    else if (type === 'algo') { fill = "#14532D"; stroke = "#4ADE80"; textColor = "#DCFCE7"; }
    else if (type === 'mac') { fill = "#78350F"; stroke = "#FBBF24"; textColor = "#FEF3C7"; }
    else if (type === 'compare') { fill = "#4C1D95"; stroke = "#C084FC"; textColor = "#EDE9FE"; }
    else if (type === 'reject') { fill = "#1a0606"; stroke = "#EF4444"; textColor = "#EF4444"; }
    else if (type === 'accept') { fill = "#061a12"; stroke = "#10B981"; textColor = "#10B981"; }
    else if (type === 'key') { fill = "#334155"; stroke = "#94A3B8"; textColor = "#F8FAFC"; rx = 20; }

    const lines = text.split('|');
    
    return (
      <motion.g 
        transform={`translate(${x}, ${y})`}
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        <rect width={width} height={height} rx={rx} fill={fill} stroke={getGlowStroke(nodeName, stroke)} strokeWidth={getGlowSW(nodeName)} />
        {lines.length > 1 ? (
          <>
            <text x={width / 2} y={height / 2 - 6} fill={textColor} fontSize="16" fontWeight="bold" textAnchor="middle">{lines[0]}</text>
            <text x={width / 2} y={height / 2 + 16} fill={textColor} fontSize="16" fontWeight="bold" textAnchor="middle">{lines[1]}</text>
          </>
        ) : (
          <text x={width / 2} y={height / 2 + 6} fill={textColor} fontSize="16" fontWeight="bold" textAnchor="middle">{text}</text>
        )}
      </motion.g>
    );
  };

  const BoundingBox = ({ x, y, width, height, label }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={width} height={height} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" rx="12" />
      <text x="20" y={height - 20} fill="#64748B" fontSize="18" fontWeight="bold">{label}</text>
    </g>
  );

  return (
    <section className="view-section active">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <h2>Message Authentication Code (MAC)</h2>
        <p>
          A Message Authentication Code ensures data integrity and authenticity. 
          The sender generates a MAC using a shared secret key, and the receiver verifies it using the same key.
        </p>
      </div>

      <div className="flowchart-scale-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', margin: '0 auto' }}>
          
          <div style={{ width: '768px', height: '448px', flexShrink: 0 }}>
            <div style={{ width: '1200px', height: '700px', position: 'relative', background: '#050B14', transform: 'scale(0.64)', transformOrigin: 'top left', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              
              <svg width="1200" height="700" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <style>
                    {`
                      @keyframes flowAnim { to { stroke-dashoffset: -14; } }
                      .flow-line { stroke: #94A3B8; stroke-width: 2; fill: none; stroke-dasharray: 8,6; animation: flowAnim 1s linear infinite; }
                      .flow-line-solid { stroke: #94A3B8; stroke-width: 2; fill: none; }
                    `}
                  </style>
                  <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#94A3B8" />
                  </marker>
                  <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#EF4444" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#10B981" />
                  </marker>
                </defs>

                {/* Bounding Boxes */}
                <BoundingBox x={30} y={60} width={450} height={520} label="SENDER" />
                <BoundingBox x={540} y={60} width={630} height={520} label="RECEIVER" />

                {/* ── SENDER ── */}
                <RectNode x={180} y={100} width={150} height={60} text="Message" type="message" nodeName="Message" />
                <RectNode x={60}  y={260} width={100} height={40} text="Key"     type="key"     nodeName="Shared Key" />
                <RectNode x={180} y={240} width={150} height={80} text="MAC|Algorithm" type="algo" nodeName="MAC Algorithm" />
                <RectNode x={205} y={400} width={100} height={50} text="MAC"     type="mac"     nodeName="Generated MAC" />

                {/* Packet box (sender) */}
                <motion.g transform="translate(380, 250)" onClick={() => setActiveNode('Transmitted Packet')} style={getGlow('Transmitted Packet')}>
                  <rect width={90} height={80} fill="#0C4A6E" stroke={getGlowStroke('Transmitted Packet','#38BDF8')} strokeWidth={getGlowSW('Transmitted Packet')} rx="6" />
                  <text x={45} y={26} fill="#E0F2FE" fontSize="13" fontWeight="bold" textAnchor="middle">Message</text>
                  <rect x={15} y={40} width={60} height={28} fill="#78350F" stroke="#FBBF24" strokeWidth="1" rx="4" />
                  <text x={45} y={59} fill="#FEF3C7" fontSize="12" fontWeight="bold" textAnchor="middle">MAC</text>
                </motion.g>

                {/* Sender arrows */}
                <line x1="255" y1="160" x2="255" y2="240" className="flow-line" markerEnd="url(#arrowHead)" />
                <line x1="160" y1="280" x2="180" y2="280" className="flow-line" markerEnd="url(#arrowHead)" />
                <line x1="255" y1="320" x2="255" y2="400" className="flow-line" markerEnd="url(#arrowHead)" />
                <polyline points="255,130 360,130 360,290 380,290" className="flow-line" markerEnd="url(#arrowHead)" />
                <polyline points="305,425 360,425 360,290" className="flow-line" />

                {/* ── TRANSMISSION ── */}
                <line x1="470" y1="290" x2="550" y2="290" className="flow-line" markerEnd="url(#arrowHead)" />
                <text x="510" y="275" fill="#64748B" fontSize="13" textAnchor="middle">Network</text>

                {/* Packet box (receiver) */}
                <motion.g transform="translate(550, 250)" onClick={() => setActiveNode('Transmitted Packet')} style={getGlow('Transmitted Packet')}>
                  <rect width={90} height={80} fill="#0C4A6E" stroke={getGlowStroke('Transmitted Packet','#38BDF8')} strokeWidth={getGlowSW('Transmitted Packet')} rx="6" />
                  <text x={45} y={26} fill="#E0F2FE" fontSize="13" fontWeight="bold" textAnchor="middle">Message</text>
                  <rect x={15} y={40} width={60} height={28} fill="#78350F" stroke="#FBBF24" strokeWidth="1" rx="4" />
                  <text x={45} y={59} fill="#FEF3C7" fontSize="12" fontWeight="bold" textAnchor="middle">MAC</text>
                </motion.g>

                {/* ── RECEIVER RIGHT SIDE ── */}
                <RectNode x={740} y={100} width={150} height={60} text="Message"       type="message" nodeName="Message" />
                <RectNode x={740} y={240} width={150} height={80} text="MAC|Algorithm" type="algo"    nodeName="MAC Algorithm" />
                <RectNode x={910} y={260} width={100} height={40} text="Key"           type="key"     nodeName="Shared Key" />

                {/* Split from receiver packet */}
                <polyline points="595,250 595,130 740,130" className="flow-line" markerEnd="url(#arrowHead)" />
                
                {/* Receiver algo arrows */}
                <line x1="815" y1="160" x2="815" y2="240" className="flow-line" markerEnd="url(#arrowHead)" />
                <line x1="910" y1="280" x2="890" y2="280" className="flow-line" markerEnd="url(#arrowHead)" />

                {/* ── COMPARISON PANEL ── */}
                {/* Panel background */}
                <g transform="translate(560, 390)">
                  <rect width={590} height={160} rx="12" fill="#0f1729" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Received MAC box */}
                  <motion.g onClick={() => setActiveNode('Received MAC')} style={getGlow('Received MAC')}>
                    <rect x={20} y={20} width={160} height={55} rx="8" fill="#78350F" stroke={getGlowStroke('Received MAC','#FBBF24')} strokeWidth={getGlowSW('Received MAC')} />
                    <text x={100} y={40} fill="#FEF3C7" fontSize="12" textAnchor="middle" fontWeight="600">Received MAC</text>
                    <text x={100} y={60} fill="#FBBF24" fontSize="11" textAnchor="middle">from packet</text>
                  </motion.g>

                  {/* Computed MAC box */}
                  <motion.g onClick={() => setActiveNode('Computed MAC')} style={getGlow('Computed MAC')}>
                    <rect x={20} y={90} width={160} height={55} rx="8" fill="#78350F" stroke={getGlowStroke('Computed MAC','#FBBF24')} strokeWidth={getGlowSW('Computed MAC')} />
                    <text x={100} y={110} fill="#FEF3C7" fontSize="12" textAnchor="middle" fontWeight="600">Computed MAC</text>
                    <text x={100} y={130} fill="#FBBF24" fontSize="11" textAnchor="middle">re-calculated locally</text>
                  </motion.g>

                  {/* Equal sign / Compare node */}
                  <motion.g onClick={() => setActiveNode('Compare')} style={getGlow('Compare')}>
                    <rect x={230} y={47} width={100} height={70} rx="8" fill="#4C1D95" stroke={getGlowStroke('Compare','#C084FC')} strokeWidth={getGlowSW('Compare')} />
                    <text x={280} y={78} fill="#EDE9FE" fontSize="28" textAnchor="middle" fontWeight="bold">≟</text>
                    <text x={280} y={104} fill="#C084FC" fontSize="11" textAnchor="middle">Compare</text>
                  </motion.g>

                  {/* Lines into compare */}
                  <line x1="180" y1="47" x2="230" y2="82" className="flow-line-solid" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
                  <line x1="180" y1="117" x2="230" y2="82" className="flow-line-solid" stroke="#94A3B8" strokeWidth="1.5" />

                  {/* No Match branch (left-down) */}
                  <line x1="280" y1="47" x2="280" y2="20" stroke="#EF4444" strokeWidth="1.5" fill="none" />
                  <polyline points="280,20 400,20" stroke="#EF4444" strokeWidth="1.5" fill="none" markerEnd="url(#arrowRed)" />
                  <text x={350} y={12} fill="#EF4444" fontSize="13" fontWeight="bold" textAnchor="middle">✗ No Match</text>

                  {/* Match branch (right-down) */}
                  <line x1="280" y1="117" x2="280" y2="140" stroke="#10B981" strokeWidth="1.5" fill="none" />
                  <polyline points="280,140 400,140" stroke="#10B981" strokeWidth="1.5" fill="none" markerEnd="url(#arrowGreen)" />
                  <text x={350} y={132} fill="#10B981" fontSize="13" fontWeight="bold" textAnchor="middle">✓ Match</text>

                  {/* Reject */}
                  <motion.g onClick={() => setActiveNode('Accept / Reject')} style={getGlow('Accept / Reject')}>
                    <rect x={400} y={-5} width={150} height={50} rx="8" fill="#1a0606" stroke={getGlowStroke('Accept / Reject','#EF4444')} strokeWidth={getGlowSW('Accept / Reject')} />
                    <text x={475} y={18} fill="#EF4444" fontSize="14" fontWeight="bold" textAnchor="middle">⛔ Reject</text>
                    <text x={475} y={37} fill="#EF4444" fontSize="11" textAnchor="middle">Message dropped</text>
                  </motion.g>

                  {/* Accept */}
                  <motion.g onClick={() => setActiveNode('Accept / Reject')} style={getGlow('Accept / Reject')}>
                    <rect x={400} y={115} width={150} height={50} rx="8" fill="#061a12" stroke={getGlowStroke('Accept / Reject','#10B981')} strokeWidth={getGlowSW('Accept / Reject')} />
                    <text x={475} y={138} fill="#10B981" fontSize="14" fontWeight="bold" textAnchor="middle">✅ Accept</text>
                    <text x={475} y={157} fill="#10B981" fontSize="11" textAnchor="middle">Message trusted</text>
                  </motion.g>
                </g>

                {/* Lines flowing into the Compare Panel */}
                <line x1="815" y1="320" x2="815" y2="390" className="flow-line" />
                <polyline points="815,390 640,390 640,410" className="flow-line" markerEnd="url(#arrowHead)" />

                <polyline points="595,330 595,380 640,380 640,410" className="flow-line" markerEnd="url(#arrowHead)" />

              </svg>
            </div>
          </div>

          <div style={{ flex: '0 0 350px', position: 'sticky', top: '20px' }}>
            <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Click any operator or box in the diagram to learn about its exact role.</p>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '12px', marginTop: 0, fontSize: '1.2rem' }}>{activeNode}</h3>
              
              {activeNode === 'Message' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The raw, plaintext data that the sender wants to transmit.<br/><br/><strong>Why it matters:</strong> The message is transmitted in plain text. The MAC only ensures it hasn't been tampered with; separate encryption is needed for confidentiality.</p>}
              {activeNode === 'Shared Key' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A symmetric secret key known exclusively by the Sender and the Receiver.<br/><br/><strong>Why it matters:</strong> This is the root of trust. Without this key, an attacker cannot generate a valid MAC for a modified message.</p>}
              {activeNode === 'MAC Algorithm' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A cryptographic function (e.g., HMAC-SHA256) that mixes the Message and Shared Key to produce the MAC tag.<br/><br/><strong>Why it matters:</strong> Even a 1-bit change in the message produces a completely different, unpredictable MAC output.</p>}
              {activeNode === 'Generated MAC' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The cryptographic tag produced by the MAC Algorithm.<br/><br/><strong>Why it matters:</strong> This unforgeable tag is attached to the message — it acts as a wax seal guaranteeing authenticity and integrity.</p>}
              {activeNode === 'Transmitted Packet' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The bundled payload of the original Message + Generated MAC tag.<br/><br/><strong>Why it matters:</strong> Anyone can see the message, but altering even one byte invalidates the MAC, alerting the receiver.</p>}
              {activeNode === 'Received MAC' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The MAC tag extracted from the incoming network packet.<br/><br/><strong>Why it matters:</strong> This is the sender's "claim" — the receiver must verify it against their own computed result.</p>}
              {activeNode === 'Computed MAC' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A fresh MAC tag re-generated locally by the Receiver using the received Message and their Shared Key.<br/><br/><strong>Why it matters:</strong> If the message was altered, this will differ from the Received MAC, revealing the tampering.</p>}
              {activeNode === 'Compare' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A strict byte-for-byte equality check: Received MAC ≟ Computed MAC.<br/><br/><strong>Why it matters:</strong> This is the final security gate — every bit must match for the message to be trusted.</p>}
              {activeNode === 'Accept / Reject' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>Match → Accept:</strong> The message is trusted. It came from a legitimate sender and was not altered.<br/><br/><strong>No Match → Reject:</strong> The message is immediately dropped. It was either corrupted in transit or maliciously modified by an attacker.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MacCipher;
