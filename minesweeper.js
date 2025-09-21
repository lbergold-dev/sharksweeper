export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  OPEN: 'open',
  MARKED: 'marked',
};

export function createBoard(boardSize, mineNumber) {
  const board = [];

  for (let y = 0; y < boardSize; y++) {
    const row = [];
    for (let x = 0; x < boardSize; x++) {
      const element = document.createElement('div');
      element.dataset.boardTileStatus = TILE_STATUSES.HIDDEN;

      if ((x + y) % 2 === 0) element.classList.add('dark');
      else element.classList.add('light');

      const tile = {
        element,
        y,
        x,
        hasMine: false,
        adjacentMineNumber: 0,

        get status() {
          return this.element.dataset.boardTileStatus;
        },

        set status(value) {
          this.element.dataset.boardTileStatus = value;
        },
      };

      row.push(tile);
    }
    board.push(row);
  }

  // add Mines
  generateRandomCoordinates(mineNumber, boardSize).forEach(
    ([mineY, mineX]) => (board[mineY][mineX].hasMine = true),
  );

  // add adjacentMineNumbers
  board.forEach(row => {
    row.forEach(tile => {
      const adjacents = getAdjacentTiles(tile, board);
      const adjacentMines = adjacents.filter(tile => tile.hasMine);
      tile.adjacentMineNumber = adjacentMines.length;
    });
  });

  return board;
}

export function checkForWinOrLoss(board, boardSize, mineNumber) {
  const openTiles = board.flat().filter(tile => tile.status === TILE_STATUSES.OPEN);
  const mineTileOpen = board.flat().some(tile => tile.status === TILE_STATUSES.MINE);

  if (openTiles.length === boardSize ** 2 - mineNumber) return 'win';
  else if (mineTileOpen) return 'lose';
  else return false;
}

export function getAdjacentTiles(tile, board) {
  return [-1, 0, 1].flatMap(dy =>
    [-1, 0, 1]
      .map(dx => [tile.y + dy, tile.x + dx])
      .filter(([y, x]) => (y !== tile.y || x !== tile.x) && board[y]?.[x])
      .map(([y, x]) => board[y][x]),
  );
}

function generateRandomCoordinates(number, size) {
  const coordinatesSet = new Set();

  while (coordinatesSet.size < number) {
    coordinatesSet.add(`${Math.floor(Math.random() * size)},${Math.floor(Math.random() * size)}`);
  }

  const coordinatesArray = [...coordinatesSet].map(cor => cor.split(','));
  return coordinatesArray;
}
