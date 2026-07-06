import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDesSimulation } from '../lib/des';

export default function DesCipher() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'explorer'
  const [inputText, setInputText] = useState('HELLODES');
  const [key, setKey] = useState('SECRETK');
  
  // Animation state for Explorer
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const studioRef = useRef(null);
  const TOTAL_STEPS = 6; // 0 to 6

  // Pad inputs to prevent crashes if user deletes characters
  const paddedInput = inputText.padEnd(8, ' ').substring(0, 8);
  const paddedKey = key.padEnd(7, ' ').substring(0, 7);
  const simData = generateDesSimulation(paddedInput, paddedKey);

  // Flowchart selection for Overview
  const [selectedNode, setSelectedNode] = useState('Plaintext');

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsAutoScrolling(false);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsAutoScrolling(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isAutoScrolling && isPlaying && currentStep < TOTAL_STEPS) {
      const timer = setTimeout(handleNext, 4500);
      return () => clearTimeout(timer);
    }
  }, [isAutoScrolling, isPlaying, currentStep]);

  const BinaryDisplay = ({ bits, title, chunk = 8, width = '100%', maxWidth = '100%', isAnimating = false, animationType = 'none' }) => {
    let chunks = [];
    if (bits && bits.length > 0) {
      for(let i=0; i<bits.length; i+=chunk) {
        chunks.push(bits.slice(i, i+chunk).join(''));
      }
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', width: width, maxWidth: maxWidth }}>
        <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{title}</div>
        <div style={{ 
          display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)',
          boxShadow: animationType === 'expansion' ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
        }}>
          {chunks.map((c, i) => {
            let initial = { opacity: 1, scale: 1, y: 0 };
            let animate = { opacity: 1, scale: 1, y: 0 };
            let transition = { ease: "easeOut", duration: 0.5 };

            if (isAnimating) {
              if (animationType === 'expansion') {
                initial = { opacity: 0, scale: 0.5, y: -20 };
                animate = { opacity: 1, scale: 1, y: 0 };
                transition = { duration: 0.5, delay: i * 0.1 };
              } else if (animationType === 'sbox') {
                initial = { rotateX: 90, opacity: 0 };
                animate = { rotateX: 0, opacity: 1 };
                transition = { duration: 0.6, delay: i * 0.1 };
              } else {
                initial = { opacity: 0, scale: 0.8, y: 10 };
                animate = { opacity: 1, scale: 1, y: 0 };
                transition = { duration: 0.5, delay: i * 0.05 };
              }
            }

            return (
              <motion.span 
                key={`chunk-${i}`} 
                initial={initial}
                animate={animate}
                transition={transition}
                style={{ fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px' }}
              >
                {c}
              </motion.span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOverviewDiagram = () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', width: '100%' }}>
      
      {/* Left Column: Flowchart */}
      <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Interactive Visual Pipeline for Feistel Network */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '40px', transform: 'scale(0.85)', transformOrigin: 'top center' }}>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Plaintext')}
            style={{ padding: '16px 32px', background: selectedNode === 'Plaintext' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Plaintext' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '300px', textAlign: 'center', fontSize: '1.1rem' }}
          >
            Plaintext (64 bits)
          </motion.div>
          
          <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />
          
          <motion.div 
            whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Initial Permutation')}
            style={{ padding: '16px 32px', background: selectedNode === 'Initial Permutation' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Initial Permutation' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '300px', textAlign: 'center', fontSize: '1.1rem' }}
          >
            Initial Permutation (IP)
          </motion.div>

          <div style={{ display: 'flex', gap: '250px', marginTop: '30px' }}>
            <div style={{ height: '40px', width: '3px', background: 'var(--text-muted)', position: 'relative' }}>
               <div style={{ position: 'absolute', bottom: '-5px', left: '-4px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid var(--text-muted)' }} />
            </div>
            <div style={{ height: '40px', width: '3px', background: 'var(--text-muted)', position: 'relative' }}>
               <div style={{ position: 'absolute', bottom: '-5px', left: '-4px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid var(--text-muted)' }} />
            </div>
          </div>

          {/* The Feistel Round Block (True Textbook Diagram) */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '700px', height: '500px', margin: '0 auto', background: 'rgba(245, 158, 11, 0.05)', border: '2px dashed var(--border-color)', borderRadius: '16px' }}>
             {/* Click overlay for the whole round */}
             <div onClick={() => setSelectedNode('Feistel Round')} style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }} title="Click to view Feistel Round summary" />
             <div style={{ position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px', textOrientation: 'upright', writingMode: 'vertical-rl' }}>16 ROUNDS</div>

             {/* Left and Right Halves at the top */}
             <motion.div onClick={(e) => { e.stopPropagation(); setSelectedNode('Left Half (L)'); }} style={{ position: 'absolute', top: '30px', left: '150px', transform: 'translateX(-50%)', padding: '12px 24px', background: selectedNode === 'Left Half (L)' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Left Half (L)' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '6px', fontWeight: 'bold', zIndex: 2, cursor: 'pointer', textAlign: 'center', fontSize: '1.1rem' }}>Left Half (32)</motion.div>
             <motion.div onClick={(e) => { e.stopPropagation(); setSelectedNode('Right Half (R)'); }} style={{ position: 'absolute', top: '30px', left: '450px', transform: 'translateX(-50%)', padding: '12px 24px', background: selectedNode === 'Right Half (R)' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Right Half (R)' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '6px', fontWeight: 'bold', zIndex: 2, cursor: 'pointer', textAlign: 'center', fontSize: '1.1rem' }}>Right Half (32)</motion.div>

             {/* SVG Connections representing True Feistel */}
             <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
               <defs>
                 <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                   <polygon points="0 0, 7 2.5, 0 5" fill="var(--text-muted)" />
                 </marker>
                 <marker id="arrowhead-accent" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                   <polygon points="0 0, 7 2.5, 0 5" fill="var(--accent-color)" />
                 </marker>
                 <marker id="arrowhead-key" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                   <polygon points="0 0, 7 2.5, 0 5" fill="#f59e0b" />
                 </marker>
               </defs>
               
               {/* Left drops down and turns right to XOR */}
               <path d="M 150 75 L 150 400 L 415 400" stroke="var(--text-muted)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
               
               {/* Right drops down into F-Function */}
               <path d="M 450 75 L 450 130" stroke="var(--text-muted)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
               
               {/* Right original data orthogonally routes around the left side to become New Left */}
               <path d="M 450 100 L 60 100 L 60 460 L 150 460 L 150 480" stroke="var(--text-muted)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
               
               {/* F-Function outputs down to XOR */}
               <path d="M 450 335 L 450 375" stroke="var(--text-muted)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
               
               {/* XOR outputs down to New Right */}
               <path d="M 450 420 L 450 480" stroke="var(--accent-color)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead-accent)" />
               
               {/* Key input leftward into F-Function */}
               <path d="M 590 225 L 530 225" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-key)" />
             </svg>

             {/* F-Function */}
             <motion.div onClick={(e) => { e.stopPropagation(); setSelectedNode('f-function (Expansion & Mix)'); }} style={{ position: 'absolute', top: '130px', left: '450px', transform: 'translateX(-50%)', padding: '16px', background: selectedNode === 'f-function (Expansion & Mix)' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', color: selectedNode === 'f-function (Expansion & Mix)' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', textAlign: 'center', zIndex: 2, width: '200px', cursor: 'pointer' }}>
               <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>f-function</div>
               <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px', marginBottom: '6px' }}>E-Expansion</div>
               <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px', marginBottom: '6px' }}>Key Mixing ⊕</div>
               <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px', marginBottom: '6px' }}>S-Boxes</div>
               <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px' }}>P-Box</div>
             </motion.div>

             {/* XOR Node */}
             <motion.div onClick={(e) => { e.stopPropagation(); setSelectedNode('XOR Swap'); }} style={{ position: 'absolute', top: '400px', left: '450px', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-color)', background: 'var(--bg-card)', color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer' }}>
               ⊕
             </motion.div>

             {/* Round Key Label */}
             <div style={{ position: 'absolute', top: '215px', left: '600px', color: '#f59e0b', fontWeight: 'bold', fontSize: '1.05rem', background: 'transparent', padding: '0', zIndex: 2, whiteSpace: 'nowrap' }}>Round Keys</div>
          </div>
          
          <div style={{ display: 'flex', gap: '250px' }}>
            <div style={{ height: '20px', width: '3px', background: 'transparent' }} />
            <div style={{ height: '20px', width: '3px', background: 'transparent' }} />
          </div>

          {/* New explicit Swap Halves stage */}
          <motion.div 
            whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Swap Halves')}
            style={{ padding: '16px 32px', background: selectedNode === 'Swap Halves' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Swap Halves' ? '#000' : '#fff', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '300px', textAlign: 'center', fontSize: '1.1rem', marginBottom: '20px' }}
          >
            Swap Halves (R₁₆, L₁₆)
          </motion.div>

          <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)', position: 'relative' }}>
             <div style={{ position: 'absolute', bottom: '-5px', left: '-4px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid var(--text-muted)' }} />
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Final Permutation')}
            style={{ padding: '16px 32px', background: selectedNode === 'Final Permutation' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Final Permutation' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '300px', textAlign: 'center', fontSize: '1.1rem' }}
          >
            Final Permutation (IP⁻¹)
          </motion.div>

          <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)', position: 'relative' }}>
             <div style={{ position: 'absolute', bottom: '-5px', left: '-4px', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid var(--text-muted)' }} />
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Ciphertext')}
            style={{ padding: '16px 32px', background: selectedNode === 'Ciphertext' ? '#10b981' : 'rgba(16, 185, 129, 0.2)', color: selectedNode === 'Ciphertext' ? '#000' : '#fff', border: '2px solid #10b981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '300px', textAlign: 'center', fontSize: '1.2rem' }}
          >
            Ciphertext (64 bits)
          </motion.div>
        </div>
      </div>

      {/* Right Column: Sticky Explanation Panel with extended height */}
      <div className="no-scrollbar" style={{ flex: '0 0 40%', position: 'sticky', top: '100px', background: 'var(--bg-surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', height: '80vh', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--accent-color)', marginBottom: '16px', fontSize: '1.4rem' }}>{selectedNode}</h3>
        {selectedNode === 'Plaintext' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> A 64-bit block of unencrypted data.<br/><br/><strong>Why it matters:</strong> DES is a block cipher that requires data to be split into exact 64-bit chunks. If a message is shorter, it gets padded. This raw data is completely readable.</p>}
        {selectedNode === 'Initial Permutation' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> A fixed wiring logic that physically shuffles the 64 bits into a different order.<br/><br/><strong>Why it matters:</strong> Cryptographically, this provides <em>no security</em>! It was originally designed to optimize data loading into 8-bit hardware buses back in the 1970s. It is completely public and reversible.</p>}
        {selectedNode === 'Feistel Round' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The core architectural loop of DES, repeated 16 times.<br/><br/><strong>Why it matters:</strong> The Feistel Network is a brilliant design. It ensures that the mathematical <code>f-function</code> used for encryption does not actually need to be reversible. By simply swapping the left and right halves, the exact same hardware circuit can be used for both encryption and decryption.</p>}
        {selectedNode === 'Left Half (L)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The 32-bit left half of the data block.<br/><br/><strong>Why it matters:</strong> During a single round, the Left Half acts passively as the "Target." It waits for the complex math to finish on the Right Half, and is then XORed with the result.</p>}
        {selectedNode === 'Right Half (R)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The 32-bit right half of the data block.<br/><br/><strong>Why it matters:</strong> The Right Half acts as the "Actor." It is fed into the f-function, expanded, mutated by the secret key, and scrambled by the S-Boxes.</p>}
        {selectedNode === 'f-function (Expansion & Mix)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The cryptographic engine of DES.<br/><br/><strong>Why it matters:</strong> This is where all the actual security happens. It expands 32 bits to 48 bits, injects the secret subkey, collapses the data non-linearly using S-Boxes (Confusion), and shuffles it using a P-Box (Diffusion).</p>}
        {selectedNode === 'XOR Swap' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The XOR operation binding the Left Half and the mutated Right Half.<br/><br/><strong>Why it matters:</strong> XOR is perfectly reversible. During decryption, XORing the exact same f-function result onto this data mathematically cancels it out, instantly revealing the original Left Half!</p>}
        {selectedNode === 'Swap Halves' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> After 16 rounds of the Feistel network crossing over left and right, the halves are deliberately swapped one final time (making the final output R₁₆, L₁₆ instead of L₁₆, R₁₆).<br/><br/><strong>Why it matters:</strong> This is a mathematical trick ensuring that the exact same algorithm can be used for decryption, simply by feeding the round keys in reverse order.</p>}
        {selectedNode === 'Final Permutation' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The exact mathematical inverse of the Initial Permutation.<br/><br/><strong>Why it matters:</strong> Just like the Initial Permutation, this provides no cryptographic security. It simply realigns the bits back into their original structural format before outputting the ciphertext.</p>}
        {selectedNode === 'Ciphertext' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The final 64-bit encrypted block.<br/><br/><strong>Why it matters:</strong> DES is now considered insecure because its 56-bit key can be brute-forced rapidly by modern computers. However, its Feistel architecture remains deeply influential in modern cryptography.</p>}
        
        {/* Supporting Reference Information */}
        <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>Reference Data</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             <div><strong>Block Size:</strong> 64 bits</div>
             <div><strong>Key Size:</strong> 56 bits (from 64)</div>
             <div><strong>Rounds:</strong> 16</div>
             <div><strong>Architecture:</strong> Feistel Network</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Data Encryption Standard (DES)</h2>
        <p>DES is a historic symmetric-key algorithm utilizing a Feistel Network structure. Operating on 64-bit blocks, it splits data into halves and scrambles them over 16 rounds.</p>
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Module 1: Overall Algorithm Explanation</button>
        <button className={`mode-tab ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>Module 2: Individual Round Explanation</button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ width: '100%' }}>
          {/* Removed clipping by adding padding and normal overflow */}
          <div className="glass-card scalable-card" style={{ padding: '40px' }}>
            <div className="card-title">DES Feistel Network Pipeline</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', fontSize: '1.1rem' }}>Interact with the flow diagram on the left to read about its architectural purpose on the right.</p>
            {renderOverviewDiagram()}
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div style={{ width: '100%' }}>
          <div className="glass-card">
            <div className="card-title">Feistel Round Explorer Input</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Plaintext (8 chars = 64 bits)</label>
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value.substring(0, 8))} disabled={isPlaying} style={{ fontFamily: 'monospace' }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Secret Key (7 chars = 56 bits)</label>
                <input type="text" value={key} onChange={e => setKey(e.target.value.substring(0, 7))} disabled={isPlaying} style={{ fontFamily: 'monospace' }} />
              </div>
            </div>
            
            {!isPlaying ? (
              <button className="btn-primary" onClick={handleStart} style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '1.1rem' }}>Start Educational Explorer</button>
            ) : (
              <button className="btn-secondary" onClick={handleReset} style={{ marginTop: '20px', width: '100%' }}>Stop Explorer</button>
            )}
          </div>

          <AnimatePresence>
            {isPlaying && (
              <motion.div key="explorer-studio" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="anim-studio" ref={studioRef} style={{ marginTop: '20px', padding: '0', overflow: 'hidden' }}>
                
                {/* Two-Column Layout for the Explorer (RSA Style) */}
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '600px' }}>
                  
                  {/* LEFT COLUMN: Educational Stepper Flowchart */}
                  <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', padding: '32px 20px', background: 'rgba(0,0,0,0.2)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', textAlign: 'center', letterSpacing: '1px' }}>ROUND PROGRESS</h3>
                    
                    {[
                      { step: 0, label: 'Initial Split' },
                      { step: 1, label: 'E-Expansion' },
                      { step: 2, label: 'Key Mixing' },
                      { step: 3, label: 'S-Box Substitution' },
                      { step: 4, label: 'P-Box Permutation' },
                      { step: 5, label: 'XOR w/ Left Half' },
                      { step: 6, label: 'Cross Swap' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', opacity: currentStep >= item.step ? 1 : 0.4 }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: currentStep === item.step ? 'var(--accent-color)' : (currentStep > item.step ? '#10b981' : 'transparent'),
                          border: `2px solid ${currentStep >= item.step ? (currentStep === item.step ? 'var(--accent-color)' : '#10b981') : 'var(--text-muted)'}`,
                          color: currentStep === item.step ? '#000' : '#fff',
                          fontWeight: 'bold', fontSize: '0.8rem', zIndex: 2
                        }}>
                          {currentStep > item.step ? '✓' : item.step}
                        </div>
                        <div style={{ 
                          marginLeft: '12px', fontSize: '0.95rem', fontWeight: currentStep === item.step ? 'bold' : 'normal',
                          color: currentStep === item.step ? 'var(--accent-color)' : '#fff'
                        }}>
                          {item.label}
                        </div>
                        {/* Connecting Line */}
                        {idx < 6 && (
                          <div style={{ position: 'absolute', width: '2px', height: '40px', background: currentStep > item.step ? '#10b981' : 'var(--border-color)', marginLeft: '11px', marginTop: '48px', zIndex: 1 }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* RIGHT COLUMN: Visual Animation Canvas & Explanations */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '350px' }}>
                      
                      {currentStep === 0 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', gap:'20px', justifyContent:'space-evenly', width: '100%'}}>
                             <BinaryDisplay bits={simData.L0} title="Left Half (L₀)" chunk={8} isAnimating={true} />
                             <BinaryDisplay bits={simData.R0} title="Right Half (R₀)" chunk={8} isAnimating={true} />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', flexDirection:'column', gap:'20px', alignItems:'center', width: '100%'}}>
                             <BinaryDisplay bits={simData.R0} title="R₀ (32 bits)" chunk={8} />
                             <motion.div initial={{y: -15}} animate={{y: 15}} transition={{repeat: Infinity, repeatType: 'reverse', duration: 1}} style={{color:'var(--accent-color)', fontSize:'2rem'}}>▼</motion.div>
                             <BinaryDisplay bits={simData.eBits} title="Expanded (48 bits)" chunk={6} isAnimating={true} animationType="expansion" />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', gap:'20px', justifyContent:'space-evenly', alignItems:'center', width: '100%'}}>
                             <BinaryDisplay bits={simData.eBits} title="Expanded R₀" chunk={12} maxWidth="300px" />
                             <motion.div animate={{scale: [1, 1.3, 1]}} transition={{repeat: Infinity, duration: 2}} style={{fontSize:'2rem', color:'var(--accent-color)'}}>⊕</motion.div>
                             <BinaryDisplay bits={simData.mockKey} title="Round Key" chunk={12} maxWidth="300px" />
                             <div style={{fontSize:'2rem', color:'var(--accent-color)'}}>➔</div>
                             <BinaryDisplay bits={simData.xorBits} title="XOR Result" chunk={12} maxWidth="300px" isAnimating={true} />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center', width: '100%'}}>
                             <BinaryDisplay bits={simData.xorBits} title="Input (6-bit chunks)" chunk={6} />
                             <motion.div initial={{opacity: 0.5}} animate={{opacity: 1}} transition={{repeat: Infinity, repeatType: 'reverse', duration: 1}} style={{fontSize:'1.5rem', color:'var(--accent-color)', margin:'10px 0'}}>
                                ▼ S-Boxes 1-8 ▼
                             </motion.div>
                             <BinaryDisplay bits={simData.sBits} title="Output (4-bit chunks)" chunk={4} isAnimating={true} animationType="sbox" />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', gap:'40px', justifyContent:'space-evenly', alignItems: 'center', width: '100%'}}>
                             <BinaryDisplay bits={simData.sBits} title="Pre-Permutation" chunk={8} />
                             <motion.div initial={{rotate: 0}} animate={{rotate: 180}} transition={{duration: 1}} style={{color:'var(--accent-color)', fontSize:'2rem'}}>➔</motion.div>
                             <BinaryDisplay bits={simData.pBits} title="f-function Output" chunk={8} isAnimating={true} />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 5 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', gap:'20px', justifyContent:'space-evenly', alignItems:'center', width: '100%'}}>
                             <BinaryDisplay bits={simData.L0} title="Old L₀" chunk={8} maxWidth="300px" />
                             <motion.div animate={{scale: [1, 1.3, 1]}} transition={{repeat: Infinity, duration: 2}} style={{fontSize:'2rem', color:'var(--accent-color)'}}>⊕</motion.div>
                             <BinaryDisplay bits={simData.pBits} title="f-function Output" chunk={8} maxWidth="300px" />
                             <div style={{fontSize:'2rem', color:'var(--accent-color)'}}>➔</div>
                             <BinaryDisplay bits={simData.newR} title="New R₁" chunk={8} maxWidth="300px" isAnimating={true} />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 6 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width:'100%'}}>
                          <div style={{display:'flex', flexDirection: 'column', gap:'10px', alignItems:'center', width: '100%'}}>
                             <div style={{display:'flex', gap:'40px', justifyContent:'space-evenly', width: '100%'}}>
                               <BinaryDisplay bits={simData.L0} title="Old L₀" chunk={8} />
                               <BinaryDisplay bits={simData.R0} title="Old R₀" chunk={8} />
                             </div>
                             <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} style={{display: 'flex', justifyContent: 'center', width: '200px', position: 'relative', height: '40px', margin: '10px 0'}}>
                               <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                                 <line x1="25" y1="0" x2="175" y2="40" stroke="var(--accent-color)" strokeWidth="3" strokeDasharray="5,5" />
                                 <line x1="175" y1="0" x2="25" y2="40" stroke="var(--accent-color)" strokeWidth="3" />
                               </svg>
                             </motion.div>
                             <div style={{display:'flex', gap:'40px', justifyContent:'space-evenly', width: '100%'}}>
                               <BinaryDisplay bits={simData.newL} title="New L₁ (Was R₀)" chunk={8} isAnimating={true} />
                               <BinaryDisplay bits={simData.newR} title="New R₁ (L₀ ⊕ f)" chunk={8} isAnimating={true} />
                             </div>
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* Educational Explanations positioned below the animations */}
                    <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '120px' }}>
                      {currentStep === 0 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>Initial Split</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The 64-bit data block is split cleanly in half: a 32-bit Left Half and a 32-bit Right Half. <strong>Why is this important?</strong> It establishes the foundation for the Feistel Network. By operating on only one half of the data at a time, DES ensures that the encryption process can be perfectly reversed later.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>E-Expansion</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The 32-bit Right Half is expanded into 48 bits using the Expansion Table. Certain bits are deliberately duplicated. <strong>Why is this important?</strong> The Round Key is 48 bits long. To securely mix the data with the key using XOR, the data must first be stretched to match the key's exact length.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>Key Mixing</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The expanded data is XORed bit-by-bit with the secret Round Key. <strong>Why is this important?</strong> This injects the cryptographic security. Without the secret key, an attacker cannot guess the output of this operation. Because XOR is perfectly reversible, legitimate users can easily undo this step during decryption if they possess the key.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>S-Box Substitution (Confusion)</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The 48-bit result is split into eight 6-bit chunks. Each goes through a distinct Substitution Box (S-Box) that outputs a 4-bit chunk, shrinking the total back to 32 bits. <strong>Why is this important?</strong> This is the <em>only</em> non-linear part of DES. It provides absolute <em>Confusion</em>, meaning the relationship between the key and the ciphertext becomes incredibly complicated.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>P-Box Permutation (Diffusion)</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The 32 bits from the S-Boxes are physically shuffled around using the P-Box. <strong>Why is this important?</strong> It provides <em>Diffusion</em>. The output of one S-Box is deliberately scattered so that it will affect multiple different S-Boxes in the very next round, causing an explosive Avalanche Effect.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 5 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>XOR with Left Half</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The highly scrambled output of the f-function is XORed with the ORIGINAL Left Half. <strong>Why is this important?</strong> This creates our New Right Half. By using XOR, the original Left Half can be easily recovered during decryption simply by running the f-function again and XORing a second time!
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 6 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>Cross Swap</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The OLD Right Half directly becomes the NEW Left Half without any modifications. <strong>Why is this important?</strong> It completes the Feistel structural loop. The halves swap roles so that in the next round, the newly scrambled data gets to act as the "actor" while the unmodified data becomes the "target".
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Compact Navigation Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                      <button className="btn-secondary" style={{padding: '8px 12px', fontSize: '0.9rem'}} onClick={handlePrev} disabled={currentStep === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="15 18 9 12 15 6"></polyline></svg> Prev
                      </button>
                      <button className="btn-secondary" style={{padding: '8px 12px', fontSize: '0.9rem'}} onClick={() => setIsAutoScrolling(!isAutoScrolling)}>
                        {isAutoScrolling ? '⏸ Pause' : '▶ Auto Play'}
                      </button>
                      <button className="btn-primary" style={{padding: '8px 12px', width: 'auto', fontSize: '0.9rem'}} onClick={handleNext} disabled={currentStep === TOTAL_STEPS}>
                        Next <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
