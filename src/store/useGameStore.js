import { create } from 'zustand';
import { generateQuest, evaluateQuest, calculateXP } from '../engine/adaptive.js';
import { SKILL_CATEGORIES } from '../data/questions.js';

const DEFAULT_PROFICIENCY = Object.fromEntries(SKILL_CATEGORIES.map(s => [s, 1.0]));

const DEFAULT_STICKERS = {
  space_helmet: false,
  math_crown: false,
  logic_badge: false,
  word_trophy: false,
  streak_flame: false,
  mystery_star: false,
};

export const useGameStore = create((set, get) => ({
  // ─── User Profile ───────────────────────────────────────────
  kidName: '',
  grade: 'Grade_2',
  theme: 'space',
  proficiency: { ...DEFAULT_PROFICIENCY },
  totalXP: 0,
  questsCompleted: 0,

  // ─── Streak / Rewards ───────────────────────────────────────
  currentStreak: 0,
  longestStreak: 0,
  unlockedStickers: { ...DEFAULT_STICKERS },
  mysteryPackPending: false,   // a pack is ready to be opened
  showHints: {},               // per-skill hint flag

  // ─── Current Quest ─────────────────────────────────────────
  currentQuest: [],
  currentQuestionIndex: 0,
  questResults: [],            // array of { question, wasCorrect }

  // ─── App State ─────────────────────────────────────────────
  gameState: 'onboarding',    // onboarding | playing | feedback | pack | dashboard

  // ─── Actions ────────────────────────────────────────────────

  setProfile: ({ kidName, grade, theme }) => set({ kidName, grade, theme }),

  startGame: () => {
    const { proficiency } = get();
    const quest = generateQuest(proficiency, 4);
    set({
      currentQuest: quest,
      currentQuestionIndex: 0,
      questResults: [],
      gameState: 'playing',
    });
  },

  startNextQuest: () => {
    const { proficiency } = get();
    const quest = generateQuest(proficiency, 4);
    set({
      currentQuest: quest,
      currentQuestionIndex: 0,
      questResults: [],
      gameState: 'playing',
      mysteryPackPending: false,
    });
  },

  submitAnswer: (wasCorrect) => {
    const state = get();
    const question = state.currentQuest[state.currentQuestionIndex];
    const updatedResults = [...state.questResults, { question, wasCorrect }];
    const nextIndex = state.currentQuestionIndex + 1;

    // Update streak
    const newStreak = wasCorrect ? state.currentStreak + 1 : 0;
    const newLongestStreak = Math.max(newStreak, state.longestStreak);

    // Check sticker unlocks
    const newStickers = { ...state.unlockedStickers };
    if (newStreak >= 3) newStickers.streak_flame = true;
    if (question.id.startsWith('we_3') && wasCorrect) newStickers.word_trophy = true;
    if (question.id.includes('astronaut')) newStickers.space_helmet = true;

    if (nextIndex >= state.currentQuest.length) {
      // Quest complete — evaluate
      const { updatedProficiency, showHints } = evaluateQuest(state.proficiency, updatedResults);
      const newXP = calculateXP(updatedProficiency);
      const questsCompleted = state.questsCompleted + 1;
      if (questsCompleted % 1 === 0) newStickers.mystery_star = true; // every quest unlocks a sticker

      set({
        questResults: updatedResults,
        proficiency: updatedProficiency,
        totalXP: newXP,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        unlockedStickers: newStickers,
        showHints,
        questsCompleted,
        mysteryPackPending: true,
        gameState: 'feedback',
      });
    } else {
      set({
        questResults: updatedResults,
        currentQuestionIndex: nextIndex,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        unlockedStickers: newStickers,
      });
    }
  },

  openPack: () => set({ gameState: 'pack' }),
  viewDashboard: () => set({ gameState: 'dashboard' }),
  goHome: () => set({ gameState: 'onboarding' }),

  resetGame: () => set({
    proficiency: { ...DEFAULT_PROFICIENCY },
    totalXP: 0,
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    unlockedStickers: { ...DEFAULT_STICKERS },
    mysteryPackPending: false,
    showHints: {},
    currentQuest: [],
    questResults: [],
    gameState: 'onboarding',
  }),
}));
