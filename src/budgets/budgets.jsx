// List the logged-in user's budgets, and let them create or join one.
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loadBudgets, randomCode, saveBudgets } from './storage';
import BudgetTable from './budgetTable';
import BudgetPopup from './budgetPopup';

export default function Budgets({ userName, selectBudget }) {
    // A join link looks like /budgets?join=XLKDN. Empty when the user opened the page normally.
    const joinCode = new URLSearchParams(window.location.search).get('join');
    const [budgets, setBudgets] = React.useState(loadBudgets);
    const navigate = useNavigate();

    // Save the list both in state and in localStorage so a refresh keeps it.
    function save(nextBudgets) {
        saveBudgets(nextBudgets);
        setBudgets(nextBudgets);
    }

    // Remember this budget and go to its envelopes page.
    function open(budget) {
        selectBudget({ code: budget.code, name: budget.name });
        navigate('/envelopes');
    }

    // Join links are handled once, when this page first loads.
    React.useEffect(() => {
        if (!userName) return;

        // A normal visit should not keep a previously selected budget highlighted.
        if (!joinCode) {
            selectBudget(null);
            return;
        }

        const found = budgets.find((budget) => budget.code === joinCode.toUpperCase());
        if (!found) {
            selectBudget(null);
            return;
        }

        // Add the user if they are not already on the member list, then open the budget.
        const alreadyMember = found.members.includes(userName);
        if (!alreadyMember) {
            const updated = budgets.map((budget) => {
                if (budget.code !== found.code) return budget;
                return { ...budget, members: [...budget.members, userName] };
            });
            save(updated);
        }
        open(found);
    }, []);

    // Make a new budget owned by the current user, then open it.
    function create(budgetName) {
        // Keep generating codes until we get one that is not already in use.
        let code = randomCode();
        while (budgets.some((budget) => budget.code === code)) {
            code = randomCode();
        }

        const budget = {
            name: budgetName,
            code,
            owner: userName,
            members: [userName],
            funds: 0,
            envelopes: [],
            activity: [],
        };
        save([...budgets, budget]);
        open(budget);
    }

    // Add the current user to an existing budget. Returns an error message, or nothing on success.
    function join(code) {
        const found = budgets.find((budget) => budget.code === code);
        if (!found) return 'No budget with that join code';
        if (found.members.includes(userName)) return 'You already belong to this budget';

        const updated = budgets.map((budget) => {
            if (budget.code !== code) return budget;
            return { ...budget, members: [...budget.members, userName] };
        });
        save(updated);
        open(found);
    }

    // Send guests to the login page and keep the join code in the URL.
    if (joinCode && !userName) return <Navigate to={`/?join=${joinCode}`} replace />;

    return (
        <main>
            <h2>Your Budgets</h2>
            <p>Select, create, or join a budget to manage envelopes.</p>
            <BudgetTable budgets={budgets} userName={userName} selectBudget={selectBudget} />
            <BudgetPopup onCreate={create} onJoin={join} />
        </main>
    );
}
