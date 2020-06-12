import { consumed } from './food.js';
import { direction, inputReset } from './input.js';
import { start } from './game.js';
const SNAKE_SPEED = 8;

const INIT_STATE = [ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ];
let snake = [ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ];

function draw(gameBoard) {
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

function update() {
	if (collided() || outOfBounds()) {
		return reset();
	}

	const newHead = { ...snake[0] }; //first item in array is head
	newHead.x += direction.x;
	newHead.y += direction.y;
	snake.unshift(newHead);

	if (!consumed()) {
		snake.pop(); //remove tail
	}
}

function collided() {
	const head = snake[0];
	const rest = snake.slice(1);
	return rest.some((segment) => {
		return head.x === segment.x && head.y === segment.y;
	});
}

function outOfBounds() {
	const head = snake[0];
	return head.x < 1 || head.x > 21 || head.y < 1 || head.y > 21;
}

export function reset() {
	snake = [ ...INIT_STATE ];
	inputReset();
	start();
}
export { SNAKE_SPEED, update, draw, snake, INIT_STATE, collided, outOfBounds };
