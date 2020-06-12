import { start, crashScreen } from './game.js';

export let direction = { x: 0, y: 1 };
export let lastInput = '';

window.addEventListener('keydown', ({ key }) => {
	if (key === getReverse(lastInput) || key === lastInput) return;

	switch (key) {
		case 'ArrowUp':
			direction = { x: -1, y: 0 };
			lastInput = 'ArrowUp';
			break;
		case 'ArrowDown':
			direction = { x: 1, y: 0 };
			lastInput = 'ArrowDown';
			break;
		case 'ArrowLeft':
			direction = { x: 0, y: -1 };
			lastInput = 'ArrowLeft';
			break;
		case 'ArrowRight':
			direction = { x: 0, y: 1 };
			lastInput = 'ArrowRight';
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
	}
}

export function inputReset() {
	direction.x = 0;
	direction.y = 1;
	lastInput = '';
}
