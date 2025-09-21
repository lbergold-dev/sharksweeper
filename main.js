import { TILE_STATUSES, createBoard, getAdjacentTiles, checkForWinOrLoss } from './minesweeper.js';

const BOARD_SIZE = 10;
const MINE_NUMBER = 8;

let board = [];

const introduction = document.querySelector('[data-introduction]');
const boardGrid = document.querySelector('[data-board-grid]');
const headerMineCounter = document.querySelector('[data-header-mine-counter]');
const modalContainerWin = document.querySelector('[data-modal-container-win]');
const modalContainerLose = document.querySelector('[data-modal-container-lose]');
const modalOverlay = document.querySelector('[data-modal-overlay]');

introduction.classList.add('active');
loadBoard();

function loadBoard() {
  board = createBoard(BOARD_SIZE, MINE_NUMBER);
  boardGrid.innerHTML = '';
  boardGrid.style.setProperty('--size', BOARD_SIZE);
  const boardGridFragment = document.createDocumentFragment();
  board.forEach(row => {
    row.forEach(tile => {
      boardGridFragment.appendChild(tile.element);
    });
  });
  boardGrid.appendChild(boardGridFragment);

  renderMineNumber();
}

function openTile(tile, board, openedWithClick) {
  if (
    tile.status === TILE_STATUSES.OPEN ||
    (openedWithClick && tile.status === TILE_STATUSES.MARKED)
  ) {
    return;
  }

  if (tile.hasMine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }
  if (tile.adjacentMineNumber > 0) {
    tile.element.innerText = tile.adjacentMineNumber;
    tile.status = TILE_STATUSES.OPEN;
    return;
  } else {
    tile.status = TILE_STATUSES.OPEN;
    getAdjacentTiles(tile, board).forEach(adjacentTile => {
      openTile(adjacentTile, board, false);
    });
  }
}

function markTile(tile) {
  const status = tile.status;
  if (status === TILE_STATUSES.OPEN) return;
  tile.status = tile.status === TILE_STATUSES.MARKED ? TILE_STATUSES.HIDDEN : TILE_STATUSES.MARKED;
}

function renderMineNumber() {
  const markedTiles = board.flat().filter(tile => tile.status === TILE_STATUSES.MARKED);
  headerMineCounter.textContent = MINE_NUMBER - markedTiles.length;
}

function renderEnd(gameIsOver) {
  switch (gameIsOver) {
    case false:
      return;
    case 'win':
      setTimeout(() => {
        modalContainerWin.classList.add('active');
      }, 750);
      break;
    case 'lose':
      setTimeout(() => {
        modalContainerLose.classList.add('active');
      }, 1000);
      break;
  }
  board.flat().forEach(tile => {
    if (tile.hasMine) tile.status = TILE_STATUSES.MINE;
  });
  modalOverlay.classList.add('active');
}

function restartGame() {
  loadBoard();
  modalContainerWin.classList.remove('active');
  modalContainerLose.classList.remove('active');
  modalOverlay.classList.remove('active');
}

introduction.addEventListener('click', () => {
  introduction.classList.remove('active');
});

boardGrid.addEventListener('click', e => {
  if (!e.target.matches('[data-board-tile-status]')) return;
  const tile = board.flat().find(t => t.element === e.target);
  if (tile) {
    openTile(tile, board, true);
    renderMineNumber();
    renderEnd(checkForWinOrLoss(board, BOARD_SIZE, MINE_NUMBER));
  }
});

boardGrid.addEventListener('contextmenu', e => {
  if (!e.target.matches('[data-board-tile-status]')) return;
  e.preventDefault();
  const tile = board.flat().find(t => t.element === e.target);
  if (tile) {
    markTile(tile);
    renderMineNumber();
  }
});

document.addEventListener('click', e => {
  if (!e.target.matches('[data-modal-button]')) return;
  restartGame();
});
