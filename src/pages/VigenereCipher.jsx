import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VigenereCipher() {
  const [mode, setMode] = useState('encrypt');
  const [keyword, setKeyword] = useState('LEMON');
  const [inputText, setInputText] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const studioRef = useRef(null);

  const textArray = inputText.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'A';
  
  const isDecrypt = mode === 'decrypt';
  
  const encryptionData = textArray.map((pChar, i) => {
    const pCode = pChar.charCodeAt(0) - 65;
    const keyChar = cleanKeyword[i % cleanKeyword.length];
    const kCode = keyChar.charCodeAt(0) - 65;
    
    const cCodeTemp = isDecrypt ? pCode - kCode : pCode + kCode;
    const finalCode = (cCodeTemp % 26 + 26) % 26;
    const cChar = String.fromCharCode(finalCode + 65);
    
    return {
      pChar,
      pCode,
      keyChar,
      kCode,
      cCodeTemp,
      finalCode,
      cChar
    };
  });

  const handleStart = () => {
    if (textArray.length === 0) return;
    setIsPlaying(true);
    setCurrentStep(0);
    setShowHighlight(false);
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < textArray.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === textArray.length) {
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
    if (isAutoScrolling && isPlaying && currentStep < textArray.length) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= textArray.length) {
      setIsAutoScrolling(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, isPlaying, currentStep, textArray.length]);

  const showStudio = inputText.length > 0;
  const isFinished = currentStep === textArray.length;
  const currentData = !isFinished ? encryptionData[currentStep] : null;

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Vigenère Cipher</h2>
        <p>The Vigenère cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword. It is a form of polyalphabetic substitution. The keyword is repeated to match the length of the plaintext, and the numerical value of the keyword's letter determines the shift applied to the plaintext letter.</p>
      </div>
      
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => { setMode('encrypt'); handleReset(); }}>Encryption</button>
        <button className={`mode-tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => { setMode('decrypt'); handleReset(); }}>Decryption</button>
      </div>

      <div className="cipher-workspace">
        <div className="glass-card">
          <div className="card-title">Parameters & Input</div>
          
          <div className="form-group">
            <label>Shift Keyword</label>
            <input type="text" value={keyword} onChange={e => { setKeyword(e.target.value); handleReset(); }} disabled={isPlaying} />
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
                  {encryptionData.map(d => d.cChar).join('')}
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
                
                {!isPlaying ? (
                  /* LIVE TYPING BUBBLES */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
                     <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginBottom:'16px', textAlign:'center'}}>
                         {mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}
                     </div>
                     <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                       <AnimatePresence>
                         {textArray.map((char, i) => (
                           <motion.div 
                             key={i} 
                             layout 
                             initial={{scale: 0, y: -20, opacity: 0}} 
                             animate={{scale: 1, y: 0, opacity: 1}} 
                             transition={{type: "spring", stiffness: 300, damping: 20}}
                             className="char-box"
                           >
                             {char}
                           </motion.div>
                         ))}
                       </AnimatePresence>
                     </div>
                  </div>
                ) : !isFinished ? (
                  /* VERTICAL STEP-BY-STEP ANIMATION LAYOUT */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    <div style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      Step {currentStep + 1} of {textArray.length}
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
                          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}</div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                            {textArray.map((char, i) => (
                              <motion.div key={`p-${i}`} className="char-box" style={{
                                borderColor: i === currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                                opacity: i === currentStep ? 1 : 0.5
                              }}>
                                {char}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* ARROW */}
                        <motion.div key={`a1-${currentStep}`} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flow-arrow" style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>▼</motion.div>

                        {/* MIDDLE: Operation Box */}
                        <motion.div key={`op-${currentStep}`} initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="math-operation-box" style={{minHeight: '160px', width: '280px'}}>
                          <div style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px'}}>
                            f(x) = (x {isDecrypt ? '-' : '+'} K) mod 26
                          </div>
                          <div>Keyword Char = <strong style={{color:'#fff'}}>'{currentData.keyChar}' ({currentData.kCode})</strong></div>
                          <div>'{currentData.pChar}' = <strong style={{color:'#fff'}}>{currentData.pCode}</strong></div>
                          <div>{currentData.pCode} {isDecrypt ? '-' : '+'} {currentData.kCode} = <strong style={{color:'#fff'}}>{currentData.cCodeTemp}</strong></div>
                          {currentData.cCodeTemp !== currentData.finalCode && (
                            <div>{currentData.cCodeTemp} mod 26 = <strong style={{color:'#fff'}}>{currentData.finalCode}</strong></div>
                          )}
                          <div style={{marginTop: '8px', color: 'var(--accent-color)', fontWeight: '600'}}>
                            {currentData.finalCode} = '{currentData.cChar}'
                          </div>
                        </motion.div>

                        {/* ARROW */}
                        <motion.div key={`a2-${currentStep}`} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flow-arrow" style={{color: 'var(--text-muted)', fontSize: '1.5rem'}}>▼</motion.div>

                        {/* BOTTOM: Ciphertext Array */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}</div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                            {encryptionData.map((data, i) => (
                              <motion.div key={`c-${i}`} className="char-box" style={{
                                borderColor: i === currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                                opacity: i <= currentStep ? 1 : 0.2
                              }}>
                                {i <= currentStep ? data.cChar : ''}
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
                      Step {currentStep} of {textArray.length} (Complete)
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
                              {encryptionData.map((d, i) => <div key={i} className="char-box">{d.pChar}</div>)}
                            </div>
                          </div>
                          
                          <div style={{display:'flex', justifyContent:'center', color:'var(--border-color)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          </div>

                          <div>
                            <div style={{fontSize:'0.85rem', color:'var(--accent-color)', marginBottom:'10px', textAlign:'center', fontWeight:'500'}}>Final {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}</div>
                            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center'}}>
                              {encryptionData.map((d, i) => <div key={i} className="char-box" style={{borderColor: 'var(--accent-color)', backgroundColor: 'var(--bg-surface-hover)'}}>{d.cChar}</div>)}
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
