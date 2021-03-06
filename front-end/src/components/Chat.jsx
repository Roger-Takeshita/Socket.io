import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import Users from './Users';
import SupportImg from '../assets/images/telemarketer.png';
import ManImg from '../assets/images/man.png';
import WomanImg from '../assets/images/woman.png';
import UserSound from '../assets/sounds/user.mp3';
import SmsSound from '../assets/sounds/sms.mp3';
import ChatIcon from './ChatIcon';

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const inputRef = useRef();
    const userRef = useRef({
        username: `Guest-${Math.floor(Math.random() * 1000 + 1)}`,
        avatar: Math.floor(Math.random() * 2 + 1) === 2 ? 'Woman' : 'Man',
    });
    const roomIdRef = useRef('main');
    const bottomChatRef = useRef(0);
    const socketRef = useRef(null);

    useEffect(() => {
        function connect() {
            socketRef.current = io('/');
            const dateOptions = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };

            socketRef.current.emit(
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

            socketRef.current.on('welcome-msg', (msg) => {
                console.log(msg.message);
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socketRef.current.on('message', (msg) => {
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

            socketRef.current.on('user-disconnected', (msg) => {
                console.log(msg.username, msg.message);
                setMessages((oldMsgs) => [...oldMsgs, msg]);
            });

            socketRef.current.on('update-users', ({ users, status }) => {
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
        setTimeout(() => {
            open && bottomChatRef.current.scrollIntoView({ block: 'end' });
        }, 150);
        if (!open) setCount((oldState) => oldState + 1);
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            setError('');
        }, 5000);
    }, [error]);

    const handleEnter = (e) => {
        if (e.charCode === 13) handleClick(e);
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleClick = (e) => {
        e.preventDefault();
        socketRef.current.emit(
            'sendMessage',
            { message, username: userRef.current },
            () => setMessage('')
        );
        inputRef.current.focus();
    };

    const handleMinimize = () => {
        setOpen((oldState) => !oldState);
        if (!open) {
            setCount(0);
            setTimeout(() => {
                !open && bottomChatRef.current.scrollIntoView({ block: 'end' });
            }, 300);
        }
    };

    return (
        <div className="wrapper">
            <div className="chat-container">
                <div className={open ? 'chat' : 'chat chat--open'}>
                    <div className="chat__header">
                        <div
                            onClick={handleMinimize}
                            className={
                                open
                                    ? 'chat__btn-icon'
                                    : 'chat__btn-icon chat__btn-icon--open'
                            }
                        >
                            {open ? (
                                <div className="chat__minimize"></div>
                            ) : (
                                <div className="chat__icon-container">
                                    <ChatIcon className="chat__icon" />
                                    {!open && count > 0 && (
                                        <div className="chat__counter">
                                            {count}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <h2
                            className={
                                open
                                    ? 'chat__header-text'
                                    : 'chat__header-text chat__header-text--open'
                            }
                        >
                            Support
                        </h2>
                        {open && (
                            <div className="chat__support">
                                <div className="chat__support-img-container">
                                    <img
                                        className="chat__support-img"
                                        src={SupportImg}
                                        alt="support"
                                    />
                                </div>
                                <p className="chat__support-name">
                                    Roger Takeshita
                                </p>
                                <p className="chat__support-title">
                                    Full-Stack Dev
                                </p>
                            </div>
                        )}
                    </div>
                    {open && (
                        <>
                            <div className="chat__body">
                                <ul className="chat__list">
                                    {messages.map((msg, key) => {
                                        return (
                                            <li
                                                key={key}
                                                className="chat__item"
                                            >
                                                <Message
                                                    imageUrl={
                                                        msg.avatar === 'Woman'
                                                            ? WomanImg
                                                            : ManImg
                                                    }
                                                    name={msg.username}
                                                    position={
                                                        !msg.username
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
                                <form
                                    onSubmit={handleClick}
                                    className="chat__form"
                                >
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
                        </>
                    )}
                </div>
                {open && error !== '' && <div className="error">{error}</div>}
            </div>
            {open && <Users users={users} />}
        </div>
    );
}

export default Chat;
