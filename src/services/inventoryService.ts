import axios from "axios";
import type { Gift } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const inventoryService = {
  async getAllGifts(): Promise<Gift[]> {
    const res = await api.get("/inventory/all-gifts");
    return res.data.gifts;
  },
  
  async addGift(name: string, value: string, message?: string): Promise<Gift> {
    const res = await api.post("/inventory/add-gift", { name, value, message });
    return res.data.gift;
  },
};
