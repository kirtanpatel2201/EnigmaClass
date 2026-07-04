import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAesSimulation, toHex } from '../lib/aes';

export default function AesCipher() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'explorer'
  const [inputText, setInputText] = useState('HELLOWORLD123456');
  const [key, setKey] = useState('SECRET_KEY_12345');
  
  // Animation state for Explorer
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const studioRef = useRef(null);
  const TOTAL_STEPS = 5; // 0 to 5 for the round explorer

  // Pad inputs to prevent toHex(undefined) crashes if user deletes characters
  const paddedInput = inputText.padEnd(16, 'X').substring(0, 16);
  const paddedKey = key.padEnd(16, 'K').substring(0, 16);
  const simData = generateAesSimulation(paddedInput, paddedKey);

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
      const timer = setTimeout(handleNext, 6000); // Increased to allow sub-animations to finish
      return () => clearTimeout(timer);
    }
  }, [isAutoScrolling, isPlaying, currentStep]);

  // Enhanced MatrixDisplay with creative animations
  const MatrixDisplay = ({ matrix, title, animationType = 'none' }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
        <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{title}</div>
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '8px', 
          background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)',
          boxShadow: animationType === 'mixColumns' ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
          transition: 'box-shadow 0.5s'
        }}>
          {matrix.map((row, r) => (
            <div key={`row-${r}`} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              {/* Highlight background for ShiftRows or HighlightRows */}
              {(animationType === 'shiftRows' || animationType === 'highlightRows') && r > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', inset: -4, background: 'rgba(245, 158, 11, 0.2)', borderRadius: '8px', zIndex: 0 }}
                />
              )}
              {row.map((val, c) => {
                let initial = { opacity: 0, scale: 0.9 };
                let animate = { opacity: 1, scale: 1 };
                let transition = { ease: "easeInOut", duration: 0.8 };
                
                if (animationType === 'subBytes') {
                  initial = { rotateY: 180, opacity: 0 };
                  animate = { rotateY: 0, opacity: 1 };
                  transition = { duration: 0.6, delay: (r * 4 + c) * 0.05 };
                } else if (animationType === 'shiftRows') {
                  initial = { x: 40, opacity: 0 };
                  animate = { x: 0, opacity: 1 };
                  transition = { duration: 0.8, delay: r * 0.1 };
                } else if (animationType === 'mixColumns') {
                  initial = { scale: 0.8, opacity: 0 };
                  animate = { scale: [0.8, 1.1, 1], opacity: 1 };
                  transition = { duration: 0.5, delay: c * 0.2 };
                } else if (animationType === 'addRoundKey') {
                  initial = { scale: 1.5, opacity: 0, filter: 'blur(4px)' };
                  animate = { scale: 1, opacity: 1, filter: 'blur(0px)' };
                  transition = { duration: 0.5, delay: (r * 4 + c) * 0.05 };
                } else if (animationType === 'highlightRows') {
                  initial = { opacity: 1, scale: 1 };
                  animate = { opacity: 1, scale: 1 };
                } else {
                  initial = { opacity: 1, scale: 1 };
                  animate = { opacity: 1, scale: 1 };
                }

                return (
                  <motion.div 
                    key={`cell-${r}-${c}`}
                    initial={initial}
                    animate={animate}
                    transition={transition}
                    style={{
                      width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)', color: '#fff',
                      fontFamily: 'monospace', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem',
                      boxShadow: animationType === 'mixColumns' ? 'inset 0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
                      zIndex: 1
                    }}
                  >
                    {toHex(val ?? 0)}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ShiftRowsSequence = ({ matrixIn, matrixOut }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '300px', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginRight: '24px', marginTop: '40px' }}>
            <div style={{ height: '45px', display: 'flex', alignItems: 'center', color: 'transparent', fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Shift 0</div>
            <div style={{ height: '45px', display: 'flex', alignItems: 'center', color: 'var(--accent-color)', fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>← Shift 1</div>
            <div style={{ height: '45px', display: 'flex', alignItems: 'center', color: 'var(--accent-color)', fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>← Shift 2</div>
            <div style={{ height: '45px', display: 'flex', alignItems: 'center', color: 'var(--accent-color)', fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>← Shift 3</div>
          </div>
          <MatrixDisplay matrix={matrixIn} title="Highlighting Rows" animationType="highlightRows" />
        </div>

        <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', padding: '0 10px' }}>➔</div>

        <MatrixDisplay matrix={matrixOut} title="ShiftRows Applied" animationType="shiftRows" />
      </div>
    );
  };

  const MixColumnsSequence = ({ matrixIn, matrixOut }) => {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
      const t1 = setTimeout(() => setPhase(1), 2500);
      return () => clearTimeout(t1);
    }, []);
  
    const gfMatrix = [
      ['02', '03', '01', '01'],
      ['01', '02', '03', '01'],
      ['01', '01', '02', '03'],
      ['03', '01', '01', '02']
    ];
    
    // Extract Column 0
    const colIn = [[matrixIn[0][0]], [matrixIn[1][0]], [matrixIn[2][0]], [matrixIn[3][0]]];
    const colOut = [[matrixOut[0][0]], [matrixOut[1][0]], [matrixOut[2][0]], [matrixOut[3][0]]];
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '300px' }}>
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div key="phase0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <MatrixDisplay matrix={gfMatrix} title="AES GF(2⁸) Matrix (4×4)" />
               <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginTop: '20px' }}>×</div>
               <MatrixDisplay matrix={colIn} title="State Column 0 (4×1)" />
            </motion.div>
          )}
          {phase === 1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <MatrixDisplay matrix={gfMatrix} title="AES GF(2⁸) Matrix (4×4)" />
               <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginTop: '20px' }}>×</div>
               <MatrixDisplay matrix={colIn} title="State Column 0 (4×1)" />
               <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginTop: '20px' }}>=</div>
               <MatrixDisplay matrix={colOut} title="Result Column 0" animationType="mixColumns" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderOverviewDiagram = () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', width: '100%' }}>
      
      {/* Left Column: Flowchart */}
      <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', transform: 'scale(0.9)', transformOrigin: 'top center' }}>
          
          {/* Main Data Flow Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px', flexShrink: 0 }}>
            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Plaintext')}
              style={{ padding: '16px 32px', background: selectedNode === 'Plaintext' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Plaintext' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'center' }}
            >
              Plaintext (128 bits)
            </motion.div>
            
            <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />
            
            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('State Matrix Creation')}
              style={{ padding: '16px', background: selectedNode === 'State Matrix Creation' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '12px', color: selectedNode === 'State Matrix Creation' ? '#000' : '#fff' }}>State Matrix</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 16px)', gap: '4px' }}>
                {Array.from({length: 16}).map((_, i) => <div key={i} style={{width:'16px', height:'16px', background: selectedNode === 'State Matrix Creation' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)', borderRadius: '2px'}} />)}
              </div>
            </motion.div>

            <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />

            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Initial AddRoundKey')}
              style={{ padding: '16px 32px', background: selectedNode === 'Initial AddRoundKey' ? 'var(--accent-color)' : 'rgba(255,255,255,0.15)', color: selectedNode === 'Initial AddRoundKey' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'center', position: 'relative' }}
            >
              Initial AddRoundKey ⊕
              {/* Connection from Key Expansion */}
              <div style={{ position: 'absolute', right: '-170px', top: '50%', width: '170px', height: '2px', background: '#f59e0b', zIndex: -1 }}>
                 <div style={{ position: 'absolute', left: '-5px', top: '-4px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '8px solid #f59e0b' }} />
                 <div style={{ position: 'absolute', right: '5px', top: '-24px', color: '#f59e0b', fontSize: '1.05rem', fontWeight: 'bold', background: 'transparent', padding: '0', border: 'none' }}>Provides K₀ ... K₃</div>
              </div>
            </motion.div>

            <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />

            {/* Loop Block */}
            <motion.div 
              whileHover={{ scale: 1.02 }} onClick={() => setSelectedNode('Rounds 1-9')}
              style={{ padding: '20px', background: selectedNode === 'Rounds 1-9' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: selectedNode === 'Rounds 1-9' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '16px', cursor: 'pointer', width: '100%', position: 'relative' }}
            >
              <div style={{ position: 'absolute', left: '-20px', top: '10%', bottom: '10%', width: '15px', borderLeft: '2px dashed var(--text-muted)', borderTop: '2px dashed var(--text-muted)', borderBottom: '2px dashed var(--text-muted)' }}>
                 <div style={{ position: 'absolute', right: '-5px', top: '-6px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid var(--text-muted)' }} />
              </div>
              
              <div style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center', fontSize: '1.1rem' }}>Rounds 1 to 9</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>SubBytes</div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>ShiftRows</div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>MixColumns</div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  AddRoundKey ⊕
                  <div style={{ position: 'absolute', right: '-170px', top: '50%', width: '170px', height: '2px', background: '#f59e0b', zIndex: -1 }}>
                     <div style={{ position: 'absolute', left: '-5px', top: '-4px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '8px solid #f59e0b' }} />
                     <div style={{ position: 'absolute', right: '5px', top: '-24px', color: '#f59e0b', fontSize: '1.05rem', fontWeight: 'bold', background: 'transparent', padding: '0', border: 'none' }}>Provides K₄ ... K₃₉</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '4px', letterSpacing: '4px' }}>• • •</div>
              </div>
            </motion.div>

            <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />

            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Final Round')}
              style={{ padding: '20px', background: selectedNode === 'Final Round' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: selectedNode === 'Final Round' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '16px', cursor: 'pointer', width: '100%' }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center', fontSize: '1.1rem' }}>Round 10 (Final)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>SubBytes</div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>ShiftRows</div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  AddRoundKey ⊕
                  <div style={{ position: 'absolute', right: '-170px', top: '50%', width: '170px', height: '2px', background: '#f59e0b', zIndex: -1 }}>
                     <div style={{ position: 'absolute', left: '-5px', top: '-4px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '8px solid #f59e0b' }} />
                     <div style={{ position: 'absolute', right: '5px', top: '-24px', color: '#f59e0b', fontSize: '1.05rem', fontWeight: 'bold', background: 'transparent', padding: '0', border: 'none' }}>Provides K₄₀ ... K₄₃</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div style={{ height: '30px', width: '3px', background: 'var(--text-muted)' }} />

            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Ciphertext')}
              style={{ padding: '16px 32px', background: selectedNode === 'Ciphertext' ? '#10b981' : 'rgba(16, 185, 129, 0.2)', color: selectedNode === 'Ciphertext' ? '#000' : '#fff', border: '2px solid #10b981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: '1.1rem' }}
            >
              Ciphertext (128 bits)
            </motion.div>
          </div>

          {/* Key Expansion Column - Shifted Right for Breathing Room, continuous vertical flow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px', flexShrink: 0, marginLeft: '60px', position: 'relative' }}>
             <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Key Expansion')}
              style={{ padding: '16px', background: selectedNode === 'Key Expansion' ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)', color: selectedNode === 'Key Expansion' ? '#000' : '#fff', border: '2px solid #f59e0b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'center' }}
            >
              Master Key (128 bits)
            </motion.div>
            
            <div style={{ height: '30px', width: '3px', background: '#f59e0b' }} />

            <motion.div 
              whileHover={{ scale: 1.05 }} onClick={() => setSelectedNode('Key Expansion')}
              style={{ padding: '20px 16px', background: selectedNode === 'Key Expansion' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)', color: selectedNode === 'Key Expansion' ? '#000' : '#f59e0b', border: '2px dashed #f59e0b', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'center', zIndex: 2 }}
            >
              Key Expansion Routine
              <div style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: '12px' }}>Derives 11 distinct 128-bit subkeys (composed of 44 32-bit words).</div>
            </motion.div>
            
            {/* Extended perfectly to connect with Round 10. Using absolute positioning to guarantee it hits the last horizontal line seamlessly */}
            <div style={{ position: 'absolute', top: '185px', bottom: '66px', width: '3px', background: '#f59e0b', zIndex: 1 }} />
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Explanation Panel with extended height to prevent clipping and fit more content */}
      <div style={{ flex: '0 0 40%', position: 'sticky', top: '100px', background: 'var(--bg-surface)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', height: '80vh', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--accent-color)', marginBottom: '16px', fontSize: '1.4rem' }}>{selectedNode}</h3>
        {selectedNode === 'Plaintext' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The raw, unencrypted 128-bit block of data.<br/><br/><strong>Why it matters:</strong> AES strictly operates on 128-bit chunks. If your message is smaller or larger, it must be padded or split. By itself, this data is completely exposed.</p>}
        {selectedNode === 'State Matrix Creation' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> AES takes the linear 16 bytes of plaintext and maps them into a 4x4 grid (State Matrix).<br/><br/><strong>Why it matters:</strong> Cryptography requires complex mixing. By placing the bytes into a 2D matrix, AES can perform matrix multiplications (MixColumns) and row rotations (ShiftRows) that rapidly scramble the data far better than operating on a flat line.</p>}
        {selectedNode === 'Initial AddRoundKey' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The plaintext matrix is XORed with the first subkey (K₀-K₃) before any encryption rounds begin.<br/><br/><strong>Why it matters:</strong> This is called <em>Key Whitening</em>. It securely binds the data to the secret key immediately. Without this step, an attacker could observe the plaintext going directly into the first round's operations, making cryptanalysis much easier.</p>}
        {selectedNode === 'Rounds 1-9' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The intense core loop of AES. Each round scrambles the data using Confusion (SubBytes) and Diffusion (ShiftRows, MixColumns), before injecting another subkey.<br/><br/><strong>Why it matters:</strong> This guarantees the <em>Avalanche Effect</em>. A change in a single bit of the plaintext (or key) cascades rapidly through these rounds, ensuring that every single bit of the ciphertext is completely unpredictable.</p>}
        {selectedNode === 'Final Round' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The 10th and final round. It skips the MixColumns step entirely.<br/><br/><strong>Why it matters:</strong> MixColumns exists to spread data (Diffusion). However, spreading data at the very last step without a subsequent non-linear operation (SubBytes) offers zero additional security. Skipping it makes the encryption and decryption hardware perfectly symmetric and much faster.</p>}
        {selectedNode === 'Ciphertext' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The final 128-bit encrypted block.<br/><br/><strong>Why it matters:</strong> Thanks to the AES architecture, this block is mathematically indistinguishable from pure random noise. It is considered impenetrable against all known modern cryptanalytic attacks.</p>}
        {selectedNode === 'Key Expansion' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}><strong>What it is:</strong> The Key Schedule takes the 128-bit Master Key and mathematically derives 11 distinct 128-bit subkeys (composed of 44 32-bit words, K₀ to K₄₃).<br/><br/><strong>Why it matters:</strong> Injecting the exact same key in every round is insecure. By expanding the key, each round gets fresh, cryptographically secure key material. This prevents related-key attacks and ensures that deducing a subkey from one round doesn't immediately compromise the master key.</p>}
        
        {/* Supporting Reference Information */}
        <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>Reference Data</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             <div><strong>Block Size:</strong> 128 bits</div>
             <div><strong>Key Size:</strong> 128 bits</div>
             <div><strong>Rounds:</strong> 10</div>
             <div><strong>Subkeys:</strong> 11 128-bit keys (44 32-bit words, W₀ to W₄₃)</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Advanced Encryption Standard (AES)</h2>
        <p>AES is the global standard for symmetric encryption. Explore the overall conceptual pipeline in Module 1, or dive deep into the specific matrix math of a single round in Module 2.</p>
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Module 1: Overall Algorithm Explanation</button>
        <button className={`mode-tab ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>Module 2: Individual Round Explanation</button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ width: '100%' }}>
          <div className="glass-card" style={{ padding: '40px' }}>
            <div className="card-title">AES High-Level Pipeline</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center', fontSize: '1.1rem' }}>Interact with the flow diagram on the left to read about its architectural purpose on the right.</p>
            {renderOverviewDiagram()}
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div style={{ width: '100%' }}>
          <div className="glass-card">
            <div className="card-title">Individual Round Explorer Input</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Plaintext (16 chars max)</label>
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value.substring(0, 16))} disabled={isPlaying} style={{ fontFamily: 'monospace' }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Secret Key (16 chars max)</label>
                <input type="text" value={key} onChange={e => setKey(e.target.value.substring(0, 16))} disabled={isPlaying} style={{ fontFamily: 'monospace' }} />
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
                      { step: 0, label: 'Initial State' },
                      { step: 1, label: 'SubBytes' },
                      { step: 2, label: 'ShiftRows' },
                      { step: 3, label: 'MixColumns' },
                      { step: 4, label: 'AddRoundKey' },
                      { step: 5, label: 'Round Complete' }
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
                        {idx < 5 && (
                          <div style={{ position: 'absolute', width: '2px', height: '40px', background: currentStep > item.step ? '#10b981' : 'var(--border-color)', marginLeft: '11px', marginTop: '48px', zIndex: 1 }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* RIGHT COLUMN: Visual Animation Canvas & Explanations */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px' }}>
                    
                    {/* Visual Animations */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '350px', position: 'relative' }}>
                      {currentStep === 0 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                          <MatrixDisplay matrix={simData.rounds[1].in} title="Input State (Post-Initial AddRoundKey)" animationType="addRoundKey" />
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                           <MatrixDisplay matrix={simData.rounds[1].in} title="Before S-Box" />
                           <div style={{color:'var(--accent-color)', fontSize:'2rem'}}>➔</div>
                           <MatrixDisplay matrix={simData.rounds[1].sub} title="After SubBytes (Confusion)" animationType="subBytes" />
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <ShiftRowsSequence matrixIn={simData.rounds[1].sub} matrixOut={simData.rounds[1].shift} />
                      )}

                      {currentStep === 3 && (
                         <MixColumnsSequence matrixIn={simData.rounds[1].shift} matrixOut={simData.rounds[1].mix} />
                      )}

                      {currentStep === 4 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                           <MatrixDisplay matrix={simData.rounds[1].mix} title="Highly Diffused State" />
                           <motion.div animate={{scale: [1, 1.3, 1]}} transition={{repeat: Infinity, duration: 2}} style={{fontSize:'2rem', color:'var(--accent-color)'}}>⊕</motion.div>
                           <MatrixDisplay matrix={simData.rounds[1].key} title="Round 1 Subkey" />
                           <div style={{fontSize:'2rem', color:'var(--accent-color)'}}>➔</div>
                           <MatrixDisplay matrix={simData.rounds[1].out} title="Final Output of Round 1" animationType="addRoundKey" />
                        </motion.div>
                      )}

                      {currentStep === 5 && (
                        <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} style={{textAlign:'center'}}>
                          <div style={{fontSize: '5rem'}}>✅</div>
                          <h3 style={{color:'var(--accent-color)', marginTop:'20px', fontSize: '2rem'}}>Round 1 Complete</h3>
                        </motion.div>
                      )}
                    </div>

                    {/* Educational Explanations positioned below the animations */}
                    <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '120px' }}>
                      {currentStep === 0 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>Initial State Setup</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The 16 bytes of plaintext are arranged column-by-column into a 4x4 matrix, and then immediately XORed with the Master Key. This produces the initial starting state for Round 1. Notice how the data is already cryptographically bound to the key before the intense math even begins.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>SubBytes (Confusion)</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            Every single byte in the matrix is replaced with a different byte using a non-linear substitution table (the S-Box). <strong>Why is this important?</strong> It shatters any linear or algebraic relationships in the plaintext, introducing massive <em>Confusion</em> into the cipher. Observe the 3D flip animation representing the substitution.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>ShiftRows (Diffusion)</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            Rows slide to the left based on their index (Row 1 shifts 1 spot, Row 2 shifts 2, etc). <strong>Why is this important?</strong> It initiates <em>Diffusion</em>. By physically scattering the substituted bytes across different columns, AES ensures that local changes in the plaintext are rapidly distributed horizontally across the entire matrix.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>MixColumns (Diffusion)</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            Each vertical column is mathematically transformed using matrix multiplication in a Galois Field. <strong>Why is this important?</strong> It provides immense vertical <em>Diffusion</em>. Combined with ShiftRows, this guarantees that after just two rounds, every single bit of the plaintext influences every single bit of the current state.
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>AddRoundKey</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The highly confused and diffused state is now XORed with the Round 1 Subkey (derived from the Master Key). <strong>Why is this important?</strong> It continuously injects secret key material into the encryption process. Without this step, an attacker could simply run the known SubBytes and MixColumns algorithms in reverse!
                          </p>
                        </motion.div>
                      )}

                      {currentStep === 5 && (
                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                          <h4 style={{color:'var(--accent-color)', marginBottom:'8px', fontSize: '1.2rem'}}>Round Complete</h4>
                          <p style={{color:'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            The data has now been heavily obfuscated. This precise four-step process (SubBytes, ShiftRows, MixColumns, AddRoundKey) repeats 9 more times, compounding the Avalanche Effect until the final ciphertext is mathematically unbreakable.
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
