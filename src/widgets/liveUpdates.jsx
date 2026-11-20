// Popups for activity other users send over the WebSocket.
import React from 'react';
import './liveUpdates.css';
import { notifier } from './notifier';

export default function LiveUpdates({ userName }) {
    const [notes, setNotes] = React.useState([]);

    React.useEffect(() => {
        if (!userName) {
            setNotes([]);
            return;
        }

        function handle(event) {
            const id = Math.random();
            setNotes((current) => [...current, { id, text: event.text }]);
            setTimeout(() => {
                setNotes((current) => current.filter((item) => item.id !== id));
            }, 5500);
        }

        notifier.addHandler(handle);
        return () => notifier.removeHandler(handle);
    }, [userName]);

    if (!notes.length) return null;

    return (
        <div className="live-popups">
            {notes.map((note) => (
                <div className="live-popup" key={note.id}>{note.text}</div>
            ))}
        </div>
    );
}
