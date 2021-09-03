const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sessions = []

app.use('/lib', express.static('lib'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
	socket.on('user identification', (user) => {
		sessions.push({
			socket: socket.id,
			user: user
		})

		console.table(sessions)

		io.emit('online', sessions)
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', {
			msg,
			name: sessions.find(session => session.socket === socket.id).user.name
		});
	});

	socket.on('disconnect', () => {
		sessions = sessions.filter(session => session.socket !== socket.id)

		io.emit('online', sessions)

		console.log(`${socket.id} desconectado`)
		console.table(sessions)
	});
});

server.listen(8018, () => {
	console.log('listening on *:8018');
});