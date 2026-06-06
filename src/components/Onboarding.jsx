import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, TreePine, Wand2, User, ChevronRight, GraduationCap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const THEMES = [
  { id: 'space', name: 'Space Explorer', icon: '🚀', color: '#3b82f6', bg: 'rgba(59,130,246,0.25)' },
  { id: 'jungle', name: 'Jungle Safari', icon: '🌿', color: '#10b981', bg: 'rgba(16,185,129,0.25)' },
  { id: 'magic', name: 'Magic Academy', icon: '🪄', color: '#8b5cf6', bg: 'rgba(139,92,246,0.25)' },
];

const GRADES = [
  { id: 'Grade_2', label: 'Grade 2', subtitle: 'Ages 7–8' },
  { id: 'Grade_3', label: 'Grade 3', subtitle: 'Ages 8–9' },
];

export const CHARACTERS = [
  { id: 'explorer', name: 'Explorer', icon: '/icons/explorer.png' },
  { id: 'magician', name: 'Magician', icon: '/icons/magician.png' },
  { id: 'astronaut', name: 'Astronaut', icon: '/icons/astronaut.png' },
];

export default function Onboarding() {
  const { setProfile, startGame } = useGameStore();
  const [kidName, setKidName] = useState('');
  const [theme, setTheme] = useState('space');
  const [grade, setGrade] = useState('Grade_2');
  const [character, setCharacter] = useState('explorer');
  const [step, setStep] = useState(0); // 0=name, 1=grade, 2=theme, 3=character

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) { setStep(s => s + 1); return; }
    setProfile({ kidName: kidName.trim() || 'Hero', grade, theme, character });
    startGame();
  };

  const canProceed = () => {
    if (step === 0) return kidName.trim().length > 0;
    return true;
  };

  return (
    <div className={`page-container theme-${theme}`}>
      {/* Floating deco */}
      {['⭐', '✨', '🌟', '💫'].map((s, i) => (
        <span
          key={i}
          className="star-bg"
          style={{
            left: `${10 + i * 23}%`,
            top: `${8 + (i % 2) * 15}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {s}
        </span>
      ))}

      <motion.div
        className="card-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="glass" style={{ padding: '40px 36px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="mascot">🏆</div>
            <h1 style={{ fontSize: '2.2rem', marginTop: '10px' }}>Olympiad Hero</h1>
            <p style={{ opacity: 0.65, marginTop: '6px', fontSize: '1rem' }}>
              Your personal learning adventure!
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  height: 6, borderRadius: 3,
                  width: i === step ? 32 : 16,
                  background: i <= step ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">

              {/* Step 0: Name */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                >
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
                    👋 What is your hero name?
                  </label>
                  <div className="input-wrapper">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your name..."
                      value={kidName}
                      onChange={e => setKidName(e.target.value)}
                      maxLength={20}
                      autoFocus
                    />
                  </div>
                  {kidName && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 10, opacity: 0.7, fontSize: '0.9rem' }}
                    >
                      Hello, <strong>{kidName}</strong>! Ready for the adventure? 🎉
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Step 1: Grade */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                >
                  <label style={{ display: 'block', marginBottom: '16px', fontWeight: 700, fontSize: '1.1rem' }}>
                    📚 Which grade are you in?
                  </label>
                  <div className="grade-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                    {GRADES.map(g => (
                      <motion.button
                        key={g.id}
                        type="button"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setGrade(g.id)}
                        style={{
                          padding: '24px 16px',
                          borderRadius: 'var(--radius-lg)',
                          background: grade === g.id ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)',
                          border: `2px solid ${grade === g.id ? '#8b5cf6' : 'rgba(255,255,255,0.15)'}`,
                          cursor: 'pointer', color: '#fff', textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <GraduationCap size={32} style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{g.label}</div>
                        <div style={{ opacity: 0.65, fontSize: '0.85rem' }}>{g.subtitle}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Theme */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                >
                  <label style={{ display: 'block', marginBottom: '16px', fontWeight: 700, fontSize: '1.1rem' }}>
                    🎨 Choose your adventure theme!
                  </label>
                  <div className="theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    {THEMES.map(t => (
                      <motion.button
                        key={t.id}
                        type="button"
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setTheme(t.id)}
                        style={{
                          padding: '20px 8px',
                          borderRadius: 'var(--radius-lg)',
                          background: theme === t.id ? t.bg : 'rgba(255,255,255,0.07)',
                          border: `2px solid ${theme === t.id ? t.color : 'rgba(255,255,255,0.15)'}`,
                          cursor: 'pointer', color: '#fff', textAlign: 'center',
                          transition: 'all 0.25s',
                        }}
                      >
                        <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{t.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>{t.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Character */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                >
                  <label style={{ display: 'block', marginBottom: '16px', fontWeight: 700, fontSize: '1.1rem' }}>
                    🦸‍♂️ Choose your companion!
                  </label>
                  <div className="theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                    {CHARACTERS.map(c => (
                      <motion.button
                        key={c.id}
                        type="button"
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setCharacter(c.id)}
                        style={{
                          position: 'relative',
                          height: '140px',
                          borderRadius: 'var(--radius-lg)',
                          border: `3px solid ${character === c.id ? '#8b5cf6' : 'transparent'}`,
                          cursor: 'pointer', color: '#fff', textAlign: 'center',
                          transition: 'all 0.25s',
                          overflow: 'hidden',
                          boxShadow: character === c.id ? '0 0 0 4px rgba(139, 92, 246, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: 0
                        }}
                      >
                        <img 
                          src={c.icon} 
                          alt={c.name} 
                          style={{ 
                            position: 'absolute', 
                            top: 0, left: 0, 
                            width: '100%', height: '100%', 
                            objectFit: 'cover', zIndex: 0 
                          }} 
                        />
                        {/* Gradient overlay to make text readable */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                          zIndex: 1
                        }} />
                        <div style={{ 
                          position: 'relative', zIndex: 2, 
                          fontWeight: 700, fontSize: '0.95rem', 
                          paddingBottom: '12px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}>
                          {c.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              type="submit"
              disabled={!canProceed()}
              style={{ width: '100%', marginTop: '28px', fontSize: '1.2rem', padding: '16px', opacity: canProceed() ? 1 : 0.5 }}
            >
              {step < 3 ? 'Next →' : "Let's Go! 🚀"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
