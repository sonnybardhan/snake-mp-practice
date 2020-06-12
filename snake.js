import { lastConsumer } from './food.js';
import { directions, inputReset } from './input.js';
import { start } from './game.js';
const SNAKE_SPEED = 3;
let snakes = [
	[ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ],
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
		if (collided(snake) || outOfBounds(snake)) {
			return reset();
		}

		const newHead = { ...snake[0] }; //first item in array is head
		newHead.x += directions[i].x;
		newHead.y += directions[i].y;
		snake.unshift(newHead);

		if (i === 0 && lastConsumer !== 0) {
			snake.pop(); //remove tail
		} else if (i === 1 && lastConsumer !== 1) {
			snake.pop(); //remove tail
		}
	}
}

function collided(snake) {
	const head = snake[0];
	const rest = snake.slice(1);
	return rest.some((segment) => {
		return head.x === segment.x && head.y === segment.y;
	});
}

function outOfBounds(snake) {
	const head = snake[0];
	return head.x < 1 || head.x > 21 || head.y < 1 || head.y > 21;
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
