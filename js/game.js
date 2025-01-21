import { board, createBoard, addMines, countAdjacentMines, minesLocation, revealTile, revealMines, relocateMine } from './board.js';

const levels = {
    beginner: { level: 'beginner', size: 9, mines: 10 },
    intermediate: { level: 'intermediate', size: 16, mines: 40 },
    advanced: { level: 'advanced', size: 30, mines: 99 },
};

export const boardElement = document.getElementById('game-board');
const startGameBtn = document.getElementById('start-game');
const restartGameBtns = document.querySelectorAll(".restart-game");
const pauseBtn = document.getElementById('pause-toggle');
const themeBtn = document.getElementById('theme-toggle');
const timer = document.getElementById('timer');
const highScore = document.getElementById('high-score');
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
let isFirstMove;
let isPaused;
let time;
let timerInterval;
export let levelConfig;

export function initialize() {
    isGameOver = false;
    isFirstMove = true;
    isPaused = false;
    minesLocation.splice(0, minesLocation.length);
    time = 0;
    timer.textContent = 'Time: 0 s';
    stopTimer();
    boardElement.classList.remove('disabled');
    pauseBtn.classList.remove('disabled');
    if (levelConfig) {
        createBoard();
        addMines();
        countAdjacentMines();
        updateScore(true);
        startTimer();
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
            const localHighScore = JSON.parse(localStorage.getItem('highScore'));
            highScore.textContent = `Best: ${localHighScore && levelConfig.level in localHighScore ? `${localHighScore[levelConfig.level]} s` : '--'}`;
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
    const revealedTiles = document.querySelectorAll(".tile[data-revealed]").length;
    const totalTiles = levelConfig.size ** 2;
    const tilesWithoutMines = totalTiles - levelConfig.mines;
    if (tilesWithoutMines === revealedTiles) {
        stopTimer(true);
        isGameOver = true;
        boardElement.classList.add('disabled');
        setTimeout(() => displayGameOver(true), 500);
        return true;
    }
    return false;
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
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    else
        gameOverMessage.textContent = "YOU LOSE!";

    restartGameBtns.forEach(btn => btn.classList.remove('disabled'));
}

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timer.textContent = `Time: ${time} s`;
    }, 1000);
}

function stopTimer(playerHasWon) {
    clearInterval(timerInterval);
    if (!playerHasWon) {
        return;
    }

    isPaused = true;
    let localHighScore = localStorage.getItem('highScore');
    if (localHighScore) {
        localHighScore = JSON.parse(localHighScore);
    }
    else {
        localHighScore = {};
    }
    if (!localHighScore[levelConfig.level] || localHighScore[levelConfig.level] > time) {
        localHighScore[levelConfig.level] = time;
        localStorage.setItem('highScore', JSON.stringify(localHighScore));
        finalScore.textContent = `New High Score! ${time} s`;
    }
    else {
        finalScore.textContent = "Your score is " + score;
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
    if (clickedTile.id === "game-board" || isGameOver) return;
    let { row, col } = clickedTile.dataset;
    row = Number(row);
    col = Number(col);

    if (isFirstMove) {
        isFirstMove = false;
        if (board[row][col] === '*') {
            relocateMine(row, col);
            countAdjacentMines();
            revealTile(row, col);
            return;
        }
    }
    if (board[row][col] === '*') {
        stopTimer(false);
        isGameOver = true;
        finalScore.textContent = "Your score is " + score;
        setTimeout(() => displayGameOver(false), 2000);
        clickedTile.textContent = '';
        clickedTile.classList.add("mine");
        boardElement.classList.add('disabled');
        pauseBtn.classList.add('disabled');
        mineSound.play();
        restartGameBtns.forEach(btn => btn.classList.add('disabled'));
        setTimeout(revealMines, 500);
        return;
    }
    revealTile(row, col);
}

function togglePause(event) {
    isPaused = !isPaused;
    isPaused ? stopTimer() : startTimer();
    boardElement.classList.toggle('disabled');
    restartGameBtns.forEach(btn => btn.classList.toggle('disabled'));
    pauseBtn.textContent = pauseBtn.textContent === 'Pause' ? 'Continue' : 'Pause';
}

function toggleTheme() {
    themeBtn.textContent = themeBtn.textContent === '☀️' ? '🌙' : '☀️'
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

levelSelector.addEventListener("click", handleLevelSelection);
themeBtn.addEventListener('click', toggleTheme);
boardElement.addEventListener("click", handleTileClick);
startGameBtn.addEventListener("click", () => {
    currentView = "level";
    initialize();
});
pauseBtn.addEventListener('click', togglePause);
restartGameBtns.forEach(btn => btn.addEventListener("click", initialize));
boardElement.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (event.target.classList.contains('tile') && !event.target.dataset.revealed) {
        event.target.textContent = event.target.textContent === '🚩' ? '' : '🚩';
    }
})

if (localStorage.getItem('theme') === 'dark') toggleTheme();

initialize();