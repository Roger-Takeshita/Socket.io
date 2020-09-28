import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';
import SupportImg from '../assets/images/telemarketer.png';

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

            socket.on('welcome-msg', (msg) => {
                console.log(msg.message, msg.username);
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

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

            socket.on('user-disconnected', (msg) => {
                console.log(msg.username, msg.message);
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('update-users', ({ users }) => {
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
                <h1 className="chat__header-text">Support</h1>
            </div>
            <div className="chat__support">
                <div className="chat__support-img-container">
                    <img
                        className="chat__support-img"
                        src={SupportImg}
                        alt="support"
                    />
                </div>
                <p className="chat__support-name">Carlos da Silva Sauro</p>
                <p className="chat__support-job">Call Center</p>
            </div>
            <div className="chat__body">
                <ul className="chat__list">
                    {messages.map((msg, key) => {
                        return (
                            <li key={key} className="chat__item">
                                {msg.username !== '' && (
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
                                )}
                                {msg.message}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="chat__cta">
                <form onSubmit={handleClick} className="chat__form">
                    <textarea
                        ref={inputRef}
                        name="message"
                        onChange={handleChange}
                        value={message}
                        rows={4}
                        placeholder="Type your message here..."
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
