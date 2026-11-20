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

        // Show a random note every 2–6 seconds, and remove it 5.5 seconds later.
        const timers = [];
        function showNext() {
            timers.push(setTimeout(() => {
                const id = Math.random();
                const text = messages[Math.floor(Math.random() * messages.length)];
                setNotes((current) => [...current, { id, text }]);
                timers.push(setTimeout(() => {
                    setNotes((current) => current.filter((item) => item.id !== id));
                }, 5500));
                showNext();
            }, 2000 + Math.random() * 4000));
        }

        showNext();
        return () => timers.forEach(clearTimeout);
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
