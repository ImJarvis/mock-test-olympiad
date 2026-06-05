export const MOCK_QUESTIONS = [
  // Pillar 1: Visual & Spatial Intelligence
  {
    id: 'v1',
    pillar: 'Visual Ninja',
    difficulty: 'easy',
    text: 'Which shape comes next in the pattern: Circle, Square, Circle, Square, ___?',
    options: ['Circle', 'Triangle', 'Square', 'Star'],
    correctAnswer: 'Circle',
    explanation: 'The pattern repeats Circle then Square.'
  },
  {
    id: 'v2',
    pillar: 'Visual Ninja',
    difficulty: 'medium',
    text: 'Identify the polygon with the maximum number of sides.',
    options: ['Triangle', 'Square', 'Hexagon', 'Octagon'],
    correctAnswer: 'Octagon',
    explanation: 'An octagon has 8 sides, which is more than 3, 4, or 6.'
  },
  // Pillar 2: Analytical Logic & Sequences
  {
    id: 'l1',
    pillar: 'Logic Detective',
    difficulty: 'easy',
    text: 'Find the missing number: 2, 4, 6, __, 10',
    options: ['7', '8', '9', '11'],
    correctAnswer: '8',
    explanation: 'The numbers are increasing by 2 each time.'
  },
  {
    id: 'l2',
    pillar: 'Logic Detective',
    difficulty: 'medium',
    text: 'Complete the word relation: If B is to Binoculars, then K is to ______.',
    options: ['Kite', 'Cat', 'Dog', 'Bat'],
    correctAnswer: 'Kite',
    explanation: 'Binoculars start with the letter B. Kite starts with the letter K.'
  },
  // Pillar 3: Quantitative Problem Solving
  {
    id: 'm1',
    pillar: 'Math Wizard',
    difficulty: 'easy',
    text: 'There are three persons in each house. Find the number of persons in 4 houses.',
    options: ['10', '12', '15', '20'],
    correctAnswer: '12',
    explanation: '3 persons × 4 houses = 12 persons.'
  },
  {
    id: 'm2',
    pillar: 'Math Wizard',
    difficulty: 'medium',
    text: 'How many 10-rupee notes can be exchanged with a fifty rupee note?',
    options: ['5', '10', '15', '20'],
    correctAnswer: '5',
    explanation: '10 × 5 = 50. So you need 5 notes of 10 rupees.'
  },
  // Pillar 4: Language & Comprehension
  {
    id: 'w1',
    pillar: 'Word Master',
    difficulty: 'easy',
    text: 'Fill in the blank: Anita is crying because ____ cat is missing.',
    options: ['his', 'her', 'she', 'mine'],
    correctAnswer: 'her',
    explanation: 'Anita is a girl, so we use the pronoun "her".'
  },
  {
    id: 'w2',
    pillar: 'Word Master',
    difficulty: 'medium',
    text: 'Find the adverb in the sentence: "The old woman shouted loudly."',
    options: ['Old', 'Woman', 'Shouted', 'Loudly'],
    correctAnswer: 'Loudly',
    explanation: 'An adverb describes a verb. "Loudly" describes how she shouted.'
  }
];
