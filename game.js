import { SPEED, update as updateSnake, draw as drawSnake } from './snake.js';

import { update as updateFood, draw as drawFood } from './food.js';

let paused = true;
const gameBoard = document.getElementById('game-board');
export const overlay = document.getElementById('overlay');
// export const crashScreen = document.getElementById('crash-screen');
export let numPlayers = 2;
let lastRender = 0;

function main(currentTime) {
	if (paused) return;
	requestAnimationFrame(main);
	const delta = (currentTime - lastRender) / 1000;
	if (delta < 1 / SPEED) return;
	lastRender = currentTime;
	update();
	draw();
}

export function start() {
	paused = !paused;
	requestAnimationFrame(main);

	if (paused) {
		overlay.style.display = 'block';
	} else {
		overlay.style.display = 'none';
	}
}

function update() {
	updateFood();
	updateSnake();
}

function draw() {
	gameBoard.innerHTML = '';
	drawFood(gameBoard);
	drawSnake(gameBoard);
}
