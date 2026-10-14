import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navigation from './widgets/navigation';
import Login from './login/login';
import Budgets from './budgets/budgets';
import Envelopes from './envelopes/envelopes';
import Activity from './activity/activity';
import Members from './members/members';
import NotFound from './notFound';
import LiveUpdates from './widgets/liveUpdates';


export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const [budget, setBudget] = React.useState(JSON.parse(localStorage.getItem('budget')));

    function selectBudget(newBudget) {
        if (newBudget) localStorage.setItem('budget', JSON.stringify(newBudget));
        else localStorage.removeItem('budget');
        setBudget(newBudget);
    }

    function logout() {
        localStorage.removeItem('userName');
        setUserName('');
        selectBudget(null);
    }

    return (
        <BrowserRouter>
        <header id="app-header">
        <h1>
            <img src="icon_white.png" alt="" />
            Co-Budget
        </h1>
        <div>
            User: <span>{userName || 'Not logged in'}</span>
            {userName && (
                <Link className="btn btn-sm btn-outline-light ms-2" to="/" onClick={logout}>
                    Logout
                </Link>
            )}
        </div>
        </header>

        <div className="layout">
            {budget && <Navigation budget={budget} />}
            <Routes>
                <Route path="/" element={<Login userName={userName} setUserName={setUserName} />} />
                <Route path="/budgets" element={<Budgets userName={userName} selectBudget={selectBudget} />} />
                <Route path="/envelopes" element={<Envelopes />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/members" element={<Members />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>

        <LiveUpdates userName={userName} />
        <footer id="site-footer">
            <span>Project by Kenneth Thomson - <a href="https://github.com/KenTheScientist/startup">GitHub</a></span>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={() => { localStorage.clear(); location.href = '/'; }}>Reset Local Storage</button>
        </footer>
        </BrowserRouter>
    )

}