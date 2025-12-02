// external
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  AlertCircle,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import "./PeriodAdminManager.css";

// internal
import { periodAdminService } from "../services/periodAdminService";
import type {
  PeriodAid,
  PeriodLookout,
  PeriodUser,
  PeriodEnums,
} from "../types";

const PeriodAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"aids" | "lookouts" | "users">(
    "aids"
  );

  // use states (period aids)
  const [aids, setAids] = useState<PeriodAid[]>([]);
  const [showAddAid, setShowAddAid] = useState(false);
  const [editingAid, setEditingAid] = useState<PeriodAid | null>(null);
  const [aidForm, setAidForm] = useState({
    problem: "",
    category: "",
    title: "",
    description: "",
    priority: 0,
  });
  const [aidsLoading, setAidsLoading] = useState(false);

  // use states (period lookouts)
  const [lookouts, setLookouts] = useState<PeriodLookout[]>([]);
  const [showAddLookout, setShowAddLookout] = useState(false);
  const [editingLookout, setEditingLookout] = useState<PeriodLookout | null>(
    null
  );
  const [lookoutForm, setLookoutForm] = useState({
    userId: "",
    title: "",
    description: "",
    showOnDate: "",
    showUntilDate: "",
    priority: 0,
  });
  const [lookoutsLoading, setLookoutsLoading] = useState(false);

  // use states (period users)
  const [users, setUsers] = useState<PeriodUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<PeriodUser | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    previousCycleStartDate: "",
    previousCycleEndDate: "",
    defaultCycleLength: 28,
    defaultPeriodLength: 5,
  });
  const [usersLoading, setUsersLoading] = useState(false);

  // use states (enums)
  const [enums, setEnums] = useState<PeriodEnums>({
    problems: [],
    categories: [],
  });

  // load enums on mount
  useEffect(() => {
    loadEnums();
  }, []);

  // load data based on active tab
  useEffect(() => {
    if (activeTab === "aids") {
      loadAids();
    } else if (activeTab === "lookouts") {
      loadLookouts();
    } else if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const loadEnums = async () => {
    try {
      const data = await periodAdminService.getEnums();
      setEnums(data);
    } catch (err: any) {
      console.error("Failed to load enums:", err);
    }
  };

  const loadAids = async () => {
    setAidsLoading(true);
    try {
      const data = await periodAdminService.getAdminAids();
      setAids(data);
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || err.message || "Failed to load aids",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setAidsLoading(false);
  };

  const loadLookouts = async () => {
    setLookoutsLoading(true);
    try {
      const data = await periodAdminService.getAdminLookouts();
      setLookouts(data);
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error || err.message || "Failed to load lookouts",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setLookoutsLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await periodAdminService.getAllPeriodUsers();
      setUsers(data);
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to load period users",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setUsersLoading(false);
  };

  // period aids handlers
  const handleAddAid = async (e: React.FormEvent) => {
    e.preventDefault();
    setAidsLoading(true);
    try {
      await periodAdminService.createAdminAid(aidForm);
      await Swal.fire({
        title: "Success!",
        text: "Period aid created successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setShowAddAid(false);
      setAidForm({
        problem: "",
        category: "",
        title: "",
        description: "",
        priority: 0,
      });
      loadAids();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to create period aid",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setAidsLoading(false);
  };

  const handleUpdateAid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAid) return;
    setAidsLoading(true);
    try {
      await periodAdminService.updateAdminAid(editingAid.id, aidForm);
      await Swal.fire({
        title: "Success!",
        text: "Period aid updated successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setEditingAid(null);
      setAidForm({
        problem: "",
        category: "",
        title: "",
        description: "",
        priority: 0,
      });
      loadAids();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to update period aid",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setAidsLoading(false);
  };

  const handleDeleteAid = async (aidId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this period aid",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await periodAdminService.deleteAdminAid(aidId);
        await Swal.fire({
          title: "Deleted!",
          text: "Period aid has been deleted",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });
        loadAids();
      } catch (err: any) {
        Swal.fire({
          title: "Error",
          text:
            err.response?.data?.error ||
            err.message ||
            "Failed to delete period aid",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const startEditAid = (aid: PeriodAid) => {
    setEditingAid(aid);
    setAidForm({
      problem: aid.problem,
      category: aid.category,
      title: aid.title,
      description: aid.description || "",
      priority: aid.priority,
    });
    setShowAddAid(true);
  };

  // period lookouts handlers
  const handleAddLookout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookoutsLoading(true);
    try {
      await periodAdminService.createAdminLookout({
        userId: parseInt(lookoutForm.userId),
        title: lookoutForm.title,
        description: lookoutForm.description || undefined,
        showOnDate: lookoutForm.showOnDate,
        showUntilDate: lookoutForm.showUntilDate || undefined,
        priority: lookoutForm.priority,
      });
      await Swal.fire({
        title: "Success!",
        text: "Period lookout created successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setShowAddLookout(false);
      setLookoutForm({
        userId: "",
        title: "",
        description: "",
        showOnDate: "",
        showUntilDate: "",
        priority: 0,
      });
      loadLookouts();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to create period lookout",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setLookoutsLoading(false);
  };

  const handleUpdateLookout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLookout) return;
    setLookoutsLoading(true);
    try {
      await periodAdminService.updateAdminLookout(editingLookout.id, {
        userId: lookoutForm.userId ? parseInt(lookoutForm.userId) : undefined,
        title: lookoutForm.title || undefined,
        description: lookoutForm.description || undefined,
        showOnDate: lookoutForm.showOnDate || undefined,
        showUntilDate: lookoutForm.showUntilDate || undefined,
        priority: lookoutForm.priority,
      });
      await Swal.fire({
        title: "Success!",
        text: "Period lookout updated successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setEditingLookout(null);
      setLookoutForm({
        userId: "",
        title: "",
        description: "",
        showOnDate: "",
        showUntilDate: "",
        priority: 0,
      });
      loadLookouts();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to update period lookout",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setLookoutsLoading(false);
  };

  const handleDeleteLookout = async (lookoutId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this period lookout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await periodAdminService.deleteAdminLookout(lookoutId);
        await Swal.fire({
          title: "Deleted!",
          text: "Period lookout has been deleted",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });
        loadLookouts();
      } catch (err: any) {
        Swal.fire({
          title: "Error",
          text:
            err.response?.data?.error ||
            err.message ||
            "Failed to delete period lookout",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const startEditLookout = (lookout: PeriodLookout) => {
    setEditingLookout(lookout);
    setLookoutForm({
      userId: lookout.userId.toString(),
      title: lookout.title,
      description: lookout.description || "",
      showOnDate: lookout.showOnDate,
      showUntilDate: lookout.showUntilDate || "",
      priority: lookout.priority,
    });
    setShowAddLookout(true);
  };

  // period users handlers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersLoading(true);
    try {
      await periodAdminService.registerPeriodUser(userForm);
      await Swal.fire({
        title: "Success!",
        text: "Period user registered successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setShowAddUser(false);
      setUserForm({
        username: "",
        previousCycleStartDate: "",
        previousCycleEndDate: "",
        defaultCycleLength: 28,
        defaultPeriodLength: 5,
      });
      loadUsers();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to register period user",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setUsersLoading(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsersLoading(true);
    try {
      await periodAdminService.updatePeriodUser(editingUser.id, {
        username: userForm.username || undefined,
        defaultCycleLength: userForm.defaultCycleLength,
        defaultPeriodLength: userForm.defaultPeriodLength,
      });
      await Swal.fire({
        title: "Success!",
        text: "Period user updated successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });
      setEditingUser(null);
      setUserForm({
        username: "",
        previousCycleStartDate: "",
        previousCycleEndDate: "",
        defaultCycleLength: 28,
        defaultPeriodLength: 5,
      });
      loadUsers();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to update period user",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setUsersLoading(false);
  };

  const handleDeactivateUser = async (userId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate this period user",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
    });

    if (result.isConfirmed) {
      try {
        await periodAdminService.deactivatePeriodUser(userId);
        await Swal.fire({
          title: "Deactivated!",
          text: "Period user has been deactivated",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });
        loadUsers();
      } catch (err: any) {
        Swal.fire({
          title: "Error",
          text:
            err.response?.data?.error ||
            err.message ||
            "Failed to deactivate period user",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const startEditUser = (user: PeriodUser) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      previousCycleStartDate: "",
      previousCycleEndDate: "",
      defaultCycleLength: user.defaultCycleLength || 28,
      defaultPeriodLength: user.defaultPeriodLength || 5,
    });
    setShowAddUser(true);
  };

  return (
    <div className="period-admin-manager">
      <div className="period-admin-header">
        <h2 className="text-lg font-semibold text-gray-900">
          Period Management
        </h2>
      </div>

      {/* Tabs */}
      <div className="period-admin-tabs">
        <button
          className={`tab-button ${activeTab === "aids" ? "active" : ""}`}
          onClick={() => setActiveTab("aids")}
        >
          <Package className="w-4 h-4" />
          <span>Period Aids</span>
        </button>
        <button
          className={`tab-button ${activeTab === "lookouts" ? "active" : ""}`}
          onClick={() => setActiveTab("lookouts")}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Lookouts</span>
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users className="w-4 h-4" />
          <span>Period Users</span>
        </button>
      </div>

      {/* Period Aids Tab */}
      {activeTab === "aids" && (
        <div className="period-admin-content">
          <div className="period-admin-section-header">
            <h3 className="text-md font-semibold text-gray-900">
              Admin Period Aids
            </h3>
            <button
              onClick={() => {
                setEditingAid(null);
                setAidForm({
                  problem: "",
                  category: "",
                  title: "",
                  description: "",
                  priority: 0,
                });
                setShowAddAid(true);
              }}
              className="primary-button"
            >
              <Plus className="w-4 h-4" />
              <span>Add Aid</span>
            </button>
          </div>

          {aidsLoading ? (
            <div className="loading-state">Loading aids...</div>
          ) : aids.length === 0 ? (
            <div className="empty-state">No period aids found</div>
          ) : (
            <div className="period-admin-grid">
              {aids.map((aid) => (
                <div key={aid.id} className="period-admin-card">
                  <div className="period-admin-card-header">
                    <h4 className="font-semibold text-gray-900">{aid.title}</h4>
                    <div className="period-admin-card-actions">
                      <button
                        onClick={() => startEditAid(aid)}
                        className="icon-button edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAid(aid.id)}
                        className="icon-button delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="period-admin-card-body">
                    <div className="period-admin-tags">
                      <span className="tag">{aid.problem}</span>
                      <span className="tag">{aid.category}</span>
                      {aid.priority > 0 && (
                        <span className="tag priority">
                          Priority: {aid.priority}
                        </span>
                      )}
                    </div>
                    {aid.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {aid.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Aid Modal */}
          {showAddAid && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingAid ? "Edit Period Aid" : "Add Period Aid"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddAid(false);
                      setEditingAid(null);
                    }}
                    className="icon-button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form
                  onSubmit={editingAid ? handleUpdateAid : handleAddAid}
                  className="space-y-4"
                >
                  <div>
                    <label className="form-label">Problem *</label>
                    <select
                      value={aidForm.problem}
                      onChange={(e) =>
                        setAidForm({ ...aidForm, problem: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={aidsLoading}
                    >
                      <option value="">Select a problem</option>
                      {enums.problems.map((problem) => (
                        <option key={problem} value={problem}>
                          {problem}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Category *</label>
                    <select
                      value={aidForm.category}
                      onChange={(e) =>
                        setAidForm({ ...aidForm, category: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={aidsLoading}
                    >
                      <option value="">Select a category</option>
                      {enums.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      value={aidForm.title}
                      onChange={(e) =>
                        setAidForm({ ...aidForm, title: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={aidsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      value={aidForm.description}
                      onChange={(e) =>
                        setAidForm({ ...aidForm, description: e.target.value })
                      }
                      className="form-input"
                      rows={3}
                      disabled={aidsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <input
                      type="number"
                      value={aidForm.priority}
                      onChange={(e) =>
                        setAidForm({
                          ...aidForm,
                          priority: parseInt(e.target.value) || 0,
                        })
                      }
                      className="form-input"
                      min="0"
                      disabled={aidsLoading}
                    />
                  </div>
                  <div className="button-group">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAid(false);
                        setEditingAid(null);
                      }}
                      className="secondary-button"
                      disabled={aidsLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={aidsLoading}
                    >
                      {aidsLoading
                        ? "Saving..."
                        : editingAid
                        ? "Update Aid"
                        : "Create Aid"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Period Lookouts Tab */}
      {activeTab === "lookouts" && (
        <div className="period-admin-content">
          <div className="period-admin-section-header">
            <h3 className="text-md font-semibold text-gray-900">
              Period Lookouts
            </h3>
            <button
              onClick={() => {
                setEditingLookout(null);
                setLookoutForm({
                  userId: "",
                  title: "",
                  description: "",
                  showOnDate: "",
                  showUntilDate: "",
                  priority: 0,
                });
                setShowAddLookout(true);
              }}
              className="primary-button"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lookout</span>
            </button>
          </div>

          {lookoutsLoading ? (
            <div className="loading-state">Loading lookouts...</div>
          ) : lookouts.length === 0 ? (
            <div className="empty-state">
              <p>No period lookouts found.</p>
              <p className="text-sm text-gray-500 mt-2">
                Use the "Add Lookout" button to create lookouts for specific
                users.
              </p>
            </div>
          ) : (
            <div className="period-admin-grid">
              {lookouts.map((lookout) => (
                <div key={lookout.id} className="period-admin-card">
                  <div className="period-admin-card-header">
                    <h4 className="font-semibold text-gray-900">
                      {lookout.title}
                    </h4>
                    <div className="period-admin-card-actions">
                      <button
                        onClick={() => startEditLookout(lookout)}
                        className="icon-button edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLookout(lookout.id)}
                        className="icon-button delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="period-admin-card-body">
                    <p className="text-sm text-gray-600">
                      User:{" "}
                      {lookout.User?.username ||
                        lookout.User?.name ||
                        `ID: ${lookout.userId}`}
                    </p>
                    {lookout.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {lookout.description}
                      </p>
                    )}
                    <div className="period-admin-dates mt-2">
                      <span className="text-xs text-gray-500">
                        Show on:{" "}
                        {new Date(lookout.showOnDate).toLocaleDateString()}
                      </span>
                      {lookout.showUntilDate && (
                        <span className="text-xs text-gray-500">
                          Until:{" "}
                          {new Date(lookout.showUntilDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Lookout Modal */}
          {showAddLookout && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingLookout ? "Edit Lookout" : "Add Lookout"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddLookout(false);
                      setEditingLookout(null);
                    }}
                    className="icon-button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form
                  onSubmit={
                    editingLookout ? handleUpdateLookout : handleAddLookout
                  }
                  className="space-y-4"
                >
                  <div>
                    <label className="form-label">User ID *</label>
                    <input
                      type="number"
                      value={lookoutForm.userId}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          userId: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      value={lookoutForm.title}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          title: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      value={lookoutForm.description}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          description: e.target.value,
                        })
                      }
                      className="form-input"
                      rows={3}
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Show On Date *</label>
                    <input
                      type="date"
                      value={lookoutForm.showOnDate}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          showOnDate: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Show Until Date</label>
                    <input
                      type="date"
                      value={lookoutForm.showUntilDate}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          showUntilDate: e.target.value,
                        })
                      }
                      className="form-input"
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <input
                      type="number"
                      value={lookoutForm.priority}
                      onChange={(e) =>
                        setLookoutForm({
                          ...lookoutForm,
                          priority: parseInt(e.target.value) || 0,
                        })
                      }
                      className="form-input"
                      min="0"
                      disabled={lookoutsLoading}
                    />
                  </div>
                  <div className="button-group">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddLookout(false);
                        setEditingLookout(null);
                      }}
                      className="secondary-button"
                      disabled={lookoutsLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={lookoutsLoading}
                    >
                      {lookoutsLoading
                        ? "Saving..."
                        : editingLookout
                        ? "Update Lookout"
                        : "Create Lookout"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Period Users Tab */}
      {activeTab === "users" && (
        <div className="period-admin-content">
          <div className="period-admin-section-header">
            <h3 className="text-md font-semibold text-gray-900">
              Period Users
            </h3>
            <button
              onClick={() => {
                setEditingUser(null);
                setUserForm({
                  username: "",
                  previousCycleStartDate: "",
                  previousCycleEndDate: "",
                  defaultCycleLength: 28,
                  defaultPeriodLength: 5,
                });
                setShowAddUser(true);
              }}
              className="primary-button"
            >
              <Plus className="w-4 h-4" />
              <span>Register User</span>
            </button>
          </div>

          {usersLoading ? (
            <div className="loading-state">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">No period users found</div>
          ) : (
            <div className="period-admin-grid">
              {users.map((user) => (
                <div key={user.User?.id} className="period-admin-card">
                  <div className="period-admin-card-header">
                    <h4 className="font-semibold text-gray-900">
                      {user.User?.name || user.User?.username}
                    </h4>
                    <div className="period-admin-card-actions">
                      <button
                        onClick={() => startEditUser(user)}
                        className="icon-button edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivateUser(user.id)}
                        className="icon-button delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="period-admin-card-body">
                    <div className="period-admin-tags">
                      <span
                        className={`tag ${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="period-admin-user-details mt-2">
                      <p className="text-sm text-gray-600">
                        Cycle Length: {user.defaultCycleLength || 28} days
                      </p>
                      <p className="text-sm text-gray-600">
                        Period Length: {user.defaultPeriodLength || 5} days
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit User Modal */}
          {showAddUser && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingUser ? "Edit Period User" : "Register Period User"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddUser(false);
                      setEditingUser(null);
                    }}
                    className="icon-button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form
                  onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                  className="space-y-4"
                >
                  <div>
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({ ...userForm, username: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={usersLoading}
                    />
                  </div>
                  {!editingUser && (
                    <>
                      <div>
                        <label className="form-label">
                          Previous Cycle Start Date *
                        </label>
                        <input
                          type="date"
                          value={userForm.previousCycleStartDate}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              previousCycleStartDate: e.target.value,
                            })
                          }
                          className="form-input"
                          required
                          disabled={usersLoading}
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          Previous Cycle End Date *
                        </label>
                        <input
                          type="date"
                          value={userForm.previousCycleEndDate}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              previousCycleEndDate: e.target.value,
                            })
                          }
                          className="form-input"
                          required
                          disabled={usersLoading}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="form-label">Default Cycle Length</label>
                    <input
                      type="number"
                      value={userForm.defaultCycleLength}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          defaultCycleLength: parseInt(e.target.value) || 28,
                        })
                      }
                      className="form-input"
                      min="1"
                      disabled={usersLoading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Default Period Length</label>
                    <input
                      type="number"
                      value={userForm.defaultPeriodLength}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          defaultPeriodLength: parseInt(e.target.value) || 5,
                        })
                      }
                      className="form-input"
                      min="1"
                      disabled={usersLoading}
                    />
                  </div>
                  <div className="button-group">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddUser(false);
                        setEditingUser(null);
                      }}
                      className="secondary-button"
                      disabled={usersLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={usersLoading}
                    >
                      {usersLoading
                        ? "Saving..."
                        : editingUser
                        ? "Update User"
                        : "Register User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodAdminManager;
