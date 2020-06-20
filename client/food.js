import {
	ws,
	clientId,
	gameId,
	playerIndex,
	game,
	addToScore,
	playerScore,
	scores,
	p1ScoreDisplay,
	p2ScoreDisplay,
	p3ScoreDisplay,
	p4ScoreDisplay,
	foodArray
} from './game.js';
import { snakes } from './snake.js';

export let food = { x: 3, y: 8 };

export let lastConsumer = { id: null };

export function update() {
	if (newConsumed() && game.mode === 'multi') {
		lastConsumer.id = playerIndex;
		addToScore(10);
		scores[playerIndex] = playerScore;
		updateScoresDisplay(playerIndex, playerScore);
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
		p1ScoreDisplay.innerText = playerScore;
	} else {
		lastConsumer.id = null;
	}
}

export function updateScoresDisplay(index, value) {
	switch (index) {
		case 0:
			p1ScoreDisplay.innerText = value;
			break;
		case 1:
			p2ScoreDisplay.innerText = value;
			break;
		case 2:
			p3ScoreDisplay.innerText = value;
			break;
		case 3:
			p4ScoreDisplay.innerText = value;
			break;
		default:
			break;
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
	let foodItem;

	if (game.mode === 'single') {
		foodItem = food;
	} else {
		// i = playerIndex;
		foodItem = foodArray[0];
	}
	let snake = snakes[playerIndex];

	if (snake[0][0] === foodItem.x && snake[0][1] === foodItem.y) {
		if (game.mode === 'single') return true;

		foodArray.shift();
		food = foodArray[0];
		if (foodArray.length <= 5) {
			requestFood();
		}
		return true;
	}
	return false;
}

// export function newConsumed() {
// 	let i = game.mode === 'single' ? 0 : playerIndex;

// 	let snake = snakes[i];
// 	if (snake[0].x === food.x && snake[0].y === food.y) {
// 		return true;
// 	}
// 	return false;
// }

function randomPosition() {
	return {
		x: (Math.random() * 21 + 1) | 0,
		y: (Math.random() * 21 + 1) | 0
	};
}

function requestFood() {
	console.log('requesting server for food!');
	const payload = {
		method: 'requestFood',
		gameId
	};
	ws.send(JSON.stringify(payload));
}
