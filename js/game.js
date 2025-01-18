import { board, createBoard, addMines, countAdjacentMines, minesLocation, revealTile, revealMines } from './board.js';

const levels = {
    beginner: { size: 9, mines: 10 },
    intermediate: { size: 16, mines: 40 },
    advanced: { size: 30, mines: 99 },
};

export const boardElement = document.getElementById('game-board');
const startGameBtn = document.getElementById('start-game');
const restartGameBtns = document.querySelectorAll(".restart-game");
const levelSelector = document.getElementById("level-selector");
const gameInfo = document.getElementById("game-info");
const instructions = document.getElementById("instructions");
const gameOverElement = document.getElementById("game-over");
const scoreElement = document.getElementById("score");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");
const winSound = new Audio("/sounds/win.mp3");
const mineSound = new Audio("/sounds/mine.mp3");

let isGameOver;
let currentView = 'instructions'; // 'level', 'instructions', 'game', 'game-over'
let score;
export let levelConfig;

export function initialize() {
    isGameOver = false;
    minesLocation.splice(0, minesLocation.length)
    if (levelConfig) {
        createBoard();
        addMines();
        countAdjacentMines();
        updateScore(true);
    }
    render();
}

// Update the DOM to display the current state of the board
export function render() {
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
            boardElement.style.display = 'grid';
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
}

export function checkWinCondition() {
    const revealedTiles = document.querySelectorAll(".tile[revealed]").length;
    const totalTiles = levelConfig.size ** 2;
    const tilesWithoutMines = totalTiles - levelConfig.mines;
    if (tilesWithoutMines === revealedTiles) {
        isGameOver = true;
        setTimeout(() => displayGameOver(true), 2000);
    }
}

export function updateScore(reset = false) {
    reset ? score = 0 : score++;
    scoreElement.textContent = `Score: ${score}`;
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

export function handleLevelSelection(event) {
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

export function handleTileClick(event) {
    const clickedTile = event.target;
    if (clickedTile.id === "game-board") return;
    let { row, col } = clickedTile.dataset;
    row = +row
    col = +col

    if (!isGameOver) {
        if (board[row][col] === '*') {
            isGameOver = true;
            setTimeout(() => displayGameOver(false), 2000);
            clickedTile.classList.add("mine");
            mineSound.play();
            setTimeout(revealMines, 500);
        }
        else
            revealTile(row, col);
    }
}

levelSelector.addEventListener("click", handleLevelSelection);
boardElement.addEventListener("click", handleTileClick);
startGameBtn.addEventListener("click", () => {
    currentView = "level";
    initialize();
});
restartGameBtns.forEach(btn => btn.addEventListener("click", initialize));

initialize();