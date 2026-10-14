// Stand-in for the database. Home can be joined with code XLKDN.
const homeEnvelopes = [
    { name: 'Groceries', balance: 750, capacity: 900 },
    { name: 'Rent', balance: 600, capacity: 600 },
];
const vacationEnvelopes = [
    { name: 'Groceries', balance: 300, capacity: 400 },
    { name: 'Vacation', balance: 200, capacity: 300 },
];

const seed = [
    { name: 'Home', code: 'XLKDN', owner: 'Sarah', members: ['Sarah', 'Jim'], funds: 1350, envelopes: homeEnvelopes, activity: [] },
    { name: 'Vacation Club', code: 'Q9T2M', owner: 'Ken', members: ['Ken'], funds: 500, envelopes: vacationEnvelopes, activity: [] },
];

function withDefaults(budget) {
    if (budget.envelopes) return { ...budget, activity: budget.activity || [] };
    const envelopes = budget.code === 'XLKDN' ? homeEnvelopes : budget.code === 'Q9T2M' ? vacationEnvelopes : [];
    return { ...budget, envelopes, activity: budget.activity || [] };
}

export function loadBudgets() {
    const saved = localStorage.getItem('budgets');
    const budgets = (saved ? JSON.parse(saved) : seed).map(withDefaults);
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
