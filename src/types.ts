export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  adminId: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  adminId: string;
  email: string;
  name: string;
}

export interface Gift {
  id: string;
  name: string;
  value: string;
  message?: string;
  createdAt?: string;
}

export interface Recipient {
  id: string;
  username: string;
  isGiftsOn: boolean;
  giftsReceived: number;
  setGift: string;
}

export interface CartItem {
  id: string;
  item: string;
  value: number;
}

export interface AppVersion {
  id: string;
  version: string;
  downloadUrl: string;
  notes?: string | null;
  mandatory: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppVersionRequest {
  version: string;
  downloadUrl: string;
  notes?: string;
  mandatory: boolean;
}

export interface NotificationRequest {
  title: string;
  body: string;
  type: "custom" | "reminder" | "gift" | "system";
}

export interface NotificationResponse {
  count: number;
  notifications: any[];
}
