// Envelopes hold the money inside the selected budget.
import React from 'react';
import { cents, findBudget, money, updateBudget } from '../budgets/storage';
import EnvelopePopup from './envelopePopup';
import './envelopes.css';

export default function Envelopes({ budget, userName }) {
    const stored = findBudget(budget?.code);
    const [envelopes, setEnvelopes] = React.useState(stored?.envelopes || []);
    // Which popup to open, and which envelope it applies to. Null when nothing was clicked.
    const [launch, setLaunch] = React.useState(null);

    if (!budget) return <main><p>Select a budget first.</p></main>;

    // Save the new envelope list, record one activity row, and update the budget's total funds.
    function commit(nextEnvelopes, entry) {
        const funds = nextEnvelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
        updateBudget(budget.code, (item) => ({
            ...item,
            envelopes: nextEnvelopes,
            activity: [entry, ...(item.activity || [])],
            funds,
        }));
        setEnvelopes(nextEnvelopes);
    }

    // Returns an error message, or nothing when the change is saved.
    function create(name, capacity) {
        const duplicate = envelopes.some((envelope) => envelope.name.toLowerCase() === name.toLowerCase());
        if (duplicate) return 'An envelope with that name already exists';
        if (!(capacity > 0)) return 'Enter a capacity';

        const nextEnvelopes = [...envelopes, { name, balance: 0, capacity: cents(capacity) }];
        commit(nextEnvelopes, {
            type: 'Envelope',
            user: userName,
            details: 'Created envelope',
            amount: cents(capacity),
            envelope: name,
        });
    }

    function fill(name, amount) {
        if (!(amount > 0)) return 'Enter an amount';

        const nextEnvelopes = envelopes.map((envelope) => {
            if (envelope.name !== name) return envelope;
            return { ...envelope, balance: cents(envelope.balance + amount) };
        });
        commit(nextEnvelopes, {
            type: 'Fill',
            user: userName,
            details: 'Added funds',
            amount: cents(amount),
            envelope: name,
        });
    }

    function spend(label, name, amount) {
        const envelope = envelopes.find((item) => item.name === name);
        if (!envelope) return 'Pick an envelope';
        if (!(amount > 0)) return 'Enter an amount';

        const nextEnvelopes = envelopes.map((item) => {
            if (item.name !== name) return item;
            return { ...item, balance: cents(item.balance - amount) };
        });
        commit(nextEnvelopes, {
            type: 'Expense',
            user: userName,
            details: label,
            amount: cents(amount),
            envelope: name,
        });
    }

    function remove(name) {
        const envelope = envelopes.find((item) => item.name === name);
        if (!envelope) return 'That envelope is already gone';

        const nextEnvelopes = envelopes.filter((item) => item.name !== name);
        commit(nextEnvelopes, {
            type: 'Delete',
            user: userName,
            details: 'Deleted envelope',
            amount: cents(envelope.balance),
            envelope: name,
        });
    }

    function ask(kind, envelopeName) {
        setLaunch({ kind, envelope: envelopeName });
    }

    const total = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);

    return (
        <main>
            <h2>Envelopes</h2>
            <p>Organize your funds.</p>
            <p><strong>Total funds: {money(total)}</strong></p>

            <div className="envelope-list">
                {envelopes.length === 0 && <p>No envelopes yet.</p>}
                {envelopes.map((envelope) => {
                    // Older budgets stored the goal as "filled" instead of "capacity".
                    const capacity = envelope.capacity ?? envelope.filled ?? 0;
                    return (
                        <article className="envelope" key={envelope.name}>
                            <img src="envelope.png" alt="Envelope" />
                            <div>
                                <h3>{envelope.name}</h3>
                                <progress value={envelope.balance} max={capacity || 1}></progress>
                                <p>{money(envelope.balance)} / {money(capacity)}</p>
                            </div>
                            <button className="btn btn-outline-primary" type="button" onClick={() => ask('spend', envelope.name)}>-</button>
                            <button className="btn btn-outline-primary" type="button" onClick={() => ask('fill', envelope.name)}>+</button>
                            <button className="btn btn-outline-danger" type="button" onClick={() => ask('delete', envelope.name)}>Delete</button>
                        </article>
                    );
                })}
            </div>

            <EnvelopePopup onCreate={create} onFill={fill} onSpend={spend} onDelete={remove} launch={launch} />
        </main>
    );
}
