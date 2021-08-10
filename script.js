//ui
import { TILE_STATUSES, createBoard, markTile, revealTile, checkLose, checkWin } from "./minesweeper.js";

let win, lose = false;
let BOARD_SIZE = 10;
let NUMBER_OF_MINES = 10;
let board, boardElement, minesLeftText, messageText, markedTileCount;
setupGame(BOARD_SIZE, NUMBER_OF_MINES);

let startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', () => {
    startGame();
})

export function startGame() {
    BOARD_SIZE = document.getElementById('numCells').value;
    NUMBER_OF_MINES = document.getElementById('numMines').value;
    board = [];
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }
    boardElement.removeEventListener("click", stopProp, true);
    boardElement.removeEventListener("contextmenu", stopProp, true);
    win = false;
    lose = false;
    messageText.innerHTML = 'Mines Left: <span data-mine-count></span>';
    markedTileCount = 0;
    setupGame(BOARD_SIZE, NUMBER_OF_MINES)
}

function setupGame(BOARD_SIZE, NUMBER_OF_MINES) {
    board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
    boardElement = document.querySelector('.board');
    minesLeftText = document.querySelector("[data-mine-count]");
    messageText = document.querySelector(".subtext");

    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element);
            tile.element.addEventListener('click', () => {
                revealTile(board, tile);
                checkGameEnd();
            })
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault();
                markTile(tile);
                listMinesLeft();
            })
        })
    })
    boardElement.style.setProperty('--size', BOARD_SIZE);
    minesLeftText.textContent = NUMBER_OF_MINES;
}
function listMinesLeft() {
    markedTileCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0)
    minesLeftText.textContent = NUMBER_OF_MINES - markedTileCount;
}

function checkGameEnd() {
    win = checkWin(board);
    lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if (win) {
        messageText.textContent = 'You Win';
    }
    if (lose) {
        messageText.textContent = 'You Lose';
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) revealTile(board, tile);
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}