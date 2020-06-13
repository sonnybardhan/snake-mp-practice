import { lastConsumer } from './food.js';
import { directions, inputReset } from './input.js';
import { start } from './game.js';
const SNAKE_SPEED = 6;
let snakes = [
	[ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ],
	[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
];

function draw(gameBoard) {
	for (let [ i, snake ] of snakes.entries()) {
		snake.forEach(({ x, y }, index) => {
			const snakeSegment = document.createElement('div');
			snakeSegment.style.gridRowStart = x;
			snakeSegment.style.gridColumnStart = y;

			let head = false;

			if (index === 0) {
				head = true;
			}

			if (i === 0) {
				snakeSegment.classList.add('snake-1');
				if (head) {
					snakeSegment.classList.add('snake-head-1');
				}
			} else {
				snakeSegment.classList.add('snake-2');
				if (head) {
					snakeSegment.classList.add('snake-head-2');
				}
			}

			if (index === snake.length - 1) {
				snakeSegment.classList.add('snake-tail');
			}

			gameBoard.appendChild(snakeSegment);
		});
	}
}

function update() {
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
	const rest = snake.slice(1);

	const newX = head.x + direction.x;
	const newY = head.y + direction.y;

	return rest.some((segment) => {
		return newX === segment.x && newY === segment.y;
	});
}
// function collided(snake) {
// 	const head = snake[0];
// 	const rest = snake.slice(1);
// 	return rest.some((segment) => {
// 		return head.x === segment.x && head.y === segment.y;
// 	});
// }

export function reset() {
	snakes = [
		[ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ],
		[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
	];

	inputReset();
	start();
}
export { SNAKE_SPEED, update, draw, snakes };
