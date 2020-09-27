import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const inputRef = useRef();
    const usernameRef = useRef(`Guest-${Math.floor(Math.random() * 1000 + 1)}`);
    const roomIdRef = useRef('main');

    useEffect(() => {
        function connect() {
            const dateOptions = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };

            socket.emit(
                'join',
                { username: usernameRef.current, roomId: roomIdRef.current },
                (error) => {
                    if (error) {
                        console.log(error);
                        setError(error);
                    }
                }
            );

            socket.on('message', (msg) => {
                console.log(
                    new Date(msg.createdAt).toLocaleDateString(
                        'en-US',
                        dateOptions
                    ),
                    msg.username,
                    msg.message
                );
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('user-connected', (msg) => {
                console.log(
                    'User connected: ',
                    new Date(msg.createdAt).toLocaleDateString(
                        'en-US',
                        dateOptions
                    ),
                    msg.username,
                    msg.message
                );
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('disconnect', (msg) => {
                console.log(
                    new Date(msg.createdAt).toLocaleDateString(
                        'en-US',
                        dateOptions
                    ),
                    msg.message
                );
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('roomData', ({ users }) => {
                setUsers(users);
            });
        }
        connect();
    }, []);

    const handleChange = (e) => {
        if (e.charCode === 13) {
            inputRef.current.focus();
            e.preventDefault();
        }
        setMessage(e.target.value);
    };

    const handleClick = (e) => {
        e.preventDefault();
        socket.emit(
            'sendMessage',
            { message, username: usernameRef.current },
            () => setMessage('')
        );
        setMessage('');
        inputRef.current.focus();
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <h1>Chat</h1>
            </div>
            <div className="chat__body">
                <ul className="chat__list">
                    {messages.map((msg, key) => {
                        return (
                            <li key={key} className="chat__item">
                                <span
                                    className={
                                        msg.username.toLowerCase() ===
                                        usernameRef.current.toLowerCase()
                                            ? 'chat__user--me'
                                            : 'chat__user'
                                    }
                                >
                                    {msg.username}
                                </span>
                                {msg.message}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="chat__cta">
                <form onSubmit={handleClick} className="chat__cta">
                    <input
                        ref={inputRef}
                        name="message"
                        onChange={handleChange}
                        value={message}
                        type="text"
                        className="chat__input"
                    />
                    <button className="chat__btn">Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
