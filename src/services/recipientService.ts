import axios from "axios";
import type { Recipient, CartItem } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const recipientService = {
  async addRecipient(username: string, isGiftsOn = true, giftsReceived = 0) {
    const res = await api.post("/recipient/add-recipient", {
      username,
      isGiftsOn,
      giftsReceived,
    });
    return res.data.recipient as Recipient;
  },

  async setGiftsOn(isGiftsOn: boolean) {
    const res = await api.patch("/recipient/set-gifts", { isGiftsOn });
    return res.data.recipient as Recipient;
  },

  async getGiftsReceived() {
    const res = await api.get("/recipient/gifts-received");
    return res.data.giftsReceived as number;
  },

  async getIsGiftsOn() {
    const res = await api.get("/recipient/gifts-status");
    return res.data.isGiftsOn as boolean;
  },

  async getRecipient() {
    const res = await api.get("/recipient/get-recipient");
    return res.data.recipient as Recipient;
  },

  async getCartItems(): Promise<CartItem[]> {
    const res = await api.get("/recipient/cart/details");
    return res.data.cartDetails;
  },

  async getCartTotal() {
    const res = await api.get("/recipient/cart/details");
    return res.data.total;
  },
};
