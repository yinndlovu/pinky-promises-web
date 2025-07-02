import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const getNextFirstOfMonth = () => {
  const now = new Date();
  const year =
    now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  return new Date(year, month, 1, 0, 0, 0, 0);
};

const dummyGifts = [
  "Book: The Alchemist",
  "Chocolate Box",
  "Gift Card: Amazon",
  "Flowers",
];

export default function Dashboard() {
  const [recipient, setRecipient] = useState("Alice");
  const [gifts, setGifts] = useState(dummyGifts);
  const [active, setActive] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [newGift, setNewGift] = useState("");
  const [newRecipient, setNewRecipient] = useState("");

  // Countdown logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextFirst = getNextFirstOfMonth();
      const diff = nextFirst.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("00:00:00:00");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        `${days.toString().padStart(2, "0")}:${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add new gift
  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGift.trim()) {
      setGifts([...gifts, newGift.trim()]);
      setNewGift("");
    }
  };

  // Change/add recipient
  const handleChangeRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipient.trim()) {
      setRecipient(newRecipient.trim());
      setNewRecipient("");
    }
  };

  // Trigger immediate gift send
  const handleSendGift = () => {
    alert(`Gift sent to ${recipient}: ${gifts[0] || "No gifts available"}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Gift Dashboard</h2>
        <div className="dashboard-section">
          <strong>Recipient:</strong> {recipient}
          <form onSubmit={handleChangeRecipient} className="inline-form">
            <input
              type="text"
              placeholder="Change/Add recipient"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
            />
            <button type="submit">Update</button>
          </form>
        </div>
        <div className="dashboard-section">
          <strong>Stored Gifts:</strong>
          <ul>
            {gifts.map((gift, idx) => (
              <li key={idx}>{gift}</li>
            ))}
          </ul>
          <form onSubmit={handleAddGift} className="inline-form">
            <input
              type="text"
              placeholder="Add new gift"
              value={newGift}
              onChange={(e) => setNewGift(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <div className="dashboard-section">
          <strong>Countdown to next gift:</strong>
          <div className="countdown">{countdown}</div>
        </div>
        <div className="dashboard-section">
          <label>
            <input
              type="checkbox"
              checked={active}
              onChange={() => setActive((a) => !a)}
            />
            Activate next gift sending
          </label>
        </div>
        <div className="dashboard-section">
          <button onClick={handleSendGift} className="send-btn">
            Send Gift Now
          </button>
        </div>
      </div>
    </div>
  );
}
