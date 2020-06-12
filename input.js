import { start } from './game.js';

export let direction = [ { x: 0, y: 1 }, { x: 0, y: 1 } ];
// export let direction = { x: 0, y: 1 };
// export let direction2 = { x: 0, y: -1 };

export let lastInput = [ '', '' ];
// export let lastInput = '';
// export let lastInput2 = '';

window.addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'ArrowUp':
			if (key === getReverse(lastInput[0]) || key === lastInput[0]) return;
			direction[0] = { x: -1, y: 0 };
			lastInput[0] = 'ArrowUp';
			break;
		case 'ArrowDown':
			if (key === getReverse(lastInput[0]) || key === lastInput[0]) return;
			direction[0] = { x: 1, y: 0 };
			lastInput[0] = 'ArrowDown';
			break;
		case 'ArrowLeft':
			if (key === getReverse(lastInput[0]) || key === lastInput[0]) return;
			direction[0] = { x: 0, y: -1 };
			lastInput[0] = 'ArrowLeft';
			break;
		case 'ArrowRight':
			if (key === getReverse(lastInput[0]) || key === lastInput[0]) return;
			direction[0] = { x: 0, y: 1 };
			lastInput[0] = 'ArrowRight';
			break;
		case 'w':
			if (key === getReverse(lastInput[1]) || key === lastInput[1]) return;
			direction[1] = { x: -1, y: 0 };
			lastInput[1] = 'w';
			break;
		case 's':
			if (key === getReverse(lastInput[1]) || key === lastInput[1]) return;
			direction[1] = { x: 1, y: 0 };
			lastInput[1] = 's';
			break;
		case 'a':
			if (key === getReverse(lastInput[1]) || key === lastInput[1]) return;
			direction[1] = { x: 0, y: -1 };
			lastInput[1] = 'a';
			break;
		case 'd':
			if (key === getReverse(lastInput[1]) || key === lastInput[1]) return;
			direction[1] = { x: 0, y: 1 };
			lastInput[1] = 'd';
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
	direction[0].x = 0;
	direction[0].y = 1;
	lastInput[0] = '';

	direction[1].x = 0;
	direction[1].y = 1;
	lastInput[1] = '';
}
