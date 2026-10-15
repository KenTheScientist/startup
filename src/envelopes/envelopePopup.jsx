import React from 'react';

export default function EnvelopePopup({ onCreate, onFill, onSpend, onDelete, launch }) {
    const [popup, setPopup] = React.useState('');
    const [name, setName] = React.useState('');
    const [capacity, setCapacity] = React.useState('');
    const [label, setLabel] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [error, setError] = React.useState('');
    const dialog = React.useRef();

    React.useEffect(() => { if (popup && !dialog.current.open) dialog.current.showModal(); }, [popup]);
    React.useEffect(() => {
        if (!launch) return;
        setError('');
        setPopup(launch.kind);
    }, [launch]);

    function submit(event) {
        event.preventDefault();
        const message = popup === 'create' ? onCreate(name.trim(), Number(capacity))
            : popup === 'fill' ? onFill(launch.envelope, Number(amount))
            : popup === 'delete' ? onDelete(launch.envelope)
            : onSpend(label.trim(), launch.envelope, Number(amount));
        if (message) return setError(message);
        setName('');
        setCapacity('');
        setLabel('');
        setAmount('');
        dialog.current.close();
    }

    const ready = popup === 'delete' || (popup === 'create' ? name.trim() && Number(capacity) > 0
        : popup === 'fill' ? Number(amount) > 0
        : label.trim() && Number(amount) > 0);

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() => { setError(''); setPopup('create'); }}>New envelope</button>
            <dialog ref={dialog} onClose={() => setPopup('')}>
                <form onSubmit={submit}>
                    <h3>{popup === 'fill' ? `Add funds to ${launch?.envelope}` : popup === 'spend' ? `New expense for ${launch?.envelope}` : popup === 'delete' ? `Delete ${launch?.envelope}?` : 'New envelope'}</h3>
                    {popup === 'create' && (
                        <>
                            <label>Name <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vacation" /></label>
                            <label>Capacity <input className="form-control" type="number" min="0.01" step="0.01" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="400.00" /></label>
                        </>
                    )}
                    {(popup === 'fill' || popup === 'spend') && <label>Amount <input className="form-control" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>}
                    {popup === 'spend' && <label>Label <input className="form-control" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Plane Tickets" /></label>}
                    {error && <p className="text-danger">{error}</p>}
                    <button className="btn btn-primary" type="submit" disabled={!ready}>{popup === 'create' ? 'Create' : popup === 'fill' ? 'Add' : popup === 'delete' ? 'Delete' : 'Spend'}</button>
                    <button type="button" className="btn btn-outline-primary ms-2" onClick={() => dialog.current.close()}>Cancel</button>
                </form>
            </dialog>
        </>
    );
}
