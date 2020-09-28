const { io } = require('../app');
const { generateMessage } = require('../utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('../database/user');

io.on('connection', (socket) => {
    console.log();
    console.log('New Connection', socket.id);

    socket.on('join', ({ username, roomId }, callback) => {
        console.log(`${username} has joined the ${roomId} room - ${socket.id}`);
        const { error, user } = addUser({ id: socket.id, username, roomId });

        if (error) return callback(error);
        socket.join(user.roomId);
        socket.emit(
            'welcome-msg',
            generateMessage('', `Welcome ${user.username}!`)
        );
        socket.broadcast
            .to(user.roomId)
            .emit(
                'message',
                generateMessage(user.username, `has joined the room`)
            );
        io.to(user.roomId).emit('update-users', {
            roomId: user.roomId,
            users: getUsersInRoom(user.roomId),
        });
        callback();
    });

    socket.on('sendMessage', ({ message }, callback) => {
        const user = getUser(socket.id);
        io.to(user.roomId).emit(
            'message',
            generateMessage(user.username, message)
        );
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            console.log(`${user.username} has let the room`);
            io.to(user.roomId).emit(
                'user-disconnected',
                generateMessage(user.username, `has left the room`)
            );
            io.to(user.roomId).emit('update-users', {
                roomId: user.roomId,
                users: getUsersInRoom(user.roomId),
            });
        }
    });
});
