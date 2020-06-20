// let HOST = location.origin.replace(/^http/, 'ws');

// for local
let HOST = 'ws://localhost:9090';

export const ws = new WebSocket(HOST);
import { SPEED, update as updateSnake, draw as drawSnake, snakes, reset, setSPEED, gameOver } from './snake.js';
import { update as updateFood, draw as drawFood, food, lastConsumer, updateScoresDisplay } from './food.js';
import { directions, numPlayers, initSinglePlayer } from './input.js';

export const gameIdInput = document.getElementById('game-id-input');
export const createBtn = document.getElementById('create-btn');
export const joinBtn = document.getElementById('join-btn');
const landingScreen = document.getElementById('landing');
const waitScreen = document.getElementById('wait-screen');
const waitMessageSpan = document.getElementById('wait-message-span');
const gameIdSpan = document.getElementById('game-id-span');
const escapeMessageSpan = document.getElementById('escape-message-span');
export const speedInput = document.getElementById('speed-input');
export const playerCountInput = document.getElementById('player-count-input');
export const speedDisplay = document.getElementById('speed-display');
export const playerCountDisplay = document.getElementById('player-count-display');
export const playerInfo = document.getElementById('player-info');

const gameBoard = document.getElementById('game-board');
export const crashScreen = document.getElementById('crash-screen');
export const gameOverMsg = document.getElementById('game-over-msg');
export const gameOverResultDisplay = document.getElementById('game-over-result-display');

export const p1ScoreDisplay = document.getElementById('player-1');
export const p2ScoreDisplay = document.getElementById('player-2');
export const p3ScoreDisplay = document.getElementById('player-3');
export const p4ScoreDisplay = document.getElementById('player-4');

export const p1Div = document.getElementById('p1-display-div');
export const p2Div = document.getElementById('p2-display-div');
export const p3Div = document.getElementById('p3-display-div');
export const p4Div = document.getElementById('p4-display-div');
export const pDivArray = [ p1Div, p2Div, p3Div, p4Div ];

export let foodPosition = {};
export let clientId = null;
export let gameId = null;
export let playerNum = 1;
export let playerIndex = 0;
export let playerSpeedInput = 10;
export let playerScore = 0;
// export let scores = { 0: 0, 1: 0, 2: 0, 3: 0 };
export let scores = [ 0, 0, 0, 0 ];
export let multiPlayerCount = 2;
export let foodArray = [];

export function setFoodArray(value) {
	//not needed
	foodArray.push(...value);
}

export const INIT_SCORES = [ 0, 0, 0, 0 ]; //convert to array

export const playerColors = [ 'green', 'orange', 'white', 'yellow' ];

export function displayScreens(playerCount) {
	// for (let i = 0; i < playerCount; i++) {
	for (let i = 0; i < pDivArray.length; i++) {
		if (i < playerCount) {
			pDivArray[i].style.display = 'block';
		} else {
			pDivArray[i].style.display = 'none';
		}
	}
}

export function resetPlayerScore() {
	playerScore = 0;
}

export function resetAllScores() {
	scores = [ ...INIT_SCORES ];
}

export function addToScore(value) {
	playerScore += value;
}

export function setPlayerIndex(value) {
	playerIndex = value;
}

export function setMultiPlayerCount(value) {
	multiPlayerCount = value;
}
//stop, wait, starting, play, pause, gameOver

function onLoad(value = 10) {
	setSPEED(value);

	speedInput.value = SPEED;
	speedDisplay.innerText = SPEED;
	speedInput.blur();

	playerCountInput.value = 2;
	playerCountDisplay.innerText = 2;
	multiPlayerCount = 2;
	playerCountInput.blur();
}

onLoad();

speedInput.addEventListener('change', (e) => {
	playerSpeedInput = e.target.value;
	speedDisplay.innerText = playerSpeedInput;
	setSPEED(playerSpeedInput);
	speedInput.blur();
});

playerCountInput.addEventListener('change', (e) => {
	// console.log(`playerCount input (prev)= ${multiPlayerCount}`);
	multiPlayerCount = parseInt(e.target.value);
	// console.log(`playerCount input = ${multiPlayerCount}`);
	playerCountDisplay.innerText = e.target.value;
	playerCountInput.blur();
});

export let game = { status: 'landing', mode: 'single' };

ws.onopen = (e) => console.log('connected to server');

ws.onmessage = (msg) => {
	const response = JSON.parse(msg.data);

	if (response.method === 'connect') {
		clientId = response.clientId;
		// console.log(`client ${clientId} successfully added`);
	} else if (response.method === 'create') {
		// console.log('server sent a message');
		playerNum = 1;
		playerIndex = 0;
		gameId = response.game.id;
		gameIdInput.value = gameId;
		// playerInfo.innerText = `SNAKE COLOR: GREEN`;
		playerInfo.innerText = `PLAYER 1: GREEN`;
		playerInfo.classList.add('green');

		// multiPlayerCount = response.game.multiPlayerCount;
		//install timer here

		waitingScreen('WAITING FOR OPPONENTS ... ', gameId, '[ESC] to quit');
		// console.log('Creators player index and num set', playerIndex, playerNum);
		// console.log(`The number of players a request has been made for `, response.game.multiPlayerCount);
		// console.log(playerIndex, playerColors[playerIndex]);
		//generate a time out
	} else if (response.method === 'join') {
		// console.log('server sent a message: player joined!', response);
		// console.log('num of players: ', response.game.clients.length);

		// const numPlayers = response.game.clients.length;

		//this makes NO SENSE
		numPlayers.count = response.game.clients.length;

		// console.log('resetting numplayers.count on join: ', numPlayers.count);

		multiPlayerCount = response.game.multiPlayerCount;

		const me = response.game.clients.find((client) => client.clientId === clientId);
		// console.log('response from server: ', response);
		// console.log('food array from server: ', response.game.foodArray);
		foodArray = [];
		foodArray.push(...response.game.foodArray);
		// console.log('me: ', me);
		// if (!playerIndex) {

		playerIndex = me.playerIndex;

		// }
		// playerIndex = playerNum - 1;
		// console.log('joiners player index and num set', playerIndex, playerNum);
		// }

		// console.log('playerColors: ', playerColors);
		// console.log('playerIndex: ', playerIndex);
		// console.log('playerColors[playerIndex]: ', playerColors[playerIndex]);

		playerInfo.innerText = `PLAYER ${playerIndex + 1}: ${playerColors[playerIndex].toUpperCase()}`;
		playerInfo.classList.add(playerColors[playerIndex]);

		// console.log('I joined, i am Player-', playerIndex + 1);
		// console.log('I am ', playerColors[playerIndex].toUpperCase());

		// food.x = response.newPosition.x;
		// food.y = response.newPosition.y;

		food[0] = foodArray[0][0];
		food[1] = foodArray[0][1];
		// food.x = foodArray[0].x;
		// food.y = foodArray[0].y;

		// console.log(foodArray);
		// console.log(food.x, food.y, foodArray[0].x, foodArray[0].y);
		// foodArray.shift();

		// console.log('creator has set speed to: ', response.game.speed);
		setSPEED(response.game.speed);
		// if (numPlayers.count === 2) { to make it dynamic set 2 to input value by creator
		// if (response.game.clients.length === response.playerCount) {
		gameId = response.game.id;

		if (response.game.clients.length === 2) {
			//starts the moment there are 2 players
			let time = 3;
			let id = setInterval(() => {
				// waitMessageSpan.innerText = `STARTING IN ${time--}`;
				waitingScreen(`STARTING IN ${time--}`, '', '[ESC] to quit');

				if (time < 0) {
					clearInterval(id);
					playerInfo.innerText = ``;
					playerInfo.classList.remove(playerColors[playerIndex]);
					displayScreens(2); //make this dynamic to playerCount
					playScreen();
					start();
				}
			}, 750);
		} else {
		}
	} else if (response.method === 'consume') {
		// food.x = response.newPosition.x;
		// food.y = response.newPosition.y;

		// console.log(food.x, food.y, foodArray[0].x, foodArray[0].y)
		if (playerIndex !== response.lastConsumer.id) {
			foodArray.shift();
			food[0] = foodArray[0][0];
			food[1] = foodArray[0][1];
		}

		console.log('items remaining ', foodArray.length);

		lastConsumer.id = response.lastConsumer.id;
		scores[lastConsumer.id] = response.playerScore;
		// console.log('score update: ', scores);
		// console.log(lastConsumer.id, response.playerScore);

		updateScoresDisplay(lastConsumer.id, response.playerScore);
	} else if (response.method === 'move') {
		const opponentIndex = response.playerIndex;

		directions[opponentIndex][0] = response.direction[0];
		directions[opponentIndex][1] = response.direction[1];

		// directions[opponentIndex].x = response.direction.x;
		// directions[opponentIndex].y = response.direction.y;

		//experiment to see if this is quicker,
		//might have to put this back if snake body is not appearing as it should

		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;
		for (let i = 0; i < newSnake.length; i++) {
			// oppSnake[i] = { ...newSnake[i] };
			oppSnake[i] = [ ...newSnake[i] ];
		}
	} else if (response.method === 'grow') {
		const opponentIndex = response.playerIndex;
		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;
		for (let i = 0; i < newSnake.length; i++) {
			oppSnake[i] = [ ...newSnake[i] ];
		}
		// console.log('re-laid opp snake GROW: ', oppSnake);
		// console.log(`opponents number: grew -> player-${opponentIndex + 1}`);
	} else if (response.method === 'crash') {
		//check if at least 2 players are remaining
		const msg = `You win! Player ${response.playerIndex + 1} crashed`;
		gameOver(msg);
	} else if (response.method === 'quit') {
		const msg = `You win. Player${response.playerIndex + 1} quit`;
		//check if at least 2 players are remaining

		game.status = 'landing';
		gameOver(msg);
	} else if (response.method === 'requestFood') {
		const sentFood = response.foodArray;
		foodArray.push(...sentFood);
		// console.log(`server sent food! new food array len`, foodArray.length);
	} else if (response.method === 'error') {
		console.log('There was an error!', response.msg);
		//spring up a message display pop up
		if (response.type === 'join') {
			gameIdInput.placeholder = response.msg.toUpperCase();
			setTimeout(() => {
				gameIdInput.placeholder = 'GAME ID';
			}, 1500);
		}

		reset();
	}
};

createBtn.addEventListener('click', () => {
	// console.log('from create event handler, multiplayer count: ', multiPlayerCount);
	// console.log(typeof multiPlayerCount);
	if (multiPlayerCount === 1) {
		// console.log('entered this');
		game.mode = 'single';
		game.status = 'landing';
		initSinglePlayer();
		start();
		return;
	} else {
		// console.log('multiplayer count: ', multiPlayerCount);
		const payload = {
			method: 'create',
			clientId,
			multiPlayerCount,
			speed: SPEED
		};
		ws.send(JSON.stringify(payload));
		game.mode = 'multi';
	}
});

joinBtn.addEventListener('click', () => {
	gameId = gameIdInput.value;

	if (!gameId) {
		gameIdInput.placeholder = 'GAME ID REQUIRED!';
		setTimeout(() => {
			gameIdInput.placeholder = 'GAME ID';
		}, 1500);
		// return console.log('Please enter a game ID');
	} else {
		joinBtn.disabled = true;
	}

	const payload = {
		method: 'join',
		clientId,
		gameId
		// playerName
	};
	ws.send(JSON.stringify(payload));
	game.mode = 'multi';
});

ws.onclose = (e) => console.log('disconnected from server');
ws.onerror = (e) => console.log('Oops! ', e); //reset everything here for single player

//game logic=====================

let lastRender = 0;

function main(currentTime) {
	// if (paused) return;
	if (game.status !== 'play') return;
	requestAnimationFrame(main);
	const delta = (currentTime - lastRender) / 1000;
	if (delta < 1 / SPEED) return;
	lastRender = currentTime;
	update();
	draw();
}

export function start() {
	switch (game.status) {
		case 'landing':
			game.status = 'play';
			playScreen();
			break;
		case 'wait':
			break;
		case 'starting':
			break;
		case 'play':
			if (game.mode === 'single') {
				game.status = 'pause';
				pauseScreen();
			} else {
				// waitMessageSpan.innerText = `No pausing during multiplayer`;
				// const id = setTimeout(() => {
				// 	waitMessageSpan.innerText = ``;
				// 	clearInterval(id);
				// }, 500);
			}
			break;
		case 'pause':
			game.status = 'play';
			playScreen();
			break;
		case 'gameOver':
			// gameOverScreen();
			break;
		default:
			// defaultScreen();
			break;
	}
	requestAnimationFrame(main); //is this the best place to put it? try returning
}

function update() {
	updateFood();
	updateSnake();
}

function draw() {
	gameBoard.innerHTML = '';
	drawFood(gameBoard);
	drawSnake(gameBoard);
}

export function stopScreen() {
	gameBoard.style.zIndex = 3;
	landingScreen.style.zIndex = 2;
	waitScreen.style.zIndex = 1;
}
export function waitingScreen(banner = '', gameId = '', esc = '') {
	waitMessageSpan.innerText = banner;
	gameIdSpan.innerText = gameId;
	escapeMessageSpan.innerText = esc;
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function startingScreen() {
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function playScreen() {
	waitMessageSpan.innerText = ``;
	escapeMessageSpan.innerText = ``;
	gameBoard.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function pauseScreen() {
	waitMessageSpan.innerText = `[SPACE] to resume`;
	escapeMessageSpan.innerText = `[ESC] to quit`;
	waitScreen.style.zIndex = 3;
	gameBoard.style.zIndex = 2;
	landingScreen.style.zIndex = 1;
}
export function homeScreen() {
	landingScreen.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	gameBoard.style.zIndex = 1;
}
export function defaultScreen() {
	landingScreen.style.zIndex = 3;
	waitScreen.style.zIndex = 2;
	gameBoard.style.zIndex = 1;
}
