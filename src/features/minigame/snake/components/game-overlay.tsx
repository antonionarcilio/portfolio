'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { overlayContentVariants, overlayVariants } from '../animations';
import type { GameStatus, Messages } from '../types';

interface GameOverlayProps {
  gameStatus: GameStatus;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onStart: () => void;
  messages: Messages;
}

export function GameOverlay({ gameStatus, score, highScore, isNewHighScore, onStart, messages }: GameOverlayProps) {
  const show = gameStatus === 'idle' || gameStatus === 'gameover';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="snake-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div variants={overlayContentVariants} initial="hidden" animate="visible">
            {gameStatus === 'idle' && (
              <>
                <div className="snake-overlay__title text-cv-text">{messages.title}</div>
                <div className="snake-overlay__score text-cv-text-dim">{messages.startInstruction}</div>
                <button
                  className="snake-overlay__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart();
                  }}
                  type="button"
                >
                  {messages.startGame}
                </button>
              </>
            )}

            {gameStatus === 'gameover' && (
              <>
                <div className="snake-overlay__title text-cv-text">{messages.gameOver}</div>
                <div className="snake-overlay__score text-cv-text-dim">
                  {messages.score}: <b>{score}</b>
                </div>

                {isNewHighScore && <div className="snake-overlay__new-record">{messages.newHighScore}</div>}

                {!isNewHighScore && highScore > 0 && (
                  <div className="snake-overlay__high-score">
                    {messages.highScore}: <b>{highScore}</b>
                  </div>
                )}

                <button
                  className="snake-overlay__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart();
                  }}
                  type="button"
                >
                  {messages.playAgain}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
