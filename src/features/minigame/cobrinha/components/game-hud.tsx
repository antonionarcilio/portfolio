'use client';

import { motion } from 'framer-motion';

import { hudVariants, scorePopVariants } from '../animations';
import type { Messages } from '../types';

interface GameHudProps {
  score: number;
  highScore: number;
  scoreKey: number;
  messages: Messages;
}

export function GameHud({ score, highScore, scoreKey, messages }: GameHudProps) {
  return (
    <motion.div className="snake-hud" variants={hudVariants} initial="hidden" animate="visible">
      <div className="snake-hud__item">
        <span className="snake-hud__label">{messages.score}</span>
        <motion.span
          className="snake-hud__value"
          key={scoreKey}
          variants={scorePopVariants}
          initial="initial"
          animate="animate"
        >
          {score}
        </motion.span>
      </div>
      <div className="snake-hud__item">
        <span className="snake-hud__label">{messages.highScore}</span>
        <span className="snake-hud__value snake-hud__value--highlight">{highScore}</span>
      </div>
    </motion.div>
  );
}
