import { lastConsumer } from './food.js';
import { directions, inputReset } from './input.js';
import { start } from './game.js';
const SNAKE_SPEED = 4;
let snakes = [
	[ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ],
	[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
];

function draw(gameBoard) {
	for (let snake of snakes) {
		snake.forEach(({ x, y }, index) => {
			const snakeSegment = document.createElement('div');
			snakeSegment.style.gridRowStart = x;
			snakeSegment.style.gridColumnStart = y;
			snakeSegment.classList.add('snake');
			if (index === 0) {
				snakeSegment.classList.add('snake-head');
			}
			gameBoard.appendChild(snakeSegment);
		});
	}
}

function update() {
	for (let i = 0; i < snakes.length; i++) {
		let snake = snakes[i];

		const newHead = { ...snake[0] }; //first item in array is head

		if (collided(snake) || outOfBounds(snake, directions[i])) {
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

// function collisionCheck(snake) {
// 	const head = snake[0];
// 	const rest = snake.slice(1);
// 	return rest.some((segment) => {
// 		return head.x === segment.x && head.y === segment.y;
// 	});
// }
function collided(snake) {
	const head = snake[0];
	const rest = snake.slice(1);
	return rest.some((segment) => {
		return head.x === segment.x && head.y === segment.y;
	});
}

export function reset() {
	snakes = [
		[ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ],
		[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
	];

	inputReset();
	start();
}
export { SNAKE_SPEED, update, draw, snakes, collided, outOfBounds };
