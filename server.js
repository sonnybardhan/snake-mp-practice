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

	const clientId = 'PLAYER-' + createId();
	clients[clientId] = { connection };
	const payload = {
		method: 'connect',
		clientId
	};

	connection.send(JSON.stringify(payload));

	connection.on('close', () => console.log(`client: ${clientId} disconnected.`));
});

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvxyz0123456789') {
	let id = '';
	while (len--) {
		id += chars[(Math.random() * chars.length) | 0];
	}
	return id;
}
