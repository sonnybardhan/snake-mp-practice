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
	playerScore
} from './game.js';

// const SPEED = 11;
let SPEED = 2;

export function setSPEED(value) {
	if (value > 0 && value <= 30) {
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
		//here check for index form the losersArr (store indexes of players who have dropped out or quit)
		let snake = snakes[i];

		const newHead = { ...snake[0] }; //first item in array is head

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
	}, 2000);
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
	resetScoresDisplay();
	hideScoresDisplays();
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
