import React from 'react';

function Message({ imageUrl, name, msg, position }) {
    return (
        <div
            className={
                position === 'right' ? 'message message--right' : 'message'
            }
        >
            <div
                className={
                    position === 'right'
                        ? 'message__img-container message__img-container--right'
                        : 'message__img-container'
                }
            >
                <img src={imageUrl} alt="Image" className="message__img" />
            </div>
            <span
                className={
                    position === 'right'
                        ? 'message__name message__name--right'
                        : 'message__name'
                }
            >
                {name}
            </span>
            <span
                className={
                    position === 'right'
                        ? 'message__msg message__msg--right'
                        : 'message__msg'
                }
            >
                {msg}
            </span>
        </div>
    );
}

export default Message;
