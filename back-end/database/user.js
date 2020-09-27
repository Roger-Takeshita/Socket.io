const users = [];

const addUser = ({ id, username, roomId }) => {
    username = username.trim().toLowerCase();
    roomId = roomId.trim().toLowerCase();

    if (!username || !roomId)
        return { error: 'Username and room are required' };

    const existingUser = users.find(
        (user) => user.roomId === roomId && user.username === username
    );
    if (existingUser) return { error: 'Username is in use' };

    const user = { id, username, roomId };
    users.push(user);
    return { user };
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

// addUser({ id: 123, username: 'Roger', room: 'teste' });
// addUser({ id: 43, username: 'Mike', room: 'teste' });
// addUser({ id: 5, username: 'Thaisa', room: 'teste1' });

// console.log(getUser(43));
// console.log(getUsersInRoom('teste'));
// console.log(getUsersInRoom('teste1'));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
