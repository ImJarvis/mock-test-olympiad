import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { useGameStore } from '../store/useGameStore';
import { SKILL_COLORS, SKILL_ICONS, SKILL_CATEGORIES } from '../data/questions';
import { getProficiencyLabel, calculateXP } from '../engine/adaptive';

export default function Dashboard() {
  const {
    kidName, proficiency, totalXP, questsCompleted,
    longestStreak, unlockedStickers, startNextQuest, goHome, theme
  } = useGameStore();

  const radarData = SKILL_CATEGORIES.map(skill => ({
    subject: `${SKILL_ICONS[skill]} ${skill.split(' ')[0]}`,
    level: proficiency[skill] || 1.0,
    fullMark: 3.0,
  }));

  const stickerList = Object.entries(unlockedStickers).filter(([, v]) => v);

  const STICKER_EMOJIS = {
    space_helmet: '👨‍🚀', math_crown: '👑', logic_badge: '🔮',
    word_trophy: '🏅', streak_flame: '🔥', mystery_star: '⭐',
  };

  const strengthSkill = SKILL_CATEGORIES.reduce((a, b) =>
    (proficiency[a] || 1) >= (proficiency[b] || 1) ? a : b
  );
  const struggleSkill = SKILL_CATEGORIES.reduce((a, b) =>
    (proficiency[a] || 1) <= (proficiency[b] || 1) ? a : b
  );

  return (
    <div className={`page-container theme-${theme}`} style={{ alignItems: 'flex-start', paddingTop: 24 }}>
      <div style={{ width: '100%', maxWidth: 640, margin: '0 auto' }}>

        {/* Hero header */}
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '28px 28px 22px', marginBottom: 16, textAlign: 'center' }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>🦸</div>
          <h1 style={{ fontSize: '1.8rem' }}>{kidName}'s Hero Stats</h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            <div className="xp-badge">⭐ {totalXP} XP</div>
            <div className="streak-badge">🔥 Best Streak: {longestStreak}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 9999, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', fontWeight: 700, color: '#a78bfa', fontSize: '1rem' }}>
              🏆 {questsCompleted} Quest{questsCompleted !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ padding: '24px 16px', marginBottom: 16 }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: 8, fontSize: '1.1rem' }}>Skill Radar</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[1, 3]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="level"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Per-skill cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}
        >
          {SKILL_CATEGORIES.map(skill => {
            const val = proficiency[skill] || 1;
            const pct = ((val - 1) / 2) * 100;
            const isStrength = skill === strengthSkill;
            const isStruggle = skill === struggleSkill && val < 2;
            return (
              <motion.div
                key={skill}
                className="glass-light"
                whileHover={{ scale: 1.02 }}
                style={{ padding: '16px 14px', border: `1px solid ${SKILL_COLORS[skill]}44` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '1.5rem' }}>{SKILL_ICONS[skill]}</span>
                  {isStrength && <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>💪 Strength</span>}
                  {isStruggle && !isStrength && <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>📚 Practice</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: SKILL_COLORS[skill] }}>
                  {skill}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.65, marginBottom: 8 }}>
                  {getProficiencyLabel(val)} · {val.toFixed(1)}/3.0
                </div>
                <div className="progress-bar-track">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    style={{ background: SKILL_COLORS[skill] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Insight box */}
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ padding: '20px 22px', marginBottom: 16 }}
        >
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>🧠 Personalised Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '14px 12px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{SKILL_ICONS[strengthSkill]}</div>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.85rem' }}>Great at!</div>
              <div style={{ opacity: 0.85, fontSize: '0.82rem', marginTop: 3 }}>{strengthSkill}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '14px 12px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{SKILL_ICONS[struggleSkill]}</div>
              <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.85rem' }}>Keep practising!</div>
              <div style={{ opacity: 0.85, fontSize: '0.82rem', marginTop: 3 }}>{struggleSkill}</div>
            </div>
          </div>
        </motion.div>

        {/* Sticker collection */}
        {stickerList.length > 0 && (
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ padding: '20px 22px', marginBottom: 16 }}
          >
            <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>🎖️ Your Collection</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {stickerList.map(([key]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(245,158,11,0.15)',
                    border: '2px solid rgba(245,158,11,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', cursor: 'default',
                  }}
                  title={key.replace('_', ' ')}
                >
                  {STICKER_EMOJIS[key]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 32 }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="btn btn-primary"
            onClick={startNextQuest}
            style={{ fontSize: '1rem' }}
          >
            🚀 New Quest
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="btn btn-ghost"
            onClick={goHome}
            style={{ fontSize: '1rem' }}
          >
            🏠 Home
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
