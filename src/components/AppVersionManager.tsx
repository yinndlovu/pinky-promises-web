import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { appVersionService } from "../services/appVersionService";
import type { AppVersion, CreateAppVersionRequest } from "../types";

const AppVersionManager: React.FC = () => {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAppVersionRequest>({
    version: "",
    downloadUrl: "",
    notes: "",
    mandatory: false,
  });

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const versionsData = await appVersionService.getAllAppVersions();
      setVersions(versionsData);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to load app versions",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setLoading(false);
  };

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const newVersion = await appVersionService.createAppVersion(formData);
      setVersions([newVersion, ...versions]);
      setShowAddVersion(false);
      setFormData({
        version: "",
        downloadUrl: "",
        notes: "",
        mandatory: false,
      });

      await Swal.fire({
        title: "Version Created!",
        text: `App version ${newVersion.version} has been created successfully.`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#10b981",
        background: "#f8fafc",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create app version",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
    setCreateLoading(false);
  };

  const handleDeleteVersion = async (id: string, version: string) => {
    const result = await Swal.fire({
      title: "Delete Version",
      text: `Are you sure you want to delete version ${version}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      setDeleteLoading(id);
      try {
        await appVersionService.deleteAppVersion(id);
        setVersions(versions.filter((v) => v.id !== id));

        await Swal.fire({
          title: "Deleted!",
          text: `Version ${version} has been deleted.`,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to delete app version",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
      setDeleteLoading(null);
    }
  };

  const copyDownloadUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    Swal.fire({
      title: "Copied!",
      text: "Download URL copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#10b981",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="recipient-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          App Version Management
        </h2>
        <button
          onClick={() => setShowAddVersion(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Version</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading versions...</span>
        </div>
      ) : versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-600 mb-4">No app versions found.</p>
          <button
            onClick={() => setShowAddVersion(true)}
            className="primary-button"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Version</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Version {version.version}
                    </h3>
                    {version.mandatory ? (
                      <span className="flex items-center space-x-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Mandatory</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Optional</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <button
                        onClick={() => copyDownloadUrl(version.downloadUrl)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Copy Download URL
                      </button>
                    </div>

                    {version.notes && (
                      <p>
                        <strong>Notes:</strong> {version.notes}
                      </p>
                    )}

                    {version.createdAt && (
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleDeleteVersion(version.id, version.version)
                  }
                  disabled={deleteLoading === version.id}
                  className="delete-button ml-4"
                >
                  {deleteLoading === version.id ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Version Modal */}
      {showAddVersion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New App Version
            </h3>
            <form onSubmit={handleCreateVersion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1.0.0"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  className="form-input"
                  required
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Download URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/app.apk"
                  value={formData.downloadUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, downloadUrl: e.target.value })
                  }
                  className="form-input"
                  required
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Notes
                </label>
                <textarea
                  placeholder="Describe what's new in this version..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="form-textarea"
                  rows={3}
                  disabled={createLoading}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={formData.mandatory}
                  onChange={(e) =>
                    setFormData({ ...formData, mandatory: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  disabled={createLoading}
                />
                <label
                  htmlFor="mandatory"
                  className="text-sm font-medium text-gray-700"
                >
                  Mandatory Update
                </label>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setShowAddVersion(false)}
                  className="secondary-button"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Version"
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

export default AppVersionManager;
