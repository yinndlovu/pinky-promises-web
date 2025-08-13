import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const remindersService = {
  async sendReminders() {
    const res = await api.post("/reminder/send");
    return res.data;
  },

  async getLastReminderDate() {
    const res = await api.get("/reminder/last-sent");
    return res.data.lastReminderSent;
  }
};
