import { lastConsumer } from './food.js';
import { directions, inputReset, numPlayers } from './input.js';
import {
	start,
	playerNum,
	playerIndex,
	game,
	homeScreen,
	ws,
	clientId,
	gameId,
	gameIdInput,
	joinBtn,
	speedInput,
	setPlayerIndex,
	speedDisplay,
	resetPlayerScore,
	resetAllScores
} from './game.js';

// const SPEED = 11;
let SPEED = 2;

export function setSPEED(value) {
	if (value > 0 && value < 30) {
		SPEED = value;
	}
}

const INIT_SNAKES = [
	[ { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 } ], //y: 1 right
	[ { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 } ], //y: -1 left
	[ { x: 17, y: 17 }, { x: 17, y: 18 }, { x: 17, y: 19 } ], //y: -1 left
	[ { x: 15, y: 5 }, { x: 15, y: 4 }, { x: 15, y: 3 } ] //y:1 right
];

let snakes = populateSnakeArray();

function draw(gameBoard) {
	for (let [ i, snake ] of snakes.entries()) {
		snake.forEach(({ x, y }, index) => {
			const snakeSegment = document.createElement('div');
			snakeSegment.style.gridRowStart = x;
			snakeSegment.style.gridColumnStart = y;

			if (index === 0) {
				snakeSegment.classList.add(`snake-head-${i + 1}`);
			}

			snakeSegment.classList.add('snake', `snake-${i + 1}`);

			if (index === snake.length - 1) {
				snakeSegment.classList.add('snake-tail');
			}

			gameBoard.appendChild(snakeSegment);
		});
	}
}

function update() {
	// return;

	for (let i = 0; i < snakes.length; i++) {
		let snake = snakes[i];

		const newHead = { ...snake[0] }; //first item in array is head

		if (collided(snake, directions[i]) || outOfBounds(snake, directions[i])) {
			// if (collided(snake, directions[i]) || outOfBounds(snake, directions[i]) || collision(snake, directions[i])) {
			// console.log(`crash`);
			if (game.mode === 'multi') {
				const payload = {
					method: 'crash',
					clientId,
					playerIndex,
					gameId
				};
				ws.send(JSON.stringify(payload));
			}

			return reset();
		} else {
			newHead.x += directions[i].x;
			newHead.y += directions[i].y;
		}

		snake.unshift(newHead);

		if (i === 0 && lastConsumer.id !== 0) {
			snake.pop(); //remove tail
		} else if (i === 1 && lastConsumer.id !== 1) {
			snake.pop(); //remove tail
		} else if (i === 2 && lastConsumer.id !== 2) {
			snake.pop(); //remove tail
		} else if (i === 3 && lastConsumer.id !== 3) {
			snake.pop(); //remove tail
		} else {
			if (i === playerIndex && game.mode === 'multi') {
				// console.log('snake grew! send signal');
				// console.log(snake.length, snake);
				const payload = {
					method: 'grow',
					clientId,
					playerIndex,
					gameId,
					snake
				};

				ws.send(JSON.stringify(payload));
			}
		}
	}
}

function outOfBounds(snake, direction) {
	const newHead = snake[0];
	if (newHead.x === 1 && direction.x === -1) {
		return true;
	} else if (newHead.x === 21 && direction.x === 1) {
		return true;
	}

	if (newHead.y === 1 && direction.y === -1) {
		return true;
	} else if (newHead.y === 21 && direction.y === 1) {
		return true;
	}

	return false;
}

function collided(snake, direction) {
	const head = snake[0];

	const newX = head.x + direction.x;
	const newY = head.y + direction.y;

	const allSegments = [ ...snake.slice(1) ];

	if (game.mode === 'multi') {
		allSegments.push(...snakes.filter((_, index) => index !== playerIndex).flat());
	}

	return allSegments.some((segment) => {
		return newX === segment.x && newY === segment.y;
	});
}

// function collision(snake, direction) {
// 	if (game.mode === 'single') {
// 		console.log('ignore for single player');
// 		return false;
// 	} else {
// 		const head = snake[0];
// 		const rest = snake.slice(1);

// 		const allSegments = [];
// 		allSnakes.push(...rest);
// 		// const otherSnakes = snakes.filter((snake, index) => index !== playerIndex);

// 		if (game.mode === 'multi') {
// 			allSnakes.push(...snakes.filter((_, index) => index !== playerIndex).flat());
// 		}

// 		const newX = head.x + direction.x;
// 		const newY = head.y + direction.y;

// 		let didCollide = false;

// 		for (let otherSnake of otherSnakes) {
// 			didCollide = otherSnake.some((segment) => {
// 				return newX === segment.x && newY === segment.y;
// 			});
// 			if (didCollide) {
// 				console.log('snakes collided');
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// }

// function collision(snake, direction) {
// 	if (game.mode === 'single') {
// 		console.log('ignore for single player');
// 		return false;
// 	}

// 	const head = snake[0];
// 	const otherSnakes = snakes.filter((snake, index) => index !== playerIndex);

// 	const newX = head.x + direction.x;
// 	const newY = head.y + direction.y;

// 	let didCollide = false;

// 	for (let otherSnake of otherSnakes) {
// 		didCollide = otherSnake.some((segment) => {
// 			return newX === segment.x && newY === segment.y;
// 		});
// 		if (didCollide) {
// 			console.log('snakes collided');
// 			return true;
// 		}
// 	}
// 	return false;
// }

export function reset() {
	snakes = populateSnakeArray();
	inputReset();
	homeScreen();
	//reset speed
	//clear input fields
	setSPEED(2);
	speedInput.value = SPEED / 2;
	speedDisplay.innerText = SPEED;
	gameIdInput.value = '';
	joinBtn.disabled = false;
	game.status = 'landing';
	game.mode = 'single';
	setPlayerIndex(0);
	resetPlayerScore();
	resetAllScores();
}

export function populateSnakeArray() {
	const newSnakes = [];
	// console.log('numplayers count in popSnake array func: ', numPlayers.count);
	for (let i = 0; i < numPlayers.count; i++) {
		if (numPlayers.count === 2 && i === 1) i++; //to ensure diagnals are populated

		const newSnake = [];
		const snake = INIT_SNAKES[i];

		for (let segment of snake) {
			newSnake.push({ ...segment });
		}
		newSnakes.push(newSnake);
	}
	return newSnakes;
}
export { SPEED, update, draw, snakes };
