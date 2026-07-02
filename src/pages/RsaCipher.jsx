import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rsaGenerateKeys, rsaEncrypt, rsaDecrypt } from '../lib/crypto';

export default function RsaCipher() {
  const [pVal, setPVal] = useState(61);
  const [qVal, setQVal] = useState(53);
  const [dVal, setDVal] = useState('');
  const [nVal, setNVal] = useState('');
  const [inputText, setInputText] = useState('65');
  const [mode, setMode] = useState('encrypt');
  
  const [keys, setKeys] = useState(null);
  const [output, setOutput] = useState(null);
  const [lastCiphertext, setLastCiphertext] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const studioRef = useRef(null);
  const totalSteps = mode === 'encrypt' ? 7 : 4;

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsAutoScrolling(false);
    setShowHighlight(false);
  };

  const handleStart = () => {
    const M = parseInt(inputText);
    if (isNaN(M)) return;

    try {
      if (mode === 'encrypt') {
        const P = parseInt(pVal);
        const Q = parseInt(qVal);
        if (!P || !Q) return;
        
        const generatedKeys = rsaGenerateKeys(P, Q);
        if (!generatedKeys) throw new Error("Invalid keys");
        setKeys(generatedKeys);
        
        const { n, e, d } = generatedKeys;
        setDVal(d.toString());
        setNVal(n.toString());
        
        const res = rsaEncrypt(M, e, n);
        setOutput(res.toString());
        setLastCiphertext(res.toString());
      } else {
        const d = parseInt(dVal);
        const n = parseInt(nVal);
        if (!d || !n) return;
        
        setKeys({ d, n });
        const res = rsaDecrypt(M, d, n);
        setOutput(res.toString());
      }
      
      setIsPlaying(true);
      setCurrentStep(0);
      setShowHighlight(false);
      setTimeout(() => studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      alert("Error generating keys or performing simulation.");
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === totalSteps - 1) {
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

  useEffect(() => {
    if (isAutoScrolling && isPlaying && currentStep < totalSteps - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 3000); // Slower interval for RSA since there's more text
      return () => clearTimeout(timer);
    } else if (currentStep >= totalSteps - 1) {
      setIsAutoScrolling(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, isPlaying, currentStep, totalSteps]);

  const isFinished = currentStep === totalSteps - 1 && output !== null && !isPlaying;

  const renderStepContent = (step) => {
    if (!keys) return null;
    const M = parseInt(inputText);
    
    if (mode === 'decrypt') {
      switch(step) {
        case 0:
          return (
            <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
              <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 1: Decryption Inputs</div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'16px', whiteSpace:'nowrap'}}>
                Ciphertext (C) = {M}
              </div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>
                Private Key (d) = {keys.d}
              </div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'24px', whiteSpace:'nowrap'}}>
                Modulus (n) = {keys.n}
              </div>
              <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
                To decrypt the message, we only need the ciphertext and the private key parameters (d, n). 
                The key generation process does not need to be repeated.
              </div>
            </div>
          );
        case 1:
          return (
            <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
              <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 2: The Decryption Formula</div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'2rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
                M = Cᵈ mod n
              </div>
              <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
                 By raising the ciphertext <strong>C</strong> to the private exponent <strong>d</strong>, we perfectly unwrap the modular exponentiation and recover the original plaintext message.
              </div>
            </div>
          );
        case 2:
          return (
            <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
              <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 3: Modular Exponentiation</div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'1.5rem', marginBottom:'16px', color:'#fff', whiteSpace:'nowrap'}}>
                M = {M}<sup style={{color:'#ef4444'}}>{keys.d}</sup> mod {keys.n}
              </div>
              <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
                 This calculation is computationally heavy but feasible for the receiver who knows <strong>d</strong>. Eve, who does not know <strong>d</strong>, cannot perform this operation.
              </div>
            </div>
          );
        case 3:
          return (
            <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
              <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 4: Recover Plaintext</div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:'2.5rem', fontWeight:'bold', color:'#10b981', marginBottom:'24px', marginTop:'16px', whiteSpace:'nowrap'}}>
                Plaintext = {output}
              </div>
              <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
                 The math completes its full circle, and the original message has been successfully recovered!
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Encryption Mode
    switch(step) {
      case 0:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 1: The Primes</div>
            <div style={{display:'flex', justifyContent:'center', gap:'40px', marginBottom:'24px'}}>
               <div>
                  <div style={{color:'var(--text-muted)'}}>Prime p</div>
                  <div style={{fontSize:'2rem', fontFamily:'var(--font-mono)', fontWeight:'bold', whiteSpace:'nowrap'}}>{pVal}</div>
               </div>
               <div>
                  <div style={{color:'var(--text-muted)'}}>Prime q</div>
                  <div style={{fontSize:'2rem', fontFamily:'var(--font-mono)', fontWeight:'bold', whiteSpace:'nowrap'}}>{qVal}</div>
               </div>
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               RSA security relies on the mathematical difficulty of factoring the product of two prime numbers. 
               In a real-world scenario, <strong style={{color:'#fff'}}>p</strong> and <strong style={{color:'#fff'}}>q</strong> would be hundreds of digits long, making them impossible to guess.
            </div>
          </div>
        );
      case 1:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 2: The Modulus (n)</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', marginBottom:'16px', whiteSpace:'nowrap'}}>
              n = p × q
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>
              n = {pVal} × {qVal}
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'2rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
              n = {keys.n}
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               The modulus <strong style={{color:'#fff'}}>n</strong> is the mathematical "ceiling" for all RSA operations. 
               It is released <strong style={{color:'#10b981'}}>publicly</strong> as part of the public key. Knowing <strong>n</strong> does not easily reveal <strong>p</strong> and <strong>q</strong>.
            </div>
          </div>
        );
      case 2:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 3: Euler's Totient φ(n)</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', marginBottom:'16px', whiteSpace:'nowrap'}}>
              φ(n) = (p - 1) × (q - 1)
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>
              φ(n) = ({pVal} - 1) × ({qVal} - 1)
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'2rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
              φ(n) = {keys.phi}
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               The totient is the <strong style={{color:'#ef4444'}}>secret trapdoor</strong>. 
               It counts the integers up to <strong>n</strong> that are coprime to <strong>n</strong>. 
               Only someone who knows the original primes <strong style={{color:'#fff'}}>p</strong> and <strong style={{color:'#fff'}}>q</strong> can easily calculate this value.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 4: Public Exponent (e)</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'2.5rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
              e = {keys.e}
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               We select a public exponent <strong style={{color:'#fff'}}>e</strong> that is coprime to our secret totient φ(n) ({keys.phi}). 
               This value is also released <strong style={{color:'#10b981'}}>publicly</strong> alongside <strong style={{color:'#fff'}}>n</strong>.
            </div>
          </div>
        );
      case 4:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 5: Private Exponent (d)</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', marginBottom:'16px', whiteSpace:'nowrap'}}>
              (e × d) mod φ(n) = 1
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>
              ({keys.e} × d) mod {keys.phi} = 1
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'2.5rem', fontWeight:'bold', color:'#ef4444', marginBottom:'24px', marginTop:'16px', whiteSpace:'nowrap'}}>
              d = {keys.d}
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               Using the Extended Euclidean Algorithm, we calculate the modular inverse <strong style={{color:'#ef4444'}}>d</strong>. 
               This is the <strong style={{color:'#ef4444'}}>Private Key</strong>. It mathematically links <strong>e</strong> and <strong>d</strong> via the secret <strong>φ(n)</strong>, and must remain a strictly guarded secret.
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'24px', fontWeight:'600'}}>Step 6: Key Distribution</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', width:'100%', maxWidth:'600px', margin:'0 auto'}}>
               <div className="math-operation-box" style={{textAlign:'center', borderColor:'rgba(16, 185, 129, 0.3)', background:'rgba(16, 185, 129, 0.05)'}}>
                 <div style={{fontSize:'1.2rem', color:'#10b981', marginBottom:'16px', fontWeight:'600'}}>Public Directory</div>
                 <div style={{fontFamily:'var(--font-mono)', fontSize:'1.1rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>Public Key (e, n)</div>
                 <div style={{fontFamily:'var(--font-mono)', fontSize:'1.5rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
                   ({keys.e}, {keys.n})
                 </div>
                 <div style={{color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:'1.5'}}>
                   Anyone in the world can look this up and use it to encrypt a message meant specifically for you.
                 </div>
               </div>
               <div className="math-operation-box" style={{textAlign:'center', borderColor:'rgba(239, 68, 68, 0.3)', background:'rgba(239, 68, 68, 0.05)'}}>
                 <div style={{fontSize:'1.2rem', color:'#ef4444', marginBottom:'16px', fontWeight:'600'}}>Private Server</div>
                 <div style={{fontFamily:'var(--font-mono)', fontSize:'1.1rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>Private Key (d, n)</div>
                 <div style={{fontFamily:'var(--font-mono)', fontSize:'1.5rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', whiteSpace:'nowrap'}}>
                   ({keys.d}, {keys.n})
                 </div>
                 <div style={{color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:'1.5'}}>
                   Only you possess this. It is mathematically required to unlock and decrypt the messages sent to you.
                 </div>
               </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="math-operation-box" style={{textAlign:'center', width:'100%', maxWidth:'450px', padding:'16px', margin:'0 auto'}}>
            <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'12px', fontWeight:'600'}}>Step 7: The Encryption Math</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', marginBottom:'16px', whiteSpace:'nowrap'}}>
              C = Mᵉ mod n
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:'var(--text-muted)', marginBottom:'8px', whiteSpace:'nowrap'}}>
              C = {M}<sup style={{color:'#fff'}}>{keys.e}</sup> mod {keys.n}
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'2.5rem', fontWeight:'bold', color:'#fff', marginBottom:'24px', marginTop:'16px', whiteSpace:'nowrap'}}>
              C = {output}
            </div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6'}}>
               The plaintext message is raised to the public exponent e, then wrapped around the modulus n. Without d, this modular exponentiation is computationally impossible to reverse.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>RSA Algorithm</h2>
        <p>Rivest–Shamir–Adleman (RSA) is a public-key cryptosystem. It uses mathematically linked public and private keys based on the difficulty of factoring the product of two large prime numbers.</p>
      </div>
      
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => { setMode('encrypt'); handleReset(); }}>Encrypt (M → C)</button>
        <button className={`mode-tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => { 
          setMode('decrypt'); 
          handleReset(); 
          if (lastCiphertext) setInputText(lastCiphertext);
        }}>Decrypt (C → M)</button>
      </div>

      <div className="cipher-workspace">
        <div className="glass-card">
          <div className="card-title">RSA Parameters</div>
          
          {mode === 'encrypt' ? (
            <div style={{display:'flex', gap:'16px', marginBottom:'20px'}}>
               <div className="form-group" style={{flex: 1}}>
                 <label>Prime P</label>
                 <input type="number" value={pVal} onChange={e => { setPVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
               <div className="form-group" style={{flex: 1}}>
                 <label>Prime Q</label>
                 <input type="number" value={qVal} onChange={e => { setQVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
            </div>
          ) : (
            <div style={{display:'flex', gap:'16px', marginBottom:'20px'}}>
               <div className="form-group" style={{flex: 1}}>
                 <label>Private Key (d)</label>
                 <input type="number" value={dVal} onChange={e => { setDVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
               <div className="form-group" style={{flex: 1}}>
                 <label>Modulus (n)</label>
                 <input type="number" value={nVal} onChange={e => { setNVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
            </div>
          )}
          
          <div className="form-group">
            <label>{mode === 'encrypt' ? 'Message (Plaintext)' : 'Ciphertext (C)'}</label>
            <input type="number" value={inputText} onChange={e => { setInputText(e.target.value); handleReset(); }} disabled={isPlaying} />
          </div>

          {!isPlaying ? (
            <button className="btn-primary" onClick={handleStart} disabled={mode === 'encrypt' ? (!pVal || !qVal || !inputText) : (!dVal || !nVal || !inputText)} style={{marginTop: '20px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>{mode === 'encrypt' ? 'Simulate Encryption' : 'Simulate Decryption'}</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={handleReset} style={{marginTop: '20px', width: '100%'}}>
              Stop Simulation
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
                  {output}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INTERACTIVE CLASSROOM STUDIO */}
        <AnimatePresence>
          {(isPlaying || isFinished) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="anim-studio" ref={studioRef} style={{ marginTop: '0' }}>
                <div className="anim-title">RSA Interactive Classroom</div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  
                  <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px'}}>
                    {Array.from({length: totalSteps}).map((_, idx) => (
                       <div key={idx} style={{
                          height: '4px', 
                          flex: 1, 
                          maxWidth: '60px', 
                          borderRadius: '2px', 
                          background: idx <= currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                          transition: 'background 0.3s'
                       }}></div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flex: 1 }}>
                    
                    {/* PREV BUTTON */}
                    <button className="btn-secondary" style={{width: 'auto', padding: '10px 16px', opacity: currentStep === 0 ? 0 : 1, pointerEvents: currentStep === 0 ? 'none' : 'auto'}} onClick={handlePrev}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    {/* CENTRAL CONTENT */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
                      
                      {/* START NODE */}
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                        <div style={{
                          padding: '8px 24px', 
                          background: 'rgba(59, 130, 246, 0.1)', 
                          border: '1px solid #3b82f6', 
                          borderRadius: '20px',
                          color: '#93c5fd',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          Start
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px', marginBottom: '8px'}}>
                          <div style={{width: '2px', height: '24px', background: 'rgba(255, 255, 255, 0.8)'}}></div>
                          <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1', marginTop: '-4px'}}>▼</div>
                        </div>
                      </div>

                      {Array.from({length: currentStep}).map((_, step) => (
                        <motion.div key={`node-${step}`} layout initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} style={{width: '100%'}}>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                            <div style={{
                              padding: '10px 20px', 
                              background: 'rgba(255,255,255,0.03)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '8px',
                              color: 'var(--text-muted)',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--accent-color)'}}><polyline points="20 6 9 17 4 12"></polyline></svg>
                              {mode === 'encrypt' ? (
                                (() => {
                                  switch(step) {
                                    case 0: return `The Primes p = ${pVal}, q = ${qVal}`;
                                    case 1: return `The Modulus (n) = ${keys?.n}`;
                                    case 2: return `Euler's Totient φ(n) = ${keys?.phi}`;
                                    case 3: return `Public Exponent (e) = ${keys?.e}`;
                                    case 4: return `Private Exponent (d) = ${keys?.d}`;
                                    case 5: return "Key Distribution Complete";
                                    case 6: return `Final Result = ${output}`;
                                    default: return "";
                                  }
                                })()
                              ) : (
                                (() => {
                                  switch(step) {
                                    case 0: return `Inputs C = ${inputText}, d = ${keys?.d}, n = ${keys?.n}`;
                                    case 1: return `Formula M = Cᵈ mod n`;
                                    case 2: return `Calculation Complete`;
                                    case 3: return `Final Plaintext = ${output}`;
                                    default: return "";
                                  }
                                })()
                              )}
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px', marginBottom: '8px'}}>
                              <div style={{width: '2px', height: '24px', background: 'rgba(255, 255, 255, 0.8)'}}></div>
                              <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1', marginTop: '-4px'}}>▼</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      <AnimatePresence mode="wait">
                        <motion.div
                           key={`card-${currentStep}`}
                           layout
                           initial={{opacity: 0, y: 10}}
                           animate={{opacity: 1, y: 0}}
                           exit={{opacity: 0, scale: 0.8}}
                           transition={{duration: 0.3}}
                           style={{width: '100%'}}
                        >
                           {renderStepContent(currentStep)}
                        </motion.div>
                      </AnimatePresence>

                    </div>

                    {/* NEXT BUTTON & AUTO SCROLL */}
                    <div style={{display:'flex', flexDirection:'column', gap:'8px', alignItems:'center'}}>
                      <button className="btn-primary" style={{width: '100%', padding: '10px 16px', opacity: currentStep === totalSteps - 1 ? 0 : 1, pointerEvents: currentStep === totalSteps - 1 ? 'none' : 'auto'}} onClick={handleNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                      {currentStep < totalSteps - 1 && (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
