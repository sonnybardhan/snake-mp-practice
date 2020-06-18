//SNAKE GAME==============

// const PORT = process.env.PORT || 9090;
const PORT = 9090;
const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
app.use(express.static('client'));

const WebSocketServer = require('websocket').server;
httpServer.listen(PORT, () => console.log(`listening on port: ${PORT} ... `));
const wss = new WebSocketServer({ httpServer: httpServer });

const clients = {};
const games = {};

wss.on('request', (req) => {
	const connection = req.accept(null, req.origin);

	console.log('client made a request ... ');
	//on client's initial request
	const clientId = createId();
	clients[clientId] = { connection };
	const payload = {
		method: 'connect',
		clientId
	};

	connection.send(JSON.stringify(payload));

	connection.on('message', (msg) => {
		const response = JSON.parse(msg.utf8Data);

		if (response.method === 'create') {
			const clientId = response.clientId;
			const gameId = createId(8);
			// let playerName = response.playerName;
			const speed = response.speed;
			// let playerIndex = 0;

			console.log(`client ${clientId} wants to create a new game`);

			games[gameId] = {
				id: gameId,
				clients: [],
				state: {},
				speed
			};

			const game = games[gameId];

			game.clients.push({
				clientId,
				// playerName,
				playerNum: 1,
				score: 0
			});

			const payload = {
				method: 'create',
				game
			};

			const con = clients[clientId].connection;
			con.send(JSON.stringify(payload));
		} else if (response.method === 'join') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			let playerIndex = null;
			const game = games[gameId];
			const con = clients[clientId].connection;

			//check for valid id
			if (!game) {
				const payload = {
					method: 'error',
					msg: '[server]: Invalid game ID'
				};
				return con.send(JSON.stringify(payload));
			}

			//check for number of players and start accordingly
			if (game.clients.length >= 2) {
				const payload = {
					method: 'error',
					msg: 'Sorry max players reached'
				};
				return con.send(JSON.stringify(payload));
			}

			//check if player is already in game
			playerIndex = game.clients.indexOf(clientId);

			if (playerIndex > -1) {
				const payload = {
					method: 'error',
					msg: 'Invalid request, already in game.'
				};
				return con.send(JSON.stringify(payload));
			}

			const playerNum = game.clients.length + 1;

			game.clients.push({
				clientId,
				score: 0,
				playerNum
			});

			let newPosition = randomPosition();

			const payload = {
				method: 'join',
				game,
				newPosition
			};

			game.clients.forEach((client) => {
				clients[client.clientId].connection.send(JSON.stringify(payload));
			});
		} else if (response.method === 'consume') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			const game = games[gameId];
			const lastConsumer = response.lastConsumer;
			const playerScore = response.playerScore;

			const client = game.clients.find((client) => client.clientId === clientId);
			client.score = playerScore;

			// console.log('scorer: ', client.clientId, client.score);
			const newPosition = randomPosition();
			const payload = {
				method: 'consume',
				lastConsumer,
				newPosition,
				playerScore
			};

			console.log('last consumer, score', lastConsumer, playerScore);

			game.clients.forEach((client) => {
				clients[client.clientId].connection.send(JSON.stringify(payload));
			});
		} else if (response.method === 'grow') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			const playerIndex = response.playerIndex;
			const game = games[gameId];
			const snake = response.snake;

			const payload = {
				method: 'grow',
				// clientId,
				playerIndex,
				snake
			};

			game.clients.forEach((client) => {
				if (client.clientId !== clientId) {
					clients[client.clientId].connection.send(JSON.stringify(payload));
				}
			});
		} else if (response.method === 'move') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			const playerIndex = response.playerIndex;
			const game = games[gameId];
			const snake = response.snake;
			const direction = response.direction;
			const lastInput = response.lastInput;

			// console.log(`client ${clientId} moved ${lastInput}. New heading: x: ${direction.x} y: ${direction.y}`);
			const payload = {
				method: 'move',
				// clientId, //not needed
				playerIndex,
				direction,
				// lastInput, //not needed
				snake
				//send snake body
			};

			//send to all but sender
			game.clients.forEach((client) => {
				if (client.clientId !== clientId) {
					clients[client.clientId].connection.send(JSON.stringify(payload));
				}
			});
		} else if (response.method === 'crash') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			const playerIndex = response.playerIndex;
			const game = games[gameId];

			const payload = {
				method: 'crash',
				playerIndex
			};

			game.clients.forEach((client) => {
				if (client.clientId !== clientId) {
					clients[client.clientId].connection.send(JSON.stringify(payload));
				}
			});
		}
	});

	connection.on('close', () => {
		//remove client from game and update
		//store clientID and game ID together in the clients object
		// clients[clientId] = {connection, gameId}
		clients[clientId] = null;

		//when any client leaves check which game they were in
		//remove from game

		if (Object.keys(clients).length) {
			clientLoop();
		} else {
			console.log('No clients online.');
		}

		console.log(`client: ${clientId} disconnected.`);
	});
});

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvxyz0123456789') {
	let id = '';
	while (len--) {
		id += chars[(Math.random() * chars.length) | 0];
	}
	return id;
}

function clientLoop() {
	for (let [ i, client ] of Object.keys(clients).entries()) {
		if (clients[client]) {
			console.log(i, client, '[connection method]');
		} else {
			console.log(client, ' disconnected.');
		}
	}
}

function randomPosition() {
	return {
		x: (Math.random() * 21 + 1) | 0,
		y: (Math.random() * 21 + 1) | 0
	};
}

// function randomPositionArray(len = 3) {
// 	const arr = [];
// 	while (len--) {
// 		arr.push(randomPosition());
// 	}
// 	return arr;
// }
