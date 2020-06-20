import { lastConsumer } from './food.js';
import { directions, inputReset, numPlayers } from './input.js';
import {
	// start,
	// playerNum,
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
	resetAllScores,
	p1ScoreDisplay,
	p2ScoreDisplay,
	p3ScoreDisplay,
	p4ScoreDisplay,
	p1Div,
	p2Div,
	p3Div,
	p4Div,
	crashScreen,
	gameOverResultDisplay,
	playerScore,
	playerInfo,
	setMultiPlayerCount,
	playerCountInput,
	playerCountDisplay,
	createBtn
} from './game.js';

const INIT_SPEED = 10;
let SPEED = 10;

export function setSPEED(value) {
	if (value > 0 && value <= 30) {
		SPEED = value;
	}
}

const INIT_SNAKES = [
	[ [ 3, 5 ], [ 3, 4 ], [ 3, 3 ] ],
	[ [ 5, 17 ], [ 5, 18 ], [ 5, 19 ] ],
	[ [ 17, 17 ], [ 17, 18 ], [ 17, 19 ] ],
	[ [ 15, 5 ], [ 15, 4 ], [ 15, 3 ] ]
];

let snakes = populateSnakeArray();

function draw(gameBoard) {
	// console.log(snakes);
	for (let [ i, snake ] of snakes.entries()) {
		// console.log(snake);
		snake.forEach(([ x, y ], index) => {
			// console.log(x, y);
			const snakeSegment = document.createElement('div');
			snakeSegment.style.gridRowStart = x;
			snakeSegment.style.gridColumnStart = y;

			if (index === 0) {
				//
				// console.log('head: ', x, y);
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
		//here check for index form the losersArr (store indexes of players who have dropped out or quit)
		let snake = snakes[i];
		const newHead = [ ...snake[0] ]; //first item in array is head

		if (collided(snake, directions[i]) || outOfBounds(snake, directions[i])) {
			// if (collided(snake, directions[i]) || outOfBounds(snake, directions[i]) || collision(snake, directions[i])) {
			// console.log(`crash`);
			let msg = '';
			if (game.mode === 'multi') {
				const payload = {
					method: 'crash',
					clientId,
					playerIndex,
					gameId
				};
				ws.send(JSON.stringify(payload));
				msg = `You lost`;
			}

			//display crash screen for 3 seconds and then reset
			gameOver(msg);
			// return reset();
		} else {
			newHead[0] += directions[i][0];
			newHead[1] += directions[i][1];
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

export function gameOver(msg = '') {
	// crashScreen.style.display = 'block';
	game.status = 'landing';
	crashScreen.style.zIndex = 10;
	// const score = playerScore;
	gameOverResultDisplay.innerText = msg || `You scored ${playerScore}`;
	setTimeout(() => {
		// crashScreen.style.display = 'none';
		crashScreen.style.zIndex = -10;
		gameOverResultDisplay.innerText = ``;

		return reset();
	}, 1200);
}

function outOfBounds(snake, direction) {
	const newHead = snake[0];
	if (newHead[0] === 1 && direction[0] === -1) {
		return true;
	} else if (newHead[0] === 21 && direction[0] === 1) {
		return true;
	}

	if (newHead[1] === 1 && direction[1] === -1) {
		return true;
	} else if (newHead[1] === 21 && direction[1] === 1) {
		return true;
	}
	return false;
}
// function outOfBounds(snake, direction) {
// 	const newHead = snake[0];
// 	if (newHead.x === 1 && direction.x === -1) {
// 		return true;
// 	} else if (newHead.x === 21 && direction.x === 1) {
// 		return true;
// 	}

// 	if (newHead.y === 1 && direction.y === -1) {
// 		return true;
// 	} else if (newHead.y === 21 && direction.y === 1) {
// 		return true;
// 	}

// 	return false;
// }

function collided(snake, direction) {
	const head = snake[0];

	const newX = head[0] + direction[0];
	const newY = head[1] + direction[1];

	const allSegments = [ ...snake.slice(1) ];

	if (game.mode === 'multi') {
		allSegments.push(...snakes.filter((_, index) => index !== playerIndex).flat());
	}

	return allSegments.some(([ x, y ]) => {
		return newX === x && newY === y;
	});
}

export function reset() {
	snakes = populateSnakeArray();
	inputReset();
	homeScreen();
	//reset speed
	//clear input fields
	setSPEED(INIT_SPEED);
	speedInput.value = SPEED;
	speedDisplay.innerText = SPEED;

	//export this to another function
	playerInfo.innerText = '';
	playerInfo.classList.remove('green');
	playerInfo.classList.remove('orange');
	playerInfo.classList.remove('white');
	playerInfo.classList.remove('yellow');

	gameIdInput.value = '';
	joinBtn.disabled = false;
	game.status = 'landing';
	game.mode = 'single';
	setPlayerIndex(0);
	resetPlayerScore();
	resetAllScores();
	resetScoresDisplay();
	hideScoresDisplays();

	playerCountInput.value = 2;
	playerCountDisplay.innerText = 2;
	setMultiPlayerCount(2);
	playerCountInput.blur();
	createBtn.blur();
}

export function resetScoresDisplay() {
	p1ScoreDisplay.innerText = 0;
	p2ScoreDisplay.innerText = 0;
	p3ScoreDisplay.innerText = 0;
	p4ScoreDisplay.innerText = 0;
}

export function hideScoresDisplays() {
	p1Div.style.display = 'none';
	p2Div.style.display = 'none';
	p3Div.style.display = 'none';
	p4Div.style.display = 'none';
}

export function populateSnakeArray() {
	const newSnakes = [];

	for (let i = 0; i < numPlayers.count; i++) {
		if (numPlayers.count === 2 && i === 1) i++; //to ensure diagnals are populated

		const newSnake = [];
		const snake = INIT_SNAKES[i];

		for (let segment of snake) {
			newSnake.push([ ...segment ]);
		}
		newSnakes.push(newSnake);
	}
	return newSnakes;
}
export { SPEED, update, draw, snakes };
