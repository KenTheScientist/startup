import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';


export default function App() {

    return (
        <header id="app-header">
        <h1>
            <img src="icon_white.png" alt="" />
            Co-Budget
        </h1>
        <div>User: <span>Not logged in</span></div>
        </header>


    )
}