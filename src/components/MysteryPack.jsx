import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/useGameStore';

export default function MysteryPack() {
  const { startNextQuest, viewDashboard, theme, claimPackGifts } = useGameStore();
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState([]);

  const handleTearOpen = () => {
    setOpened(true);
    const newGifts = claimPackGifts();
    setRevealed(newGifts);
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#8b5cf6', '#10b981', '#f43f5e', '#ffffff'],
    });
  };

  return (
    <div className={`page-container theme-${theme}`}>
      <div className="card-container" style={{ textAlign: 'center' }}>
        <motion.div
          className="glass"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          style={{ padding: '40px 28px' }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎁 Mystery Pack!</h2>
          <p style={{ opacity: 0.7, marginBottom: '32px' }}>
            You earned rewards for your quest! Tap to reveal.
          </p>

          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="pack-closed"
                exit={{ scale: 0, opacity: 0 }}
                style={{ marginBottom: '32px' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9, rotate: -3 }}
                  onClick={handleTearOpen}
                  style={{
                    fontSize: '6rem', background: 'none', border: 'none', cursor: 'pointer',
                    filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))',
                    display: 'block', margin: '0 auto',
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎁
                </motion.button>
                <p style={{ marginTop: 16, opacity: 0.6, fontSize: '0.95rem' }}>Tap the pack to open it!</p>
              </motion.div>
            ) : (
              <motion.div
                key="pack-open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginBottom: '28px' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: revealed.length <= 2 ? `repeat(${revealed.length}, 1fr)` : 'repeat(3, 1fr)',
                  gap: '16px',
                  justifyItems: 'center',
                  marginBottom: '20px',
                }}>
                  {revealed.map((gift, i) => {
                    return (
                      <motion.div
                        key={gift.id}
                        initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.15, type: 'spring', stiffness: 150 }}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '2px solid rgba(245,158,11,0.4)',
                          borderRadius: 20, padding: '20px 12px', textAlign: 'center',
                          boxShadow: '0 4px 20px rgba(245,158,11,0.2)',
                        }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{gift.emoji}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{gift.label}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: 4 }}>{gift.desc}</div>
                      </motion.div>
                    );
                  })}
                  {revealed.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', opacity: 0.6 }}>
                      <div style={{ fontSize: '3rem' }}>📦</div>
                      <p>Complete more quests to earn stickers!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn btn-primary"
              onClick={startNextQuest}
            >
              Next Quest 🚀
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn btn-ghost"
              onClick={viewDashboard}
            >
              Hero Stats 📊
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
