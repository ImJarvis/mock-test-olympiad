import { create } from 'zustand';
import { generateQuest, evaluateQuest, calculateXP } from '../engine/adaptive.js';
import { SKILL_CATEGORIES } from '../data/questions.js';

const DEFAULT_PROFICIENCY = Object.fromEntries(SKILL_CATEGORIES.map(s => [s, 1.0]));

export const THEME_GIFTS = {
  space: [
    { id: 's1', emoji: '🚀', label: 'Rocket Thruster', desc: 'A piece of your spaceship!' },
    { id: 's2', emoji: '🛰️', label: 'Satellite Dish', desc: 'Communication with Earth.' },
    { id: 's3', emoji: '👽', label: 'Friendly Alien', desc: 'A new companion for the journey.' },
    { id: 's4', emoji: '☄️', label: 'Meteor Shard', desc: 'A rare space rock.' },
    { id: 's5', emoji: '🌌', label: 'Galaxy Map', desc: 'Shows the way home.' },
    { id: 's6', emoji: '🔭', label: 'Telescope', desc: 'See distant stars.' }
  ],
  jungle: [
    { id: 'j1', emoji: '🧭', label: 'Explorer Compass', desc: 'Never lose your way.' },
    { id: 'j2', emoji: '🗺️', label: 'Treasure Map', desc: 'Leads to hidden ruins.' },
    { id: 'j3', emoji: '🐒', label: 'Monkey Friend', desc: 'Swings through the vines with you.' },
    { id: 'j4', emoji: '🔦', label: 'Flashlight', desc: 'Lights up the dark caves.' },
    { id: 'j5', emoji: '💎', label: 'Ancient Gem', desc: 'Found in the lost temple.' },
    { id: 'j6', emoji: '🥾', label: 'Hiking Boots', desc: 'Ready for any terrain.' }
  ],
  magic: [
    { id: 'm1', emoji: '🪄', label: 'Elder Wand', desc: 'Channel your inner magic.' },
    { id: 'm2', emoji: '📜', label: 'Spell Scroll', desc: 'Contains a forgotten spell.' },
    { id: 'm3', emoji: '🦉', label: 'Owl Familiar', desc: 'Delivers your messages.' },
    { id: 'm4', emoji: '🧪', label: 'Brewing Potion', desc: 'Bubbling with mystery.' },
    { id: 'm5', emoji: '🔮', label: 'Crystal Ball', desc: 'Reveals the future.' },
    { id: 'm6', emoji: '🧙‍♀️', label: 'Magic Hat', desc: 'A hat full of secrets.' }
  ]
};

export const useGameStore = create((set, get) => ({
  // ─── User Profile ───────────────────────────────────────────
  kidName: '',
  grade: 'Grade_2',
  theme: 'space',
  character: 'explorer',
  proficiency: { ...DEFAULT_PROFICIENCY },
  totalXP: 0,
  questsCompleted: 0,

  // ─── Streak / Rewards ───────────────────────────────────────
  currentStreak: 0,
  longestStreak: 0,
  ownedGifts: [],
  mysteryPackPending: false,   // a pack is ready to be opened
  showHints: {},               // per-skill hint flag

  // ─── Current Quest ─────────────────────────────────────────
  currentQuest: [],
  currentQuestionIndex: 0,
  questResults: [],            // array of { question, wasCorrect }

  // ─── App State ─────────────────────────────────────────────
  gameState: 'onboarding',    // onboarding | playing | feedback | pack | dashboard

  // ─── Actions ────────────────────────────────────────────────

  setProfile: ({ kidName, grade, theme, character }) => set({ kidName, grade, theme, character }),

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
    const state = get();
    // Dynamic quest length based on consecutive right answers (currentStreak)
    let questSize = 4;
    if (state.currentStreak >= 4) questSize = 8;
    else if (state.currentStreak >= 2) questSize = 6;

    const quest = generateQuest(state.proficiency, questSize);
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

    if (nextIndex >= state.currentQuest.length) {
      // Quest complete — evaluate
      const { updatedProficiency, showHints } = evaluateQuest(state.proficiency, updatedResults);
      const newXP = calculateXP(updatedProficiency);
      const questsCompleted = state.questsCompleted + 1;
      
      const correctCount = updatedResults.filter(r => r.wasCorrect).length;
      const pct = (correctCount / state.currentQuest.length) * 100;
      const earnedPack = pct > 75; // Only give pack if score > 75%

      set({
        questResults: updatedResults,
        proficiency: updatedProficiency,
        totalXP: newXP,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        showHints,
        questsCompleted,
        mysteryPackPending: earnedPack,
        gameState: 'feedback',
      });
    } else {
      set({
        questResults: updatedResults,
        currentQuestionIndex: nextIndex,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
      });
    }
  },

  claimPackGifts: () => {
    const state = get();
    const giftsForTheme = THEME_GIFTS[state.theme] || THEME_GIFTS.space;
    
    // Number of gifts based on longest streak in this session
    let numGifts = 1;
    if (state.currentStreak >= 5) numGifts = 3;
    else if (state.currentStreak >= 3) numGifts = 2;

    const availableGifts = giftsForTheme.filter(g => !state.ownedGifts.some(og => og.id === g.id));
    
    // If we have no new gifts left, just give the first one as a duplicate or fallback
    if (availableGifts.length === 0) {
      return []; 
    }

    // Shuffle and pick
    const shuffled = [...availableGifts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.random() > 0.5 ? numGifts : Math.max(1, numGifts - 1)); // Add some randomness

    set({ 
      ownedGifts: [...state.ownedGifts, ...selected],
      mysteryPackPending: false 
    });

    return selected;
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
    ownedGifts: [],
    mysteryPackPending: false,
    showHints: {},
    currentQuest: [],
    questResults: [],
    gameState: 'onboarding',
  }),
}));
