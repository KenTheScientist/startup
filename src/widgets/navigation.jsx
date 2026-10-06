import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav>
            <menu>
                <li><NavLink to="/">Login</NavLink></li>
                <li><NavLink to="/budgets">Budgets</NavLink></li>
                <li><NavLink to="/envelopes">Envelopes</NavLink></li>
                <li><NavLink to="/activity">Activity</NavLink></li>
                <li><NavLink to="/members">Members</NavLink></li>
            </menu>
        </nav>
    )
} 