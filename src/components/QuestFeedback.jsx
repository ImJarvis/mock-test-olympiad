import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { SKILL_COLORS, SKILL_ICONS } from '../data/questions';
import { getProficiencyLabel } from '../engine/adaptive';

export default function QuestFeedback() {
  const {
    questResults, proficiency, kidName, openPack, startNextQuest, viewDashboard, theme, questsCompleted, totalXP, mysteryPackPending
  } = useGameStore();

  const correctCount = questResults.filter(r => r.wasCorrect).length;
  const total = questResults.length;
  const pct = Math.round((correctCount / total) * 100);

  // Determine message
  const message =
    pct === 100 ? '🏆 Perfect Quest! You nailed it!' :
    pct >= 75 ? '⭐ Great job! Keep it up!' :
    pct >= 50 ? '👍 Good effort! Practice makes perfect.' :
    '🔋 Recharging powers... Every hero learns from practice!';

  return (
    <div className={`page-container theme-${theme}`}>
      <div className="card-container">
        <motion.div
          className="glass"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{ padding: '36px 28px', textAlign: 'center' }}
        >
          {/* XP Progress Bar */}
          <div style={{ width: '100%', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 4, display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '0 12px', fontWeight: 800, color: '#fcd34d' }}>⭐ {totalXP} XP</div>
              <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', marginLeft: 8 }}>
                 <motion.div 
                   initial={{ width: 0 }} animate={{ width: `${Math.min(100, (totalXP % 1000) / 10)}%` }} 
                   transition={{ duration: 1, delay: 0.5 }}
                   style={{ height: '100%', background: '#fbbf24', borderRadius: 10 }}
                 />
              </div>
            </div>
          </div>
          {/* Score display */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '8px' }}
          >
            {pct === 100 ? '🌟' : pct >= 75 ? '⭐' : pct >= 50 ? '👍' : '🔋'}
          </motion.div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Quest Complete!</h2>
          <p style={{ opacity: 0.7, marginBottom: '28px', fontSize: '1rem' }}>{message}</p>

          {/* Score circles */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24' }}>{correctCount}/{total}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Correct</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399' }}>{pct}%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Score</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: mysteryPackPending ? '1fr 1fr' : '1fr', gap: '12px' }}>
            {mysteryPackPending && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="btn btn-amber"
                onClick={openPack}
                style={{ fontSize: '1rem' }}
              >
                🎁 Open Pack!
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn btn-primary"
              onClick={startNextQuest}
              style={{ fontSize: '1rem' }}
            >
              Next Quest 🚀
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn btn-ghost"
            onClick={viewDashboard}
            style={{ width: '100%', marginTop: '12px', fontSize: '1rem' }}
          >
            Hero Stats 📊
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
