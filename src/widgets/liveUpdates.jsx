import React from 'react';

const showNotifications = false;

const messages = [
    'Jim joined the Home budget',
    'Sarah created a Vacation envelope',
    'Jim added $1000 to the Vacation envelope',
    'Sarah spent $600 for Plane Tickets',
    'Maya added $40 to the Groceries envelope',
    'Daniel spent $14 on Ice Cream from Groceries',
    'Luis created a Rainy Day envelope',
    'June joined the Vacation Club budget',
    'Noah spent $85 on New Tires from Car Fund',
    'Priya added $200 to the Rent envelope',
    'Helen spent $22 on Yarn from Hobbies',
    'Chris deleted the unused Arcade envelope',
    'Sam added $15 to the Pizza Night envelope',
    'Elena spent $9 on Bus Fare from Transit',
    'Owen spent $30 on Dog Walking from Pet Care',
    'Jordan created a Birthday Party envelope',
    'Riley added $75 to the Date Night envelope',
    'Maria spent $48 on Soccer Cleats from Kids',
    'Alex joined the Home budget',
    'Taylor spent $6 on Coffee from Treats',
];

export default function LiveUpdates({ userName }) {
    const [notes, setNotes] = React.useState([]);

    React.useEffect(() => {
        if (!showNotifications || !userName) return setNotes([]);
        // This will be replaced with WebSocket messages
        const timers = [];
        let id;
        function schedule() {
            id = setInterval(() => {
                clearInterval(id);
                const note = { id: Math.random(), text: messages[Math.floor(Math.random() * messages.length)] };
                setNotes((prev) => [...prev, note]);
                timers.push(setTimeout(() => setNotes((prev) => prev.filter((n) => n.id !== note.id)), 5500));
                schedule();
            }, 2000 + Math.random() * 4000);
        }
        schedule();
        return () => { clearInterval(id); timers.forEach(clearTimeout); };
    }, [userName]);

    if (!showNotifications || !notes.length) return null;

    return (
        <div className="live-popups">
            {notes.map((note) => <div className="live-popup" key={note.id}>{note.text}</div>)}
        </div>
    );
}
