import { CATEGORIES } from './data.js';

// Block Blast piece shapes defined as 2D arrays (1 = filled, 0 = empty)
const SHAPES = [
  // Single
  [[1]],
  // Dominoes
  [[1, 1]],
  [[1], [1]],
  // Triominoes
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 0]],
  [[1, 1], [0, 1]],
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  // Tetrominoes
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [0, 1, 0]],
  // Pentominoes (harder - appear at higher levels)
  [[1, 1, 1, 1, 1]],
  [[1], [1], [1], [1], [1]],
  [[1, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1], [0, 0, 1]],
  // Large squares
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
];

// Difficulty tiers - index into SHAPES
const EASY_SHAPES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11];
const MEDIUM_SHAPES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const HARD_SHAPES = Array.from({ length: SHAPES.length }, (_, i) => i);

const categoryKeys = Object.keys(CATEGORIES);

/**
 * Generate a random piece with a category assignment.
 * @param {number} level - Current game level (affects shape complexity)
 * @returns {{ shape: number[][], category: string }}
 */
export function generatePiece(level) {
  let pool;
  if (level <= 2) pool = EASY_SHAPES;
  else if (level <= 5) pool = MEDIUM_SHAPES;
  else pool = HARD_SHAPES;

  const shapeIndex = pool[Math.floor(Math.random() * pool.length)];
  const shape = SHAPES[shapeIndex];
  const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];

  return { shape, category };
}

/**
 * Generate a set of 3 pieces for the tray.
 * @param {number} level - Current game level
 * @returns {Array<{ shape: number[][], category: string }>}
 */
export function generatePieceSet(level) {
  return [generatePiece(level), generatePiece(level), generatePiece(level)];
}

/**
 * Get the bounding box dimensions of a shape.
 */
export function getShapeDimensions(shape) {
  return { rows: shape.length, cols: shape[0].length };
}
