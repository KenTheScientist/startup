import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Stand-in for the database. Home can be joined with code XLKDN.
const seed = [
    { name: 'Home', code: 'XLKDN', owner: 'Sarah', members: ['Sarah', 'Jim'], funds: 1350 },
    { name: 'Vacation Club', code: 'Q9T2M', owner: 'Ken', members: ['Ken'], funds: 500 },
];

function loadBudgets() {
    const saved = localStorage.getItem('budgets');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('budgets', JSON.stringify(seed));
    return seed;
}

function randomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function Budgets({ userName, selectBudget }) {
    const [budgets, setBudgets] = React.useState(loadBudgets);
    const [name, setName] = React.useState('');
    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => selectBudget(null), []);

    function open(budget) {
        selectBudget({ code: budget.code, name: budget.name });
        navigate('/envelopes');
    }

    function save(next) {
        localStorage.setItem('budgets', JSON.stringify(next));
        setBudgets(next);
    }

    function create(event) {
        event.preventDefault();
        let joinCode;
        do { joinCode = randomCode(); } while (budgets.some((b) => b.code === joinCode));
        const budget = { name: name.trim(), code: joinCode, owner: userName, members: [userName], funds: 0 };
        save([...budgets, budget]);
        open(budget);
    }

    function join(event) {
        event.preventDefault();
        const joinCode = code.trim().toUpperCase();
        const found = budgets.find((b) => b.code === joinCode);
        if (!found) return setError('No budget with that join code');
        if (found.members.includes(userName)) return setError('You already belong to this budget');
        save(budgets.map((b) => b.code === joinCode ? { ...b, members: [...b.members, userName] } : b));
        open(found);
    }

    const mine = budgets.filter((b) => b.members.includes(userName));

    return (
        <main>
                <h2>Your Budgets</h2>
                <p>Select, create, or join a budget to manage envelopes.</p>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Join code</th>
                                <th>Owner</th>
                                <th>Members</th>
                                <th>Total funds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mine.length === 0 && (
                                <tr><td colSpan="5">You have no budgets yet. Create one or join with a code.</td></tr>
                            )}
                            {mine.map((b) => (
                                <tr key={b.code}>
                                    <td><Link to="/envelopes" onClick={() => selectBudget({ code: b.code, name: b.name })}>{b.name}</Link></td>
                                    <td>{b.code}</td>
                                    <td>{b.owner}</td>
                                    <td>{b.members.length}</td>
                                    <td>${b.funds.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="split">
                    <form onSubmit={create}>
                        <fieldset>
                            <legend>Create a new budget</legend>
                            <label>Name <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Home" /></label>
                            <button className="btn btn-primary" type="submit" disabled={!name.trim()}>Create</button>
                        </fieldset>
                    </form>
                    <form onSubmit={join}>
                        <fieldset>
                            <legend>Join a budget</legend>
                            <label>Join code <input className="form-control" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XLKDN" /></label>
                            {error && <p className="text-danger">{error}</p>}
                            <button className="btn btn-primary" type="submit" disabled={!code.trim()}>Join</button>
                        </fieldset>
                    </form>
                </div>

                <section className="live">
                    <h3>Live updates</h3>
                    <ul>
                        <li>Jim joined the Home budget</li>
                        <li>Sarah created the Home budget</li>
                    </ul>
                </section>
        </main>
    )
}
