import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { SKILL_COLORS, SKILL_ICONS } from '../data/questions';
import { getProficiencyLabel } from '../engine/adaptive';

export default function QuestFeedback() {
  const {
    questResults, proficiency, kidName, openPack, startNextQuest, viewDashboard, theme, questsCompleted
  } = useGameStore();

  const correctCount = questResults.filter(r => r.wasCorrect).length;
  const total = questResults.length;
  const pct = Math.round((correctCount / total) * 100);

  // Determine message
  const message =
    pct === 100 ? '🏆 Perfect Quest! You nailed it!' :
    pct >= 75 ? '⭐ Great job! Keep it up!' :
    pct >= 50 ? '👍 Good effort! Practice makes perfect.' :
    '💪 Keep going! Every hero stumbles before they soar.';

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
          {/* Score display */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '8px' }}
          >
            {pct === 100 ? '🌟' : pct >= 75 ? '⭐' : pct >= 50 ? '👍' : '💪'}
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

          {/* Per-question recap */}
          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            {questResults.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: 12, marginBottom: 8,
                  background: r.wasCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${r.wasCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{r.wasCorrect ? '✅' : '🔘'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.question.text.slice(0, 60)}...
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: 2 }}>
                    {SKILL_ICONS[r.question.skill_category]} {r.question.skill_category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>



          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn btn-amber"
              onClick={openPack}
              style={{ fontSize: '1rem' }}
            >
              🎁 Open Pack!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn btn-primary"
              onClick={startNextQuest}
              style={{ fontSize: '1rem' }}
            >
              Next Quest →
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn btn-ghost"
            onClick={viewDashboard}
            style={{ width: '100%', marginTop: '10px', fontSize: '0.95rem' }}
          >
            📊 View Hero Stats
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
