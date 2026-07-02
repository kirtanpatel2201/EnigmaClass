import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { railFence } from '../lib/crypto';

export default function RailFenceCipher() {
  const [mode, setMode] = useState('encrypt');
  const [rails, setRails] = useState(3);
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
    const [frames, setFrames] = useState([]);
  
  const studioRef = useRef(null);
  const outputRef = useRef(null);

  const handleRun = async () => {
    const text = inputText.replace(/\s/g, '');
    if (rails <= 1 || !text) return;
    
    setIsAnimating(true);
    setFrames([]);
    setOutput('');
    
    setTimeout(() => {
      studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    const newFrames = [];
    newFrames.push({
      type: 'example',
      id: 'ex-0',
      content: (
        <>
          <div className="we-title">📐 How Rail Fence Works</div>
          Letters are written diagonally across <strong className="text-white">{rails} rails</strong>.<br/>
          Reading each rail left-to-right, then combining them creates the ciphertext.<br/>
          Below is the letter placement pattern across all {rails} rails:
        </>
      )
    });
    setFrames([...newFrames]);
    await new Promise(r => setTimeout(r, 1200));

    const grid = Array.from({ length: rails }, () => Array(text.length).fill(''));
    let r = 0, dirDown = false;
    for (let c = 0; c < text.length; c++) {
        grid[r][c] = text[c];
        if (r === 0 || r === rails - 1) dirDown = !dirDown;
        r += dirDown ? 1 : -1;
    }

    const gridRows = [];
    
    for (let i = 0; i < rails; i++) {
      gridRows.push(
        <div key={i} className="flex gap-2 justify-center mb-2">
          {grid[i].map((char, j) => (
            <motion.div
              key={j}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: j * 0.1 }}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono font-bold text-lg border transition-colors ${char ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-sm' : 'border-zinc-800 border-dashed text-transparent'}`}
            >
              {char || '·'}
            </motion.div>
          ))}
        </div>
      );
      
      newFrames.push({
        type: 'grid',
        id: `grid-row-${i}`,
        content: [...gridRows] // render everything up to current row
      });
      setFrames([...newFrames]);
      await new Promise(r => setTimeout(r, 450));
    }

    await new Promise(r => setTimeout(r, 1000));
    const out = railFence(text, rails, mode === 'decrypt');
    setOutput(out);
    setIsAnimating(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  return (
    <section className="view-section active">
      <div className="view-header">
        <h2>Rail Fence Cipher</h2>
        <p>The rail fence cipher is a form of transposition cipher. In the rail fence cipher, the plaintext is written downwards and diagonally on successive "rails" of an imaginary fence.</p>
      </div>
      
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'encrypt' ? 'active' : ''}`} onClick={() => setMode('encrypt')}>Encryption</button>
        <button className={`mode-tab ${mode === 'decrypt' ? 'active' : ''}`} onClick={() => setMode('decrypt')}>Decryption</button>
      </div>

      <div className="cipher-workspace">
        <div className="glass-card">
          <div className="card-title">Parameters & Input</div>
          
          <div className="form-group">
            <label>Number of Rails (2-10)</label>
            <input type="number" value={rails} onChange={e => setRails(parseInt(e.target.value) || 2)} />
          </div>
          
          <div className="form-group mt-6">
            <label>{mode === 'encrypt' ? 'Message' : 'Ciphertext to Decrypt'}</label>
            <textarea placeholder="Type message..." value={inputText} onChange={e => setInputText(e.target.value)} />
          </div>

          <button className="btn-primary mt-4" onClick={handleRun}>
            <Play size={18} />
            <span>Draw Fence & {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</span>
          </button>

          {output && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-6 pt-4 border-t border-zinc-800" ref={outputRef}>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Final Output</label>
              <div className="output-area">{output}</div>
            </motion.div>
          )}
        </div>

        <div className="anim-studio" ref={studioRef} style={{display: frames.length > 0 ? 'flex' : 'none'}}>
          <div className="anim-title">Fence Drawing Studio</div>
          <div className="flex flex-col w-full">
            <AnimatePresence>
              {frames.length > 0 && frames[0].type === 'example' && (
                <motion.div key={frames[0].id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="worked-example w-full">
                  {frames[0].content}
                </motion.div>
              )}
              {frames.length > 1 && (
                <div className="overflow-x-auto w-full pt-4 pb-8" style={{ marginTop: '32px' }}>
                   {frames[frames.length - 1].content}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
