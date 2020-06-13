import { snakes } from './snake.js';

let food = randomPosition();
export let lastConsumer = '';

export function update() {
	if (consumed()) {
		food = randomPosition();
	} else {
		lastConsumer = '';
	}
}

export function draw(gameBoard) {
	const foodElement = document.createElement('div');
	foodElement.style.gridRowStart = food.x;
	foodElement.style.gridColumnStart = food.y;
	foodElement.classList.add('food');
	gameBoard.appendChild(foodElement);
}

function randomPosition() {
	return {
		x: (Math.random() * 21 + 1) | 0,
		y: (Math.random() * 21 + 1) | 0
	};
}

export function consumed() {
	if (snakes[0][0].x === food.x && snakes[0][0].y === food.y) {
		lastConsumer = 0;
		return true;
	}
	if (snakes[1][0].x === food.x && snakes[1][0].y === food.y) {
		lastConsumer = 1;
		return true;
	}
	return false;
}
