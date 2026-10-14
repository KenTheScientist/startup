import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login({ userName, setUserName }) {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    function auth(create) {
        // This will be replaced with login/register service calls
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (create && users[name]) return setError('Username already exists');
        if (!create && users[name] !== password) return setError('Invalid username or password');
        if (create) localStorage.setItem('users', JSON.stringify({ ...users, [name]: password }));
        localStorage.setItem('userName', name);
        setUserName(name);
        navigate('/budgets');
    }

    function logout() {
        localStorage.removeItem('userName');
        setUserName('');
    }

    return (
        <main>
                <h2>Login to Co-Budget</h2>
                <p>
                    Co-Budget is a shared budget application for families and couples. Create budgets, add envelopes,
                    track expenses, and see when others spend money in real time.
                </p>

                {userName ? (
                    <div>
                        <p>Logged in as <strong>{userName}</strong></p>
                        <button className="btn btn-primary" onClick={() => navigate('/budgets')}>Go to Budgets</button>
                        <button className="btn btn-outline-primary" onClick={logout}>Logout</button>
                    </div>
                ) : (
                <form id="login-form" onSubmit={(event) => { event.preventDefault(); auth(false); }}>
                    <fieldset>
                    <legend>Login or create an account</legend>
                    <label>Username <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="username" /></label>
                    <label>Password <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" /></label>
                    {error && <p className="text-danger">{error}</p>}
                    <button className="btn btn-primary" type="submit" disabled={!name || !password}>Login</button>
                    <button className="btn btn-outline-primary ms-2" type="button" disabled={!name || !password} onClick={() => auth(true)}>Create Account</button>
                    </fieldset>
                </form>
                )}
        </main>
    )
}
