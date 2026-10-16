// Stand-in for the database. Home can be joined with code XLKDN.

function withDefaults(budget) {
    if (budget.envelopes) return { ...budget, activity: budget.activity || [] };
    const envelopes = budget.code === 'XLKDN' ? [] : budget.code === 'Q9T2M' ? [] : [];
    return { ...budget, envelopes, activity: budget.activity || [] };
}

export function loadBudgets() {
    const saved = localStorage.getItem('budgets');
    const budgets = (saved ? JSON.parse(saved) : []).map(withDefaults);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    return budgets;
}

export function money(amount) {
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function cents(amount) {
    return Math.round(amount * 100) / 100;
}

export function saveBudgets(budgets) {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

export function randomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
