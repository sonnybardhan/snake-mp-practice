import { ws, clientId, gameId, playerIndex, game } from './game.js';
import { snakes } from './snake.js';

export let food = { x: 3, y: 8 };
// let food = '';

// export let lastConsumer = '';
export let lastConsumer = { id: null };

// export function update() {
// 	if (newConsumed() && game.mode === 'multi') {
// 		// if (consumed()) {
// 		const payload = {
// 			method: 'consume',
// 			clientId,
// 			gameId,
// 			lastConsumer
// 		};

// 		ws.send(JSON.stringify(payload));
// 		// lastConsumer = playerIndex;
// 	} else {
// 		lastConsumer.id = null;
// 	}
// }
export function update() {
	if (newConsumed() && game.mode === 'multi') {
		lastConsumer.id = playerIndex;
		console.log('new update works - ', lastConsumer.id);
		const payload = {
			method: 'consume',
			clientId,
			gameId,
			lastConsumer
		};

		ws.send(JSON.stringify(payload));
	} else if (newConsumed() && game.mode === 'single') {
		lastConsumer.id = playerIndex;
	} else {
		lastConsumer.id = null;
	}
}
// export function update() {
// 	if (newConsumed()) {
// 		// if (consumed()) {
// 		const payload = {
// 			method: 'consume',
// 			clientId,
// 			gameId,
// 			lastConsumer
// 		};

// 		ws.send(JSON.stringify(payload));
// 		// lastConsumer = playerIndex;
// 	} else {
// 		// lastConsumer = '';
// 		lastConsumer.id = null;
// 	}
// }

export function draw(gameBoard) {
	const foodElement = document.createElement('div');
	foodElement.style.gridRowStart = food.x;
	foodElement.style.gridColumnStart = food.y;
	foodElement.classList.add('food');
	gameBoard.appendChild(foodElement);
}

// export function consumed() {
// 	for (let [ i, snake ] of snakes.entries()) {
// 		console.log(snakes[0]);
// 		console.log(snakes[1]);
// 		if (snake[0].x === food.x && snake[0].y === food.y) {
// 			lastConsumer.id = i;
// 			return true;
// 		}
// 	}
// 	return false;
// }

export function newConsumed() {
	let snake = snakes[playerIndex];
	if (snake[0].x === food.x && snake[0].y === food.y) {
		return true;
	}
	return false;
}
// export function newConsumed() {
// 	// console.log('newConsumed func: ', playerIndex, playerNum);

// 	let snake = snakes[playerIndex];

// 	if (snake[0].x === food.x && snake[0].y === food.y) {
// 		lastConsumer.id = playerIndex;
// 		return true;
// 	}
// 	return false;
// }
