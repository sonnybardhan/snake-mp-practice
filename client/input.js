import { start, backToLanding, ws, clientId, gameId, playerNum, playerIndex } from './game.js';
import { snakes } from './snake.js';
export let numPlayers = 2;

const S1_DIR = { x: 0, y: 1 }; // left
const S2_DIR = { x: 0, y: -1 }; //right
const S3_DIR = { x: 0, y: -1 }; //left
const S4_DIR = { x: 0, y: 1 }; //right
const INIT_INPUTS = [ 'ArrowRight', 'a', 'a', 'ArrowRight' ];
const INIT_DIR = [ { ...S1_DIR }, { ...S2_DIR }, { ...S3_DIR }, { ...S4_DIR } ];

export let directions = populateDirections();
export let lastInputs = populateInputs();

window.addEventListener('keydown', ({ key }) => {
	// console.log(key);
	switch (key) {
		case 'ArrowUp':
			if (lastInputs[playerIndex] === 'ArrowDown') return;
			directions[playerIndex] = { x: -1, y: 0 };
			lastInputs[playerIndex] = 'ArrowUp';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerNum);
			break;
		case 'ArrowDown':
			if (lastInputs[playerIndex] === 'ArrowUp') return;
			directions[playerIndex] = { x: 1, y: 0 };
			lastInputs[playerIndex] = 'ArrowDown';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerNum);
			break;
		case 'ArrowLeft':
			if (lastInputs[playerIndex] === 'ArrowRight') return;
			directions[playerIndex] = { x: 0, y: -1 };
			lastInputs[playerIndex] = 'ArrowLeft';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerNum);
			break;
		case 'ArrowRight':
			if (lastInputs[playerIndex] === 'ArrowLeft') return;
			directions[playerIndex] = { x: 0, y: 1 };
			lastInputs[playerIndex] = 'ArrowRight';
			send(clientId, gameId, directions[playerIndex], lastInputs[playerIndex], playerNum);
			break;
		case ' ':
			start();
			break;
		case 'Escape':
			backToLanding();
			break;
	}
});

function populateDirections() {
	const newDirections = [];

	for (let i = 0; i < numPlayers; i++) {
		const direction = INIT_DIR[i];
		newDirections.push({ ...direction });
	}
	return newDirections;
}

function populateInputs() {
	const inputs = [];
	for (let i = 0; i < numPlayers; i++) {
		const input = INIT_INPUTS[i];
		inputs.push(input);
	}
	return inputs;
}

export function inputReset() {
	directions = populateDirections();
	lastInputs = populateInputs();
}

function send(clientId, gameId, direction, lastInput, playerNum) {
	const payload = {
		method: 'move',
		clientId,
		gameId,
		direction,
		lastInput,
		playerNum,
		snake: snakes[playerIndex]
	};
	ws.send(JSON.stringify(payload));
}
