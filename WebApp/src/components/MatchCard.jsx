
import { useState } from "react";

function MatchCard({ match, onBook }) {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState(1);

  const totalPrice = match.price * tickets;

  const handleSubmit = () => {
    if (userName.trim() === "") {
      alert("Please enter your name!");
      return;
    }

    if (tickets < 1 || tickets > match.available_seats) {
      alert("Please select a valid number of tickets!");
      return;
    }

    onBook(match, userName, tickets);
  };

  return (
    <div className="match-card">

      <h2>{match.team1} vs {match.team2}</h2>

      <p>Date: {match.date}</p>

      <p>Venue: {match.venue}</p>

      <p>Ticket Price: ₹{match.price}</p>

      <p>Available Seats: {match.available_seats}</p>

      <label>Your Name:</label>

      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
      />

      <label>Number of Tickets:</label>

      <input
        type="number"
        min="1"
        max={match.available_seats}
        value={tickets}
        onChange={(e) => setTickets(Number(e.target.value))}
      />

      <p>Total Price: ₹{totalPrice}</p>

      <button
        onClick={handleSubmit}
        disabled={match.available_seats <= 0}
      >
        Book Tickets
      </button>

    </div>
  );
}

export default MatchCard;
