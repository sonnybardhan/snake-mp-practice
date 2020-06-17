import { start, backToLanding, ws, clientId, gameId } from './game.js';
// import { reset } from './snake';
export let numPlayers = 1;

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
			if (lastInputs[0] === 'ArrowDown') return;
			directions[0] = { x: -1, y: 0 };
			lastInputs[0] = 'ArrowUp';
			send(clientId, gameId, directions[0], lastInputs[0]);
			break;
		case 'ArrowDown':
			if (lastInputs[0] === 'ArrowUp') return;
			directions[0] = { x: 1, y: 0 };
			lastInputs[0] = 'ArrowDown';
			send(clientId, gameId, directions[0], lastInputs[0]);
			break;
		case 'ArrowLeft':
			if (lastInputs[0] === 'ArrowRight') return;
			directions[0] = { x: 0, y: -1 };
			lastInputs[0] = 'ArrowLeft';
			send(clientId, gameId, directions[0], lastInputs[0]);
			break;
		case 'ArrowRight':
			if (lastInputs[0] === 'ArrowLeft') return;
			directions[0] = { x: 0, y: 1 };
			lastInputs[0] = 'ArrowRight';
			send(clientId, gameId, directions[0], lastInputs[0]);
			break;
		// case 'w':
		// 	if (lastInputs[1] === 's') return;
		// 	directions[1] = { x: -1, y: 0 };
		// 	lastInputs[1] = 'w';
		// 	send(clientId, gameId, directions[1], lastInputs[1]);
		// 	break;
		// case 's':
		// 	if (lastInputs[1] === 'w') return;
		// 	directions[1] = { x: 1, y: 0 };
		// 	lastInputs[1] = 's';
		// 	send(clientId, gameId, directions[1], lastInputs[1]);
		// 	break;
		// case 'a':
		// 	if (lastInputs[1] === 'd') return;
		// 	directions[1] = { x: 0, y: -1 };
		// 	lastInputs[1] = 'a';
		// 	send(clientId, gameId, directions[1], lastInputs[1]);
		// 	break;
		// case 'd':
		// 	if (lastInputs[1] === 'a') return;
		// 	directions[1] = { x: 0, y: 1 };
		// 	lastInputs[1] = 'd';
		// 	send(clientId, gameId, directions[1], lastInputs[1]);
		// break;
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

function send(clientId, gameId, direction, lastInput) {
	const payload = {
		method: 'move',
		clientId,
		gameId,
		direction,
		lastInput
	};
	ws.send(JSON.stringify(payload));
}
