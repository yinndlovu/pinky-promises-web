// external
import React, { useState, useEffect } from "react";
import {
  Gift,
  Clock,
  Plus,
  Send,
  LogOut,
  Package,
  Zap,
  Users,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Swal from "sweetalert2";

// internal
import { recipientService } from "../../services/recipientService";
import { giftService } from "../../services/giftService";
import { inventoryService } from "../../services/inventoryService";
import type { CartItem, Gift as GiftType, Recipient } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { remindersService } from "../../services/remindersService";

const Dashboard: React.FC = () => {
  // variables
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // use states
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [addRecipientLoading, setAddRecipientLoading] = useState(false);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [timeToNext, setTimeToNext] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showAddGift, setShowAddGift] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [lastReminderDate, setLastReminderDate] = useState<string | null>(null);

  // use states (messages & processing)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendGiftLoading, setSendGiftLoading] = useState(false);
  const [sendRemindersLoading, setSendRemindersLoading] = useState(false);

  useEffect(() => {
    recipientService
      .getRecipient()
      .then(setRecipient)
      .catch(() => setRecipient(null));
  }, []);

  useEffect(() => {
    inventoryService
      .getAllGifts()
      .then(setGifts)
      .catch(() => setError("Failed to load gifts"));
  }, []);

  useEffect(() => {
    recipientService
      .getCartTotal()
      .then(setCartTotal)
      .catch(() => setCartTotal(0));
  });

  useEffect(() => {
    recipientService.getCartItems().then(setCartItems);
  }, []);

  useEffect(() => {
    remindersService
      .getLastReminderDate()
      .then((date) => setLastReminderDate(date))
      .catch(() => setLastReminderDate(null));
  }, []);

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddRecipientLoading(true);
    try {
      const newRec = await recipientService.addRecipient(newRecipientName);
      setRecipient(newRec);
      setShowAddRecipient(false);
      setNewRecipientName("");

      await Swal.fire({
        title: "Recipient Added!",
        text: `Recipient "${newRec.username}" added successfully.`,
        icon: "success",
        confirmButtonText: "Great!",
        background: "#f8fafc",
        confirmButtonColor: "#a855f7",
        timer: 10000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error || err.message || "Failed to add recipient",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#a855f7",
      });
    }
    setAddRecipientLoading(false);
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newGift = await inventoryService.addGift(name, value, message);
      setGifts((prev) => [...prev, newGift]);

      setName("");
      setValue("");
      setMessage("");

      setShowAddGift(false);

      await Swal.fire({
        title: "Gift Added Successfully!",
        text: `"${newGift.name}" has been added to your inventory.`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#10b981",
        background: "#f8fafc",
        timer: 10000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to add gift");

      Swal.fire({
        title: "Oops!",
        text: err.message || "Failed to add gift. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        background: "#fef2f2",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const calculateTimeToNext = () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = nextMonth.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeToNext({ days, hours, minutes, seconds });
    };

    calculateTimeToNext();
    const interval = setInterval(calculateTimeToNext, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleGifts = async () => {
    if (!recipient) {
      return;
    }

    try {
      const updated = await recipientService.setGiftsOn(!recipient.isGiftsOn);
      setRecipient(updated);
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error || err.message || "Failed to toggle gifts",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#a855f7",
      });
    }
  };

  const sendImmediateGift = async () => {
    if (!recipient) {
      return;
    }

    setSendGiftLoading(true);
    try {
      await giftService.sendGift();
      Swal.fire({
        title: "Gift Sent!",
        text: `A gift was sent to ${recipient.username}.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || err.message || "Failed to send gift",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setSendGiftLoading(false);
  };

  const removeGift = (giftId: string) => {
    setGifts(gifts.filter((g) => g.id !== giftId));
  };

  const sendReminders = async () => {
    setSendRemindersLoading(true);
    try {
      await remindersService.sendReminders();
      Swal.fire({
        title: "Reminders Sent!",
        text: `Reminders were sent to all users.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to send reminders",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setSendRemindersLoading(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="logo">
            <div className="logo-icon">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">PinkyPromises</h1>
          </div>

          <div className="user-info">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {admin?.name}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Recipients
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {recipient ? 1 : 0}
                </p>
              </div>
              <div className="stats-card-icon green">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available Gifts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {gifts.length}
                </p>
              </div>
              <div className="stats-card-icon purple">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gifts Sent
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {recipient?.giftsReceived || 0}
                </p>
              </div>
              <div className="stats-card-icon blue">
                <Send className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="countdown-card">
            <div className="stats-card-content">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "rgba(255, 165, 0, 0.7)" }}
                >
                  Next Gift In
                </p>
                <p className="text-xl font-bold">
                  {timeToNext.days}d {timeToNext.hours}h {timeToNext.minutes}m
                </p>
              </div>
              <div className="countdown-icon">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipient Management */}
          <div className="lg:col-span-1">
            <div className="recipient-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Current Recipient
              </h2>
              {recipient ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {recipient.username}
                      </h3>
                      {recipient?.setGift ? (
                        <p className="text-sm text-pink-600 font-medium mt-1">
                          Current set favorite present:{" "}
                          <span className="italic">
                            {recipient?.setGift || "Not set yet"}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-pink-600 font-medium mt-1">
                          Recipient hasn't set a favorite present yet
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {recipient.giftsReceived} gifts received
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Monthly Gifts
                    </span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={recipient.isGiftsOn}
                        onChange={handleToggleGifts}
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>
                  <button
                    onClick={sendImmediateGift}
                    className="primary-button"
                    disabled={sendGiftLoading}
                  >
                    {sendGiftLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Send Gift Now</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-4 text-gray-600">No recipient found.</p>
                  <button
                    onClick={() => setShowAddRecipient(true)}
                    className="primary-button"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Recipient</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="lg:col-span-1 mt-8">
              <div className="recipient-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Recipient Cart
                </h2>
                {cartItems && cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between">
                          <span className="text-gray-800">{item.item}</span>
                          <span className="text-pink-600 font-medium">
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {cartTotal}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-gray-600">
                      Recipient's cart is empty
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Recipient Modal */}
            {showAddRecipient && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Recipient
                  </h3>
                  <form onSubmit={handleAddRecipient} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Username"
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                      className="form-input"
                      required
                      disabled={addRecipientLoading}
                    />
                    <div className="button-group">
                      <button
                        type="button"
                        onClick={() => setShowAddRecipient(false)}
                        className="secondary-button"
                        disabled={addRecipientLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="primary-button"
                        disabled={addRecipientLoading}
                      >
                        {addRecipientLoading ? "Adding..." : "Add Recipient"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          {/* Gift Inventory */}
          <div className="lg:col-span-2">
            <div className="recipient-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Gift Inventory
                </h2>
                <button
                  onClick={() => setShowAddGift(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gift</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div key={gift.id} className="gift-card group">
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {gift.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Value:</strong> {gift.value}
                      </p>
                      {gift.message && (
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Message:</strong> {gift.message}
                        </p>
                      )}
                      {gift.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Added:</strong>{" "}
                          {new Date(gift.createdAt).toLocaleString()}
                        </p>
                      )}
                      <div className="flex items-center justify-end mt-2">
                        <button
                          onClick={() => removeGift(gift.id)}
                          className="delete-button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Gift Modal */}
              {showAddGift && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Add New Gift
                    </h3>
                    <form onSubmit={handleAddGift} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Gift Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. gift card code)"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="form-input"
                        required
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="Message (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-input"
                        disabled={loading}
                      />

                      {error && (
                        <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                          {error}
                        </div>
                      )}

                      <div className="button-group">
                        <button
                          type="button"
                          onClick={() => setShowAddGift(false)}
                          className="secondary-button"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="primary-button"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="loading-spinner"></div>
                              <span>Adding Gift...</span>
                            </div>
                          ) : (
                            "Add Gift"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Send Reminders */}
        <div className="mt-8">
          <div className="recipient-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Send Reminders
              </h2>
              <span className="text-sm text-gray-500">
                Last Sent:{" "}
                {lastReminderDate
                  ? new Date(lastReminderDate).toLocaleString()
                  : "Never"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Send reminders to all users.
            </p>

            <button
              onClick={sendReminders}
              className="primary-button"
              disabled={sendRemindersLoading}
            >
              {sendRemindersLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Sending Reminders...</span>
                </div>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Send Reminders</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
