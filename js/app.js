/*-------------- Constants -------------*/

const levels = {
    beginner: { size: 9, mines: 10 },
    intermediate: { size: 16, mines: 40 },
    advanced: { size: 30, mines: 99 },
};
const adjacentPositions = [[-1, -1], [-1, 0], [-1, 1],
                            [0, -1],           [0, 1],
                            [1, -1],  [1, 0],  [1, 1]];

/*---------- Variables (state) ---------*/

let isGameOver; // Boolean 
let currentView = 'instructions'; // 'level', 'instructions', 'game', 'game-over'
let levelConfig;
let board; //  array representing the game board
let score; // Keeps track of revealed empty cells
let minesLocation = []; // 2D Array containing the indexes of the mines' locations

/*----- Cached Element References  -----*/

const gameInfo = document.getElementById("game-info");
const startGameBtn = document.getElementById('start-game');
const instructions = document.getElementById("instructions");
const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById("score");
const resetBtns = document.querySelectorAll(".reset-game");
const gameOverElement = document.getElementById("game-over");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");
const levelSelector = document.getElementById("level-selector");
const revealSound = new Audio("/sounds/pop.mp3");
const mineSound = new Audio("/sounds/mine.mp3");
const winSound = new Audio("/sounds/win.mp3");

/*-------------- Functions -------------*/

function initialize() {
    isGameOver = false;
    minesLocation = [];
    score = 0;
    if (levelConfig) {
        createBoard();
        addMines();
        countAdjacentMines();
        updateScore();
    }
    render();
}

function render() {
    switch (currentView) {
        case 'level':
            levelSelector.style.display = 'flex';
            gameInfo.style.display = 'none';
            instructions.style.display = 'none';
            boardElement.style.display = 'none';
            gameOverElement.style.display = 'none';
            break;
        case 'instructions':
            levelSelector.style.display = 'none';
            gameInfo.style.display = 'none';
            instructions.style.display = 'flex';
            boardElement.style.display = 'none';
            gameOverElement.style.display = 'none';
            break;
        case 'game':
            levelSelector.style.display = 'none';
            gameInfo.style.display = 'flex';
            instructions.style.display = 'none';
            boardElement.style.display = 'block';
            gameOverElement.style.display = 'none';
            break;
        case 'game-over':
            levelSelector.style.display = 'none';
            gameInfo.style.display = 'none';
            instructions.style.display = 'none';
            boardElement.style.display = 'none';
            gameOverElement.style.display = 'flex';
            break;
    }
} // Update the DOM to display the current state of the board/
function createBoard() {

    boardElement.innerHTML = '';

    board = new Array(levelConfig.size).fill();
    board = board.map(() => new Array(levelConfig.size).fill(''));

    for (let rowIndex = 0; rowIndex < levelConfig.size; rowIndex++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.style.height = `calc(100% / ${levelConfig.size})`;

        for (let colIndex = 0; colIndex < levelConfig.size; colIndex++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `${rowIndex}-${colIndex}`
            rowDiv.appendChild(tile);
        }
        boardElement.appendChild(rowDiv);
    }
}

// Randomly place mines on the board and saves their locations in minesLocation
function addMines() {
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
function countAdjacentMines() {
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

function handleLevelSelection(event) {
    switch (event.target.id) {
        case 'beginner':
            levelConfig = levels.beginner;
            break;
        case 'intermediate':
            levelConfig = levels.intermediate;
            break;
        case 'advanced':
            levelConfig = levels.advanced;
            break;
        default:
            return;
    }
    currentView = 'game';
    initialize();
}

function handleTileClick(event) {
    const clickedTile = event.target;
    if (clickedTile.id !== "game-board") {
        const [row, col] = clickedTile.id.split('-').map(Number);

        if (!isGameOver) {
            if (board[row][col] === '*') {
                isGameOver = true;
                setTimeout(() => displayGameOver(false), 2000);
                revealMines();
            }
            else
                revealTile(row, col);
        }
    }
}

function revealTile(row, col) {
    console
    if (row < 0 || row >= levelConfig.size ||
        col < 0 || col >= levelConfig.size)
        return;

    const tile = document.getElementById(`${row}-${col}`);
    if (tile.hasAttribute("revealed"))
        return;

    score++;
    updateScore();
    revealSound.play()
    if (board[row][col] && board[row][col] !== '*') {
        tile.textContent = board[row][col];
        tile.style.backgroundColor = getTileColor(board[row][col]);
    }
    else
        tile.style.backgroundColor = "darkgray";
    tile.setAttribute("revealed", '');
    checkWinCondition();

    if (board[row][col] === '') {
        for (let posToReveal of adjacentPositions)
            revealTile(row + posToReveal[0], col + posToReveal[1]);
    }
}

function revealMines() {
    for (let posToReveal of minesLocation) {
        let tile = document.getElementById(`${posToReveal[0]}-${posToReveal[1]}`);
        tile.classList.add("mine");
    }
    mineSound.play();
}

function updateScore() {
    scoreElement.textContent = `Score ${score}`;
}

function getTileColor(minesCount) {
    const colors = {
        1: 'blue',
        2: 'green',
        3: 'red',
        4: 'purple',
        5: 'maroon',
        6: 'turquoise',
        7: 'black',
        8: 'gray'
    };
    return colors[minesCount];
}

function checkWinCondition() {
    const revealedTiles = document.querySelectorAll(".tile[revealed]").length;
    const totalTiles = levelConfig.size ** 2;
    const tilesWithoutMines = totalTiles - levelConfig.mines;
    if (tilesWithoutMines === revealedTiles) {
        isGameOver = true;
        setTimeout(() => displayGameOver(true), 2000);
    }

}
function displayGameOver(playerHasWon) {
    gameInfo.style.display = "none";
    boardElement.style.display = "none";
    gameOverElement.style.display = "flex";
    gameOverElement.style.flexDirection = "column";
    gameOverElement.style.justifyContent = "space-evenly";
    gameOverElement.style.alignContent = "center";
    if (playerHasWon) {
        winSound.play();
        gameOverMessage.textContent = "YOU WIN!";
    }
    else
        gameOverMessage.textContent = "YOU LOSE!";
    finalScore.textContent = "Your score is " + score;
}

initialize();

// /*----------- Event Listeners ----------*/

startGameBtn.addEventListener("click", () => {
    currentView = "level";
    initialize();
});

levelSelector.addEventListener("click", handleLevelSelection);
boardElement.addEventListener("click", handleTileClick);
resetBtns.forEach(btn => btn.addEventListener("click", initialize));
