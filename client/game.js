let HOST = 'ws://localhost:9090';
export const ws = new WebSocket(HOST);
const nameInput = document.getElementById('name-input');
const gameIdInput = document.getElementById('game-id-input');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const spaceBar = document.getElementById('space-bar');

let clientId = null;
let gameId = null;
let playerName = null;
let playerNum = null;

ws.onopen = (e) => console.log('connected to server');

ws.onmessage = (msg) => {
	const response = JSON.parse(msg.data);
	// console.log(response);

	if (response.method === 'connect') {
		clientId = response.clientId;
		console.log(`client ${clientId} successfully added`);
	} else if (response.method === 'create') {
		console.log('server sent a message: ', response);
		gameId = response.game.id;
		gameIdInput.value = gameId;
		//this should implicitly 'join' the creator
		//generate a time out
	} else if (response.method === 'join') {
		console.log('server sent a message: ', response);
	} else if (response.method === 'play') {
	} else if (response.method === 'error') {
		console.log('There was an error!', response.msg);
	}
};

createBtn.addEventListener('click', () => {
	const payload = {
		method: 'create',
		clientId
	};
	ws.send(JSON.stringify(payload));
});

joinBtn.addEventListener('click', () => {
	gameId = gameIdInput.value;
	playerName = nameInput.value;

	if (!gameId) {
		return console.log('Please enter a game ID');
	}

	const payload = {
		method: 'join',
		clientId,
		gameId,
		playerName
	};
	ws.send(JSON.stringify(payload));
});

ws.onclose = (e) => console.log('disconnected from server');
ws.onerror = (e) => console.log('Oop! ', e);

//game logic=====================

import { SPEED, update as updateSnake, draw as drawSnake } from './snake.js';

import { update as updateFood, draw as drawFood } from './food.js';

//elements from the start screen

//ignore this during development
export const overlay = document.getElementById('overlay');

let paused = true;

//in game elements
const gameBoard = document.getElementById('game-board');

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
