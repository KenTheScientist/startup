// Login and account creation. The service stores the account and sets an auth cookie.
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login({ userName, setUserName }) {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

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

    async function submit(path) {
        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, password }),
            });
            if (response.ok) finishLogin();
            else setError((await response.json()).msg);
        } catch {
            setError('Could not reach the service');
        }
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

            <form id="login-form" onSubmit={(event) => { event.preventDefault(); submit('/api/auth/login'); }}>
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
                    <button className="btn btn-outline-primary ms-2" type="button" disabled={!name || !password} onClick={() => submit('/api/auth/register')}>
                        Create Account
                    </button>
                </fieldset>
            </form>
        </main>
    );
}
