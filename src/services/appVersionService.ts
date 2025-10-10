// external
import axios from "axios";
import type { AppVersion, CreateAppVersionRequest } from "../types";

// internal
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// service for app versions
export const appVersionService = {
  async getLatestAppVersion(): Promise<AppVersion> {
    try {
      const response = await api.get("/admin/version/latest");
      return response.data.latestVersion;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch latest app version");
    }
  },

  async getAllAppVersions(): Promise<AppVersion[]> {
    try {
      const response = await api.get("/admin/version/all");
      return response.data.versions;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch app versions");
    }
  },

  async createAppVersion(
    versionData: CreateAppVersionRequest
  ): Promise<AppVersion> {
    try {
      const response = await api.post("/admin/version/create", versionData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to create app version");
    }
  },

  async deleteAppVersion(id: string): Promise<void> {
    try {
      await api.delete(`/admin/version/${id}/delete`);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to delete app version");
    }
  },

  async getAppVersionById(id: string): Promise<AppVersion> {
    try {
      const response = await api.get(`/admin/version/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch app version");
    }
  },
};
