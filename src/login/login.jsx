// Login and account creation. Accounts are saved in the browser until the service exists.
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login({ userName, setUserName }) {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    // Accounts are stored as { username: password }. This will be replaced by the login service.
    function loadUsers() {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }

    // After login, open a join link if the URL has one. Otherwise go to the budget list.
    function afterLogin() {
        const join = new URLSearchParams(window.location.search).get('join');
        if (join) return `/budgets?join=${join}`;
        return '/budgets';
    }

    function finishLogin() {
        localStorage.setItem('userName', name);
        setUserName(name);
        navigate(afterLogin());
    }

    function login() {
        const users = loadUsers();
        if (users[name] !== password) {
            setError('Invalid username or password');
            return;
        }
        finishLogin();
    }

    function createAccount() {
        const users = loadUsers();
        if (users[name]) {
            setError('Username already exists');
            return;
        }
        users[name] = password;
        localStorage.setItem('users', JSON.stringify(users));
        finishLogin();
    }

    // Someone who is already logged in should not see this form.
    if (userName) return <Navigate to={afterLogin()} replace />;

    return (
        <main>
            <h2>Login to Co-Budget</h2>
            <p>
                Co-Budget is a shared budget application for families and couples. Create budgets, add envelopes,
                track expenses, and see when others spend money in real time.
            </p>

            <form id="login-form" onSubmit={(event) => { event.preventDefault(); login(); }}>
                <fieldset>
                    <legend>Login or create an account</legend>
                    <label>
                        Username
                        <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="username" />
                    </label>
                    <label>
                        Password
                        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                    </label>
                    {error && <p className="text-danger">{error}</p>}
                    <button className="btn btn-primary" type="submit" disabled={!name || !password}>Login</button>
                    <button className="btn btn-outline-primary ms-2" type="button" disabled={!name || !password} onClick={createAccount}>
                        Create Account
                    </button>
                </fieldset>
            </form>
        </main>
    );
}
