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
let board; //  array representing the game board
let score; // Keeps track of revealed empty cells
let minesLocation = []; // 2D Array containing the indexes of the mines' locations
let levelConfig = levels.intermediate; // Difficulty level chosen by the user

/*----- Cached Element References  -----*/

const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById("score");

/*-------------- Functions -------------*/

function initialize() {
    isGameOver = false;
    minesLocation = [];
    score = 0;
    createBoard();
    addMines();
    countAdjacentMines();
    updateScore();
    render();
}

function render() { } // Update the DOM to display the current state of the board

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

function handleTileClick(event) {
    const clickedTile = event.target;
    const [row, col] = clickedTile.id.split('-').map(Number);

    if (!isGameOver) {
        if (board[row][col] === '*') {
            isGameOver = true;
            revealMines();
        }
        else
            revealTile(row, col);
    }
}

function revealTile(row, col) {
    if (row < 0 || row >= levelConfig.size ||
        col < 0 || col >= levelConfig.size)
        return;

    const tile = document.getElementById(`${row}-${col}`);
    if (tile.classList.contains("revealed"))
        return;

    score++;
    updateScore();
    tile.classList.add("revealed");
    tile.textContent = board[row][col];

    if (board[row][col] === '') {
        for (let posToReveal of adjacentPositions)
            revealTile(row + posToReveal[0], col + posToReveal[1]);
    }
}

function revealMines() {
    for (let posToReveal of minesLocation) {
        let tile = document.getElementById(`${posToReveal[0]}-${posToReveal[1]}`);
        tile.textContent = '*';
        tile.classList.add("mine");
    }
}

function updateScore(){
    scoreElement.textContent = score;
}

function checkWinCondition(){
    const revealedTiles = document.querySelectorAll(".tile.revealed").length();
    const totalTiles = levelConfig.size**2;
    tilesWithoutMinesMines = totalTiles - revealedTiles;
    if (tilesWithoutMinesMines == minesLocation.length)
        console.log("Ganaste")
    
}

initialize();

// /*----------- Event Listeners ----------*/

boardElement.addEventListener("click", handleTileClick);
document.getElementById("reset").addEventListener("click", ()=>{
    initialize();

})
