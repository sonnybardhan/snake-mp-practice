let HOST = 'ws://localhost:9090';
export const ws = new WebSocket(HOST);
import { SPEED, update as updateSnake, draw as drawSnake, snakes, reset, setSPEED } from './snake.js';
// import { SPEED, newUpdate as updateSnake, draw as drawSnake, snakes, reset } from './snake.js';
import { update as updateFood, draw as drawFood, food, lastConsumer } from './food.js';
import { directions, numPlayers } from './input.js';

export const nameInput = document.getElementById('name-input');
export const gameIdInput = document.getElementById('game-id-input');
export const createBtn = document.getElementById('create-btn');
export const joinBtn = document.getElementById('join-btn');
const landingScreen = document.getElementById('landing');
// const spaceBar = document.getElementById('space-bar');
const waitScreen = document.getElementById('wait-screen');
const waitMessageSpan = document.getElementById('wait-message-span');
const gameIdSpan = document.getElementById('game-id-span');
const escapeMessageSpan = document.getElementById('escape-message-span');
export const speedInput = document.getElementById('speed-input');
export const playerCountInput = document.getElementById('player-count-input');
// const cancelBtn = document.getElementById('cancel-btn');
// export const overlay = document.getElementById('overlay');
const gameBoard = document.getElementById('game-board');

export let foodPosition = {};

export let clientId = null;
export let gameId = null;
// export let playerName = null;
export let playerNum = 1;
export let playerIndex = 0;
export let playerSpeedInput = 10;

export function setPlayerIndex(value) {
	playerIndex = value;
}
//stop, wait, starting, play, pause, gameOver

speedInput.addEventListener('change', (e) => {
	playerSpeedInput = e.target.value * 2;
	setSPEED(playerSpeedInput);
	// console.log('playerSpeedInput changed: ', playerSpeedInput);
});

export let game = { status: 'landing', mode: 'single' };
// export let inPlay = false;

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

		// gameIdSpan.innerText = gameId;
		// landingScreen.style.zIndex = -1;
		// waitScreen.style.zIndex = 4;

		waitingScreen('WAITING FOR OPPONENTS ... ', gameId, '[ESC] to quit');
		// console.log('gameId: ', gameId);
		console.log('Creators player index and num set', playerIndex, playerNum);
		playerNum = 1;
		playerIndex = 0;
		//generate a time out
	} else if (response.method === 'join') {
		// console.log('server sent a message: player joined!', response);
		// console.log('num of players: ', response.game.clients.length);

		// const numPlayers = response.game.clients.length;
		numPlayers.count = response.game.clients.length;
		console.log('resetting numplayers.count on join: ', numPlayers.count);

		console.log('num of players post join: ', numPlayers.count);

		// populateSnakeArray();
		// console.log('re-populating snake array on rejoin: ', snakes);

		// if (!playerNum) {
		const me = response.game.clients.find((client) => client.clientId === clientId);
		playerNum = me.playerNum;
		playerIndex = playerNum - 1;
		// console.log('joiners player index and num set', playerIndex, playerNum);
		// }

		food.x = response.newPosition.x;
		food.y = response.newPosition.y;

		console.log('creator has set speed to: ', response.game.speed);
		setSPEED(response.game.speed);
		// if (numPlayers.count === 2) { to make it dynamic set 2 to input value by creator
		// if (response.game.clients.length === numPlayers.count) {
		if (response.game.clients.length === 2) {
			//starts the moment there are 2 players

			gameId = response.game.id;

			waitingScreen('GAME STARTING ... ', gameId, '[ESC] to quit');

			let time = 3;
			let id = setInterval(() => {
				// waitMessageSpan.innerText = `STARTING IN ${time--}`;
				waitingScreen(`STARTING IN ${time--}`, '', '[ESC] to quit');

				if (time < 0) {
					clearInterval(id);
					// waitMessageSpan.innerText = 'PAUSED';
					// waitingScreen();
					playScreen();
					start();
				}
			}, 200);
			// let id = setInterval(() => {
			// 	waitMessageSpan.innerText = `STARTING IN ${time--}`;
			// 	// waitMessageSpan()

			// 	if (time < 0) {
			// 		clearInterval(id);
			// 		waitMessageSpan.innerText = 'PAUSED';
			// 		start();
			// 	}
			// }, 200);
		}
	} else if (response.method === 'play') {
	} else if (response.method === 'consume') {
		food.x = response.newPosition.x;
		food.y = response.newPosition.y;
		lastConsumer.id = response.lastConsumer.id;
		// const test = 'player ' + response.lastConsumer;

		// const opponentIndex = response.lastConsumer.id;
		// const oppSnake = snakes[opponentIndex];
		// const newSnake = response.snake;
		// for (let i = 0; i < newSnake.length; i++) {
		// 	oppSnake[i] = { ...newSnake[i] };
		// }
		// console.log('re-laid opp snake on consume: ', oppSnake);
		// console.log(`last consumer: ${response.lastConsumer.id}`);
	} else if (response.method === 'move') {
		// console.log('opponent moved: ', response);

		// console.log('oppnent last inputs: ', response.lastInput);

		const opponentIndex = response.playerIndex;

		directions[opponentIndex].x = response.direction.x;
		directions[opponentIndex].y = response.direction.y;

		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;
		for (let i = 0; i < newSnake.length; i++) {
			oppSnake[i] = { ...newSnake[i] };
		}
	} else if (response.method === 'grow') {
		const opponentIndex = response.playerIndex;
		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;
		for (let i = 0; i < newSnake.length; i++) {
			oppSnake[i] = { ...newSnake[i] };
		}
		console.log('re-laid opp snake GROW: ', oppSnake);
		console.log(`opponents number: grew -> player-${opponentIndex + 1}`);
	} else if (response.method === 'crash') {
		//display winner
		const opponentIndex = response.playerIndex;
		console.log(`[Opponent] player-${response.playerIndex + 1} crashed`);
		reset();
	} else if (response.method === 'error') {
		console.log('There was an error!', response.msg);
		reset();
	}
};

createBtn.addEventListener('click', () => {
	// playerName = nameInput.value;
	const payload = {
		method: 'create',
		clientId,
		// playerName,
		speed: SPEED
	};
	ws.send(JSON.stringify(payload));
	game.mode = 'multi';
});

joinBtn.addEventListener('click', () => {
	gameId = gameIdInput.value;
	// playerName = nameInput.value;

	if (!gameId) {
		return console.log('Please enter a game ID');
	} else {
		joinBtn.disabled = true;
	}

	const payload = {
		method: 'join',
		clientId,
		gameId
		// playerName
	};
	ws.send(JSON.stringify(payload));
	game.mode = 'multi';
});

// cancelBtn.addEventListener('click', () => {
// });
// export function backToLanding() {
// 	landingScreen.style.zIndex = 4;
// 	waitScreen.style.zIndex = -1;
// }

ws.onclose = (e) => console.log('disconnected from server');
ws.onerror = (e) => console.log('Oops! ', e); //reset everything here for single player

//game logic=====================

// let paused = true;
let lastRender = 0;

function main(currentTime) {
	// if (paused) return;
	if (game.status !== 'play') return;
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

//trial
export function start() {
	switch (game.status) {
		case 'landing':
			game.status = 'play';
			playScreen();
			break;
		case 'stop':
			// stopScreen();
			console.log('Stop does nothing');
			break;
		case 'wait':
			// waitScreen();
			break;
		case 'starting':
			// startingScreen();
			break;
		case 'play':
			if (game.mode === 'single') {
				game.status = 'pause';
				pauseScreen();
			} else {
				waitMessageSpan.innerText = `No pausing during multiplayer`;
				const id = setTimeout(() => {
					waitMessageSpan.innerText = ``;
					clearInterval(id);
				}, 500);
			}
			break;
		case 'pause':
			game.status = 'play';
			playScreen();
			break;
		case 'gameOver':
			// gameOverScreen();
			break;
		default:
			// defaultScreen();
			break;
	}
	requestAnimationFrame(main); //is this the best place to put it? try returning
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

export function stopScreen() {
	gameBoard.style.zIndex = 3;
	landingScreen.style.zIndex = 2;
	waitScreen.style.zIndex = 1;
}
export function waitingScreen(banner = '', gameId = '', esc = '') {
	waitMessageSpan.innerText = banner;
	gameIdSpan.innerText = gameId;
	escapeMessageSpan.innerText = esc;
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function startingScreen() {
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function playScreen() {
	waitMessageSpan.innerText = ``;
	escapeMessageSpan.innerText = ``;
	gameBoard.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function pauseScreen() {
	waitMessageSpan.innerText = `[SPACE] to resume`;
	escapeMessageSpan.innerText = `[ESC] to quit`;
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function homeScreen() {
	landingScreen.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	gameBoard.style.zIndex = 1;
}
export function defaultScreen() {
	landingScreen.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	gameBoard.style.zIndex = 1;
}
