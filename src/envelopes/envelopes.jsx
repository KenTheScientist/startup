// Envelopes hold the money inside the selected budget.
import React from 'react';
import { cents, money } from '../budgets/money';
import EnvelopePopup from './envelopePopup';
import './envelopes.css';

export default function Envelopes({ budget }) {
    const [envelopes, setEnvelopes] = React.useState([]);
    // Which popup to open, and which envelope it applies to. Null when nothing was clicked.
    const [launch, setLaunch] = React.useState(null);

    React.useEffect(() => {
        if (!budget) return;
        fetch(`/api/budgets/${budget.code}/envelopes`).then(async (response) => {
            if (response.ok) setEnvelopes(await response.json());
        });
    }, [budget]);

    if (!budget) return <main><p>Select a budget first.</p></main>;

    // Save the envelope list on the service. The service records the activity row and the new total.
    async function commit(nextEnvelopes, entry) {
        const response = await fetch(`/api/budgets/${budget.code}/envelopes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ envelopes: nextEnvelopes, activity: entry }),
        });
        if (!response.ok) return 'Could not save the envelope';
        setEnvelopes(await response.json());
    }

    // Returns an error message, or nothing when the change is saved.
    function create(name, capacity) {
        const duplicate = envelopes.some((envelope) => envelope.name.toLowerCase() === name.toLowerCase());
        if (duplicate) return 'An envelope with that name already exists';
        if (!(capacity > 0)) return 'Enter a capacity';

        const nextEnvelopes = [...envelopes, { name, balance: 0, capacity: cents(capacity) }];
        return commit(nextEnvelopes, {
            type: 'Envelope',
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
        return commit(nextEnvelopes, {
            type: 'Fill',
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
        return commit(nextEnvelopes, {
            type: 'Expense',
            details: label,
            amount: cents(amount),
            envelope: name,
        });
    }

    function remove(name) {
        const envelope = envelopes.find((item) => item.name === name);
        if (!envelope) return 'That envelope is already gone';

        const nextEnvelopes = envelopes.filter((item) => item.name !== name);
        return commit(nextEnvelopes, {
            type: 'Delete',
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
