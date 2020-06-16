let HOST = 'ws://localhost:9090';
const ws = new WebSocket(HOST);

ws.onopen = (e) => console.log('connected to server');
ws.onclose = (e) => console.log('disconnected from server');
ws.onerror = (e) => console.log('Oop! ', e);

import { SPEED, update as updateSnake, draw as drawSnake } from './snake.js';

import { update as updateFood, draw as drawFood } from './food.js';

// export var numPlayers = 2;

let paused = true;
const gameBoard = document.getElementById('game-board');
export const overlay = document.getElementById('overlay');
// export const crashScreen = document.getElementById('crash-screen');
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
	// overlay.style.display = 'none';

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
