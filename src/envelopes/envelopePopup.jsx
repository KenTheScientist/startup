// One dialog handles creating, filling, spending, and deleting an envelope.
import React from 'react';

export default function EnvelopePopup({ onCreate, onFill, onSpend, onDelete, launch }) {
    // "create", "fill", "spend", "delete", or "" when the dialog is closed.
    const [popup, setPopup] = React.useState('');
    const [name, setName] = React.useState('');
    const [capacity, setCapacity] = React.useState('');
    const [label, setLabel] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [error, setError] = React.useState('');
    const dialog = React.useRef();

    // Open the dialog after it has been rendered.
    React.useEffect(() => {
        if (popup && !dialog.current.open) dialog.current.showModal();
    }, [popup]);

    // The envelopes page sets `launch` when +, -, or Delete is clicked.
    React.useEffect(() => {
        if (!launch) return;
        setError('');
        setPopup(launch.kind);
    }, [launch]);

    function heading() {
        if (popup === 'fill') return `Add funds to ${launch?.envelope}`;
        if (popup === 'spend') return `New expense for ${launch?.envelope}`;
        if (popup === 'delete') return `Delete ${launch?.envelope}?`;
        return 'New envelope';
    }

    function submitLabel() {
        if (popup === 'create') return 'Create';
        if (popup === 'fill') return 'Add';
        if (popup === 'delete') return 'Delete';
        return 'Spend';
    }

    // Delete needs no fields. The other actions need the fields for that popup filled in.
    function canSubmit() {
        if (popup === 'delete') return true;
        if (popup === 'create') return Boolean(name.trim()) && Number(capacity) > 0;
        if (popup === 'fill') return Number(amount) > 0;
        return Boolean(label.trim()) && Number(amount) > 0;
    }

    function clearFields() {
        setName('');
        setCapacity('');
        setLabel('');
        setAmount('');
    }

    // Ask the envelopes page to make the change. A returned string is an error and keeps the dialog open.
    function submit(event) {
        event.preventDefault();

        let message;
        if (popup === 'create') message = onCreate(name.trim(), Number(capacity));
        else if (popup === 'fill') message = onFill(launch.envelope, Number(amount));
        else if (popup === 'delete') message = onDelete(launch.envelope);
        else message = onSpend(label.trim(), launch.envelope, Number(amount));

        if (message) {
            setError(message);
            return;
        }

        clearFields();
        dialog.current.close();
    }

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() => { setError(''); setPopup('create'); }}>
                New envelope
            </button>

            <dialog ref={dialog} onClose={() => setPopup('')}>
                <form onSubmit={submit}>
                    <h3>{heading()}</h3>

                    {popup === 'create' && (
                        <>
                            <label>
                                Name
                                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vacation" />
                            </label>
                            <label>
                                Capacity
                                <input className="form-control" type="number" min="0.01" step="0.01" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="400.00" />
                            </label>
                        </>
                    )}

                    {(popup === 'fill' || popup === 'spend') && (
                        <label>
                            Amount
                            <input className="form-control" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </label>
                    )}

                    {popup === 'spend' && (
                        <label>
                            Label
                            <input className="form-control" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Plane Tickets" />
                        </label>
                    )}

                    {error && <p className="text-danger">{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={!canSubmit()}>
                        {submitLabel()}
                    </button>
                    <button type="button" className="btn btn-outline-primary ms-2" onClick={() => dialog.current.close()}>
                        Cancel
                    </button>
                </form>
            </dialog>
        </>
    );
}
