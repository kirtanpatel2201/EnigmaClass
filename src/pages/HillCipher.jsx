import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HillCipher() {
  const [mode, setMode] = useState('encrypt');
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrix, setMatrix] = useState([5, 8, 0, 17, 3, 0, 0, 0, 0]);
  const [inputText, setInputText] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const studioRef = useRef(null);

  const handleMatrixChange = (index, value) => {
    const newMatrix = [...matrix];
    newMatrix[index] = parseInt(value) || 0;
    setMatrix(newMatrix);
    if (isPlaying) handleReset();
  };

  let rawText = inputText.toUpperCase().replace(/[^A-Z]/g, '');
  while (rawText.length % matrixSize !== 0 && rawText.length > 0) {
    rawText += 'X';
  }
  const blocks = [];
  for (let i = 0; i < rawText.length; i += matrixSize) {
    blocks.push(rawText.slice(i, i + matrixSize));
  }
  
  // Det calculation
  let det = 0;
  if (matrixSize === 2) {
    det = (matrix[0] * matrix[4] - matrix[1] * matrix[3]) % 26;
  } else {
    det = (
      matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) -
      matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
      matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6])
    ) % 26;
  }
  if (det < 0) det += 26;

  let detInv = -1;
  for (let i = 1; i < 26; i++) {
    if ((det * i) % 26 === 1) {
      detInv = i;
      break;
    }
  }

  // Inverse matrix calculation
  const invMatrix = Array(9).fill(0);
  if (matrixSize === 2 && detInv !== -1) {
    invMatrix[0] = (matrix[4] * detInv) % 26;
    invMatrix[1] = (-matrix[1] * detInv) % 26;
    invMatrix[3] = (-matrix[3] * detInv) % 26;
    invMatrix[4] = (matrix[0] * detInv) % 26;
  } else if (matrixSize === 3 && detInv !== -1) {
    const c00 = (matrix[4] * matrix[8] - matrix[5] * matrix[7]);
    const c01 = -(matrix[3] * matrix[8] - matrix[5] * matrix[6]);
    const c02 = (matrix[3] * matrix[7] - matrix[4] * matrix[6]);
    const c10 = -(matrix[1] * matrix[8] - matrix[2] * matrix[7]);
    const c11 = (matrix[0] * matrix[8] - matrix[2] * matrix[6]);
    const c12 = -(matrix[0] * matrix[7] - matrix[1] * matrix[6]);
    const c20 = (matrix[1] * matrix[5] - matrix[2] * matrix[4]);
    const c21 = -(matrix[0] * matrix[5] - matrix[2] * matrix[3]);
    const c22 = (matrix[0] * matrix[4] - matrix[1] * matrix[3]);
    
    invMatrix[0] = (c00 * detInv) % 26;
    invMatrix[1] = (c10 * detInv) % 26;
    invMatrix[2] = (c20 * detInv) % 26;
    invMatrix[3] = (c01 * detInv) % 26;
    invMatrix[4] = (c11 * detInv) % 26;
    invMatrix[5] = (c21 * detInv) % 26;
    invMatrix[6] = (c02 * detInv) % 26;
    invMatrix[7] = (c12 * detInv) % 26;
    invMatrix[8] = (c22 * detInv) % 26;
  }
  
  const K = Array(9).fill(0);
  for (let i = 0; i < 9; i++) {
    const val = mode === 'encrypt' ? matrix[i] : invMatrix[i];
    K[i] = val < 0 ? (val % 26 + 26) % 26 : val % 26;
  }

  const encryptionData = blocks.map(block => {
    const p1 = block.charCodeAt(0) - 65;
    const p2 = block.charCodeAt(1) - 65;
    const p3 = matrixSize === 3 ? block.charCodeAt(2) - 65 : 0;
    
    const c1Temp = p1 * K[0] + p2 * K[1] + (matrixSize === 3 ? p3 * K[2] : 0);
    const c2Temp = p1 * K[3] + p2 * K[4] + (matrixSize === 3 ? p3 * K[5] : 0);
    const c3Temp = matrixSize === 3 ? (p1 * K[6] + p2 * K[7] + p3 * K[8]) : 0;
    
    const c1 = c1Temp % 26;
    const c2 = c2Temp % 26;
    const c3 = c3Temp % 26;
    
    let cBlock = String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
    if (matrixSize === 3) cBlock += String.fromCharCode(c3 + 65);
    
    return {
      block,
      p1, p2, p3,
      c1Temp, c2Temp, c3Temp,
      c1, c2, c3,
      cBlock
    };
  });

  const handleStart = () => {
    if (blocks.length === 0) return;
    setIsPlaying(true);
    setCurrentStep(0);
    setShowHighlight(false);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < blocks.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === blocks.length) {
        setShowHighlight(true);
        setTimeout(() => setShowHighlight(false), 2000);
        setIsAutoScrolling(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsAutoScrolling(false);
  };

  useEffect(() => {
    if (isAutoScrolling && isPlaying && currentStep < blocks.length) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= blocks.length) {
      setIsAutoScrolling(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, isPlaying, currentStep, blocks.length]);

  const showStudio = inputText.length > 0;
  const isFinished = currentStep === blocks.length;
  const currentData = !isFinished && blocks.length > 0 ? encryptionData[currentStep] : null;

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Hill Cipher</h2>
        <p>Invented by Lester S. Hill in 1929, the Hill cipher is a polygraphic substitution cipher based on linear algebra. Each letter is represented by a number modulo 26. A block of n letters is multiplied by an invertible n × n matrix modulo 26 to produce the ciphertext block. The matrix serves as the encryption key.</p>
      </div>
      
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => { setMode('encrypt'); handleReset(); }}>Encryption</button>
        <button className={`mode-tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => { setMode('decrypt'); handleReset(); }}>Decryption</button>
      </div>

      <div className="cipher-workspace">
        <div className="glass-card">
          <div className="card-title">Parameters & Input</div>
          
          <div className="mode-tabs" style={{marginBottom: '20px', marginTop: '10px'}}>
            <button className={`mode-tab ${matrixSize === 2 ? 'active' : ''}`} onClick={() => { setMatrixSize(2); handleReset(); }}>2×2 Matrix</button>
            <button className={`mode-tab ${matrixSize === 3 ? 'active' : ''}`} onClick={() => { setMatrixSize(3); handleReset(); }}>3×3 Matrix</button>
          </div>

          <div className="form-group">
            <label>{matrixSize}x{matrixSize} Matrix Key</label>
            <div style={{display:'grid', gridTemplateColumns: `repeat(${matrixSize}, 1fr)`, gap: '8px', maxWidth: matrixSize === 2 ? '150px' : '220px'}}>
               <input type="number" value={matrix[0]} onChange={e => handleMatrixChange(0, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
               <input type="number" value={matrix[1]} onChange={e => handleMatrixChange(1, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
               {matrixSize === 3 && <input type="number" value={matrix[2]} onChange={e => handleMatrixChange(2, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>}
               
               <input type="number" value={matrix[3]} onChange={e => handleMatrixChange(3, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
               <input type="number" value={matrix[4]} onChange={e => handleMatrixChange(4, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
               {matrixSize === 3 && <input type="number" value={matrix[5]} onChange={e => handleMatrixChange(5, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>}
               
               {matrixSize === 3 && (
                 <>
                   <input type="number" value={matrix[6]} onChange={e => handleMatrixChange(6, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
                   <input type="number" value={matrix[7]} onChange={e => handleMatrixChange(7, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
                   <input type="number" value={matrix[8]} onChange={e => handleMatrixChange(8, e.target.value)} disabled={isPlaying} style={{textAlign:'center'}}/>
                 </>
               )}
            </div>
            {detInv === -1 && mode === 'decrypt' && (
              <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '8px'}}>Matrix is not invertible mod 26!</div>
            )}
          </div>
          
          <div className="form-group" style={{marginTop: '20px'}}>
            <label>{mode === 'encrypt' ? 'Message to Encrypt' : 'Ciphertext to Decrypt'}</label>
            <textarea 
              placeholder="Type message..." 
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                if (isPlaying) handleReset();
              }}
              disabled={isPlaying}
            />
          </div>

          {!isPlaying ? (
            <button className="btn-primary" onClick={handleStart} disabled={!inputText || (mode === 'decrypt' && detInv === -1)} style={{marginTop: '20px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>{mode === 'encrypt' ? 'Encrypt & Animate' : 'Decrypt & Animate'}</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={handleReset} style={{marginTop: '20px', width: '100%'}}>
              Stop Animation
            </button>
          )}

          <AnimatePresence>
            {isFinished && (
              <motion.div 
                initial={{opacity:0, y: 10}} 
                animate={{ opacity:1, y: 0 }} 
                className="output-section"
              >
                <label>Final {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}</label>
                <div className="output-area" style={{
                  borderColor: 'var(--border-color)',
                  color: showHighlight ? 'var(--accent-color)' : 'var(--text-primary)',
                  textShadow: showHighlight ? '0 0 8px var(--accent-color)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {encryptionData.map(d => d.cBlock).join('')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STUDIO */}
        <AnimatePresence>
          {showStudio && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="anim-studio" ref={studioRef} style={{ marginTop: '0' }}>
                <div className="anim-title">{mode === 'encrypt' ? 'Encryption Studio' : 'Decryption Studio'}</div>
                
                {!isPlaying && !isFinished ? (
                  /* LIVE TYPING BUBBLES */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
                     <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginBottom:'16px', textAlign:'center'}}>
                         {mode === 'encrypt' ? 'Plaintext Blocks' : 'Ciphertext Blocks'}
                     </div>
                     <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                       <AnimatePresence>
                         {blocks.map((block, i) => (
                           <motion.div 
                             key={i} 
                             layout 
                             initial={{scale: 0, y: -20, opacity: 0}} 
                             animate={{scale: 1, y: 0, opacity: 1}} 
                             transition={{type: "spring", stiffness: 300, damping: 20}}
                             className="char-box" style={{width: 'auto', padding: '0 12px'}}
                           >
                             {block}
                           </motion.div>
                         ))}
                       </AnimatePresence>
                     </div>
                  </div>
                ) : !isFinished ? (
                  /* VERTICAL STEP-BY-STEP ANIMATION LAYOUT */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    <div style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      Step {currentStep + 1} of {blocks.length}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flex: 1 }}>
                      
                      {/* PREV BUTTON */}
                      <button className="btn-secondary" style={{width: 'auto', padding: '10px 16px'}} onClick={handlePrev} disabled={currentStep === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>

                      {/* CENTRAL VERTICAL STACK */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        
                        {/* TOP: Plaintext Array */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{mode === 'encrypt' ? 'Plaintext Block' : 'Ciphertext Block'}</div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                            {blocks.map((block, i) => (
                              <motion.div key={`p-${i}`} className="char-box" style={{
                                width: 'auto', padding: '0 12px',
                                borderColor: i === currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                                opacity: i === currentStep ? 1 : 0.5
                              }}>
                                {block}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* ARROW */}
                        <motion.div key={`a1-${currentStep}`} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flow-arrow" style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>▼</motion.div>

                        {/* MIDDLE: Operation Box */}
                        <motion.div key={`op-${currentStep}`} initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="math-operation-box" style={{minHeight: '160px', width: '380px', padding: '24px', textAlign: 'left'}}>
                          
                          <div style={{marginBottom: '12px', fontSize: '0.95rem'}}>
                            <div style={{color: 'var(--text-muted)'}}>Formula:</div>
                            <div style={{color: '#fff', fontWeight: '600', marginTop: '4px'}}>
                              [{matrixSize === 2 ? 'C1, C2' : 'C1, C2, C3'}] = [{matrixSize === 2 ? 'P1, P2' : 'P1, P2, P3'}] × Matrix mod 26
                            </div>
                          </div>
                          
                          <div style={{borderTop: '1px solid var(--border-color)', margin: '16px 0'}}></div>

                          <div style={{marginBottom: '8px'}}>
                            <div style={{color: 'var(--text-muted)', marginBottom: '8px'}}>First Character (C1)</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C1 = ({currentData.p1} × {K[0]}) + ({currentData.p2} × {K[1]}){matrixSize === 3 ? ` + (${currentData.p3} × ${K[2]})` : ''}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C1 = {currentData.p1 * K[0]} + {currentData.p2 * K[1]}{matrixSize === 3 ? ` + ${currentData.p3 * K[2]}` : ''}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C1 = {currentData.c1Temp}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>{currentData.c1Temp} mod 26 = {currentData.c1}</div>
                            <div style={{fontFamily: 'var(--font-mono)', marginTop:'4px'}}>Character = <strong style={{color:'var(--accent-color)'}}>'{currentData.cBlock[0]}'</strong></div>
                          </div>

                          <div style={{borderTop: '1px solid var(--border-color)', margin: '16px 0'}}></div>

                          <div style={{marginBottom: '8px'}}>
                            <div style={{color: 'var(--text-muted)', marginBottom: '8px'}}>Second Character (C2)</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C2 = ({currentData.p1} × {K[3]}) + ({currentData.p2} × {K[4]}){matrixSize === 3 ? ` + (${currentData.p3} × ${K[5]})` : ''}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C2 = {currentData.p1 * K[3]} + {currentData.p2 * K[4]}{matrixSize === 3 ? ` + ${currentData.p3 * K[5]}` : ''}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>C2 = {currentData.c2Temp}</div>
                            <div style={{fontFamily: 'var(--font-mono)'}}>{currentData.c2Temp} mod 26 = {currentData.c2}</div>
                            <div style={{fontFamily: 'var(--font-mono)', marginTop:'4px'}}>Character = <strong style={{color:'var(--accent-color)'}}>'{currentData.cBlock[1]}'</strong></div>
                          </div>
                          
                          {matrixSize === 3 && (
                            <>
                              <div style={{borderTop: '1px solid var(--border-color)', margin: '16px 0'}}></div>
                              <div>
                                <div style={{color: 'var(--text-muted)', marginBottom: '8px'}}>Third Character (C3)</div>
                                <div style={{fontFamily: 'var(--font-mono)'}}>C3 = ({currentData.p1} × {K[6]}) + ({currentData.p2} × {K[7]}) + ({currentData.p3} × {K[8]})</div>
                                <div style={{fontFamily: 'var(--font-mono)'}}>C3 = {currentData.p1 * K[6]} + {currentData.p2 * K[7]} + {currentData.p3 * K[8]}</div>
                                <div style={{fontFamily: 'var(--font-mono)'}}>C3 = {currentData.c3Temp}</div>
                                <div style={{fontFamily: 'var(--font-mono)'}}>{currentData.c3Temp} mod 26 = {currentData.c3}</div>
                                <div style={{fontFamily: 'var(--font-mono)', marginTop:'4px'}}>Character = <strong style={{color:'var(--accent-color)'}}>'{currentData.cBlock[2]}'</strong></div>
                              </div>
                            </>
                          )}
                        </motion.div>

                        {/* ARROW */}
                        <motion.div key={`a2-${currentStep}`} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flow-arrow" style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>▼</motion.div>

                        {/* BOTTOM: Ciphertext Array */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{mode === 'encrypt' ? 'Ciphertext Block' : 'Plaintext Block'}</div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                            {encryptionData.map((data, i) => (
                              <motion.div key={`c-${i}`} className="char-box" style={{
                                width: 'auto', padding: '0 12px',
                                borderColor: i === currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                                opacity: i <= currentStep ? 1 : 0.2
                              }}>
                                {i <= currentStep ? data.cBlock : ''}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* NEXT BUTTON & AUTO SCROLL */}
                      <div style={{display:'flex', flexDirection:'column', gap:'8px', alignItems:'center'}}>
                        <button className="btn-primary" style={{width: '100%', padding: '10px 16px'}} onClick={handleNext}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        <button 
                          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                          style={{
                            background:'transparent', border:'none', cursor:'pointer', 
                            fontSize:'0.75rem', fontWeight:'600', 
                            color: isAutoScrolling ? 'var(--accent-color)' : 'var(--text-muted)'
                          }}
                        >
                          {isAutoScrolling ? '■ STOP AUTO' : '▶ AUTO SCROLL'}
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                   /* FINAL DISPLAY AFTER LAST STEP */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      Step {currentStep} of {blocks.length} (Complete)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flex: 1 }}>
                      
                      <button className="btn-secondary" style={{width: 'auto', padding: '10px 16px'}} onClick={handlePrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{fontSize:'1.1rem', color:'var(--text-primary)', marginBottom:'24px', fontWeight:'600'}}>
                            Encryption Complete
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                          <div>
                            <div style={{fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'10px', textAlign:'center'}}>{mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}</div>
                            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                              {encryptionData.map((d, i) => <div key={i} className="char-box" style={{width:'auto', padding:'0 8px'}}>{d.pBlock}</div>)}
                            </div>
                          </div>
                          
                          <div style={{display:'flex', justifyContent:'center', color:'var(--border-color)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          </div>

                          <div>
                            <div style={{fontSize:'0.85rem', color:'var(--accent-color)', marginBottom:'10px', textAlign:'center', fontWeight:'500'}}>Final {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}</div>
                            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                              {encryptionData.map((d, i) => <div key={i} className="char-box" style={{borderColor: 'var(--accent-color)', backgroundColor: 'var(--bg-surface-hover)', width:'auto', padding:'0 8px'}}>{d.cBlock}</div>)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{display:'flex', flexDirection:'column', gap:'8px', alignItems:'center'}}>
                        <button className="btn-primary" style={{width: '100%', padding: '10px 16px', opacity: 0, pointerEvents: 'none'}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
