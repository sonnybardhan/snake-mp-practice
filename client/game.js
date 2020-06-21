// let HOST = location.origin.replace(/^http/, 'ws');

// for local
let HOST = 'ws://localhost:9090';

export const ws = new WebSocket(HOST);
import {
	SPEED,
	update as updateSnake,
	draw as drawSnake,
	snakes,
	reset,
	setSPEED,
	gameOver,
	setSnakes
} from './snake.js';
import { update as updateFood, draw as drawFood, lastConsumer, updateScoresDisplay, setFood } from './food.js';
import { directions, numPlayers, initSinglePlayer, setDirections, setLastInputs, setNumPlayers } from './input.js';

const gameBoard = document.getElementById('game-board');
export const gameIdInput = document.getElementById('game-id-input');
export const createBtn = document.getElementById('create-btn');
export const joinBtn = document.getElementById('join-btn');
export const landingScreen = document.getElementById('landing');
export const waitScreen = document.getElementById('wait-screen');
export const waitMessageSpan = document.getElementById('wait-message-span');
export const gameIdSpan = document.getElementById('game-id-span');
export const escapeMessageSpan = document.getElementById('escape-message-span');
export const speedInput = document.getElementById('speed-input');
export const playerCountInput = document.getElementById('player-count-input');
export const speedDisplay = document.getElementById('speed-display');
export const playerCountDisplay = document.getElementById('player-count-display');
export const playerInfo = document.getElementById('player-info');

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

export const matchInputSlider = document.getElementById('match-count-input');
export const matchCountDisplay = document.getElementById('match-count-display');

export let clientId = null;
export let gameId = null;
export let playerNum = 1;
export let playerIndex = 0;
export let playerSpeedInput = 10;
export let playerScore = 0;
export let scores = [ 0, 0, 0, 0 ];
export let foodArray = [];
export let matchCount = 1;

export function setMatchCount(value) {
	matchCount = value;
}

export function setFoodArray(value, reset = false) {
	if (reset) {
		foodArray = [];
	}
	foodArray.push(...value);
}

export const INIT_SCORES = [ 0, 0, 0, 0 ];

export const playerColors = [ 'green', 'orange', 'white', 'yellow' ];

export function displayScreens(playerCount) {
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

function onLoad(value = 10) {
	setSpeedData(value);
	setPlayersData(1);
	setMatchData(3);
}

onLoad();

speedInput.addEventListener('change', (e) => {
	playerSpeedInput = e.target.value;
	speedDisplay.innerText = playerSpeedInput;
	setSPEED(playerSpeedInput);
	speedInput.blur();
});

playerCountInput.addEventListener('change', (e) => {
	// numPlayers.count = parseInt(e.target.value);
	setNumPlayers(parseInt(e.target.value));
	playerCountDisplay.innerText = numPlayers;
	playerCountInput.blur();
});

matchInputSlider.addEventListener('change', (e) => {
	setMatchCount(parseInt(e.target.value));
	// console.log('new matchCount: ', matchCount);
	matchCountDisplay.innerText = matchCount;
	matchInputSlider.blur();
});

export let game = { status: 'landing', mode: 'single' };

ws.onopen = (e) => console.log('connected to server');

ws.onmessage = (msg) => {
	const response = JSON.parse(msg.data);

	if (response.method === 'connect') {
		clientId = response.clientId;
	} else if (response.method === 'create') {
		playerNum = 1;
		playerIndex = 0;
		gameId = response.game.id;
		gameIdInput.value = gameId;
		playerInfo.innerText = `PLAYER 1: GREEN`;
		playerInfo.classList.add('green');
		// numPlayers.count = response.game.numPlayers;
		setNumPlayers(response.game.numPlayers);
		//install timer here
		// const remaining = numPlayers.count - response.game.clients.length;
		const remaining = numPlayers - response.game.clients.length;
		const msg = `WAITING FOR ${remaining > 1 ? remaining : 'AN'} OPPONENT${remaining > 1 ? 'S' : ''} ...`;
		waitingScreen(msg, gameId, '[ESC] to quit');
		//generate a time out
	} else if (response.method === 'join') {
		// numPlayers.count = response.game.numPlayers;
		setNumPlayers(response.game.numPlayers);

		const me = response.game.clients.find((client) => client.clientId === clientId);

		// foodArray = [];
		// foodArray.push(...response.game.foodArray);
		setFoodArray(response.game.foodArray, true);

		playerIndex = me.playerIndex;
		playerInfo.innerText = `PLAYER ${playerIndex + 1}: ${playerColors[playerIndex].toUpperCase()}`;
		playerInfo.classList.add(playerColors[playerIndex]);

		// food[0] = foodArray[0][0];
		// food[1] = foodArray[0][1];

		setFood(foodArray[0]);

		setSPEED(response.game.speed);
		gameId = response.game.id;
		setMatchCount(response.game.matchCount);
		// console.log('matchCount set by creator: ', matchCount);
		setSnakes(numPlayers);
		setDirections(numPlayers);
		setLastInputs(numPlayers);

		if (numPlayers > 1 && numPlayers === response.game.clients.length) {
			let time = 3;
			let id = setInterval(() => {
				const msg = `STARTING IN ${time--}`;
				waitingScreen(msg, '', '[ESC] to quit');

				if (time < 0) {
					clearInterval(id);
					playerInfo.innerText = ``;
					playerInfo.classList.remove(playerColors[playerIndex]);
					displayScreens(numPlayers);
					playScreen();
					start();
				}
			}, 750);
		} else {
			const remaining = numPlayers - response.game.clients.length;
			const msg = `WAITING FOR ${remaining} MORE OPPONENT${remaining > 1 ? 'S' : ''} ... `;
			waitingScreen(msg, gameId, '[ESC] to quit');
		}
	} else if (response.method === 'consume') {
		if (playerIndex !== response.lastConsumer.id) {
			foodArray.shift();
			setFood(foodArray[0]);
		}

		lastConsumer.id = response.lastConsumer.id;
		scores[lastConsumer.id] = response.playerScore;
		updateScoresDisplay(lastConsumer.id, response.playerScore);
	} else if (response.method === 'move') {
		const opponentIndex = response.playerIndex;

		// directions[opponentIndex][0] = response.direction[0];
		// directions[opponentIndex][1] = response.direction[1];

		function setPlayerDirection(index, direction) {
			directions[index] = [ ...direction ];
			console.log(`set Player-${index + 1}'s direction from new function.'`);
		}
		setPlayerDirection(opponentIndex, response.direction);

		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;

		for (let i = 0; i < newSnake.length; i++) {
			oppSnake[i] = [ ...newSnake[i] ];
		}
	} else if (response.method === 'grow') {
		const opponentIndex = response.playerIndex;
		const oppSnake = snakes[opponentIndex];
		const newSnake = response.snake;
		for (let i = 0; i < newSnake.length; i++) {
			oppSnake[i] = [ ...newSnake[i] ];
		}
	} else if (response.method === 'crash') {
		//check if at least 2 players are remaining
		const msg = `Player${response.playerIndex + 1} crashed!`;
		gameOver(msg);
	} else if (response.method === 'quit') {
		const msg = `Player${response.playerIndex + 1} quit`;
		//check if at least 2 players are remaining

		game.status = 'landing';
		gameOver(msg);
	} else if (response.method === 'requestFood') {
		const sentFood = response.foodArray;
		// foodArray.push(...sentFood);
		setFoodArray(sentFood);
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
	if (numPlayers === 1) {
		game.mode = 'single';
		game.status = 'landing';

		let time = 3;
		let id = setInterval(() => {
			waitingScreen(`STARTING IN ${time--}`, '', '[ESC] to quit');
			playerInfo.innerText = `Color: Green`;
			playerInfo.classList.add('green');
			if (time < 0) {
				clearInterval(id);
				playerInfo.innerText = ``;
				playerInfo.classList.remove(playerColors[playerIndex]);
				initSinglePlayer();

				// playScreen();
				start();
				createBtn.blur();
			}
		}, 750);

		return;
	} else {
		console.log('matchCount at the time of creating: ', matchCount);
		const payload = {
			method: 'create',
			clientId,
			numPlayers,
			speed: SPEED,
			matchCount
		};
		ws.send(JSON.stringify(payload));
		game.mode = 'multi';
	}
});

joinBtn.addEventListener('click', () => {
	gameId = gameIdInput.value.trim();

	if (!gameId || gameId.length < 8) {
		gameIdInput.placeholder = 'GAME ID REQUIRED!';
		setTimeout(() => {
			gameIdInput.placeholder = 'GAME ID';
		}, 1500);
		// return console.log('Please enter a game ID');
	} else {
		joinBtn.disabled = true;
		const payload = {
			method: 'join',
			clientId,
			gameId
		};
		ws.send(JSON.stringify(payload));
		game.mode = 'multi';
	}
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

//MATCH UTILITY FUNCTIONS

export function setMatchData(value) {
	console.log('using setmatchdata');
	setMatchCount(value);
	matchInputSlider.value = value;
	matchCountDisplay.innerText = value;
	matchInputSlider.blur();
}

export function setPlayersData(value) {
	console.log('using setPlayersData');
	setNumPlayers(value);
	playerCountInput.value = value;
	playerCountDisplay.innerText = value;
	playerCountInput.blur();
}

export function setSpeedData(value) {
	console.log('using setSpeedData');
	setSPEED(value);
	speedInput.value = value;
	speedDisplay.innerText = value;
	speedInput.blur();
}
