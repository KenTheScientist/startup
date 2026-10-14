import React from 'react';

export default function BudgetPopup({ onCreate, onJoin }) {
    const [name, setName] = React.useState('');
    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState('');
    const [popup, setPopup] = React.useState('');
    const dialog = React.useRef();

    React.useEffect(() => { if (popup && !dialog.current.open) dialog.current.showModal(); }, [popup]);

    function submit(event) {
        event.preventDefault();
        const message = popup === 'create' ? onCreate(name.trim()) : onJoin(code.trim().toUpperCase());
        if (message) setError(message);
    }

    return (
        <>
            <div className="mb-3">
                <button type="button" className="btn btn-primary" onClick={() => { setError(''); setPopup('create'); }}>Create New Budget</button>
                <button type="button" className="btn btn-outline-primary ms-2" onClick={() => { setError(''); setPopup('join'); }}>Join Budget</button>
            </div>
            <dialog ref={dialog} onClose={() => setPopup('')}>
                <form onSubmit={submit}>
                    <h3>{popup === 'create' ? 'Create a new budget' : 'Join a budget'}</h3>
                    {popup === 'create'
                        ? <label>Name <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Home" /></label>
                        : <label>Join code <input className="form-control" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XLKDN" /></label>}
                    {error && <p className="text-danger">{error}</p>}
                    <button className="btn btn-primary" type="submit" disabled={popup === 'create' ? !name.trim() : !code.trim()}>{popup === 'create' ? 'Create' : 'Join'}</button>
                    <button type="button" className="btn btn-outline-primary ms-2" onClick={() => dialog.current.close()}>Cancel</button>
                </form>
            </dialog>
        </>
    );
}
