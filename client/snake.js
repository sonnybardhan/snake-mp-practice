import { lastConsumer } from './food.js';
import { directions, inputReset, numPlayers } from './input.js';
import { start } from './game.js';
const SPEED = 1;

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

			// let head = false;

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
			return reset();
		} else {
			newHead.x += directions[i].x;
			newHead.y += directions[i].y;
		}

		snake.unshift(newHead);

		if (i === 0 && lastConsumer !== 0) {
			snake.pop(); //remove tail
		} else if (i === 1 && lastConsumer !== 1) {
			snake.pop(); //remove tail
		} else if (i === 2 && lastConsumer !== 2) {
			snake.pop(); //remove tail
		} else if (i === 3 && lastConsumer !== 3) {
			snake.pop(); //remove tail
		}
	}
	//send snake position ignore opponent move
	console.log();
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
	const rest = snake.slice(1);

	const newX = head.x + direction.x;
	const newY = head.y + direction.y;

	return rest.some((segment) => {
		return newX === segment.x && newY === segment.y;
	});
}

export function reset() {
	snakes = populateSnakeArray();
	inputReset();
	// start(true);
	start();
}

function populateSnakeArray() {
	const newSnakes = [];

	for (let i = 0; i < numPlayers; i++) {
		if (numPlayers === 2 && i === 1) i++; //to ensure diagnals are populated

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
