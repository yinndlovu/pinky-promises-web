// external
import axios from "axios";
import type { NotificationRequest, NotificationResponse } from "../types";

// internal
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// service for notifications
export const notificationService = {
  async sendNotificationToAll(
    notificationData: NotificationRequest
  ): Promise<NotificationResponse> {
    try {
      const response = await api.post("/notification/send", notificationData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to send notifications");
    }
  },
};
