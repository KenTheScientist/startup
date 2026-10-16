// Fake live notifications. A timer stands in for WebSocket messages from other users.
import React from 'react';
import './liveUpdates.css';

const messages = [
    'Jim joined the Home budget',
    'Sarah created a Vacation envelope',
    'Jim added $1000 to the Vacation envelope',
    'Sarah spent $600 on Plane Tickets',
    'Maya added $40 to the Groceries envelope',
    'Daniel spent $14 on Ice Cream from Groceries',
    'Luis created a Rainy Day envelope',
    'June joined the Vacation Club budget',
    'Noah spent $85 on New Tires from Car Fund',
    'Priya added $200 to the Rent envelope',
    'Helen spent $22 on Yarn from Hobbies',
    'Sam added $15 to the Pizza Night envelope',
    'Elena spent $9 on Bus Fare from Transit',
    'Owen spent $30 on Dog Walking from Pet Care',
    'Jordan created a Birthday Party envelope',
    'Riley added $75 to the Date Night envelope',
    'Maria spent $48 on Soccer Cleats from Kids',
    'Alex joined the Home budget',
];

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
