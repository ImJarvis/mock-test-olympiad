# Olympiad Hero 🦸‍♂️

A gamified, adaptive learning platform designed to help kids (under 10 years old) prepare for Olympiad exams. 

## Overview
Olympiad Hero is not just another mock test app. It features an intelligent **Adaptive Engine** that adjusts the difficulty of questions based on a child's performance in real-time. By tracking their proficiency across four core pillars, the app provides a highly personalised learning experience.

### Core Pillars
1. **Shape Shifter (Visual/Spatial):** Pattern recognition, mirror images, folding shapes.
2. **Number Detective (Quantitative):** Logic puzzles, sequences, operations.
3. **Pattern Master (Logical/Analytical):** Missing terms, odd one out, family trees.
4. **Word Explorer (Verbal Reasoning):** Coding-decoding, word matrices, analogies.

## Features
- 🚀 **3 Fun Themes:** Space Explorer, Jungle Safari, and Magic Academy.
- 🧠 **Adaptive Difficulty:** Automatically levels up to harder questions as the child proves mastery, and scales back with helpful hints if they struggle.
- 🏆 **Gamification:** Features streaks, XP points, and a mystery sticker pack reward system.
- 📊 **Hero Dashboard:** Visualises a child's strengths and areas for practice using a skill radar chart.
- 🚫 **No Red Crosses:** Wrong answers are framed gently to maintain a positive and encouraging environment.

## Tech Stack
- **Frontend Framework:** React (Vite)
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Data Visualisation:** Recharts
- **Styling:** Vanilla CSS (Glassmorphism design)
- **Confetti:** canvas-confetti

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository.
2. Navigate into the project directory:
   ```bash
   cd MockTestOlympiad
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## Deployment
This project is built with Vite and is perfectly suited for zero-configuration deployment on [Vercel](https://vercel.com). Simply import the repository in your Vercel dashboard, and the platform will automatically build and deploy it.
