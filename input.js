import { start } from './game.js';

export let directions = [ { x: 0, y: 1 }, { x: 0, y: 1 } ];
export let lastInputs = [ 'ArrowRight', 'd' ];

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

function getReverse(dir) {
	switch (dir) {
		case 'ArrowUp':
			return 'ArrowDown';
		case 'ArrowDown':
			return 'ArrowUp';
		case 'ArrowLeft':
			return 'ArrowRight';
		case 'ArrowRight':
			return 'ArrowLeft';
		case 'w':
			return 's';
		case 's':
			return 'w';
		case 'a':
			return 'd';
		case 'd':
			return 'a';
	}
}

export function inputReset() {
	directions = [ { x: 0, y: 1 }, { x: 0, y: 1 } ];
	lastInputs = [ '', '' ];
}
