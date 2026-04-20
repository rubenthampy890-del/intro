import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'motion/react';
import { Hologram } from './components/Hologram';
import { Cpu, Zap, Radio, Terminal } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<'intro' | 'dissolving' | 'final'>('intro');
  const [text, setText] = useState('Nexus System Initializing...');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Stage 1: Welcome message
    const timer1 = setTimeout(() => {
      setText('Welcome to Nexus');
    }, 2000);

    // Stage 2: Trigger Dissolve
    const timer2 = setTimeout(() => {
      setStage('dissolving');
      setText('Calibrating Subsystems...');
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleDissolveComplete = () => {
    setStage('final');
    setShowButton(true);
    setText('Nexus Ready');
  };

  return (
    <div className="relative h-screen w-screen bg-[#020408] overflow-hidden font-sans text-white">
      {/* Background Ambience */}
      <div className="atmosphere" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,255,0.02),transparent,rgba(0,255,255,0.02))] bg-[length:100%_4px,100%_100%] pointer-events-none z-0" />

      {/* System Status Header */}
      <header className="absolute top-12 left-12 z-40 flex items-center space-x-4 pointer-events-none">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 opacity-60">
          System Node: NX-01 // Core Active
        </div>
      </header>

      {/* Side Decorative Lines */}
      <div className="absolute top-0 right-0 p-8 h-full flex flex-col justify-center space-y-6 opacity-20 pointer-events-none z-40">
        <div className="w-16 h-[1px] bg-cyan-400" />
        <div className="w-8 h-[1px] bg-cyan-400 ml-8" />
        <div className="w-12 h-[1px] bg-cyan-400 ml-4" />
        <div className="w-24 h-[1px] bg-cyan-400" />
      </div>

      {/* 3D Canvas Layer */}
      {(stage === 'intro' || stage === 'dissolving') && (
        <div className="absolute inset-0 z-10 hologram-glow">
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Suspense fallback={null}>
              <Hologram 
                isDissolving={stage === 'dissolving'} 
                onDissolveComplete={handleDissolveComplete}
              />
            </Suspense>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
          </Canvas>
        </div>
      )}

      {/* UI Overlay */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!showButton && (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-light tracking-[0.25em] uppercase text-white">
                {text.includes('Welcome') ? (
                  <>Welcome to <span className="text-cyan-400 font-semibold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Nexus</span></>
                ) : text}
              </h1>
              <p className="mt-4 text-cyan-200/40 font-mono text-xs uppercase tracking-widest">
                Cognitive Architecture v4.2.0 // Neural Link Ready
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex flex-col items-center"
          >
            <button 
              onClick={() => window.location.reload()}
              className="initialise-btn-custom px-16 py-5 rounded-full text-cyan-100 uppercase tracking-[0.4em] font-medium text-sm hover:scale-105 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl group-hover:bg-cyan-400/20 transition-colors" />
              <div className="relative flex items-center gap-3">
                <Terminal size={18} className="opacity-70" />
                <span>Initialise Nexus</span>
              </div>
            </button>
            <p className="mt-8 text-cyan-600 font-mono text-[9px] tracking-[0.2em] uppercase opacity-60">
              // Authentication Success //
            </p>
          </motion.div>
        )}
      </div>

      {/* System Footer Bar */}
      <footer className="absolute bottom-12 w-full px-12 flex justify-between items-end z-40 pointer-events-none">
        <div className="space-y-1">
          <div className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest">Security Protocol</div>
          <div className="text-xs text-white/80 font-light">Encrypted RSA-4096 End-to-End</div>
        </div>
        <div className="flex space-x-12">
          <div className="text-right">
            <div className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest">Latency</div>
            <div className="text-xs text-white/80 font-light">0.4ms</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest">Stability</div>
            <div className="text-xs text-white/80 font-light">99.99%</div>
          </div>
        </div>
      </footer>

      {/* Scanner Element */}
      {stage === 'intro' && (
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-cyan-400/20 blur-[1px] z-30"
        />
      )}
    </div>
  );
}

