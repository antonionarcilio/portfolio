'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Direction, GameStatus, GameState as GS, Messages, Position } from '../types';
import { CANVAS_SIZE, CELL_SIZE, GRID_SIZE } from '../utils/constants';
import { calculateInterval, createInitialGameState, generateRandomPosition, tick } from '../utils/game-engine';
import { directionFromKey, directionFromSwipe, isOpposite } from '../utils/input-handler';
import { getHighScore as readHighScore, setHighScore as saveHighScore } from '../utils/storage';

function drawSnakeCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  fillStyle: string,
  isHead: boolean,
) {
  const gap = isHead ? 0.5 : 1;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x * cellSize + gap, y * cellSize + gap, cellSize - gap * 2, cellSize - gap * 2);
  if (isHead) {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(x * cellSize + 5, y * cellSize + 5, cellSize - 10, cellSize - 10);
  }
}

function render(ctx: CanvasRenderingContext2D, state: GS, now: number) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = i * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, CANVAS_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(CANVAS_SIZE, pos);
    ctx.stroke();
  }

  ctx.fillStyle = '#ef4444';
  const fx = state.food.x * CELL_SIZE;
  const fy = state.food.y * CELL_SIZE;
  ctx.fillRect(fx + 1.5, fy + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);

  if (state.bonusFood) {
    const pulse = Math.sin(now / 180) * 0.25 + 0.75;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#facc15';
    const bx = state.bonusFood.x * CELL_SIZE;
    const by = state.bonusFood.y * CELL_SIZE;
    ctx.fillRect(bx + 1.5, by + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
    ctx.globalAlpha = 1;
  }

  state.snake.forEach((seg, i) => {
    const isHead = i === 0;
    drawSnakeCell(ctx, seg.x, seg.y, CELL_SIZE, isHead ? '#22c55e' : '#16a34a', isHead);
  });
}

export function useSnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GS | null>(null);
  const bufferedDirectionRef = useRef<Direction | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameStatusRef = useRef<GameStatus>('idle');

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => readHighScore());
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const t = useTranslations('minigame.snake');
  const messages: Messages = {
    title: t('title'),
    startInstruction: t('startInstruction'),
    gameOver: t('gameOver'),
    score: t('score'),
    highScore: t('highScore'),
    newHighScore: t('newHighScore'),
    playAgain: t('playAgain'),
    startGame: t('startGame'),
    close: t('close'),
  };

  gameStatusRef.current = gameStatus;

  const handleGameOver = useCallback((finalScore: number) => {
    const prevHigh = readHighScore();
    if (finalScore > prevHigh) {
      saveHighScore(finalScore);
      setHighScore(finalScore);
      setIsNewHighScore(true);
    }
    setScore(finalScore);
    gameStatusRef.current = 'gameover';
    setGameStatus('gameover');
  }, []);

  const startGame = useCallback(() => {
    const snake: Position[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    const food = generateRandomPosition(GRID_SIZE, snake);
    stateRef.current = createInitialGameState(snake, food);
    bufferedDirectionRef.current = null;
    setIsNewHighScore(false);
    setScore(0);
    gameStatusRef.current = 'playing';
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameStatusRef.current === 'gameover') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (gameStatusRef.current === 'idle') {
        startGame();
        return;
      }

      if (gameStatusRef.current !== 'playing') return;

      const dir = directionFromKey(e.key);
      if (dir) {
        e.preventDefault();
        if (stateRef.current && !isOpposite(stateRef.current.direction, dir)) {
          bufferedDirectionRef.current = dir;
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [startGame]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      if (gameStatusRef.current === 'idle') {
        startGame();
        touchStartRef.current = null;
        return;
      }

      if (gameStatusRef.current === 'gameover') {
        startGame();
        touchStartRef.current = null;
        return;
      }

      if (gameStatusRef.current !== 'playing') {
        touchStartRef.current = null;
        return;
      }

      const dir = directionFromSwipe(touchStartRef.current.x, touchStartRef.current.y, touch.clientX, touch.clientY);

      touchStartRef.current = null;

      if (dir && stateRef.current && !isOpposite(stateRef.current.direction, dir)) {
        bufferedDirectionRef.current = dir;
      }
    },
    [startGame],
  );

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let lastTickTime = 0;

    function loop(timestamp: number) {
      const currentState = stateRef.current;
      if (!currentState || currentState.isDead) return;

      if (bufferedDirectionRef.current !== null) {
        stateRef.current = { ...currentState, direction: bufferedDirectionRef.current };
        bufferedDirectionRef.current = null;
      }

      const effectiveState = stateRef.current!;
      const interval = calculateInterval(effectiveState.score);

      if (lastTickTime === 0) {
        lastTickTime = timestamp;
      }

      const elapsed = timestamp - lastTickTime;

      if (elapsed >= interval) {
        lastTickTime = timestamp - (elapsed % interval);

        const result = tick(effectiveState, timestamp);
        stateRef.current = result;

        if (result.isDead) {
          handleGameOver(result.score);
          render(ctx!, result, timestamp);
          return;
        }

        if (result.score !== effectiveState.score) {
          setScore(result.score);
        }
      }

      render(ctx!, stateRef.current!, timestamp);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [gameStatus, handleGameOver]);

  return {
    canvasRef,
    score,
    highScore,
    gameStatus,
    isNewHighScore,
    startGame,
    handleTouchStart,
    handleTouchEnd,
    messages,
  };
}
