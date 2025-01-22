# minesweeper-game
A simple implementation of the classic Minesweeper game using HTML, CSS, and JavaScript. This project includes basic game logic, recursive cell revealing, and dynamic board generation.

![Screenshot](/images/Screenshot.png) <!-- Replace with the path to your screenshot or logo -->

## Description

Minesweeper is a classic game where the objective is to reveal all cells on a board without triggering hidden mines. The game offers three difficulty levels: **Beginner**, **Intermediate**, and **Advanced**. As you reveal cells, the number in each cell indicates the number of adjacent mines. Clicking on a mine ends the game, and all mines are revealed.


### Background Information

This project was created to practice skills in JavaScript, HTML, and CSS, and to learn about creating interactive web-based games. The Minesweeper game was chosen for its simplicity and as a great exercise to apply programming logic and interface design.

## Getting Started

You can play Minesweeper at the following deployed link: [Play Minesweeper](https://luiscuriel-bit.github.io/minesweeper-game/)

### Clone the repository:

   ```bash
   git clone https://github.com/luiscuriel-bit/minesweeper-game
   ```

## How to Play

1. Click on a cell to reveal its content.  
2. If you click on a mine, the game ends, and all mines are revealed.  
3. The number in each cell indicates the number of adjacent mines.  
4. To mark a cell as a potential mine, **right-click** on it to place a flag.  
5. You can use a **hint feature** to reveal a safe cell after making a few moves.  
6. If you reveal all cells without mines, you win! 🎉  

## Technologies Used
+ **JavaScript:** For game logic and DOM interaction.
+ **HTML:** For game structure and user interface.
+ **CSS:** For game design and styling.

## Features

- **Dynamic Board Generation:** Boards are generated based on selected difficulty.  
- **Recursive Cell Revealing:** Adjacent empty cells are automatically revealed.  
- **Flagging System:** Mark cells as potential mines with a right-click.  
- **Hint Mechanism:** Reveal a safe cell after making a few moves.  
- **Sound Effects:** Includes sounds for actions like revealing cells, flagging, and game over.  
- **Confetti Animation:** Celebrate your victory with a confetti animation!  
- **Difficulty Levels:** Choose between Beginner, Intermediate, and Advanced.  

## Credits

- **Confetti Animation:** Powered by the [canvas-confetti library](https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js).  
- **Flag Sound:** Sourced from [freesound.org](https://freesound.org/people/sora955/sounds/231321/).  
- **Game Sounds:** Sourced from [OpenGameArt.org](https://opengameart.org/content/win-and-lose-melodies) and [OpenGameArt.org](https://opengameart.org/content/puzzle-games-music).