// App shell: header, page routes, sidebar, and footer.
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
    // Who is logged in. An empty string means nobody is logged in.
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');

    // The budget the user is currently working in. Only the name and join code are kept here.
    const [budget, setBudget] = React.useState(JSON.parse(localStorage.getItem('budget')));

    // Remember the selected budget so a refresh stays on the same one.
    function selectBudget(newBudget) {
        if (newBudget) localStorage.setItem('budget', JSON.stringify(newBudget));
        else localStorage.removeItem('budget');
        setBudget(newBudget);
    }

    // Log out, forget the selected budget, and leave the user name blank.
    function logout() {
        localStorage.removeItem('userName');
        setUserName('');
        selectBudget(null);
    }

    // Wipe every saved login, budget, and setting, then go back to the login page.
    function resetStorage() {
        localStorage.clear();
        location.href = '/';
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
                {/* The sidebar only appears after a budget has been chosen. */}
                {budget && <Navigation budget={budget} />}

                <Routes>
                    <Route path="/" element={<Login userName={userName} setUserName={setUserName} />} />
                    <Route path="/budgets" element={<Budgets userName={userName} selectBudget={selectBudget} />} />
                    <Route path="/envelopes" element={<Envelopes budget={budget} userName={userName} />} />
                    <Route path="/activity" element={<Activity budget={budget} />} />
                    <Route path="/members" element={<Members budget={budget} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>

            <LiveUpdates userName={userName} />

            <footer id="site-footer">
                <span>Project by Kenneth Thomson - <a href="https://github.com/KenTheScientist/startup">GitHub</a></span>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={resetStorage}>
                    Reset Local Storage
                </button>
            </footer>
        </BrowserRouter>
    );
}
