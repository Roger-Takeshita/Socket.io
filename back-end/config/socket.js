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

    socket.on('join', ({ user, roomId }, callback) => {
        console.log(
            `${user.username} has joined the ${roomId} room - ${socket.id}`
        );
        const { error, newUser } = addUser({ id: socket.id, user, roomId });

        if (error) return callback(error);
        socket.join(newUser.roomId);
        socket.emit(
            'welcome-msg',
            generateMessage('', `Welcome ${newUser.username}`)
        );
        socket.broadcast
            .to(newUser.roomId)
            .emit('message', generateMessage(newUser, `has joined the room`));
        io.to(newUser.roomId).emit('update-users', {
            roomId: newUser.roomId,
            users: getUsersInRoom(newUser.roomId),
            status: 'connected',
        });
        callback();
    });

    socket.on('sendMessage', ({ message }, callback) => {
        const user = getUser(socket.id);
        io.to(user.roomId).emit('message', generateMessage(user, message));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            console.log(`${user.username} has let the room`);
            io.to(user.roomId).emit(
                'user-disconnected',
                generateMessage(user, `has left the room`)
            );
            io.to(user.roomId).emit('update-users', {
                roomId: user.roomId,
                users: getUsersInRoom(user.roomId),
                status: 'disconnected',
            });
        }
    });
});
