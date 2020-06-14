import { lastConsumer } from './food.js';
import { directions, inputReset, numPlayers } from './input.js';
import { start } from './game.js';
const SPEED = 5;

// let S1 = [ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ];
// let S2 = [ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ];
let S3 = [ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ];
let S4 = [ { x: 17, y: 19 }, { x: 17, y: 20 }, { x: 17, y: 21 } ];

/*
user enters number of players, build snake runs a loop to that number

*/

// const INIT_SNAKES = [
// 	[ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ],
// 	[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
// ];

// const INIT_SNAKES = [ [ { x: 4, y: 4 }, { x: 4, y: 3 } ], [ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ] ];

// const INIT_SNAKES = [
// 	[ { x: 4, y: 19 }, { x: 4, y: 20 }, { x: 4, y: 21 } ], //{}
// 	[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ]
// ];
// const INIT_SNAKES = [
// 	[ { x: 4, y: 19 }, { x: 4, y: 20 }, { x: 4, y: 21 } ],
// 	[ { x: 17, y: 4 }, { x: 17, y: 3 }, { x: 17, y: 2 } ],
// 	[ { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 } ],
// 	[ { x: 17, y: 19 }, { x: 17, y: 20 }, { x: 17, y: 21 } ]
// ];
const INIT_SNAKES = [
	[ { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 } ], //y: 1 right
	[ { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 } ], //y: -1 left
	[ { x: 17, y: 17 }, { x: 17, y: 18 }, { x: 17, y: 19 } ], //y: -1 left
	[ { x: 17, y: 5 }, { x: 17, y: 4 }, { x: 17, y: 3 } ] //y:1 right
];

// const S1_DIR = { x: 0, y: -1 }; // left
// const S2_DIR = { x: 0, y: 1 }; //right
// const S3_DIR = { x: 0, y: -1 }; //left
// const S4_DIR = { x: 0, y: 1 }; //right

// const INIT_INPUTS = ['ArrowLeft', 'd', 'ArrowLeft', 'd'];

let snakes = populateSnakeArray();

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
				// } else if( i === 1) {
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
	// return;
	for (let i = 0; i < snakes.length; i++) {
		let snake = snakes[i];

		const newHead = { ...snake[0] }; //first item in array is head

		if (collided(snake, directions[i]) || outOfBounds(snake, directions[i])) {
			console.log(`snake ${i} collided`);
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
}

function outOfBounds(snake, direction) {
	const newHead = snake[0];
	if (newHead.x === 1 && direction.x === -1) {
		console.log('OOB');
		return true;
	} else if (newHead.x === 21 && direction.x === 1) {
		console.log('OOB');
		return true;
	}

	if (newHead.y === 1 && direction.y === -1) {
		console.log('OOB');
		return true;
	} else if (newHead.y === 21 && direction.y === 1) {
		console.log('OOB');
		return true;
	}

	return false;
}

function collided(snake, direction) {
	const head = snake[0];
	const rest = snake.slice(1);

	const newX = head.x + direction.x;
	const newY = head.y + direction.y;

	let flag = rest.some((segment) => {
		return newX === segment.x && newY === segment.y;
	});
	if (flag) console.log('Collision');
	return flag;
}

export function reset() {
	snakes = populateSnakeArray();
	inputReset();
	start();
}

function populateSnakeArray() {
	const newSnakes = [];

	for (let i = 0; i < numPlayers; i++) {
		// for (let snake of INIT_SNAKES) {
		//[ { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 } ]
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
