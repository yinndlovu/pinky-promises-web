import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const giftService = {
  async sendGift() {
    const res = await api.post("/gift/send-gift");
    return res.data;
  },
};
