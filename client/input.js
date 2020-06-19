// import { start, ws, clientId, gameId, playerNum, playerIndex, game, p1Div, scores1DisplayDiv } from './game.js';
import { start, ws, clientId, gameId, playerIndex, game, p1Div, crashScreen } from './game.js';
import { snakes, reset, setSPEED, hideScoresDisplays, gameOver } from './snake.js';
export let numPlayers = { count: 2 };

//dummy code for now////////////////////
// export let playerCount = 2;
// export function setPlayerCount(value) {
// 	playerCount = value;
// 	console.log('playerCount changed: ', playerCount);
// }
////////////////////////////////////////

const S1_DIR = { x: 0, y: 1 }; // left
const S2_DIR = { x: 0, y: -1 }; //right
const S3_DIR = { x: 0, y: -1 }; //left
const S4_DIR = { x: 0, y: 1 }; //right
const INIT_INPUTS = [ 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight' ];
const INIT_DIR = [ { ...S1_DIR }, { ...S2_DIR }, { ...S3_DIR }, { ...S4_DIR } ];

export let directions = populateDirections();
export let lastInputs = populateInputs();

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
			directions[playerIndex] = { x: -1, y: 0 };
			lastInputs[playerIndex] = 'ArrowUp';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerIndex);
			break;
		case 'ArrowDown':
			if (lastInputs[playerIndex] === 'ArrowUp') return;
			directions[playerIndex] = { x: 1, y: 0 };
			lastInputs[playerIndex] = 'ArrowDown';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerIndex);
			break;
		case 'ArrowLeft':
			if (lastInputs[playerIndex] === 'ArrowRight') return;
			directions[playerIndex] = { x: 0, y: -1 };
			lastInputs[playerIndex] = 'ArrowLeft';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerIndex);
			break;
		case 'ArrowRight':
			if (lastInputs[playerIndex] === 'ArrowLeft') return;
			directions[playerIndex] = { x: 0, y: 1 };
			lastInputs[playerIndex] = 'ArrowRight';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerIndex);
			break;
		case ' ':
			if (game.mode === 'single' && game.status === 'landing') {
				initSinglePlayer();
			}
			// scores1DisplayDiv.style.display = 'block';
			start();
			break;
		case 'Escape':
			if (game.status === 'play' && game.mode === 'multi') {
				quitMessage();
				game.status = 'landing';
				gameOver('You quit');
			}
			reset();
			//check for game mode multiplayer, if so, send message to disconnect client
			break;
	}
});

function initSinglePlayer() {
	snakes.splice(1);
	hideScoresDisplays();
	p1Div.style.display = 'block';
}

function populateDirections() {
	const newDirections = [];

	for (let i = 0; i < numPlayers.count; i++) {
		// for (let i = 0; i < numPlayers; i++) {
		const direction = INIT_DIR[i];
		newDirections.push({ ...direction });
	}
	return newDirections;
}

function populateInputs() {
	const inputs = [];
	for (let i = 0; i < numPlayers.count; i++) {
		// for (let i = 0; i < numPlayers; i++) {
		const input = INIT_INPUTS[i];
		inputs.push(input);
	}
	return inputs;
}

export function inputReset() {
	directions = populateDirections();
	lastInputs = populateInputs();
}

function send(clientId, gameId, direction, lastInput, playerIndex) {
	if (game.mode === 'multi') {
		const payload = {
			method: 'move',
			clientId,
			gameId,
			direction,
			lastInput,
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
