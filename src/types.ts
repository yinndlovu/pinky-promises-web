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
}