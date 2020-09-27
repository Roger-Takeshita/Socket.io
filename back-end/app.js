const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
exports.io = socketio(server);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
require('./config/socket');

app.get('/*', (req, res) => {
    res.status(404).json({ message: "Path doesn't exist" });
});

module.exports = server;
