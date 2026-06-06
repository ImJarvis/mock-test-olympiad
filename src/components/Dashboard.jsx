import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { useGameStore } from '../store/useGameStore';
import { SKILL_COLORS, SKILL_ICONS, SKILL_CATEGORIES } from '../data/questions';
import { getProficiencyLabel, calculateXP } from '../engine/adaptive';
import { CHARACTERS } from './Onboarding';

export default function Dashboard() {
  const {
    kidName, proficiency, totalXP, questsCompleted,
    longestStreak, ownedGifts, startNextQuest, goHome, theme, character
  } = useGameStore();

  const [view, setView] = useState('kid');
  const activeChar = CHARACTERS.find(c => c.id === character) || CHARACTERS[0];

  const radarData = SKILL_CATEGORIES.map(skill => ({
    subject: `${SKILL_ICONS[skill]} ${skill.split(' ')[0]}`,
    level: Math.round(((proficiency[skill] || 1.0) / 3.0) * 10),
    fullMark: 10,
  }));

  const sortedSkills = [...SKILL_CATEGORIES].sort((a, b) => {
    return (proficiency[b] || 1) - (proficiency[a] || 1);
  });
  const strengthSkill = sortedSkills[0];
  const struggleSkill = sortedSkills[sortedSkills.length - 1];
  const allEqual = (proficiency[strengthSkill] || 1) === (proficiency[struggleSkill] || 1);

  const avgScore = SKILL_CATEGORIES.reduce((acc, skill) => acc + (proficiency[skill] || 1), 0) / SKILL_CATEGORIES.length;
  const strongSkills = [];
  const practiceSkills = [];
  
  SKILL_CATEGORIES.forEach(skill => {
    const val = proficiency[skill] || 1;
    if (allEqual || val >= avgScore) {
       strongSkills.push(skill);
    } else {
       practiceSkills.push(skill);
    }
  });

  const renderSkillCard = (skill) => {
    const val = proficiency[skill] || 1;
    const pct = ((val - 1) / 2) * 100;
    const score10 = Math.round((val / 3.0) * 10);
    return (
      <motion.div
        key={skill}
        className="glass-light"
        whileHover={{ scale: 1.02 }}
        style={{ padding: '16px 14px', border: `1px solid ${SKILL_COLORS[skill]}44` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>{SKILL_ICONS[skill]}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: SKILL_COLORS[skill] }}>
          {skill}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.65, marginBottom: 8 }}>
          {getProficiencyLabel(val)} · {score10}/10
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
  };

  return (
    <div className={`page-container theme-${theme}`} style={{ alignItems: 'flex-start', paddingTop: 24 }}>
      <div style={{ width: '100%', maxWidth: 640, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {view === 'kid' ? (
            <motion.div
              key="kid-view"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', paddingTop: '40px' }}
            >
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.6, duration: 0.8 }}
                style={{
                  position: 'relative', background: '#fff', color: '#334155', padding: '24px 32px',
                  borderRadius: '30px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxWidth: '80%', margin: '0 auto'
              }}>
                <motion.p 
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }} 
                  transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                  style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, lineHeight: 1.4 }}
                >
                  GASP! 😱 {kidName}!!<br />
                  <span style={{ color: '#f59e0b', fontSize: '1.8rem', display: 'block', margin: '8px 0' }}>{totalXP} XP?! 🤯</span>
                  You've crushed {questsCompleted} quests! {longestStreak >= 3 ? `A ${longestStreak}x streak is melting the servers! 🔥` : `You are UNSTOPPABLE! 🚀`}
                </motion.p>
                <div style={{
                  position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '20px solid #fff'
                }} />
              </motion.div>

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1], y: [0, -15, 0], rotate: [0, -5, 5, 0] }} 
                transition={{ 
                  scale: { type: 'spring', bounce: 0.6, duration: 0.8 },
                  y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.8 },
                  rotate: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.8 }
                }}
                style={{ width: '260px', height: '260px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}
              >
                <img src={activeChar.icon} alt={activeChar.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </motion.div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                  onClick={startNextQuest}
                  style={{ fontSize: '1.2rem', padding: '12px 32px' }}
                >
                  🚀 Next Quest!
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn btn-ghost"
                  onClick={() => setView('parent')}
                  style={{ fontSize: '1.1rem', padding: '12px 24px', background: 'rgba(255,255,255,0.1)' }}
                >
                  📊 Parent / Teacher Stats
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="parent-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn btn-ghost"
                  onClick={() => setView('kid')}
                  style={{ fontSize: '1rem', padding: '8px 16px', background: 'rgba(255,255,255,0.1)' }}
                >
                  ⬅️ Back to Hero
                </motion.button>
              </div>
              
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
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
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

              {/* Organized Skill Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ marginBottom: 16 }}
              >
                {strongSkills.length > 0 && (
                  <div className="glass" style={{ padding: '20px 22px', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>💪</span> Consistently Improving
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {strongSkills.map(renderSkillCard)}
                    </div>
                  </div>
                )}
                
                {practiceSkills.length > 0 && (
                  <div className="glass" style={{ padding: '20px 22px', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                      <span style={{ fontSize: '1.3rem' }}>📚</span> Needs Practice
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {practiceSkills.map(renderSkillCard)}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sticker collection */}
              {ownedGifts.length > 0 && (
                <motion.div
                  className="glass"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ padding: '20px 22px', marginBottom: 16 }}
                >
                  <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>🎖️ Your Collection</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {ownedGifts.map((gift) => (
                      <motion.div
                        key={gift.id}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        style={{
                          background: 'rgba(255,255,255,0.1)', padding: '12px',
                          borderRadius: 16, fontSize: '2rem',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        title={gift.label}
                      >
                        {gift.emoji || '⭐'}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
