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
	const clientId = 'PLAYER-' + createId();
	clients[clientId] = { connection };
	const payload = {
		method: 'connect',
		clientId
	};
	// clientLoop();
	connection.send(JSON.stringify(payload));

	connection.on('message', (msg) => {
		const response = JSON.parse(msg.utf8Data);

		if (response.method === 'create') {
			const clientId = response.clientId;
			const gameId = createId() + createId();
			let playerName = response.playerName;
			// let playerIndex = 0;

			console.log(`client ${clientId} wants to create a new game`);

			games[gameId] = {
				id: gameId,
				clients: [],
				state: {}
			};

			const game = games[gameId];

			if (!playerName) {
				playerName = 'Player-1';
			}

			game.clients.push({
				clientId,
				playerName,
				playerNum: 1,
				score: 0
			});

			// game.state.foodPositions = randomPositionArray(4);

			const payload = {
				method: 'create',
				game
			};

			const con = clients[clientId].connection;
			con.send(JSON.stringify(payload));
		} else if (response.method === 'join') {
			//should have an client ID
			const clientId = response.clientId;
			//should have game ID and error handling
			const gameId = response.gameId;
			let playerName = response.playerName;
			let playerIndex = null;
			const game = games[gameId];
			const con = clients[clientId].connection;
			// con.send(JSON.stringify(payload));

			//check for valid id
			if (!game) {
				const payload = {
					method: 'error',
					msg: 'Invalid game ID'
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

			if (!playerName) {
				playerName = 'Player-' + playerNum;
			}

			game.clients.push({
				clientId,
				playerName,
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

			const client = game.clients.find((client) => client.clientId === clientId);
			client.score += 10;
			console.log('scorer: ', client.clientId, client.score);
			const newPosition = randomPosition();
			const payload = {
				method: 'consume',
				lastConsumer: clientId,
				newPosition,
				game
			};

			game.clients.forEach((client) => {
				clients[client.clientId].connection.send(JSON.stringify(payload));
			});
		} else if (response.method === 'move') {
			const clientId = response.clientId;
			const gameId = response.gameId;
			const playerNum = response.playerNum;
			const game = games[gameId];
			const direction = response.direction;
			const lastInput = response.lastInput;

			// console.log(`client ${clientId} moved ${lastInput}. New heading: x: ${direction.x} y: ${direction.y}`);
			const payload = {
				method: 'move',
				clientId,
				playerNum,
				direction,
				lastInput
				//send snake body
			};

			//send to all but sender
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
