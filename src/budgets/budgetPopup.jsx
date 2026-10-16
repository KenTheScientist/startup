// Popup for creating a budget or joining one with a code.
import React from 'react';

export default function BudgetPopup({ onCreate, onJoin }) {
    const [name, setName] = React.useState('');
    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState('');
    // Either "create", "join", or "" when the dialog is closed.
    const [popup, setPopup] = React.useState('');
    const dialog = React.useRef();

    const creating = popup === 'create';

    // Open the dialog after React has rendered it. showModal() has to run on the real element.
    React.useEffect(() => {
        if (popup && !dialog.current.open) dialog.current.showModal();
    }, [popup]);

    function openPopup(kind) {
        setError('');
        setPopup(kind);
    }

    // Create or join. An error message stays in the dialog. Success leaves the page.
    function submit(event) {
        event.preventDefault();
        const message = creating ? onCreate(name.trim()) : onJoin(code.trim().toUpperCase());
        if (message) setError(message);
    }

    const hasInput = creating ? name.trim() : code.trim();

    return (
        <>
            <div className="mb-3">
                <button type="button" className="btn btn-primary" onClick={() => openPopup('create')}>Create New Budget</button>
                <button type="button" className="btn btn-outline-primary ms-2" onClick={() => openPopup('join')}>Join Budget</button>
            </div>

            {/* Closing the dialog (Cancel or the Escape key) clears which popup is open. */}
            <dialog ref={dialog} onClose={() => setPopup('')}>
                <form onSubmit={submit}>
                    <h3>{creating ? 'Create a new budget' : 'Join a budget'}</h3>

                    {creating ? (
                        <label>
                            Name
                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Home" />
                        </label>
                    ) : (
                        <label>
                            Join code
                            <input className="form-control" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XLKDN" />
                        </label>
                    )}

                    {error && <p className="text-danger">{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={!hasInput}>
                        {creating ? 'Create' : 'Join'}
                    </button>
                    <button type="button" className="btn btn-outline-primary ms-2" onClick={() => dialog.current.close()}>Cancel</button>
                </form>
            </dialog>
        </>
    );
}
