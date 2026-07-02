export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  direction: Direction;
  food: Position;
  bonusFood: Position | null;
  bonusFoodSpawnTime: number | null;
  lastBonusFoodEndTime: number | null;
  score: number;
  foodEaten: number;
  isDead: boolean;
}

export interface Messages {
  title: string;
  startInstruction: string;
  gameOver: string;
  score: string;
  highScore: string;
  newHighScore: string;
  playAgain: string;
  startGame: string;
}
