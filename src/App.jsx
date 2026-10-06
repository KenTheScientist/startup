import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Login from './login/login';
import Budgets from './budgets/budgets';
import Envelopes from './envelopes/envelopes';


export default function App() {

    return (
        <BrowserRouter>
        <header id="app-header">
        <h1>
            <img src="icon_white.png" alt="" />
            Co-Budget
        </h1>
        <div>User: <span>Not logged in</span></div>
        </header>

        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/envelopes" element={<Envelopes />} />
        </Routes>

        <footer id="site-footer">
            <span>Project by Kenneth Thomson - <a href="https://github.com/KenTheScientist/startup">GitHub</a></span>
        </footer>
        </BrowserRouter>
    )

}