let HOST = 'ws://localhost:9090';
export const ws = new WebSocket(HOST);
import { SPEED, update as updateSnake, draw as drawSnake } from './snake.js';
import { update as updateFood, draw as drawFood, food } from './food.js';
import { directions, lastInputs } from './input.js';

const nameInput = document.getElementById('name-input');
const gameIdInput = document.getElementById('game-id-input');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const landingScreen = document.getElementById('landing');
// const spaceBar = document.getElementById('space-bar');
const waitScreen = document.getElementById('wait-screen');
const waitMessageSpan = document.getElementById('wait-message-span');
const gameIdSpan = document.getElementById('game-id-span');
// const cancelBtn = document.getElementById('cancel-btn');
// export const overlay = document.getElementById('overlay');
// main game element
const gameBoard = document.getElementById('game-board');

export let foodPosition = {};

export let clientId = null;
export let gameId = null;
export let playerName = null;
export let playerNum = null;
let gameStatus = '';

ws.onopen = (e) => console.log('connected to server');

ws.onmessage = (msg) => {
	const response = JSON.parse(msg.data);

	if (response.method === 'connect') {
		clientId = response.clientId;
		console.log(`client ${clientId} successfully added`);
	} else if (response.method === 'create') {
		console.log('server sent a message: ', response);
		gameId = response.game.id;
		gameIdInput.value = gameId;

		gameIdSpan.innerText = gameId;
		landingScreen.style.zIndex = -1;
		waitScreen.style.zIndex = 4;
		console.log('gameId: ', gameId);
		playerNum = 1;
		//this should implicitly 'join' the creator
		//generate a time out
	} else if (response.method === 'join') {
		console.log('server sent a message: player joined!', response);
		console.log('num of players: ', response.game.clients.length);
		const numPlayers = response.game.clients.length;

		const me = response.game.clients.find((client) => client.clientId === clientId);
		console.log('my number: ', me.playerNum);
		// foodPosition = { ...response.position };
		// console.log(foodPosition);

		food.x = response.newPosition.x;
		food.y = response.newPosition.y;

		// console.log('new food position set on join: ', food);
		if (numPlayers === 2) {
			gameId = response.game.id;
			gameIdSpan.innerText = gameId;
			landingScreen.style.zIndex = -1;
			waitScreen.style.zIndex = 4;

			waitMessageSpan.innerText = 'GAME STARTING ... ';

			console.log('food position is: ', foodPosition);
			//set interval stuff
			// let prevId;
			let time = 3;
			let id = setInterval(() => {
				waitMessageSpan.innerText = `STARTING IN ${time--}`;
				if (time < 0) {
					clearInterval(id);
					waitMessageSpan.innerText = 'PAUSED';
					start();
				}
			}, 200);

			// setTimeout(() => {
			// 	start();
			// }, 3000);
		}
	} else if (response.method === 'play') {
	} else if (response.method === 'consume') {
		// console.log('consume message: ', response.newPosition);
		// foodPosition = { ...response.newPosition };
		// food = { ...response.newPosition };
		food.x = response.newPosition.x;
		food.y = response.newPosition.y;
		console.log('Somebody scored! ', response.game.clients);
		// update();
		// drawFood(gameBoard);
	} else if (response.method === 'move') {
		// console.log('opponent moved: ', response);
	} else if (response.method === 'error') {
		console.log('There was an error!', response.msg);
	}
};

createBtn.addEventListener('click', () => {
	playerName = nameInput.value;
	const payload = {
		method: 'create',
		clientId,
		playerName
	};
	ws.send(JSON.stringify(payload));
});

joinBtn.addEventListener('click', () => {
	gameId = gameIdInput.value;
	playerName = nameInput.value;

	if (!gameId) {
		return console.log('Please enter a game ID');
	} else {
		joinBtn.disabled = true;
	}

	const payload = {
		method: 'join',
		clientId,
		gameId,
		playerName
	};
	ws.send(JSON.stringify(payload));
});

// cancelBtn.addEventListener('click', () => {
// });
export function backToLanding() {
	landingScreen.style.zIndex = 4;
	waitScreen.style.zIndex = -1;
}

ws.onclose = (e) => console.log('disconnected from server');
ws.onerror = (e) => console.log('Oop! ', e);

//game logic=====================

//elements from the start screen

//ignore this during development

let paused = true;

//in game elements

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

// export function start() {
// 	paused = !paused;
// 	requestAnimationFrame(main);
// 	// overlay.style.display = 'none';

// 	if (paused) {
// 		overlay.style.display = 'block';
// 	} else {
// 		overlay.style.display = 'none';
// 	}
// }
export function start(gameOver = false) {
	paused = !paused;
	requestAnimationFrame(main);

	if (!gameOver) {
		// overlay.style.display = 'none';
		if (paused) {
			landingScreen.style.zIndex = 1;
			gameBoard.style.zIndex = 2;
			waitScreen.style.zIndex = 3;
		} else {
			landingScreen.style.zIndex = 2;
			waitScreen.style.zIndex = 1;
			gameBoard.style.zIndex = 3;
		}
	} else {
		landingScreen.style.zIndex = 3;
		gameBoard.style.zIndex = 2;
		waitScreen.style.zIndex = 1;
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
