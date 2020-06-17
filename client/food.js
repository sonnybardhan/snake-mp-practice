import { ws, clientId, gameId } from './game.js';
import { snakes } from './snake.js';

export let food = { x: 3, y: 8 };
// let food = '';

export let lastConsumer = '';

export function update() {
	if (consumed()) {
		const payload = {
			method: 'consume',
			clientId,
			gameId
		};

		ws.send(JSON.stringify(payload));
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

// function randomPosition() {
// 	return {
// 		x: (Math.random() * 21 + 1) | 0,
// 		y: (Math.random() * 21 + 1) | 0
// 	};
// }

export function consumed() {
	for (let [ i, snake ] of snakes.entries()) {
		if (snake[0].x === food.x && snake[0].y === food.y) {
			lastConsumer = i;
			return true;
		}
	}
	return false;
}
