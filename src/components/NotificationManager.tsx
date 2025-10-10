//external
import React, { useState } from "react";
import { Send, MessageSquare, AlertCircle, Gift, Bell } from "lucide-react";
import Swal from "sweetalert2";

// internal
import { notificationService } from "../services/notificationService";
import type { NotificationRequest } from "../types";

const NotificationManager: React.FC = () => {
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState<NotificationRequest>({
    title: "",
    body: "",
    type: "custom",
  });

  const notificationTypes = [
    { value: "custom", label: "Custom", icon: MessageSquare, color: "blue" },
    { value: "reminder", label: "Reminder", icon: Bell, color: "orange" },
    { value: "gift", label: "Gift", icon: Gift, color: "purple" },
    { value: "system", label: "System", icon: AlertCircle, color: "red" },
  ];

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await notificationService.sendNotificationToAll(
        formData
      );

      setShowSendNotification(false);
      setFormData({
        title: "",
        body: "",
        type: "custom",
      });

      await Swal.fire({
        title: "Notifications Sent!",
        text: `Successfully sent notifications to ${response.count} users.`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#10b981",
        background: "#f8fafc",
        timer: 5000,
        timerProgressBar: true,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to send notifications",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setSending(false);
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = notificationTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.icon : MessageSquare;
  };

  const getTypeColor = (type: string) => {
    const typeInfo = notificationTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.color : "blue";
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = notificationTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.label : "Custom";
  };

  return (
    <div className="recipient-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Push Notifications
            </h2>
            <p className="text-sm text-gray-500">
              Send notifications to all app users
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSendNotification(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send Notification</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">How it works</h3>
            <p className="text-sm text-blue-700 mt-1">
              Notifications will be sent to all users who have push
              notifications enabled and have a valid Expo push token. You can
              choose different notification types to help users understand the
              context.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Types Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {notificationTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div
              key={type.value}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center space-x-2 mb-1">
                <IconComponent className={`w-4 h-4 text-${type.color}-600`} />
                <span className="text-sm font-medium text-gray-900">
                  {type.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {type.value === "custom" && "General purpose notifications"}
                {type.value === "reminder" && "Reminder notifications"}
                {type.value === "gift" && "Gift-related notifications"}
                {type.value === "system" && "System announcements"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Send Notification Modal */}
      {showSendNotification && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Send Push Notification
            </h3>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="form-input"
                  disabled={sending}
                >
                  {notificationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter notification title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-input"
                  required
                  disabled={sending}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  placeholder="Enter notification message"
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  className="form-textarea"
                  rows={4}
                  required
                  disabled={sending}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.body.length}/500 characters
                </p>
              </div>

              {/* Preview */}
              {(formData.title || formData.body) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </h4>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      {React.createElement(getTypeIcon(formData.type), {
                        className: `w-4 h-4 text-${getTypeColor(
                          formData.type
                        )}-600`,
                      })}
                      <span
                        className={`text-xs font-medium text-${getTypeColor(
                          formData.type
                        )}-600 uppercase tracking-wide`}
                      >
                        {getTypeLabel(formData.type)}
                      </span>
                    </div>
                    {formData.title && (
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">
                        {formData.title}
                      </h5>
                    )}
                    {formData.body && (
                      <p className="text-sm text-gray-700">{formData.body}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setShowSendNotification(false)}
                  className="secondary-button"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    sending || !formData.title.trim() || !formData.body.trim()
                  }
                >
                  {sending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to All Users</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
