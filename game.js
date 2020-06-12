import { SNAKE_SPEED, update as updateSnake, draw as drawSnake } from './snake.js';

import { update as updateFood, draw as drawFood } from './food.js';

// export let gameOver = false;
let paused = true;
const gameBoard = document.getElementById('game-board');
export const overlay = document.getElementById('overlay');

let lastRenderTime = 0;

function main(currentTime) {
	if (paused) return;
	requestAnimationFrame(main);
	const deltaTime = (currentTime - lastRenderTime) / 1000;
	if (deltaTime < 1 / SNAKE_SPEED) return;
	lastRenderTime = currentTime;
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
