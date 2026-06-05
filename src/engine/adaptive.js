// =============================================================================
// ADAPTIVE ENGINE — Core Algorithm
// Based on PRD Research Report specifications
//
// Proficiency: 1.0 → 3.0 scale
// - Grade_2 Easy:   tier 1, proficiency < 1.5
// - Grade_2 Medium: tier 2, proficiency 1.0–2.0
// - Grade_2 Hard:   tier 3, proficiency 1.5–2.0
// - Grade_3 Easy:   tier 1, proficiency >= 2.0
// - Grade_3 Medium: tier 2, proficiency 2.0–2.5
// - Grade_3 Hard:   tier 3, proficiency >= 2.5
// =============================================================================

import { getQuestions, SKILL_CATEGORIES } from '../data/questions.js';

/**
 * Given a proficiency level, determine which grade and difficulty tier to serve.
 * Proficiency 1.0–1.5 → Grade 2 Easy
 * Proficiency 1.5–2.0 → Grade 2 Medium/Hard
 * Proficiency 2.0–2.5 → Grade 3 Easy/Medium
 * Proficiency 2.5–3.0 → Grade 3 Hard
 */
export function getQuestionParams(proficiency) {
  if (proficiency < 1.5) {
    return { base_grade: 'Grade_2', difficulty_tier: 1 };
  } else if (proficiency < 2.0) {
    // Mix of medium and hard for Grade 2
    return { base_grade: 'Grade_2', difficulty_tier: proficiency < 1.75 ? 2 : 3 };
  } else if (proficiency < 2.5) {
    return { base_grade: 'Grade_3', difficulty_tier: proficiency < 2.25 ? 1 : 2 };
  } else {
    return { base_grade: 'Grade_3', difficulty_tier: 3 };
  }
}

/**
 * Generate a quest of 3–5 questions.
 * Questions are chosen to cover all skill categories proportionally,
 * weighting toward lower-proficiency skills.
 * @param {Object} proficiency - { 'Shape Shifter': 1.0, 'Number Detective': 1.5, ... }
 * @param {number} questSize - 3, 4, or 5
 */
export function generateQuest(proficiency, questSize = 4) {
  // Sort categories by proficiency ascending (weaker first = more practice)
  const sorted = SKILL_CATEGORIES.sort(
    (a, b) => (proficiency[a] || 1.0) - (proficiency[b] || 1.0)
  );

  const questions = [];
  const used = new Set();

  // Try to include at least 1 from each category, filling extras from weakest
  for (let i = 0; i < questSize; i++) {
    const skill = sorted[i % sorted.length];
    const params = getQuestionParams(proficiency[skill] || 1.0);

    const candidates = getQuestions({ skill_category: skill, ...params, limit: 10 })
      .filter(q => !used.has(q.id));

    if (candidates.length > 0) {
      const chosen = candidates[0];
      questions.push(chosen);
      used.add(chosen.id);
    }
  }

  return questions;
}

/**
 * Evaluate a completed quest and return updated proficiency scores.
 * PRD Rules:
 * - 100% on a category → +0.5 proficiency
 * - < 50% on a category → -0.25 proficiency
 * - In between → no change
 * - Proficiency clamped to [1.0, 3.0]
 * @param {Object} proficiency - current proficiency per skill
 * @param {Array} results - array of { question, wasCorrect }
 * @returns { updatedProficiency, skillResults, showHints }
 */
export function evaluateQuest(proficiency, results) {
  // Group results by skill category
  const bySkill = {};
  for (const { question, wasCorrect } of results) {
    const cat = question.skill_category;
    if (!bySkill[cat]) bySkill[cat] = { correct: 0, total: 0 };
    bySkill[cat].total += 1;
    if (wasCorrect) bySkill[cat].correct += 1;
  }

  const updatedProficiency = { ...proficiency };
  const skillResults = {};
  const showHints = {};

  for (const [skill, stats] of Object.entries(bySkill)) {
    const ratio = stats.correct / stats.total;
    skillResults[skill] = { ...stats, ratio };

    if (ratio === 1.0) {
      // Perfect score — level up
      updatedProficiency[skill] = Math.min(3.0, (updatedProficiency[skill] || 1.0) + 0.5);
      showHints[skill] = false;
    } else if (ratio < 0.5) {
      // Struggling — level down and show hints
      updatedProficiency[skill] = Math.max(1.0, (updatedProficiency[skill] || 1.0) - 0.25);
      showHints[skill] = true;
    } else {
      showHints[skill] = false;
    }
  }

  return { updatedProficiency, skillResults, showHints };
}

/**
 * Calculate the total XP points based on proficiency scores.
 */
export function calculateXP(proficiency) {
  return Object.values(proficiency).reduce((sum, p) => {
    return sum + Math.round((p - 1.0) * 100);
  }, 0);
}

/**
 * Return a grade label for a proficiency value
 */
export function getProficiencyLabel(proficiency) {
  if (proficiency >= 2.8) return 'Grand Master';
  if (proficiency >= 2.5) return 'Expert';
  if (proficiency >= 2.0) return 'Advanced';
  if (proficiency >= 1.5) return 'Intermediate';
  return 'Beginner';
}

/**
 * Calculate streak multiplier
 */
export function getStreakMultiplier(streak) {
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}
