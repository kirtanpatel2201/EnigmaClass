import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePlayfairGrid, playfair } from '../lib/crypto';

export default function PlayfairCipher() {
  const [mode, setMode] = useState('encrypt');
  const [key, setKey] = useState('MONARCHY');
  const [inputText, setInputText] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1); // -1 is matrix gen step
  const [showHighlight, setShowHighlight] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const studioRef = useRef(null);

  let rawText = inputText.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  
  // Format into digraphs
  let formattedText = '';
  for (let i = 0; i < rawText.length; i++) {
      formattedText += rawText[i];
      if (i < rawText.length - 1 && rawText[i] === rawText[i+1] && formattedText.length % 2 !== 0) {
          formattedText += 'X';
      }
  }
  if (formattedText.length % 2 !== 0) formattedText += 'X';

  const pairs = [];
  for (let i = 0; i < formattedText.length; i += 2) {
    pairs.push(formattedText.slice(i, i + 2));
  }
  
  const isDecrypt = mode === 'decrypt';
  const matrix = generatePlayfairGrid(key);
  
  const encryptionData = pairs.map(pair => {
    const res = playfair(pair, key, isDecrypt);
    
    const p1 = pair[0];
    const p2 = pair[1];
    let r1 = -1, c1 = -1, r2 = -1, c2 = -1;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (matrix[r][c] === p1) { r1 = r; c1 = c; }
            if (matrix[r][c] === p2) { r2 = r; c2 = c; }
        }
    }
    
    let rule = "";
    if (r1 === r2) rule = `Same Row (Shift ${isDecrypt ? 'Left' : 'Right'})`;
    else if (c1 === c2) rule = `Same Column (Shift ${isDecrypt ? 'Up' : 'Down'})`;
    else rule = "Rectangle Rule (Swap Corners)";

    return {
      pair,
      cPair: res,
      r1, c1, r2, c2,
      res1: res[0], res2: res[1],
      rule
    };
  });

  const handleStart = () => {
    if (pairs.length === 0) return;
    setIsPlaying(true);
    setCurrentStep(-1);
    setShowHighlight(false);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < pairs.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === pairs.length) {
        setShowHighlight(true);
        setTimeout(() => setShowHighlight(false), 2000);
        setIsAutoScrolling(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setIsAutoScrolling(false);
  };

  useEffect(() => {
    if (isAutoScrolling && isPlaying && currentStep < pairs.length) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= pairs.length) {
      setIsAutoScrolling(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, isPlaying, currentStep, pairs.length]);

  const showStudio = inputText.length > 0;
  const isFinished = currentStep === pairs.length;
  const currentData = (!isFinished && currentStep >= 0 && pairs.length > 0) ? encryptionData[currentStep] : null;

  const renderMatrix = (stepData) => {
    return (
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {matrix.map((row, r) => (
          row.map((char, c) => {
            let isP = false;
            let isC = false;
            if (stepData) {
               isP = (r === stepData.r1 && c === stepData.c1) || (r === stepData.r2 && c === stepData.c2);
               // Because Playfair digraph outputs are distinct from inputs typically, 
               // and characters only appear once in grid, direct char comparison works.
               isC = (char === stepData.res1) || (char === stepData.res2);
            }
            
            let bg = 'rgba(255,255,255,0.05)';
            let color = 'var(--text-muted)';
            let border = '1px solid transparent';
            
            if (isP) {
               bg = 'rgba(239, 68, 68, 0.15)'; // Redish for plaintext
               border = '1px solid rgba(239, 68, 68, 0.5)';
               color = '#fca5a5';
            } else if (isC) {
               bg = 'rgba(59, 130, 246, 0.15)'; // Blueish for ciphertext
               border = '1px solid rgba(59, 130, 246, 0.5)';
               color = '#93c5fd';
            }
            
            return (
              <div key={`${r}-${c}`} style={{
                width: '36px', height: '36px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: bg, border, borderRadius: '6px', color, 
                fontWeight: (isP || isC) ? 'bold' : 'normal',
                fontFamily: 'var(--font-mono)', fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}>
                 {char}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Playfair Cipher</h2>
        <p>The Playfair cipher encrypts pairs of letters (digraphs), instead of single letters. This makes it significantly harder to break using frequency analysis.</p>
      </div>
      
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => { setMode('encrypt'); handleReset(); }}>Encryption</button>
        <button className={`mode-tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => { setMode('decrypt'); handleReset(); }}>Decryption</button>
      </div>

      <div className="cipher-workspace">
        <div className="glass-card">
          <div className="card-title">Parameters & Input</div>
          
          <div className="form-group">
            <label>Keyword</label>
            <input type="text" value={key} onChange={e => { setKey(e.target.value); handleReset(); }} disabled={isPlaying} />
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
            <button className="btn-primary" onClick={handleStart} disabled={!inputText} style={{marginTop: '20px'}}>
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
                  {encryptionData.map(d => d.cPair).join('')}
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
                         {mode === 'encrypt' ? 'Plaintext Blocks (Pairs)' : 'Ciphertext Blocks (Pairs)'}
                     </div>
                     <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                       <AnimatePresence>
                         {pairs.map((pair, i) => (
                           <motion.div 
                             key={i} 
                             layout 
                             initial={{scale: 0, y: -20, opacity: 0}} 
                             animate={{scale: 1, y: 0, opacity: 1}} 
                             transition={{type: "spring", stiffness: 300, damping: 20}}
                             className="char-box" style={{width: 'auto', padding: '0 12px'}}
                           >
                             {pair}
                           </motion.div>
                         ))}
                       </AnimatePresence>
                     </div>
                  </div>
                ) : !isFinished ? (
                  /* VERTICAL STEP-BY-STEP ANIMATION LAYOUT */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    <div style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      {currentStep === -1 ? 'Step 1 of ' + (pairs.length + 1) + ' (Matrix Generation)' : `Step ${currentStep + 2} of ${pairs.length + 1} (Processing Digraph)`}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flex: 1 }}>
                      
                      {/* PREV BUTTON */}
                      <button className="btn-secondary" style={{width: 'auto', padding: '10px 16px'}} onClick={handlePrev} disabled={currentStep === -1}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>

                      {/* CENTRAL VERTICAL STACK */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        
                        {currentStep >= 0 && (
                          <>
                            {/* TOP: Plaintext Array */}
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{mode === 'encrypt' ? 'Plaintext Block' : 'Ciphertext Block'}</div>
                              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {pairs.map((pair, i) => (
                                  <motion.div key={`p-${i}`} className="char-box" style={{
                                    width: 'auto', padding: '0 12px',
                                    borderColor: i === currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                                    opacity: i === currentStep ? 1 : 0.5
                                  }}>
                                    {pair}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            {/* ARROW */}
                            <motion.div key={`a1-${currentStep}`} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flow-arrow" style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>▼</motion.div>
                          </>
                        )}

                        {/* MIDDLE: Operation Box */}
                        <motion.div key={`op-${currentStep}`} initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="math-operation-box" style={{minHeight: '160px', width: '420px', textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                          {currentStep === -1 ? (
                            <>
                              <div style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600'}}>
                                Step 1: Matrix Construction
                              </div>
                              <div style={{display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center'}}>
                                {renderMatrix(null)}
                                <div style={{textAlign: 'left', flex: 1}}>
                                  <div style={{color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'8px'}}>
                                    The 5×5 matrix is generated using the keyword <strong style={{color:'#fff'}}>'{key}'</strong>.
                                  </div>
                                  <div style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>
                                    Duplicate letters are removed, and 'J' is merged with 'I'. The remaining alphabet fills the rest.
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>
                                Digraph Mapping
                              </div>
                              
                              <div style={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center'}}>
                                {renderMatrix(currentData)}
                                
                                <div style={{textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.15)', padding: '16px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box'}}>
                                  <div style={{fontFamily: 'var(--font-mono)', display: 'grid', gridTemplateColumns: '140px 20px 1fr', gap: '8px 0', alignItems: 'center', fontSize: '0.95rem'}}>
                                     <div style={{color: 'var(--text-muted)'}}>Input Pair</div>
                                     <div style={{color: 'var(--text-muted)'}}>:</div>
                                     <div style={{color: '#fca5a5', fontWeight: '600'}}>'{currentData.pair}'</div>
                                     
                                     <div style={{color: 'var(--text-muted)'}}>Selected Rule</div>
                                     <div style={{color: 'var(--text-muted)'}}>:</div>
                                     <div style={{color: '#fff', fontWeight: '500'}}>{currentData.rule}</div>
                                     
                                     <div style={{color: 'var(--text-muted)'}}>Transformation</div>
                                     <div style={{color: 'var(--text-muted)'}}>:</div>
                                     <div style={{color: 'var(--accent-color)', fontWeight: '600'}}>'{currentData.pair}' → '{currentData.cPair}'</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>

                        {currentStep >= 0 && (
                          <>
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
                                    {i <= currentStep ? data.cPair : ''}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                      </div>

                      {/* NEXT BUTTON & AUTO SCROLL */}
                      <div style={{display:'flex', flexDirection:'column', gap:'8px', alignItems:'center'}}>
                        <button className="btn-primary" style={{width: '100%', padding: '10px 16px', opacity: currentStep === pairs.length ? 0 : 1, pointerEvents: currentStep === pairs.length ? 'none' : 'auto'}} onClick={handleNext}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        {currentStep < pairs.length && (
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
                        )}
                      </div>

                    </div>
                  </div>
                ) : (
                  /* FINAL DISPLAY AFTER LAST STEP */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      Step {currentStep} of {pairs.length} (Complete)
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
                              {encryptionData.map((d, i) => <div key={i} className="char-box" style={{width:'auto', padding:'0 8px'}}>{d.pair}</div>)}
                            </div>
                          </div>
                          
                          <div style={{display:'flex', justifyContent:'center', color:'var(--border-color)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          </div>

                          <div>
                            <div style={{fontSize:'0.85rem', color:'var(--accent-color)', marginBottom:'10px', textAlign:'center', fontWeight:'500'}}>Final {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}</div>
                            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                              {encryptionData.map((d, i) => <div key={i} className="char-box" style={{borderColor: 'var(--accent-color)', backgroundColor: 'var(--bg-surface-hover)', width:'auto', padding:'0 8px'}}>{d.cPair}</div>)}
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
