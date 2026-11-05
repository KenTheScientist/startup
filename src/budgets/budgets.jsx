// List the logged-in user's budgets, and let them create or join one.
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BudgetTable from './budgetTable';
import BudgetPopup from './budgetPopup';

export default function Budgets({ userName, selectBudget }) {
    // A join link looks like /budgets?join=XLKDN. Empty when the user opened the page normally.
    const joinCode = new URLSearchParams(window.location.search).get('join');
    const [budgets, setBudgets] = React.useState([]);
    const navigate = useNavigate();

    // Remember this budget and go to its envelopes page.
    function open(budget) {
        selectBudget({ code: budget.code, name: budget.name });
        navigate('/envelopes');
    }

    // Load this user's budgets from the service. A join link adds them, then opens that budget.
    React.useEffect(() => {
        if (!userName) return;
        const code = joinCode?.toUpperCase();
        fetch('/api/budgets').then(async (response) => {
            if (!response.ok) return;
            let list = await response.json();
            setBudgets(list);
            if (!code) {
                selectBudget(null);
                return;
            }
            if (!list.some((budget) => budget.code === code)) {
                const joined = await fetch(`/api/budgets/${code}/members`, { method: 'POST' });
                if (!joined.ok) {
                    selectBudget(null);
                    return;
                }
                list = await (await fetch('/api/budgets')).json();
                setBudgets(list);
            }
            const found = list.find((budget) => budget.code === code);
            if (found) open(found);
        });
    }, []);

    // Make a new budget owned by the current user, then open it.
    async function create(budgetName) {
        const response = await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: budgetName }),
        });
        if (!response.ok) return 'Could not create the budget';
        const budget = await response.json();
        setBudgets((list) => [...list, budget]);
        open(budget);
    }

    // Add the current user to an existing budget. Returns an error message, or nothing on success.
    async function join(code) {
        const response = await fetch(`/api/budgets/${code}/members`, { method: 'POST' });
        if (!response.ok) return (await response.json()).msg;
        const loaded = await fetch(`/api/budgets/${code}`);
        if (!loaded.ok) return (await loaded.json()).msg;
        const found = await loaded.json();
        setBudgets((list) => (list.some((item) => item.code === code) ? list : [...list, found]));
        open(found);
    }

    // Send guests to the login page and keep the join code in the URL.
    if (joinCode && !userName) return <Navigate to={`/?join=${joinCode}`} replace />;
    if (!userName) return <Navigate to="/" replace />;

    return (
        <main>
            <h2>Your Budgets</h2>
            <p>Select, create, or join a budget to manage envelopes.</p>
            <BudgetTable budgets={budgets} userName={userName} selectBudget={selectBudget} />
            <BudgetPopup onCreate={create} onJoin={join} />
        </main>
    );
}
