import type { Direction, GameState, Position } from '../types';
import {
  BASE_INTERVAL_MS,
  BONUS_FOOD_DURATION_MS,
  BONUS_FOOD_EATEN_THRESHOLD,
  BONUS_FOOD_INTERVAL_MS,
  GRID_SIZE,
  SPEED_CAP,
} from './constants';

export function createInitialGameState(snake: Position[], food: Position): GameState {
  return {
    snake,
    direction: 'RIGHT',
    food,
    bonusFood: null,
    bonusFoodSpawnTime: null,
    lastBonusFoodEndTime: null,
    score: 0,
    foodEaten: 0,
    isDead: false,
  };
}

export function wrapPosition(pos: Position): Position {
  return {
    x: ((pos.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
    y: ((pos.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
  };
}

export function getNextHead(head: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return wrapPosition({ x: head.x, y: head.y - 1 });
    case 'DOWN':
      return wrapPosition({ x: head.x, y: head.y + 1 });
    case 'LEFT':
      return wrapPosition({ x: head.x - 1, y: head.y });
    case 'RIGHT':
      return wrapPosition({ x: head.x + 1, y: head.y });
  }
}

export function checkSelfCollision(snake: Position[]): boolean {
  const head = snake[0];
  return snake.slice(1).some((seg) => seg.x === head.x && seg.y === head.y);
}

export function calculateInterval(score: number): number {
  return BASE_INTERVAL_MS / (1 + Math.min(score, SPEED_CAP) * 0.01);
}

export function generateRandomPosition(gridSize: number, snake: Position[]): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const maxAttempts = gridSize * gridSize;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const pos: Position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    if (!occupied.has(`${pos.x},${pos.y}`)) return pos;
  }
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!occupied.has(`${x},${y}`)) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

export interface TickResult extends GameState {
  foodJustEaten: boolean;
  bonusJustEaten: boolean;
}

export function tick(state: GameState, now: number): TickResult {
  if (state.isDead) {
    return { ...state, foodJustEaten: false, bonusJustEaten: false };
  }

  const newHead = getNextHead(state.snake[0], state.direction);

  const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const ateBonus = state.bonusFood !== null && newHead.x === state.bonusFood.x && newHead.y === state.bonusFood.y;
  const ateSomething = ateFood || ateBonus;

  const newSnake = ateSomething ? [newHead, ...state.snake] : [newHead, ...state.snake.slice(0, -1)];

  if (checkSelfCollision(newSnake)) {
    return {
      ...state,
      snake: newSnake,
      isDead: true,
      foodJustEaten: false,
      bonusJustEaten: false,
    };
  }

  let score = state.score;
  let foodEaten = state.foodEaten;
  let food = state.food;
  let bonusFood = state.bonusFood;
  let bonusFoodSpawnTime = state.bonusFoodSpawnTime;
  let lastBonusFoodEndTime = state.lastBonusFoodEndTime;
  let foodJustEaten = false;
  let bonusJustEaten = false;

  if (ateFood) {
    score += 1;
    foodEaten += 1;
    food = generateRandomPosition(GRID_SIZE, newSnake);
    foodJustEaten = true;
  }

  if (ateBonus) {
    score += 2;
    foodEaten += 1;
    bonusFood = null;
    bonusFoodSpawnTime = null;
    lastBonusFoodEndTime = now;
    bonusJustEaten = true;
  }

  if (foodEaten >= BONUS_FOOD_EATEN_THRESHOLD) {
    if (bonusFood === null) {
      if (lastBonusFoodEndTime === null) {
        spawnBonusFood();
      } else if (now - lastBonusFoodEndTime >= BONUS_FOOD_INTERVAL_MS) {
        spawnBonusFood();
      }
    } else if (bonusFoodSpawnTime !== null && now - bonusFoodSpawnTime >= BONUS_FOOD_DURATION_MS) {
      bonusFood = null;
      bonusFoodSpawnTime = null;
      lastBonusFoodEndTime = now;
    }
  }

  function spawnBonusFood() {
    bonusFood = generateRandomPosition(GRID_SIZE, newSnake);
    bonusFoodSpawnTime = now;
  }

  return {
    snake: newSnake,
    direction: state.direction,
    food,
    bonusFood,
    bonusFoodSpawnTime,
    lastBonusFoodEndTime,
    score,
    foodEaten,
    isDead: false,
    foodJustEaten,
    bonusJustEaten,
  };
}
