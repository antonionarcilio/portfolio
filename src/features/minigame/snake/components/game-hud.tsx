'use client';

import { motion } from 'framer-motion';

import { hudVariants, scorePopVariants } from '../animations';
import type { Messages } from '../types';

interface GameHudProps {
  score: number;
  highScore: number;
  scoreKey: number;
  messages: Messages;
  onClose?: () => void;
}

export function GameHud({ score, highScore, scoreKey, messages, onClose }: GameHudProps) {
  return (
    <motion.div className="snake-hud" variants={hudVariants} initial="hidden" animate="visible">
      <div className="snake-hud__group">
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
      </div>

      {onClose && (
        <button
          className="bg-transparent border border-cv-border text-cv-cyan font-cv-mono text-[16px] w-7 h-7 flex items-center justify-center leading-none outline-none transition-[border-color,box-shadow] duration-150 hover:border-cv-cyan hover:shadow-[0_0_12px_rgba(43,214,255,0.5)]"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          type="button"
          aria-label="Fechar"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
