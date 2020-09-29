const users = [];

const addUser = ({ id, user, roomId }) => {
    username = user.username.trim().toLowerCase();
    roomId = roomId.trim().toLowerCase();

    if (!user.username || !roomId)
        return { error: 'Username and room are required' };

    const existingUser = users.find(
        (userDoc) =>
            userDoc.roomId === roomId && userDoc.username === user.username
    );
    if (existingUser) return { error: 'Username is in use' };

    const newUser = {
        id,
        username: user.username,
        avatar: user.avatar,
        roomId,
    };
    users.push(newUser);
    return { newUser };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
};

// addUser({ id: 123, {username: 'Roger', avatar: 'Man'}, room: 'teste' });
// addUser({ id: 43, {username: 'Mike', avatar: 'Man'}, room: 'teste' });
// addUser({ id: 5, {username: 'Thaisa', avatar: 'Woman'}, room: 'teste1' });

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
