import { ws, clientId, gameId, playerIndex } from './game.js';
import { snakes } from './snake.js';

export let food = { x: 3, y: 8 };
// let food = '';

// export let lastConsumer = '';
export let lastConsumer = { id: null };

export function update() {
	if (newConsumed()) {
		// if (consumed()) {
		const payload = {
			method: 'consume',
			clientId,
			gameId,
			lastConsumer
		};

		ws.send(JSON.stringify(payload));
		// lastConsumer = playerIndex;
	} else {
		// lastConsumer = '';
		lastConsumer.id = null;
	}
}

export function draw(gameBoard) {
	const foodElement = document.createElement('div');
	foodElement.style.gridRowStart = food.x;
	foodElement.style.gridColumnStart = food.y;
	foodElement.classList.add('food');
	gameBoard.appendChild(foodElement);
}

export function consumed() {
	// console.log('consumed called');
	for (let [ i, snake ] of snakes.entries()) {
		console.log(snakes[0]);
		console.log(snakes[1]);
		if (snake[0].x === food.x && snake[0].y === food.y) {
			console.log('consumed by: ', i);
			console.log('playerIndex: ', playerIndex);
			lastConsumer = i;
			// lastConsumer = playerIndex;
			return true;
		}
	}
	return false;
}

export function newConsumed() {
	// console.log('newConsumed func: ', playerIndex, playerNum);

	let snake = snakes[playerIndex];

	if (snake[0].x === food.x && snake[0].y === food.y) {
		lastConsumer.id = playerIndex;
		return true;
	}
	return false;
}
