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
        // You must be logged in to see notifications.
        if (!userName) {
            setNotes([]);
            return;
        }

        const timeouts = [];
        let stopped = false;

        // Wait 2–6 seconds, show a random message, then hide it after 5.5 seconds.
        function showNext() {
            const wait = 2000 + Math.random() * 4000;
            const showTimer = setTimeout(() => {
                if (stopped) return;

                const note = {
                    id: Math.random(),
                    text: messages[Math.floor(Math.random() * messages.length)],
                };
                setNotes((current) => [...current, note]);

                // Hide the note after 5.5 seconds.
                const hideTimer = setTimeout(() => {
                    setNotes((current) => current.filter((item) => item.id !== note.id));
                }, 5500);
                timeouts.push(hideTimer);

                showNext();
            }, wait);
            timeouts.push(showTimer);
        }

        showNext();

        // Stop pending timers when the user logs out or this component goes away.
        return () => {
            stopped = true;
            timeouts.forEach(clearTimeout);
        };
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
