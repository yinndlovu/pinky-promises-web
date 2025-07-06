import axios from "axios";
import type { LoginResponse, Admin } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const adminAuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post("/admin/login", { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to login. Please try again.");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async getCurrentAdmin(): Promise<Admin | null> {
    try {
      const response = await api.get("/admin/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      await api.get("/admin/me");
      return true;
    } catch (error) {
      return false;
    }
  },
};
