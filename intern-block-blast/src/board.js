const BOARD_SIZE = 8;

/**
 * Create an empty 8x8 board. Each cell is null (empty) or a category string.
 */
export function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

/**
 * Check if a piece can be placed at (row, col) on the board.
 */
export function canPlace(board, shape, row, col) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] === 1) {
        const br = row + r;
        const bc = col + c;
        if (br < 0 || br >= BOARD_SIZE || bc < 0 || bc >= BOARD_SIZE) return false;
        if (board[br][bc] !== null) return false;
      }
    }
  }
  return true;
}

/**
 * Place a piece on the board. Returns a new board (immutable).
 */
export function placePiece(board, shape, category, row, col) {
  const newBoard = board.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] === 1) {
        newBoard[row + r][col + c] = category;
      }
    }
  }
  return newBoard;
}

/**
 * Find completed rows and columns.
 * Returns { rows: number[], cols: number[] }
 */
export function findCompletedLines(board) {
  const rows = [];
  const cols = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every((cell) => cell !== null)) {
      rows.push(r);
    }
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) cols.push(c);
  }

  return { rows, cols };
}

/**
 * Clear completed lines from the board. Returns a new board.
 */
export function clearLines(board, { rows, cols }) {
  const newBoard = board.map((r) => [...r]);

  for (const r of rows) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      newBoard[r][c] = null;
    }
  }

  for (const c of cols) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      newBoard[r][c] = null;
    }
  }

  return newBoard;
}

/**
 * Get all cells that belong to completed lines (for animation).
 */
export function getClearedCells(rows, cols) {
  const cells = new Set();
  for (const r of rows) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      cells.add(`${r},${c}`);
    }
  }
  for (const c of cols) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      cells.add(`${r},${c}`);
    }
  }
  return cells;
}

/**
 * Check if any of the given pieces can be placed anywhere on the board.
 */
export function hasValidMove(board, pieces) {
  for (const piece of pieces) {
    if (!piece) continue;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlace(board, piece.shape, r, c)) return true;
      }
    }
  }
  return false;
}

/**
 * Calculate score for clearing lines.
 * Bonus for multiple lines cleared at once.
 */
export function calculateScore(linesCleared) {
  if (linesCleared === 0) return 0;
  // 100 per line, with combo multiplier
  return linesCleared * 100 * linesCleared;
}

export { BOARD_SIZE };
