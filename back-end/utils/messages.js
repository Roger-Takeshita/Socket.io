const generateMessage = (user, message) => {
    return {
        username: user.username,
        avatar: user.avatar,
        message,
        createdAt: new Date().getTime(),
    };
};

module.exports = {
    generateMessage,
};
