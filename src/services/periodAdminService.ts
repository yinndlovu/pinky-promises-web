// external
import axios from "axios";

// internal
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// service for period admin operations
export const periodAdminService = {
  async getEnums() {
    const res = await api.get("/admin/period/enums");
    return res.data;
  },

  async getAdminAids() {
    const res = await api.get("/admin/period/aids");
    return res.data;
  },

  async createAdminAid(data: {
    problem: string;
    category: string;
    title: string;
    description?: string;
    priority?: number;
  }) {
    const res = await api.post("/admin/period/aid", data);
    return res.data;
  },

  async updateAdminAid(
    aidId: number,
    data: {
      problem?: string;
      category?: string;
      title?: string;
      description?: string;
      priority?: number;
    }
  ) {
    const res = await api.put(`/admin/period/aid/${aidId}`, data);
    return res.data;
  },

  async deleteAdminAid(aidId: number) {
    const res = await api.delete(`/admin/period/aid/${aidId}`);
    return res.data;
  },

  async getAdminLookouts() {
    const res = await api.get("/admin/period/lookouts");
    return res.data;
  },

  async createAdminLookout(data: {
    userId: number;
    title: string;
    description?: string;
    showOnDate: string;
    showUntilDate?: string;
    priority?: number;
  }) {
    const res = await api.post("/admin/period/lookout", data);
    return res.data;
  },

  async updateAdminLookout(
    lookoutId: number,
    data: {
      userId?: number;
      title?: string;
      description?: string;
      showOnDate?: string;
      showUntilDate?: string;
      priority?: number;
    }
  ) {
    const res = await api.put(`/admin/period/lookout/${lookoutId}`, data);
    return res.data;
  },

  async deleteAdminLookout(lookoutId: number) {
    const res = await api.delete(`/admin/period/lookout/${lookoutId}`);
    return res.data;
  },

  async registerPeriodUser(data: {
    username: string;
    previousCycleStartDate: string;
    previousCycleEndDate: string;
    defaultCycleLength?: number;
    defaultPeriodLength?: number;
  }) {
    const res = await api.post("/admin/period/user/register", data);
    return res.data;
  },

  async getAllPeriodUsers() {
    const res = await api.get("/admin/period/users");
    return res.data;
  },

  async updatePeriodUser(
    userId: number,
    data: {
      username?: string;
      defaultCycleLength?: number;
      defaultPeriodLength?: number;
      isActive?: boolean;
    }
  ) {
    const res = await api.put(`/admin/period/user/${userId}`, data);
    return res.data;
  },

  async deactivatePeriodUser(userId: number) {
    const res = await api.delete(`/admin/period/user/${userId}`);
    return res.data;
  },
};
