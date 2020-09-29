import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../utils/socket';
import Message from './Message';
import SupportImg from '../assets/images/telemarketer.png';
import ManImg from '../assets/images/man.png';
import WomanImg from '../assets/images/woman.png';
import UserSound from '../assets/sounds/user.mp3';
import SmsSound from '../assets/sounds/sms.mp3';

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const inputRef = useRef();
    const userRef = useRef({
        username: `Guest-${Math.floor(Math.random() * 1000 + 1)}`,
        avatar: Math.floor(Math.random() * 2 + 1) === 2 ? 'Woman' : 'Man',
    });
    const roomIdRef = useRef('main');
    const bottomChatRef = useRef(null);

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
                {
                    user: userRef.current,
                    roomId: roomIdRef.current,
                },
                (error) => {
                    if (error) {
                        setError(error);
                        setMessages((oldMsgs) => [
                            ...oldMsgs,
                            { username: undefined, message: `ERROR: ${error}` },
                        ]);
                    }
                }
            );

            socket.on('welcome-msg', (msg) => {
                console.log(msg.message);
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
                if (
                    msg.username.toLowerCase() !==
                        userRef.current.username.toLowerCase() &&
                    msg.message !== 'has joined the room' &&
                    msg.message !== 'has left the room'
                ) {
                    const newSmsSound = new Audio(SmsSound);
                    const newSmsSoundPromise = newSmsSound.play();
                    if (newSmsSoundPromise !== undefined) {
                        newSmsSoundPromise
                            .then(() => {
                                // Automatic playback started!
                            })
                            .catch(() => {
                                // Automatic playback failed
                            });
                    }
                }
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('user-disconnected', (msg) => {
                console.log(msg.username, msg.message);
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socket.on('update-users', ({ users, status }) => {
                if (status === 'connected') {
                    const updateUserSound = new Audio(UserSound);
                    const updateUserSoundPromise = updateUserSound.play();
                    if (updateUserSoundPromise !== undefined) {
                        updateUserSoundPromise
                            .then(() => {
                                // Automatic playback started!
                            })
                            .catch(() => {
                                // Automatic playback failed
                                updateUserSound
                                    .play()
                                    .then(() => {
                                        // Automatic playback started again!
                                    })
                                    .catch(() => {
                                        // Automatic playback failed again!
                                    });
                            });
                    }
                }
                setUsers(users);
            });
        }
        connect();
    }, []);

    useEffect(() => {
        bottomChatRef.current.scrollIntoView({ block: 'end' });
    }, [messages]);

    const handleEnter = (e) => {
        if (e.charCode === 13) handleClick(e);
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleClick = (e) => {
        e.preventDefault();
        socket.emit('sendMessage', { message, username: userRef.current }, () =>
            setMessage('')
        );
        inputRef.current.focus();
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <h1 className="chat__header-text">Support</h1>
                <div className="chat__support">
                    <div className="chat__support-img-container">
                        <img
                            className="chat__support-img"
                            src={SupportImg}
                            alt="support"
                        />
                    </div>
                    <p className="chat__support-name">Carlos da Silva Sauro</p>
                    <p className="chat__support-title">Call Center</p>
                </div>
            </div>
            <div className="chat__body">
                <ul className="chat__list">
                    {messages.map((msg, key) => {
                        return (
                            <li key={key} className="chat__item">
                                <Message
                                    imageUrl={
                                        msg.avatar === 'Woman'
                                            ? WomanImg
                                            : ManImg
                                    }
                                    name={msg.username}
                                    position={
                                        msg.username === undefined
                                            ? 'general'
                                            : msg.username.toLowerCase() ===
                                              userRef.current.username.toLowerCase()
                                            ? 'right'
                                            : ''
                                    }
                                    msg={msg.message}
                                />
                            </li>
                        );
                    })}
                </ul>
                <div ref={bottomChatRef}></div>
            </div>
            <div className="chat__cta">
                <form onSubmit={handleClick} className="chat__form">
                    <textarea
                        ref={inputRef}
                        name="message"
                        onKeyPress={handleEnter}
                        onChange={handleChange}
                        value={message}
                        rows={4}
                        data-gramm="false"
                        placeholder="Type your message here..."
                        type="text"
                        className="chat__input"
                        required
                    />
                    <button className="chat__btn">Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
