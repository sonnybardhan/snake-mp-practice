import { ws, clientId, gameId, playerIndex, game, addToScore, playerScore, scores } from './game.js';
import { snakes } from './snake.js';

export let food = { x: 3, y: 8 };

export let lastConsumer = { id: null };

export function update() {
	if (newConsumed() && game.mode === 'multi') {
		lastConsumer.id = playerIndex;
		addToScore(10);
		scores[playerIndex] = playerScore;

		const payload = {
			method: 'consume',
			clientId,
			gameId,
			lastConsumer,
			playerScore: scores[playerIndex]
		};
		ws.send(JSON.stringify(payload));
	} else if (newConsumed() && game.mode === 'single') {
		lastConsumer.id = playerIndex;
		food = randomPosition();
		addToScore(10);
	} else {
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

export function newConsumed() {
	let i = game.mode === 'single' ? 0 : playerIndex;

	let snake = snakes[i];
	if (snake[0].x === food.x && snake[0].y === food.y) {
		return true;
	}
	return false;
}

function randomPosition() {
	return {
		x: (Math.random() * 21 + 1) | 0,
		y: (Math.random() * 21 + 1) | 0
	};
}
