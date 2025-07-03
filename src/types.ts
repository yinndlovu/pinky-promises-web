export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface GiftRecipient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastGiftSent?: Date;
  totalGiftsReceived: number;
}