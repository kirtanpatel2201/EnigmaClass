import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diffieHellmanCalculate } from '../lib/crypto';

export default function DhCipher() {
  const [pVal, setPVal] = useState(23);
  const [gVal, setGVal] = useState(5);
  const [aSec, setASec] = useState(4);
  const [bSec, setBSec] = useState(3);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    
  const [dhData, setDhData] = useState(null);

  const studioRef = useRef(null);
  const totalSteps = 5;

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsAutoScrolling(false);
  };

  const handleStart = () => {
    const p = parseInt(pVal);
    const g = parseInt(gVal);
    const a = parseInt(aSec);
    const b = parseInt(bSec);
    if (!p || !g || !a || !b) return;

    const A = diffieHellmanCalculate(g, a, p);
    const B = diffieHellmanCalculate(g, b, p);
    const sA = diffieHellmanCalculate(B, a, p);
    const sB = diffieHellmanCalculate(A, b, p);

    setDhData({ p, g, a, b, A, B, sA, sB });
    
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === totalSteps - 1) {
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
      }, 3000); 
      return () => clearTimeout(timer);
    } else if (currentStep >= totalSteps - 1) {
      setIsAutoScrolling(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, isPlaying, currentStep, totalSteps]);

  const isFinished = currentStep === totalSteps - 1 && dhData !== null && !isPlaying;

  const renderStepContent = (step) => {
    if (!dhData) return null;
    const { p, g, a, b, A, B, sA, sB } = dhData;
    
    // UI Helpers
    const AliceBox = ({ title, children, active = true }) => (
       <div style={{
          border: active ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--border-color)', 
          background: active ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-surface-hover)', 
          boxShadow: active ? '0 4px 20px rgba(59, 130, 246, 0.05)' : 'none',
          padding: '24px', borderRadius: '12px', flex: 1, 
          display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
       }}>
          <div style={{fontSize:'0.85rem', color: active ? '#93c5fd' : 'var(--text-muted)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px'}}>
             {title}
          </div>
          <div style={{color:'var(--text-primary)', fontFamily:'var(--font-mono)', fontSize:'0.95rem', lineHeight:'1.5'}}>
             {children}
          </div>
       </div>
    );
    
    const BobBox = ({ title, children, active = true }) => (
       <div style={{
          border: active ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--border-color)', 
          background: active ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-surface-hover)', 
          boxShadow: active ? '0 4px 20px rgba(245, 158, 11, 0.05)' : 'none',
          padding: '24px', borderRadius: '12px', flex: 1, 
          display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
       }}>
          <div style={{fontSize:'0.85rem', color: active ? '#fcd34d' : 'var(--text-muted)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px'}}>
             {title}
          </div>
          <div style={{color:'var(--text-primary)', fontFamily:'var(--font-mono)', fontSize:'0.95rem', lineHeight:'1.5'}}>
             {children}
          </div>
       </div>
    );

    const EveBox = ({ title, children, icon, active = true, animatedTrack = null }) => (
       <div style={{
          border: active ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-color)', 
          background: active ? 'rgba(239, 68, 68, 0.05)' : 'transparent', 
          padding: '24px 12px', borderRadius: '12px', flex: 1, 
          display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
          textAlign: 'center', position: 'relative'
       }}>
          <div style={{fontSize:'0.85rem', color: active ? '#fca5a5' : 'var(--text-muted)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
             {icon && <span>{icon}</span>}
             {title}
          </div>
          
          <div style={{color:'var(--text-primary)', fontSize:'0.95rem', lineHeight:'1.6', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
             {children}
          </div>

          {animatedTrack && (
             <div style={{width: '100%', height: '2px', background: active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)', position: 'relative', marginTop: '24px'}}>
                {animatedTrack}
             </div>
          )}
       </div>
    );

    const getLayout = (title, subtitle, alice, eve, bob) => (
      <div style={{width:'100%', maxWidth:'1100px', margin:'0 auto', display: 'flex', flexDirection: 'column'}}>
        <div style={{textAlign:'center', marginBottom:'32px', height:'60px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
           <div style={{fontSize:'1.2rem', color:'var(--accent-color)', marginBottom:'8px', fontWeight:'600'}}>{title}</div>
           <div style={{fontSize:'0.95rem', color:'var(--text-muted)'}}>{subtitle}</div>
        </div>
        <div style={{display:'flex', gap:'20px', alignItems:'stretch', height:'280px'}}>
           <div style={{flex: 1, display:'flex'}}>{alice}</div>
           {eve && <div style={{flex: 1.5, display:'flex', position: 'relative'}}>{eve}</div>}
           <div style={{flex: 1, display:'flex'}}>{bob}</div>
        </div>
      </div>
    );

    switch(step) {
      case 0:
        return getLayout(
          "Step 1: Public Agreement",
          "Alice and Bob must first agree on the public parameters to use for the exchange.",
          <AliceBox title="Alice" active={false}>Waiting for agreement...</AliceBox>,
          <EveBox title="Public Network (Eve)" active={true} icon="🌐" animatedTrack={
             <motion.div 
                initial={{left: 0, opacity: 0}}
                animate={{left: '100%', opacity: [0, 1, 1, 0]}}
                transition={{duration: 2.5, ease: "linear", repeat: Infinity, repeatDelay: 0.5}}
                style={{position: 'absolute', top: '-14px', transform: 'translateX(-50%)', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', whiteSpace: 'nowrap'}}
             >
                p={p}, g={g} ➔
             </motion.div>
          }>
             <div style={{fontFamily:'var(--font-mono)', fontSize:'1.2rem', marginBottom:'12px'}}>
                Prime (p) = {p}<br/>
                Base (g) = {g}
             </div>
             <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>
                These numbers are exchanged in plain sight. Eve (the eavesdropper) can see them clearly.
             </div>
          </EveBox>,
          <BobBox title="Bob" active={false}>Waiting for agreement...</BobBox>
        );
      case 1:
        return getLayout(
          "Step 2: Private Secrets",
          "Both parties generate a secret random number. These never leave their devices.",
          <AliceBox title="Alice (Local)">
             <div style={{color:'#3b82f6', marginBottom:'8px'}}>🔒 Secret (a) = {a}</div>
             <div style={{fontSize:'0.85rem', color:'var(--text-muted)', fontFamily:'var(--font-sans)'}}>Stored securely on Alice's device.</div>
          </AliceBox>,
          <EveBox title="Public Network (Eve)" active={false} icon="🌐" animatedTrack={
             <motion.div 
                initial={{left: 0, opacity: 0}}
                animate={{left: '100%', opacity: [0, 0.5, 0.5, 0]}}
                transition={{duration: 3, ease: "linear", repeat: Infinity}}
                style={{position: 'absolute', top: '-10px', transform: 'translateX(-50%)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)'}}
             >
                ➤
             </motion.div>
          }>
             <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>
                Eve only sees p={p}, g={g}.<br/><br/>She has absolutely no knowledge of Alice's or Bob's secrets.
             </div>
          </EveBox>,
          <BobBox title="Bob (Local)">
             <div style={{color:'#f59e0b', marginBottom:'8px'}}>🔒 Secret (b) = {b}</div>
             <div style={{fontSize:'0.85rem', color:'var(--text-muted)', fontFamily:'var(--font-sans)'}}>Stored securely on Bob's device.</div>
          </BobBox>
        );
      case 2:
        return getLayout(
          "Step 3: Computing Public Mixes",
          "Alice and Bob independently mix their private secrets with the public base.",
          <AliceBox title="Alice's Mix (A)">
             A = g<sup style={{color:'#3b82f6'}}>a</sup> mod p<br/>
             A = {g}<sup style={{color:'#3b82f6'}}>{a}</sup> mod {p}<br/><br/>
             <strong style={{fontSize:'1.2rem'}}>A = {A}</strong>
          </AliceBox>,
          <EveBox title="Public Network (Eve)" active={false} icon="🌐" animatedTrack={
             <motion.div 
                initial={{left: 0, opacity: 0}}
                animate={{left: '100%', opacity: [0, 0.5, 0.5, 0]}}
                transition={{duration: 3, ease: "linear", repeat: Infinity}}
                style={{position: 'absolute', top: '-10px', transform: 'translateX(-50%)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)'}}
             >
                ➤
             </motion.div>
          }>
             <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>
                Eve is listening to the network, waiting for the mixes to be transmitted...
             </div>
          </EveBox>,
          <BobBox title="Bob's Mix (B)">
             B = g<sup style={{color:'#f59e0b'}}>b</sup> mod p<br/>
             B = {g}<sup style={{color:'#f59e0b'}}>{b}</sup> mod {p}<br/><br/>
             <strong style={{fontSize:'1.2rem'}}>B = {B}</strong>
          </BobBox>
        );
      case 4: 
        return getLayout(
          "Step 5: The Shared Secret",
          "Alice and Bob mix the received values with their own secrets to find the common key.",
          <AliceBox title="Alice Computes">
             S = B<sup style={{color:'#3b82f6'}}>a</sup> mod p<br/>
             S = {B}<sup style={{color:'#3b82f6'}}>{a}</sup> mod {p}<br/><br/>
             <strong style={{fontSize:'1.5rem', color:'#10b981'}}>S = {sA}</strong>
          </AliceBox>,
          <motion.div 
             initial={{scale: 0.8, opacity: 0}} 
             animate={{scale: 1, opacity: 1}} 
             transition={{duration: 0.5, ease: "easeOut"}} 
             style={{
                width: '100%',
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
             }}>
             <div style={{fontSize: '2rem', marginBottom: '12px'}}>✅</div>
             <div style={{color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontSize: '0.9rem', lineHeight: '1.4', whiteSpace: 'nowrap'}}>
                Secure Key Exchange Successful
             </div>
             <div style={{fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#fff'}}>
                Shared Secret (S) = {sA}
             </div>
          </motion.div>,
          <BobBox title="Bob Computes">
             S = A<sup style={{color:'#f59e0b'}}>b</sup> mod p<br/>
             S = {A}<sup style={{color:'#f59e0b'}}>{b}</sup> mod {p}<br/><br/>
             <strong style={{fontSize:'1.5rem', color:'#10b981'}}>S = {sB}</strong>
          </BobBox>
        );
      case 3: // Step 4 (The Exchange) - placed out of order in code to use return directly above for step 5
        return getLayout(
          "Step 4: The Exchange",
          "The public mixes are sent across the insecure network.",
          <AliceBox title="Alice" active={true}>
             <div style={{color:'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>Sending</span>
                <span style={{color:'#3b82f6', fontWeight:'bold'}}>A = {A}</span>
             </div>
             <div style={{marginTop:'32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Receiving</span>
                <span style={{color:'#f59e0b', fontWeight:'bold'}}>B = {B}</span>
             </div>
          </AliceBox>,
          <div style={{width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px'}}>
             <div style={{color: '#fca5a5', fontSize: '0.85rem', marginBottom: '32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>🌐</span> Insecure Network (Eve)
             </div>
             
             {/* The Track */}
             <div style={{width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', margin: '16px 0'}}>
                
                {/* A traveling to Bob */}
                <motion.div 
                   initial={{left: 0, opacity: 0}}
                   animate={{left: '100%', opacity: [0, 1, 1, 0]}}
                   transition={{duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5}}
                   style={{position: 'absolute', top: '-28px', transform: 'translateX(-50%)', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}
                >
                   A = {A}
                </motion.div>

                {/* B traveling to Alice */}
                <motion.div 
                   initial={{right: 0, opacity: 0}}
                   animate={{right: '100%', opacity: [0, 1, 1, 0]}}
                   transition={{duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5}}
                   style={{position: 'absolute', top: '12px', transform: 'translateX(50%)', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}
                >
                   B = {B}
                </motion.div>

             </div>

             <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '48px', textAlign: 'center'}}>
                Eve intercepts both mixes in transit. But she cannot reverse the math to find the private secrets!
             </div>
          </div>,
          <BobBox title="Bob" active={true}>
             <div style={{color:'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>Sending</span>
                <span style={{color:'#f59e0b', fontWeight:'bold'}}>B = {B}</span>
             </div>
             <div style={{marginTop:'32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Receiving</span>
                <span style={{color:'#3b82f6', fontWeight:'bold'}}>A = {A}</span>
             </div>
          </BobBox>
        );
      default:
        return null;
    }
  };

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Diffie-Hellman Key Exchange</h2>
        <p>Diffie-Hellman is a mathematical method of securely exchanging cryptographic keys over a public channel. It allows two parties that have no prior knowledge of each other to jointly establish a shared secret key.</p>
      </div>

      {(isPlaying || isFinished) && (
        <div 
           style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 24px', marginTop: '16px', marginBottom: '24px', fontSize: '0.9rem', whiteSpace: 'nowrap', overflowX: 'auto', width: '100%'}}
        >
           <div><span style={{color: '#cbd5e1'}}>Public Prime (p):</span> <strong style={{color: '#fff', fontFamily: 'var(--font-mono)'}}>{pVal}</strong></div>
           <div style={{color: 'rgba(255,255,255,0.1)'}}>|</div>
           <div><span style={{color: '#cbd5e1'}}>Public Base (g):</span> <strong style={{color: '#fff', fontFamily: 'var(--font-mono)'}}>{gVal}</strong></div>
           <div style={{color: 'rgba(255,255,255,0.1)'}}>|</div>
           <div><span style={{color: '#3b82f6'}}>Alice's Secret (a):</span> <strong style={{color: '#fff', fontFamily: 'var(--font-mono)'}}>{aSec}</strong></div>
           <div style={{color: 'rgba(255,255,255,0.1)'}}>|</div>
           <div><span style={{color: '#f59e0b'}}>Bob's Secret (b):</span> <strong style={{color: '#fff', fontFamily: 'var(--font-mono)'}}>{bSec}</strong></div>
           <div style={{color: 'rgba(255,255,255,0.1)'}}>|</div>
           <div style={{color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500'}}>
              <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981'}}></span>
              {isFinished ? 'Complete' : 'Running'}
           </div>
           <button onClick={handleReset} style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '16px', transition: 'all 0.2s'}}>Stop Simulation</button>
        </div>
      )}

      <div className="cipher-workspace" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {!isPlaying && !isFinished && (
          <div className="glass-card">
            <div className="card-title">Public Parameters</div>
            <div style={{display:'flex', gap:'16px', marginBottom:'24px'}}>
               <div className="form-group" style={{flex: 1}}>
                 <label>Prime (p)</label>
                 <input type="number" value={pVal} onChange={e => { setPVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
               <div className="form-group" style={{flex: 1}}>
                 <label>Base (g)</label>
                 <input type="number" value={gVal} onChange={e => { setGVal(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
            </div>

            <div className="card-title">Private Secrets</div>
            <div style={{display:'flex', gap:'16px', marginBottom:'24px'}}>
               <div className="form-group" style={{flex: 1}}>
                 <label style={{color: '#3b82f6'}}>Alice's Secret (a)</label>
                 <input type="number" value={aSec} onChange={e => { setASec(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
               <div className="form-group" style={{flex: 1}}>
                 <label style={{color: '#f59e0b'}}>Bob's Secret (b)</label>
                 <input type="number" value={bSec} onChange={e => { setBSec(e.target.value); handleReset(); }} disabled={isPlaying} />
               </div>
            </div>

            <button className="btn-primary" onClick={handleStart} disabled={!pVal || !gVal || !aSec || !bSec} style={{marginTop: '10px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Simulate Key Exchange</span>
            </button>
          </div>
        )}

        {/* INTERACTIVE CLASSROOM STUDIO */}
        {(isPlaying || isFinished) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div className="anim-studio" ref={studioRef} style={{ marginTop: '0', flex: 'none', height: '550px', minHeight: '550px', maxHeight: '550px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="anim-title">Diffie-Hellman Interactive Classroom</div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  
                  <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px'}}>
                    {Array.from({length: totalSteps}).map((_, idx) => (
                       <div key={idx} style={{
                          height: '4px', 
                          flex: 1, 
                          maxWidth: '80px', 
                          borderRadius: '2px', 
                          background: idx <= currentStep ? 'var(--accent-color)' : 'var(--border-color)',
                          transition: 'background 0.3s'
                       }}></div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flex: 1 }}>
                    
                    {/* PREV BUTTON */}
                    <div style={{ width: '80px', height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <button className="btn-secondary" style={{width: '100%', padding: '10px 16px', opacity: currentStep === 0 ? 0 : 1, pointerEvents: currentStep === 0 ? 'none' : 'auto'}} onClick={handlePrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>
                    </div>

                    {/* CENTRAL CONTENT */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                           key={currentStep}
                           initial={{opacity: 0, y: 10}}
                           animate={{opacity: 1, y: 0}}
                           exit={{opacity: 0, y: -10}}
                           transition={{duration: 0.3}}
                           style={{width: '100%'}}
                        >
                           {renderStepContent(currentStep)}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* NEXT BUTTON & AUTO SCROLL */}
                    <div style={{width: '80px', height: '70px', display:'flex', flexDirection:'column', gap:'8px', alignItems:'center', justifyContent: 'flex-start'}}>
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
      </div>
    </section>
  );
}
