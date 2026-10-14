import { NavLink } from 'react-router-dom';

export default function Navigation({ budget }) {
    return (
        <nav>
            <menu>
                <li><NavLink className="back-link" to="/budgets">← Back to Budgets</NavLink></li>
                <li className="current-budget">{budget.name}</li>
                <li><NavLink to="/envelopes">Envelopes</NavLink></li>
                <li><NavLink to="/activity">Activity</NavLink></li>
                <li><NavLink to="/members">Members</NavLink></li>
            </menu>
        </nav>
    )
}
