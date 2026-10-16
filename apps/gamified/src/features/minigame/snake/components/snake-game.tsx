'use client';

import { useSnakeGame } from '../hooks/use-snake-game';
import { CANVAS_SIZE } from '../utils/constants';
import { GameHud } from './game-hud';
import { GameOverlay } from './game-overlay';

interface SnakeGameProps {
  onClose?: () => void;
}

export function SnakeGame({ onClose }: SnakeGameProps) {
  const {
    canvasRef,
    score,
    highScore,
    gameStatus,
    isNewHighScore,
    startGame,
    handleTouchStart,
    handleTouchEnd,
    messages,
  } = useSnakeGame();

  return (
    <div className="snake-container">
      <GameHud score={score} highScore={highScore} scoreKey={score} messages={messages} onClose={onClose} />

      <div className="snake-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="snake-canvas"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <GameOverlay
          gameStatus={gameStatus}
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onStart={startGame}
          messages={messages}
        />
      </div>
    </div>
  );
}
