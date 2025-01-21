import { boardElement, checkWinCondition, levelConfig, updateScore } from './game.js';

const revealSound = new Audio("/sounds/pop.mp3");
const adjacentPositions = [[-1, -1], [-1, 0], [-1, 1],
                            [0, -1],          [0, 1],
                            [1, -1], [1, 0],  [1, 1]];
export let minesLocation = []; // 2D Array containing the indexes of the mines' locations
export let board; //  array representing the game board

export function createBoard() {
    boardElement.innerHTML = '';
    boardElement.style.setProperty('--board-size', levelConfig.size)

    board = new Array(levelConfig.size).fill().map(() => new Array(levelConfig.size).fill(''));

    for (let rowIndex = 0; rowIndex < levelConfig.size; rowIndex++) {
        for (let colIndex = 0; colIndex < levelConfig.size; colIndex++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.row = rowIndex;
            tile.dataset.col = colIndex;
            tile.id = `${rowIndex}-${colIndex}`
            boardElement.appendChild(tile);
        }
    }
}

// Randomly place mines on the board and saves their locations in minesLocation
export function addMines() {
    let row;
    let column;
    while (minesLocation.length < levelConfig.mines) {
        row = Math.floor(Math.random() * levelConfig.size);
        column = Math.floor(Math.random() * levelConfig.size);
        if (board[row][column] !== '*') {
            minesLocation.push([row, column]);
            board[row][column] = '*';
        }
    }
}

// Calculate the number of adjacent mines for the given cell and update the cell value    
export function countAdjacentMines() {
    for (let i = 0; i < levelConfig.size; i++) {
        for (let j = 0; j < levelConfig.size; j++) {
            if (board[i][j] == '*') continue;
            let mineCount = 0;
            for (let posToCheck of adjacentPositions) {
                const rowToCheck = i + posToCheck[0];
                const colToCheck = j + posToCheck[1];
                if (rowToCheck < 0 || rowToCheck >= levelConfig.size ||
                    colToCheck < 0 || colToCheck >= levelConfig.size)
                    continue;
                if (board[rowToCheck][colToCheck] === '*')
                    mineCount++;
            }
            if (mineCount)
                board[i][j] = mineCount;
        }
    }
}

export function revealTile(row, col) {
    if (row < 0 || row >= levelConfig.size ||
        col < 0 || col >= levelConfig.size)
        return;

    const tile = document.getElementById(`${row}-${col}`);
    if (tile.dataset.revealed)
        return;

    updateScore();
    revealSound.play()
    tile.textContent = board[row][col];
    tile.classList.add(`bg-color-${board[row][col] || 0}`);
    tile.dataset.revealed = 'true';

    if (!checkWinCondition() && board[row][col] === '') {
        for (let posToReveal of adjacentPositions)
            revealTile(row + posToReveal[0], col + posToReveal[1]);
    }
}

export function revealMines() {
    for (let posToReveal of minesLocation) {
        let tile = document.getElementById(`${posToReveal[0]}-${posToReveal[1]}`);
        tile.textContent = '';
        tile.dataset.revealed = 'true'
        tile.classList.add("mine");
    }
}

export function relocateMine(row, col) {
    while (board[row][col] === '*') {
        board[row][col] = '';
        minesLocation.splice(minesLocation.findIndex(mine => mine[0] === row && mine[1] === col), 1);
        addMines();
    }
}