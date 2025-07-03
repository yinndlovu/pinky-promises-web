import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  User, 
  Clock, 
  Plus, 
  Send, 
  Settings, 
  LogOut,
  Calendar,
  Package,
  Zap,
  Users,
  ChevronDown,
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Gift as GiftType, GiftRecipient } from '../../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRecipient, setSelectedRecipient] = useState<GiftRecipient | null>(null);
  const [recipients, setRecipients] = useState<GiftRecipient[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [timeToNext, setTimeToNext] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAddGift, setShowAddGift] = useState(false);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', description: '', price: 0, category: '' });
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

  // Initialize dummy data
  useEffect(() => {
    const dummyRecipients: GiftRecipient[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        isActive: true,
        lastGiftSent: new Date('2024-01-01'),
        totalGiftsReceived: 8
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        isActive: false,
        lastGiftSent: new Date('2023-12-01'),
        totalGiftsReceived: 12
      }
    ];

    const dummyGifts: GiftType[] = [
      {
        id: '1',
        name: 'Premium Coffee Blend',
        description: 'Artisanal coffee from Ethiopian highlands',
        price: 29.99,
        imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Food & Beverage'
      },
      {
        id: '2',
        name: 'Wireless Earbuds',
        description: 'High-quality noise-canceling earbuds',
        price: 149.99,
        imageUrl: 'https://images.pexels.com/photos/8000629/pexels-photo-8000629.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics'
      },
      {
        id: '3',
        name: 'Skincare Set',
        description: 'Luxury skincare collection with natural ingredients',
        price: 89.99,
        imageUrl: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Beauty'
      },
      {
        id: '4',
        name: 'Book Collection',
        description: 'Curated selection of bestselling novels',
        price: 39.99,
        imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Books'
      }
    ];

    setRecipients(dummyRecipients);
    setSelectedRecipient(dummyRecipients[0]);
    setGifts(dummyGifts);
  }, []);

  // Countdown timer
  useEffect(() => {
    const calculateTimeToNext = () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = nextMonth.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
    navigate('/login');
  };

  const handleAddGift = () => {
    if (newGift.name && newGift.description && newGift.price > 0) {
      const gift: GiftType = {
        id: Date.now().toString(),
        name: newGift.name,
        description: newGift.description,
        price: newGift.price,
        imageUrl: 'https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: newGift.category || 'General'
      };
      setGifts([...gifts, gift]);
      setNewGift({ name: '', description: '', price: 0, category: '' });
      setShowAddGift(false);
    }
  };

  const handleAddRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      const recipient: GiftRecipient = {
        id: Date.now().toString(),
        name: newRecipient.name,
        email: newRecipient.email,
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        isActive: false,
        totalGiftsReceived: 0
      };
      setRecipients([...recipients, recipient]);
      setNewRecipient({ name: '', email: '' });
      setShowAddRecipient(false);
    }
  };

  const toggleRecipientStatus = () => {
    if (selectedRecipient) {
      const updatedRecipients = recipients.map(r =>
        r.id === selectedRecipient.id ? { ...r, isActive: !r.isActive } : r
      );
      setRecipients(updatedRecipients);
      setSelectedRecipient({ ...selectedRecipient, isActive: !selectedRecipient.isActive });
    }
  };

  const sendImmediateGift = () => {
    if (selectedRecipient) {
      const updatedRecipients = recipients.map(r =>
        r.id === selectedRecipient.id
          ? { ...r, lastGiftSent: new Date(), totalGiftsReceived: r.totalGiftsReceived + 1 }
          : r
      );
      setRecipients(updatedRecipients);
      setSelectedRecipient({
        ...selectedRecipient,
        lastGiftSent: new Date(),
        totalGiftsReceived: selectedRecipient.totalGiftsReceived + 1
      });
    }
  };

  const removeGift = (giftId: string) => {
    setGifts(gifts.filter(g => g.id !== giftId));
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="logo">
            <div className="logo-icon">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">GiftDash</h1>
          </div>
          
          <div className="user-info">
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="user-avatar"
              />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Recipients</p>
                <p className="text-3xl font-bold text-gray-900">{recipients.filter(r => r.isActive).length}</p>
              </div>
              <div className="stats-card-icon green">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Gifts</p>
                <p className="text-3xl font-bold text-gray-900">{gifts.length}</p>
              </div>
              <div className="stats-card-icon purple">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gifts Sent</p>
                <p className="text-3xl font-bold text-gray-900">{recipients.reduce((sum, r) => sum + r.totalGiftsReceived, 0)}</p>
              </div>
              <div className="stats-card-icon blue">
                <Send className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="countdown-card">
            <div className="stats-card-content">
              <div>
                <p className="text-sm font-medium" style={{ color: 'rgba(255, 165, 0, 0.7)' }}>Next Gift In</p>
                <p className="text-xl font-bold">{timeToNext.days}d {timeToNext.hours}h {timeToNext.minutes}m</p>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Current Recipient</h2>
                <div className="recipient-dropdown">
                  <button
                    onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                    className="recipient-dropdown-button"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showRecipientDropdown && (
                    <div className="recipient-dropdown-menu">
                      {recipients.map((recipient) => (
                        <button
                          key={recipient.id}
                          onClick={() => {
                            setSelectedRecipient(recipient);
                            setShowRecipientDropdown(false);
                          }}
                          className="recipient-dropdown-item"
                        >
                          <img
                            src={recipient.avatar}
                            alt={recipient.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div style={{ textAlign: 'left' }}>
                            <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                            <p className="text-xs text-gray-500">{recipient.email}</p>
                          </div>
                        </button>
                      ))}
                      <hr style={{ margin: '0.5rem 0' }} />
                      <button
                        onClick={() => {
                          setShowAddRecipient(true);
                          setShowRecipientDropdown(false);
                        }}
                        className="recipient-dropdown-item text-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add New Recipient</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedRecipient && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedRecipient.avatar}
                      alt={selectedRecipient.name}
                      className="recipient-avatar"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedRecipient.name}</h3>
                      <p className="text-sm text-gray-600">{selectedRecipient.email}</p>
                      <p className="text-xs text-gray-500">{selectedRecipient.totalGiftsReceived} gifts received</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Monthly Gifts</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={selectedRecipient.isActive}
                        onChange={toggleRecipientStatus}
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>

                  <button
                    onClick={sendImmediateGift}
                    className="primary-button"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Send Gift Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Add Recipient Modal */}
            {showAddRecipient && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Recipient</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newRecipient.name}
                      onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newRecipient.email}
                      onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => setShowAddRecipient(false)}
                      className="secondary-button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRecipient}
                      className="primary-button"
                    >
                      Add Recipient
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gift Inventory */}
          <div className="lg:col-span-2">
            <div className="recipient-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Gift Inventory</h2>
                <button
                  onClick={() => setShowAddGift(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gift</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div key={gift.id} className="gift-card group">
                    <div className="flex items-start space-x-4">
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className="gift-image"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{gift.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{gift.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-green-600">${gift.price}</span>
                          <button
                            onClick={() => removeGift(gift.id)}
                            className="delete-button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="gift-category">
                          {gift.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Gift Modal */}
              {showAddGift && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Gift</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Gift Name"
                        value={newGift.name}
                        onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                        className="form-input"
                      />
                      <textarea
                        placeholder="Description"
                        value={newGift.description}
                        onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                        className="form-textarea"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={newGift.price || ''}
                        onChange={(e) => setNewGift({ ...newGift, price: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={newGift.category}
                        onChange={(e) => setNewGift({ ...newGift, category: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="button-group">
                      <button
                        onClick={() => setShowAddGift(false)}
                        className="secondary-button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddGift}
                        className="primary-button"
                      >
                        Add Gift
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;