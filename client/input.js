// import { start, ws, clientId, gameId, playerNum, playerIndex, game, p1Div, scores1DisplayDiv } from './game.js';
import { start, ws, clientId, gameId, playerIndex, game, p1Div, crashScreen, playerSpeedInput } from './game.js';
import { snakes, reset, setSPEED, hideScoresDisplays, gameOver } from './snake.js';
// export let numPlayers = { count: 1 };

export let numPlayers = { count: 1 };
// const count = document.getElementById('player-count-input');

// export let numPlayers = { count: parseInt(count) };

//dummy code for now////////////////////
// export let playerCount = 2;
// export function setPlayerCount(value) {
// 	playerCount = value;
// 	console.log('playerCount changed: ', playerCount);
// }
////////////////////////////////////////

const S1_DIR = [ 0, 1 ]; // left
const S2_DIR = [ 0, -1 ]; //right
const S3_DIR = [ 0, -1 ]; //left
const S4_DIR = [ 0, 1 ]; //right

const INIT_INPUTS = [ 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight' ];
const INIT_DIR = [ [ ...S1_DIR ], [ ...S2_DIR ], [ ...S3_DIR ], [ ...S4_DIR ] ];

export let directions = populateDirections();
export let lastInputs = populateInputs();

export function setDirections(value) {
	directions = populateDirections(value);
	// console.log('Re-populating directions');
}

export function setLastInputs(value) {
	lastInputs = populateDirections(value);
	// console.log('Re-populating lastInputs');
}

let prevTime = 0;
let currentTime = 0;

window.addEventListener('keydown', ({ key }) => {
	// console.log('registering key: ', key);
	currentTime = +new Date();
	const diff = currentTime - prevTime;
	prevTime = currentTime;

	if (diff < 75) return;

	switch (key) {
		case 'ArrowUp':
			if (lastInputs[playerIndex] === 'ArrowDown') return;
			// directions[playerIndex] = { x: -1, y: 0 };
			directions[playerIndex] = [ -1, 0 ];
			lastInputs[playerIndex] = 'ArrowUp';
			send(clientId, gameId, directions[playerIndex], playerIndex);
			break;
		case 'ArrowDown':
			if (lastInputs[playerIndex] === 'ArrowUp') return;
			directions[playerIndex] = [ 1, 0 ];
			lastInputs[playerIndex] = 'ArrowDown';
			send(clientId, gameId, directions[playerIndex], playerIndex);
			break;
		case 'ArrowLeft':
			if (lastInputs[playerIndex] === 'ArrowRight') return;
			directions[playerIndex] = [ 0, -1 ];
			lastInputs[playerIndex] = 'ArrowLeft';
			send(clientId, gameId, directions[playerIndex], playerIndex);
			break;
		case 'ArrowRight':
			if (lastInputs[playerIndex] === 'ArrowLeft') return;
			directions[playerIndex] = [ 0, 1 ];
			lastInputs[playerIndex] = 'ArrowRight';
			send(clientId, gameId, directions[playerIndex], playerIndex);
			break;
		case ' ':
			if (game.mode === 'single' && game.status === 'landing') {
				initSinglePlayer();
			}
			start();
			break;
		case 'Escape':
			if (game.status === 'play' && game.mode === 'multi') {
				quitMessage();
				game.status = 'landing';
				gameOver('You quit');
			}
			reset();
			break;
	}
});

export function initSinglePlayer() {
	snakes.splice(1);
	hideScoresDisplays();
	p1Div.style.display = 'block';
}

function populateDirections(players = 1) {
	const newDirections = [];

	for (let i = 0; i < players; i++) {
		const direction = INIT_DIR[i];
		newDirections.push([ ...direction ]);
	}
	return newDirections;
}

function populateInputs(players = 1) {
	const inputs = [];
	for (let i = 0; i < players; i++) {
		const input = INIT_INPUTS[i];
		inputs.push(input);
	}
	return inputs;
}
// function populateDirections() {
// 	const newDirections = [];

// 	for (let i = 0; i < numPlayers.count; i++) {
// 		const direction = INIT_DIR[i];
// 		newDirections.push([ ...direction ]);
// 	}
// 	return newDirections;
// }

// function populateInputs() {
// 	const inputs = [];
// 	for (let i = 0; i < numPlayers.count; i++) {
// 		// for (let i = 0; i < numPlayers; i++) {
// 		const input = INIT_INPUTS[i];
// 		inputs.push(input);
// 	}
// 	return inputs;
// }

export function inputReset() {
	directions = populateDirections();
	lastInputs = populateInputs();
}

function send(clientId, gameId, direction, playerIndex) {
	if (game.mode === 'multi') {
		const payload = {
			method: 'move',
			clientId,
			gameId,
			direction,
			playerIndex,
			snake: snakes[playerIndex]
		};
		ws.send(JSON.stringify(payload));
	}
}

function quitMessage() {
	const payload = {
		method: 'quit',
		clientId,
		playerIndex,
		gameId
	};
	ws.send(JSON.stringify(payload));
}
