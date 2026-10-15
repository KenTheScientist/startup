import React from 'react';
import { cents, loadBudgets, money, saveBudgets } from '../budgets/storage';
import EnvelopePopup from './envelopePopup';
import './envelopes.css';

export default function Envelopes({ budget, userName }) {
    const stored = loadBudgets().find((item) => item.code === budget?.code);
    const [envelopes, setEnvelopes] = React.useState(stored?.envelopes || []);
    const [launch, setLaunch] = React.useState(null);

    if (!budget) return <main><p>Select a budget first.</p></main>;

    function commit(next, entry) {
        saveBudgets(loadBudgets().map((item) => item.code === budget.code ? {
            ...item,
            envelopes: next,
            activity: [entry, ...(item.activity || [])],
            funds: next.reduce((sum, envelope) => sum + envelope.balance, 0),
        } : item));
        setEnvelopes(next);
    }

    function create(name, capacity) {
        if (envelopes.some((envelope) => envelope.name.toLowerCase() === name.toLowerCase())) return 'An envelope with that name already exists';
        if (!(capacity > 0)) return 'Enter a capacity';
        commit([...envelopes, { name, balance: 0, capacity: cents(capacity) }], { type: 'Envelope', user: userName, details: 'Created envelope', amount: cents(capacity), envelope: name });
    }

    function fill(name, amount) {
        if (!(amount > 0)) return 'Enter an amount';
        commit(envelopes.map((item) => item.name === name ? { ...item, balance: cents(item.balance + amount) } : item),
            { type: 'Fill', user: userName, details: 'Added funds', amount: cents(amount), envelope: name });
    }

    function spend(label, name, amount) {
        const envelope = envelopes.find((item) => item.name === name);
        if (!envelope) return 'Pick an envelope';
        if (!(amount > 0)) return 'Enter an amount';
        commit(envelopes.map((item) => item.name === name ? { ...item, balance: cents(item.balance - amount) } : item),
            { type: 'Expense', user: userName, details: label, amount: cents(amount), envelope: name });
    }

    function remove(name) {
        const envelope = envelopes.find((item) => item.name === name);
        if (!envelope) return 'That envelope is already gone';
        commit(envelopes.filter((item) => item.name !== name),
            { type: 'Delete', user: userName, details: 'Deleted envelope', amount: cents(envelope.balance), envelope: name });
    }

    const total = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);

    return (
        <main>
                <h2>Envelopes</h2>
                <p>Organize your funds.</p>
                <p><strong>Total funds: {money(total)}</strong></p>

                <div className="envelope-list">
                    {envelopes.length === 0 && <p>No envelopes yet.</p>}
                    {envelopes.map((envelope) => (
                        <article className="envelope" key={envelope.name}>
                            <img src="envelope.png" alt="Envelope" />
                            <div>
                                <h3>{envelope.name}</h3>
                                <progress value={envelope.balance} max={(envelope.capacity ?? envelope.filled) || 1}></progress>
                                <p>{money(envelope.balance)} / {money(envelope.capacity ?? envelope.filled ?? 0)}</p>
                            </div>
                            <button className="btn btn-outline-primary" type="button" onClick={() => setLaunch({ kind: 'spend', envelope: envelope.name, id: Math.random() })}>-</button>
                            <button className="btn btn-outline-primary" type="button" onClick={() => setLaunch({ kind: 'fill', envelope: envelope.name, id: Math.random() })}>+</button>
                            <button className="btn btn-outline-danger" type="button" onClick={() => setLaunch({ kind: 'delete', envelope: envelope.name, id: Math.random() })}>Delete</button>
                        </article>
                    ))}
                </div>

                <EnvelopePopup onCreate={create} onFill={fill} onSpend={spend} onDelete={remove} launch={launch} />
        </main>
    )
}
