import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Sha512Cipher = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNode, setSelectedNode] = useState('Message');
  const [selectedRoundNode, setSelectedRoundNode] = useState('Registers (a-h)');

  const getGlow = (nodeName, isOverview = true) => {
    const isSelected = isOverview ? selectedNode === nodeName : selectedRoundNode === nodeName;
    return isSelected ? { boxShadow: '0 0 15px rgba(16, 185, 129, 0.8)', borderColor: '#10b981', zIndex: 10 } : {};
  };

  const renderOverviewDiagram = () => (
    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: '1450px', margin: '0 auto', padding: '0 20px' }}>
      
      {/* Left Column: Flowchart */}
      <div style={{ width: '768px', height: '424px', flexShrink: 0 }}>
        <div style={{ width: '960px', height: '530px', position: 'relative', background: 'transparent', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
          
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <defs>
              <marker id="ovArrowRight" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <polygon points="0 0, 8 3, 0 6" fill="#e5e7eb" />
              </marker>
              <marker id="ovArrowLeft" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <polygon points="8 0, 0 3, 8 6" fill="#e5e7eb" />
              </marker>
            </defs>

            {/* Dimension Line under N x 1024 bits */}
            <line x1="10%" y1="25" x2="90%" y2="25" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />

            {/* Dimension Lines under L-bits and 128-bits */}
            <line x1="10%" y1="52" x2="62%" y2="52" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
            <line x1="78%" y1="52" x2="90%" y2="52" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />

            {/* Dotted Lines from Message down to M blocks (Left and Right edges of each chunk) */}
            <line x1="10%" y1="100" x2="10%" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6,4" />
            <line x1="25%" y1="100" x2="25%" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6,4" />
            
            <line x1="40%" y1="100" x2="40%" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6,4" />
            
            <line x1="75%" y1="100" x2="75%" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6,4" />
            <line x1="90%" y1="100" x2="90%" y2="170" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6,4" />

            {/* 1024-bits dimension lines over M blocks */}
            <line x1="10%" y1="160" x2="25%" y2="160" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
            <line x1="25%" y1="160" x2="40%" y2="160" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
            <line x1="75%" y1="160" x2="90%" y2="160" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />

            {/* Vertical Arrows: M down to F */}
            <line x1="17.5%" y1="210" x2="17.5%" y2="270" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="32.5%" y1="210" x2="32.5%" y2="270" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="82.5%" y1="210" x2="82.5%" y2="270" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Vertical Arrows: F down to + */}
            <line x1="17.5%" y1="310" x2="17.5%" y2="360" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="32.5%" y1="310" x2="32.5%" y2="360" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="82.5%" y1="310" x2="82.5%" y2="360" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Vertical Arrows: + down to H */}
            <line x1="17.5%" y1="392" x2="17.5%" y2="430" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="32.5%" y1="392" x2="32.5%" y2="430" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <line x1="82.5%" y1="392" x2="82.5%" y2="430" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Routing: IV = H0 to F1 and +1 */}
            <path d="M 48 430 L 48 290 L 144 290" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <path d="M 48 376 L 144 376" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Routing: H1 to F2 and +2 */}
            <path d="M 216 450 L 250 450 L 250 290 L 288 290" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <path d="M 250 376 L 288 376" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Routing: H2 to ... */}
            <path d="M 360 450 L 432 450 L 432 290 L 500 290" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <path d="M 432 376 L 500 376" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* Routing: ... to FN and +N */}
            <path d="M 682 450 L 682 290 L 768 290" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />
            <path d="M 682 376 L 768 376" fill="none" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ovArrowRight)" />

            {/* 512-bits dimension lines under H blocks */}
            <line x1="0.5%" y1="485" x2="9.5%" y2="485" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
            <line x1="12.5%" y1="485" x2="22.5%" y2="485" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
            <line x1="27.5%" y1="485" x2="37.5%" y2="485" stroke="#9ca3af" strokeWidth="1" markerStart="url(#ovArrowLeft)" markerEnd="url(#ovArrowRight)" />
          </svg>

          {/* Texts at top */}
          <div style={{ position: 'absolute', top: '0px', left: '10%', width: '80%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>N x 1024 bits</div>
          <div style={{ position: 'absolute', top: '32px', left: '10%', width: '52%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>L-bits</div>
          <div style={{ position: 'absolute', top: '32px', left: '78%', width: '12%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>128-bits</div>

          {/* Message Row */}
          <div style={{ position: 'absolute', top: '60px', left: '10%', width: '80%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedNode('Message')} style={{ flex: '0 0 65%', background: '#9ca3af', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', ...getGlow('Message') }}>Message</motion.div>
            <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedNode('Padding')} style={{ flex: '0 0 20%', background: '#f3f4f6', border: '1px solid #1f2937', borderLeft: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.8rem', cursor: 'pointer', ...getGlow('Padding') }}>1000000...0</motion.div>
            <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedNode('Length Field (F)')} style={{ flex: '0 0 15%', background: '#9ca3af', border: '1px solid #1f2937', borderLeft: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', ...getGlow('Length Field (F)') }}>Length (L)</motion.div>
          </div>

          {/* Big Down Arrow in the middle */}
          <div style={{ position: 'absolute', top: '105px', left: '50%', transform: 'translateX(-50%)', fontSize: '3rem', color: '#6b7280', zIndex: 0 }}>⬇</div>

          {/* 1024-bits labels */}
          <div style={{ position: 'absolute', top: '140px', left: '10%', width: '15%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>1024-bits</div>
          <div style={{ position: 'absolute', top: '140px', left: '25%', width: '15%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>1024-bits</div>
          <div style={{ position: 'absolute', top: '140px', left: '75%', width: '15%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>1024-bits</div>

          {/* M Blocks (Blue) */}
          <div style={{ position: 'absolute', top: '170px', left: '10%', width: '15%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Message Block')} style={{ flex: 1, background: '#3b82f6', border: '1px solid #1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', ...getGlow('Message Block') }}>M₁</motion.div>
          </div>
          <div style={{ position: 'absolute', top: '170px', left: '25%', width: '15%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Message Block')} style={{ flex: 1, background: '#3b82f6', border: '1px solid #1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', ...getGlow('Message Block') }}>M₂</motion.div>
          </div>
          
          <div style={{ position: 'absolute', top: '175px', left: '50%', width: '15%', display: 'flex', height: '20px', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem', letterSpacing: '6px' }}>...</div>
          
          <div style={{ position: 'absolute', top: '170px', left: '75%', width: '15%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Message Block')} style={{ flex: 1, background: '#3b82f6', border: '1px solid #1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', ...getGlow('Message Block') }}>Mₙ</motion.div>
          </div>

          {/* F Blocks (Gray, rounded) */}
          <div style={{ position: 'absolute', top: '270px', left: '15%', width: '5%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Compression Function (F)')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('Compression Function (F)') }}>F</motion.div>
          </div>
          <div style={{ position: 'absolute', top: '270px', left: '30%', width: '5%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Compression Function (F)')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('Compression Function (F)') }}>F</motion.div>
          </div>
          
          <div style={{ position: 'absolute', top: '275px', left: '55%', width: '10%', display: 'flex', height: '20px', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem', letterSpacing: '6px' }}>...</div>
          
          <div style={{ position: 'absolute', top: '270px', left: '80%', width: '5%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Compression Function (F)')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('Compression Function (F)') }}>F</motion.div>
          </div>

          {/* + Blocks */}
          <div style={{ position: 'absolute', top: '360px', left: '15%', width: '5%', display: 'flex', height: '32px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Davies-Meyer Addition')} style={{ flex: 1, background: '#f3f4f6', border: '1px solid #1f2937', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, fontSize: '1.2rem', ...getGlow('Davies-Meyer Addition') }}>+</motion.div>
          </div>
          <div style={{ position: 'absolute', top: '360px', left: '30%', width: '5%', display: 'flex', height: '32px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Davies-Meyer Addition')} style={{ flex: 1, background: '#f3f4f6', border: '1px solid #1f2937', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, fontSize: '1.2rem', ...getGlow('Davies-Meyer Addition') }}>+</motion.div>
          </div>
          
          <div style={{ position: 'absolute', top: '360px', left: '55%', width: '10%', display: 'flex', height: '20px', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem', letterSpacing: '6px' }}>...</div>
          
          <div style={{ position: 'absolute', top: '360px', left: '80%', width: '5%', display: 'flex', height: '32px' }}>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedNode('Davies-Meyer Addition')} style={{ flex: 1, background: '#f3f4f6', border: '1px solid #1f2937', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, fontSize: '1.2rem', ...getGlow('Davies-Meyer Addition') }}>+</motion.div>
          </div>

          {/* H Blocks (Bottom Row) */}
          <div style={{ position: 'absolute', top: '430px', left: '0.5%', width: '9%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Initialization Vector')} style={{ flex: 1, background: '#f3f4f6', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', zIndex: 1, ...getGlow('Initialization Vector') }}>IV = H₀</motion.div>
          </div>

          <div style={{ position: 'absolute', top: '430px', left: '12.5%', width: '10%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('State Register (H)')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('State Register (H)') }}>H₁</motion.div>
          </div>

          <div style={{ position: 'absolute', top: '430px', left: '27.5%', width: '10%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('State Register (H)')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('State Register (H)') }}>H₂</motion.div>
          </div>

          <div style={{ position: 'absolute', top: '430px', left: '77.5%', width: '10%', display: 'flex', height: '40px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Hash Code')} style={{ flex: 1, background: '#9ca3af', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 1, ...getGlow('Hash Code') }}>Hₙ</motion.div>
          </div>

          {/* 512-bits texts under H blocks */}
          <div style={{ position: 'absolute', top: '500px', left: '0.5%', width: '9%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>512-bits</div>
          <div style={{ position: 'absolute', top: '500px', left: '12.5%', width: '10%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>512-bits</div>
          <div style={{ position: 'absolute', top: '500px', left: '27.5%', width: '10%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>512-bits</div>
          <div style={{ position: 'absolute', top: '485px', left: '77.5%', width: '10%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Hash Code</div>
          
        </div>
      </div>

      {/* Right Column: Sticky Explanation Panel */}
      <div style={{ flex: '0 0 350px', position: 'sticky', top: '20px' }}>
        <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Click any operator or box in the diagram to learn about its exact role.</p>
          <h3 style={{ color: 'var(--accent-color)', marginBottom: '12px', marginTop: 0, fontSize: '1.2rem' }}>{selectedNode}</h3>
          
          {selectedNode === 'Message' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The raw input data of arbitrary length (L-bits) that needs to be hashed.<br/><br/><strong>Why it matters:</strong> SHA-512 can theoretically hash messages up to 2^128 bits long. Think of this as the "document" or "password" you want to permanently fingerprint. Any slight change in this text completely alters the resulting hash.</p>}
          {selectedNode === 'Padding' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A single '1' bit followed by '0' bits appended to the message.<br/><br/><strong>Why it matters:</strong> Hash functions are like meat-grinders that only accept chunks of exactly 1024 bits. Padding fills in the empty space of your message so the final chunk is exactly the right size, while remaining mathematically distinct from a message that naturally had zeros at the end.</p>}
          {selectedNode === 'Length Field (F)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A 128-bit integer at the very end of the padded message representing the exact original length (L) of the message before padding.<br/><br/><strong>Why it matters:</strong> This is a crucial security feature called "Merkle-Damgård strengthening". It prevents "length-extension attacks"—meaning a hacker cannot simply guess the hash of your message plus extra words at the end, because the length field secures the original boundary.</p>}
          {selectedNode === 'Message Block' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A 1024-bit slice (M) of the padded message.<br/><br/><strong>Why it matters:</strong> SHA-512 processes the data sequentially. M₁ is fed into the first loop, M₂ into the second loop, etc. Each block drives 80 rounds of intense mathematical mixing in the compression function.</p>}
          {selectedNode === 'Initialization Vector' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The starting 512-bit state (H₀).<br/><br/><strong>Why it matters:</strong> To begin the hash chain, we need a starting point. In SHA-512, these 8 registers are universally standardized constants derived from the square roots of prime numbers. This provides a deterministic but mathematically "random-looking" starting condition.</p>}
          {selectedNode === 'Compression Function (F)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The core heart of SHA-512. It takes a 512-bit state and a 1024-bit message block and runs 80 complex rounds of bitwise logic.<br/><br/><strong>Why it matters:</strong> This is where the actual "hashing" occurs. Through bit rotations and additions, a single flipped bit in the input causes massive, unpredictable changes in the output state (the Avalanche Effect).</p>}
          {selectedNode === 'Davies-Meyer Addition' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A modulo 2^64 addition of the original state (before compression) to the new state (after compression).<br/><br/><strong>Why it matters:</strong> This transforms a reversible cipher into an irreversible hash. By adding the input to the output, any mathematical path backwards is completely destroyed. You literally cannot run the hash in reverse.</p>}
          {selectedNode === 'State Register (H)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The intermediate 512-bit hash value passed to the next block.<br/><br/><strong>Why it matters:</strong> It accumulates the entropy (randomness) of all previous blocks, creating an unbreakable chain that links the entire message together.</p>}
          {selectedNode === 'Hash Code' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The final 512-bit output generated after the last message block is processed.<br/><br/><strong>Why it matters:</strong> This is your SHA-512 hash! It acts as an absolute, unique cryptographic fingerprint for the original message.</p>}
        </div>
      </div>

    </div>
  );

  const renderExplorer = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: '1450px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Left Column: Explorer Diagram centered */}
        <div style={{ width: '768px', height: '480px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '960px', height: '600px', position: 'relative', background: '#0a0a0a', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
            
            <svg width="960" height="600" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
              <defs>
                <marker id="arrowSolid" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
                <marker id="arrowTeal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>

              {/* Exact Line Layout based on Image 2 - Mathematically mapped */}
              
              {/* SHIFTS (Diagonals behind elements) */}
              <path d="M 100 70 L 200 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />
              <path d="M 200 70 L 300 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />
              <path d="M 300 70 L 400 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />
              <path d="M 500 70 L 600 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />
              <path d="M 600 70 L 700 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />
              <path d="M 700 70 L 800 530" stroke="#9ca3af" strokeWidth="3" strokeDasharray="10,5" fill="none" markerEnd="url(#arrowSolid)" />

              {/* INPUTS TO FUNCTIONS */}
              <path d="M 100 70 L 100 220" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* a to Sigma0 */}
              <path d="M 100 150 L 160 150" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* a to Maj */}
              <path d="M 200 70 L 200 120" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* b to Maj */}
              <path d="M 300 70 L 300 150 L 240 150" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* c to Maj */}

              <path d="M 500 70 L 500 220" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* e to Sigma1 */}
              <path d="M 500 150 L 560 150" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* e to Ch */}
              <path d="M 600 70 L 600 120" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* f to Ch */}
              <path d="M 700 70 L 700 150 L 640 150" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* g to Ch */}

              {/* RIGHT SIDE ADDER CHAIN */}
              <path d="M 800 70 L 800 125" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* h to Add1 */}
              <path d="M 630 150 L 775 150" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Ch to Add1 */}
              
              <path d="M 800 165 L 800 225" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add1 to Add2 */}
              <path d="M 530 250 L 775 250" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Sigma1 to Add2 */}
              
              <path d="M 800 265 L 800 325" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add2 to Add3 */}
              <path d="M 870 350 L 825 350" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* W to Add3 */}
              
              <path d="M 800 365 L 800 425" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add3 to Add4 */}
              <path d="M 870 450 L 825 450" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* K to Add4 */}

              {/* LEFT SIDE ADDER CHAIN */}
              <path d="M 100 270 L 100 325" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Sigma0 to Add5 */}
              <path d="M 200 170 L 200 350 L 125 350" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Maj to Add5 */}
              
              <path d="M 100 365 L 100 455" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add5 to Add6 */}

              {/* T1 ROUTING */}
              <path d="M 800 465 L 800 480 L 455 480" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add4 to Add7 */}
              <path d="M 425 480 L 125 480" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* Add7 to Add6 */}

              {/* D to E ADDER */}
              <path d="M 400 70 L 400 455 L 440 455 L 440 465" stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrowSolid)" /> {/* d to Add7 */}

              {/* FINAL OUTPUTS TO NEW A AND E (Teal Lines) */}
              <path d="M 100 495 L 100 520" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrowTeal)" /> {/* Add6 to a */}
              <path d="M 440 495 L 440 515 L 500 515 L 500 520" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrowTeal)" /> {/* Add7 to e */}
            </svg>

            {/* Top Registers (Y=30 to 70) */}
            {['a','b','c','d','e','f','g','h'].map((reg, idx) => {
              const leftPos = [70, 170, 270, 370, 470, 570, 670, 770][idx];
              return (
                <motion.div key={`in-${reg}`} whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Registers (a-h)')} style={{ position: 'absolute', top: '30px', left: `${leftPos}px`, width: '60px', height: '40px', background: (reg === 'd' || reg === 'h') ? '#10b981' : '#f59e0b', borderRadius: '8px', border: '2px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Registers (a-h)', false) }}>
                  <span style={{ fontSize: '1.2rem' }}>H<sub style={{ fontSize: '0.7rem' }}>(i)</sub>{reg}</span>
                </motion.div>
              );
            })}

            {/* Operators (Maj, Ch, Sigma) */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Majority (Maj)')} style={{ position: 'absolute', top: '130px', left: '170px', width: '60px', height: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Majority (Maj)', false) }}>Maj</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Choose (Ch)')} style={{ position: 'absolute', top: '130px', left: '570px', width: '60px', height: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Choose (Ch)', false) }}>Ch</motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Sigma 0')} style={{ position: 'absolute', top: '230px', left: '70px', width: '60px', height: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Sigma 0', false) }}>&Sigma;₀</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Sigma 1')} style={{ position: 'absolute', top: '230px', left: '470px', width: '60px', height: '40px', background: '#f8fafc', borderRadius: '8px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Sigma 1', false) }}>&Sigma;₁</motion.div>

            {/* Adders (Radius 15 -> Width/Height 30) */}
            {/* Right Side Adders */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '135px', left: '785px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '235px', left: '785px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '335px', left: '785px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '435px', left: '785px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            
            {/* Left Side Adders */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '335px', left: '85px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '465px', left: '85px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>
            
            {/* Middle Adder (for e) - Shifted right to 425px (center 440) to avoid dashed line */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Modulo 2^64 Addition')} style={{ position: 'absolute', top: '465px', left: '425px', width: '30px', height: '30px', background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, fontSize: '1.2rem', ...getGlow('Modulo 2^64 Addition', false) }}>+</motion.div>

            {/* Constants W and K */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Message Schedule Word (Wi)')} style={{ position: 'absolute', top: '335px', left: '870px', width: '60px', height: '30px', color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', zIndex: 2, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', ...getGlow('Message Schedule Word (Wi)', false) }}>W<sub style={{ fontSize: '0.8rem' }}>t</sub></motion.div>
            <motion.div whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Round Constant (Ki)')} style={{ position: 'absolute', top: '435px', left: '870px', width: '60px', height: '30px', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', zIndex: 2, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', ...getGlow('Round Constant (Ki)', false) }}>K<sub style={{ fontSize: '0.8rem' }}>t</sub></motion.div>

            {/* Bottom Registers (Y=530 to 570) */}
            {['a','b','c','d','e','f','g','h'].map((reg, idx) => {
              const leftPos = [70, 170, 270, 370, 470, 570, 670, 770][idx];
              return (
                <motion.div key={`out-${reg}`} whileHover={{ scale: 1.1 }} onClick={() => setSelectedRoundNode('Registers (a-h)')} style={{ position: 'absolute', top: '530px', left: `${leftPos}px`, width: '60px', height: '40px', background: (reg === 'a' || reg === 'e') ? '#10b981' : '#f59e0b', borderRadius: '8px', border: '2px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 2, ...getGlow('Registers (a-h)', false) }}>
                  <span style={{ fontSize: '1.1rem' }}>{reg}</span>
                </motion.div>
              );
            })}

          </div>
        </div>

        {/* Right Column: Sticky Explanation Panel */}
        <div style={{ flex: '0 0 350px', position: 'sticky', top: '20px' }}>
          <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Click any operator or box in the diagram to learn about its exact mathematical role here.</p>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '12px', marginTop: 0, fontSize: '1.2rem' }}>{selectedRoundNode}</h3>
            
            {selectedRoundNode === 'Registers (a-h)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The eight 64-bit working variables (a through h).<br/><br/><strong>Why it matters:</strong> At the start of a block, these are initialized to the previous block's hash state. During the 80 rounds, these registers are constantly updated and shifted. Notice the distinct Teal boxes: the new 'a' is formed by a massive combination of variables, and the new 'e' also receives an injected mix of variables. The rest simply shift down one position.</p>}
            {selectedRoundNode === 'Majority (Maj)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A bitwise function: <code>(a AND b) XOR (a AND c) XOR (b AND c)</code><br/><br/><strong>Why it matters:</strong> This function looks at the corresponding bits in registers a, b, and c. It outputs a '1' if the majority (2 or 3) of the inputs are '1', and a '0' otherwise. This provides critical non-linear mixing.</p>}
            {selectedRoundNode === 'Choose (Ch)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A bitwise function: <code>(e AND f) XOR (NOT e AND g)</code><br/><br/><strong>Why it matters:</strong> This acts as a multiplexer. For every bit position, if the bit in 'e' is 1, it "chooses" the bit from 'f'. If 'e' is 0, it "chooses" the bit from 'g'. This forces deep conditional entanglement between the registers.</p>}
            {selectedRoundNode === 'Sigma 0' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A rotation function: <code>ROTR²⁸(a) XOR ROTR³⁴(a) XOR ROTR³⁹(a)</code><br/><br/><strong>Why it matters:</strong> This rotates the 64-bit 'a' register by three different, specifically chosen prime-related amounts, and XORs them together. This ensures that a single bit change in 'a' rapidly spreads across 3 different bit positions (avalanche effect).</p>}
            {selectedRoundNode === 'Sigma 1' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A rotation function: <code>ROTR¹⁴(e) XOR ROTR¹⁸(e) XOR ROTR⁴¹(e)</code><br/><br/><strong>Why it matters:</strong> Just like Sigma 0, but applied to register 'e' using different rotation constants. This dual-rotation strategy is the primary driver of SHA-512's diffusion properties.</p>}
            {selectedRoundNode === 'Modulo 2^64 Addition' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> Standard arithmetic addition of 64-bit numbers, wrapped around if it overflows (modulo 2^64).<br/><br/><strong>Why it matters:</strong> SHA-512 mixes boolean logic (XOR, AND) with arithmetic addition. These two types of operations do not distribute over each other. Mixing them makes algebraic cryptanalysis (solving the hash like an algebra equation) virtually impossible.</p>}
            {selectedRoundNode === 'Message Schedule Word (Wi)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A 64-bit slice of the message being hashed.<br/><br/><strong>Why it matters:</strong> The original 1024-bit block is expanded into 80 separate 64-bit words (one for each round). This injects the actual data you are trying to fingerprint directly into the state updates at every step.</p>}
            {selectedRoundNode === 'Round Constant (Ki)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> A predetermined 64-bit constant unique to this specific round.<br/><br/><strong>Why it matters:</strong> Based on the cube roots of prime numbers, these constants destroy any potential symmetry in the algorithm. Without them, hashing a message of all zeros might get stuck in a predictable loop.</p>}
          </div>
        </div>

      </div>
    );
  };

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>SHA-512 Hash Function</h2>
        <p>
          SHA-512 (Secure Hash Algorithm 512) is a cryptographic hash function that outputs a 512-bit digest. Unlike AES or DES, which are reversible ciphers using keys, a hash function is an irreversible one-way mathematical meat-grinder designed for data integrity and fingerprinting.
        </p>
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Module 1: Overall Algorithm Explanation</button>
        <button className={`mode-tab ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>Module 2: Individual Round Explanation</button>
      </div>

      <div className="flowchart-scale-wrapper" style={{ width: '100%' }}>
        {activeTab === 'overview' && (
          <div className="glass-card scalable-card" style={{ padding: '40px' }}>
            <div className="card-title">SHA-512 Merkle-Damgård Construction</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', fontSize: '1.1rem' }}>Interact with the flow diagram on the left to read about its architectural purpose on the right.</p>
            {renderOverviewDiagram()}
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="glass-card scalable-card" style={{ padding: '40px' }}>
            <div className="card-title">SHA-512 Compression Function (1 Round)</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', fontSize: '1.1rem' }}>Explore the precise shift-register routing and bitwise operations of a single SHA-512 round.</p>
            {renderExplorer()}
          </div>
        )}
      </div>
    </section>
  );
};

export default Sha512Cipher;
