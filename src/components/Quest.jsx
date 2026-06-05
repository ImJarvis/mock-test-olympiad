import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/useGameStore';
import { SKILL_COLORS, SKILL_ICONS } from '../data/questions';
import { getStreakMultiplier } from '../engine/adaptive';

export default function Quest() {
  const {
    currentQuest,
    currentQuestionIndex,
    submitAnswer,
    currentStreak,
    kidName,
    showHints,
    questsCompleted,
    theme,
  } = useGameStore();

  const [selected, setSelected] = useState(null);        // option string selected
  const [answered, setAnswered] = useState(false);       // if question is locked in
  const [showFeedback, setShowFeedback] = useState(false);

  const question = currentQuest[currentQuestionIndex];
  const progress = (currentQuestionIndex / currentQuest.length) * 100;
  const hintActive = showHints?.[question?.skill_category];
  const streakMultiplier = getStreakMultiplier(currentStreak);

  // Reset on new question
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setShowFeedback(false);
  }, [currentQuestionIndex]);

  if (!question) return null;

  const handleOptionClick = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);

    const isCorrect = option === question.correctAnswer;
    setShowFeedback(true);

    if (isCorrect) {
      confetti({
        particleCount: streakMultiplier >= 2 ? 200 : 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'],
      });
    }

    setTimeout(() => {
      submitAnswer(isCorrect);
    }, 2000);
  };

  const getOptionClass = (option) => {
    if (!answered) return 'option-btn';
    if (option === question.correctAnswer) return 'option-btn correct';
    if (option === selected && option !== question.correctAnswer) return 'option-btn selected-wrong';
    return 'option-btn incorrect';
  };

  const skillColor = SKILL_COLORS[question.skill_category] || '#8b5cf6';
  const skillIcon = SKILL_ICONS[question.skill_category] || '❓';

  return (
    <div className={`page-container theme-${theme}`} style={{ alignItems: 'flex-start', paddingTop: '32px' }}>
      <div className="card-container">

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ opacity: 0.75, fontWeight: 600, fontSize: '0.9rem' }}>
            Quest {questsCompleted + 1} · Q{currentQuestionIndex + 1}/{currentQuest.length}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStreak >= 3 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="streak-badge"
              >
                🔥 ×{streakMultiplier} streak
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-track" style={{ marginBottom: '24px' }}>
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ background: `linear-gradient(90deg, ${skillColor}, #8b5cf6)` }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className="glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ padding: '32px 28px', marginBottom: '16px' }}
          >
            {/* Skill pill */}
            <div style={{ marginBottom: '16px' }}>
              <span
                className="skill-pill"
                style={{ background: `${skillColor}22`, color: skillColor, border: `1px solid ${skillColor}55` }}
              >
                {skillIcon} {question.skill_category}
              </span>
              {question.difficulty_tier === 3 && (
                <span className="skill-pill" style={{ marginLeft: 8, background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                  ⚡ Hard
                </span>
              )}
            </div>

            {/* Question text */}
            <h2 style={{ fontSize: '1.35rem', lineHeight: 1.55, marginBottom: '20px' }}>
              {question.text}
            </h2>

            {/* Hint (for struggling kids) */}
            {hintActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 12, padding: '10px 14px',
                  marginBottom: '16px', fontSize: '0.9rem', color: '#fbbf24'
                }}
              >
                💡 Hint: {question.hint}
              </motion.div>
            )}

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={!answered ? { x: 4 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  className={getOptionClass(option)}
                  onClick={() => handleOptionClick(option)}
                  disabled={answered}
                >
                  <span style={{ marginRight: 10, opacity: 0.6, fontWeight: 700 }}>
                    {['A', 'B', 'C', 'D'][idx]}.
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback panel */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              style={{
                padding: '20px 24px',
                borderRadius: 'var(--radius-lg)',
                background: selected === question.correctAnswer
                  ? 'rgba(16,185,129,0.18)'
                  : 'rgba(100,100,120,0.2)',
                border: `1px solid ${selected === question.correctAnswer ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              {selected === question.correctAnswer ? (
                <>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#34d399' }}>🎉 Excellent work!</p>
                  <p style={{ marginTop: 6, opacity: 0.85, fontSize: '0.95rem' }}>{question.explanation}</p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#94a3b8' }}>💪 Almost there!</p>
                  <p style={{ marginTop: 6, opacity: 0.85, fontSize: '0.95rem' }}>
                    The correct answer is <strong style={{ color: '#34d399' }}>{question.correctAnswer}</strong>.{' '}
                    {question.explanation}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
