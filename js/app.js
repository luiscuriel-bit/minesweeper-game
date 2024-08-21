/*-------------- Constants -------------*/

const board = []; //  array representing the game board
const minesLocation = []; // 2D Array containing the indexes of the mines' locations
const SIZE = 9;
let level; // Difficulty level chosen by the user
let numMines; // Number of mines based on the level of difficulty
let score = 0; // Keeps track of revealed empty cells

/*---------- Variables (state) ---------*/

let isGameOver = false; // Boolean 

/*----- Cached Element References  -----*/

const boardElement = document.getElementById('game-board');

/*-------------- Functions -------------*/

function initialize() {
    createBoard();
    render();
}

function createBoard() {
    boardElement.innerHTML = '';

    for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.style.height = `calc(100% / ${SIZE})`;

        for (let colIndex = 0; colIndex < SIZE; colIndex++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            rowDiv.appendChild(tile);
        }
        boardElement.appendChild(rowDiv);
    }
}

function addMines() { }     // Randomly place mines on the board and save their locations in minesLocation
function countAdjacentMines() { }   // Calculate the number of adjacent mines for the given cell and update the cell value    
function render() { } // Update the DOM to display the current state of the board

initialize();

// /*----------- Event Listeners ----------*/

