import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import Onboarding from './components/Onboarding';
import Quest from './components/Quest';
import QuestFeedback from './components/QuestFeedback';
import MysteryPack from './components/MysteryPack';
import Dashboard from './components/Dashboard';

const pageVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

export default function App() {
  const { gameState } = useGameStore();

  return (
    <AnimatePresence mode="wait">
      {gameState === 'onboarding' && (
        <motion.div key="onboarding" {...pageVariants} transition={{ duration: 0.3 }} style={{ minHeight: '100vh' }}>
          <Onboarding />
        </motion.div>
      )}
      {gameState === 'playing' && (
        <motion.div key="playing" {...pageVariants} transition={{ duration: 0.25 }} style={{ minHeight: '100vh' }}>
          <Quest />
        </motion.div>
      )}
      {gameState === 'feedback' && (
        <motion.div key="feedback" {...pageVariants} transition={{ duration: 0.3 }} style={{ minHeight: '100vh' }}>
          <QuestFeedback />
        </motion.div>
      )}
      {gameState === 'pack' && (
        <motion.div key="pack" {...pageVariants} transition={{ duration: 0.3 }} style={{ minHeight: '100vh' }}>
          <MysteryPack />
        </motion.div>
      )}
      {gameState === 'dashboard' && (
        <motion.div key="dashboard" {...pageVariants} transition={{ duration: 0.3 }} style={{ minHeight: '100vh' }}>
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
