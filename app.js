"use strict";

// 0|1|2
// 3|4|5
// 6|7|8

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
];
function findWinner(board) {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return null;
}
function isBoardFull(board) {
    return board.every((cell) => cell !== null);
}
function otherPlayer(player) {
    return player === "X" ? "O" : "X";
}



const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("new-game");
const resetScoreBtn = document.getElementById("reset-score");
const scoreEls = {
    X: document.getElementById("score-x"),
    O: document.getElementById("score-o"),
    draws: document.getElementById("score-draws"),
};
let board = Array(9).fill(null);
let current = "X";
let gameOver = false;
let startingPlayer = "X"; 
const scores = { X: 0, O: 0, draws: 0 };


const cellEls = [];
for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.addEventListener("click", () => play(i));
    boardEl.appendChild(btn);
    cellEls.push(btn);
}

function play(index) {
    if (gameOver || board[index] !== null)
        return;
    board[index] = current;
    const result = findWinner(board);
    if (result) {
        gameOver = true;
        scores[result.winner]++;
        result.line.forEach((i) => cellEls[i].classList.add("win"));
        statusEl.textContent = `${result.winner} wins!`;
    }
    else if (isBoardFull(board)) {
        gameOver = true;
        scores.draws++;
        statusEl.textContent = "It's a draw!";
    }
    else {
        current = otherPlayer(current);
        statusEl.textContent = `${current}'s turn`;
    }
    draw();
}
function draw() {
    cellEls.forEach((btn, i) => {
        const value = board[i];
        btn.textContent = value ?? "";
        btn.className = "cell" + (value ? ` ${value.toLowerCase()}` : "") + (btn.classList.contains("win") ? " win" : "");
        btn.disabled = gameOver || value !== null;
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        btn.setAttribute("aria-label", `Row ${row}, column ${col}, ${value ?? "empty"}`);
    });
    scoreEls.X.textContent = String(scores.X);
    scoreEls.O.textContent = String(scores.O);
    scoreEls.draws.textContent = String(scores.draws);
}
function newGame() {
    board = Array(9).fill(null);
    gameOver = false;
    startingPlayer = otherPlayer(startingPlayer);
    current = startingPlayer;
    cellEls.forEach((btn) => btn.classList.remove("win"));
    statusEl.textContent = `${current}'s turn`;
    draw();
}
newGameBtn.addEventListener("click", newGame);
resetScoreBtn.addEventListener("click", () => {
    scores.X = scores.O = scores.draws = 0;
    startingPlayer = "O"; 
    newGame();
});
statusEl.textContent = `${current}'s turn`;
draw();
