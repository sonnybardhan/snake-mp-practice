import { start } from './game.js';

// const S1_DIR = { x: 0, y: 1 };
// const S2_DIR = { x: 0, y: 1 };
const S1_DIR = { x: 0, y: -1 }; // left
const S2_DIR = { x: 0, y: 1 }; //right
const S3_DIR = { x: 1, y: 1 }; //down
const S4_DIR = { x: -1, y: 1 }; //up

// const S1_DIR = { x: 0, y: -1 };
// const S2_DIR = { x: 0, y: 1 };
// const S1_DIR = 3;
// const S2_DIR = 3;

//follow clock directions

// const INIT_INPUTS = [ 'ArrowRight', 'd' ];
const INIT_INPUTS = [ 'ArrowLeft', 'd' ];
const INIT_DIR = [ { ...S1_DIR }, { ...S2_DIR } ];

// export let lastInputs = [ ...INIT_INPUTS ];
export let directions = populateDirections();
export let lastInputs = populateInputs();

window.addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'ArrowUp':
			if (lastInputs[0] === 'ArrowDown') return;
			directions[0] = { x: -1, y: 0 };
			lastInputs[0] = 'ArrowUp';
			break;
		case 'ArrowDown':
			if (lastInputs[0] === 'ArrowUp') return;
			directions[0] = { x: 1, y: 0 };
			lastInputs[0] = 'ArrowDown';
			break;
		case 'ArrowLeft':
			if (lastInputs[0] === 'ArrowRight') return;
			directions[0] = { x: 0, y: -1 };
			lastInputs[0] = 'ArrowLeft';
			break;
		case 'ArrowRight':
			if (lastInputs[0] === 'ArrowLeft') return;
			directions[0] = { x: 0, y: 1 };
			lastInputs[0] = 'ArrowRight';
			break;
		case 'w':
			if (lastInputs[1] === 's') return;
			directions[1] = { x: -1, y: 0 };
			lastInputs[1] = 'w';
			break;
		case 's':
			if (lastInputs[1] === 'w') return;
			directions[1] = { x: 1, y: 0 };
			lastInputs[1] = 's';
			break;
		case 'a':
			if (lastInputs[1] === 'd') return;
			directions[1] = { x: 0, y: -1 };
			lastInputs[1] = 'a';
			break;
		case 'd':
			if (lastInputs[1] === 'a') return;
			directions[1] = { x: 0, y: 1 };
			lastInputs[1] = 'd';
			break;
		case ' ':
			start();
			break;
	}
});

function populateDirections() {
	const newDirections = [];

	for (let direction of INIT_DIR) {
		newDirections.push({ ...direction });
	}
	// console.log('used pop directions');
	return newDirections;
}

function populateInputs() {
	const inputs = [];
	for (let input of INIT_INPUTS) {
		inputs.push(input);
	}
	console.log('used pop inputs');
	return inputs;
}

export function inputReset() {
	directions = populateDirections();
	// lastInputs = [...INIT_INPUTS];
	lastInputs = populateInputs();
}

// export function inputReset() {
// 	directions = [ { ...S1_DIR }, { ...S2_DIR } ];
// 	lastInputs = [ ...INIT_INPUTS ];
// }
