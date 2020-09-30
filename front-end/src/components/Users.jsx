import React from 'react';

function Users({ users }) {
    return (
        <div className="users">
            <h2>Online:</h2>
            <div className="users__list-container">
                <ul className="users__list">
                    {users.map((user) => {
                        return (
                            <li key={user.id} className="users__item">
                                {user.username}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Users;
