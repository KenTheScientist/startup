import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loadBudgets, randomCode, saveBudgets } from './storage';
import BudgetTable from './budgetTable';
import BudgetPopup from './budgetPopup';

export default function Budgets({ userName, selectBudget }) {
    const joinCode = new URLSearchParams(window.location.search).get('join');
    const [budgets, setBudgets] = React.useState(loadBudgets);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!userName) return;
        if (!joinCode) return selectBudget(null);
        const found = budgets.find((b) => b.code === joinCode.toUpperCase());
        if (!found) return selectBudget(null);
        if (!found.members.includes(userName)) {
            save(budgets.map((b) => b.code === found.code ? { ...b, members: [...b.members, userName] } : b));
        }
        open(found);
    }, []);

    function open(budget) {
        selectBudget({ code: budget.code, name: budget.name });
        navigate('/envelopes');
    }

    function save(next) {
        saveBudgets(next);
        setBudgets(next);
    }

    function create(budgetName) {
        let joinCode;
        do { joinCode = randomCode(); } while (budgets.some((b) => b.code === joinCode));
        const budget = { name: budgetName, code: joinCode, owner: userName, members: [userName], funds: 0, envelopes: [], activity: [] };
        save([...budgets, budget]);
        open(budget);
    }

    function join(joinCode) {
        const found = budgets.find((b) => b.code === joinCode);
        if (!found) return 'No budget with that join code';
        if (found.members.includes(userName)) return 'You already belong to this budget';
        save(budgets.map((b) => b.code === joinCode ? { ...b, members: [...b.members, userName] } : b));
        open(found);
    }

    if (joinCode && !userName) return <Navigate to={`/?join=${joinCode}`} replace />;

    return (
        <main>
                <h2>Your Budgets</h2>
                <p>Select, create, or join a budget to manage envelopes.</p>
                <BudgetTable budgets={budgets} userName={userName} selectBudget={selectBudget} />
                <BudgetPopup onCreate={create} onJoin={join} />
        </main>
    )
}
