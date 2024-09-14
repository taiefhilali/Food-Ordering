export interface User {
  _id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
  username: string;
  imageUrl: string;
}

export interface Reply {
  _id: string;
  replyText: string;
  createdAt: Date;
  user: User; // Include user reference
}

export interface Feedback {
  _id: string;
  userId: User;
  restaurantId: string;
  feedbackText: string;
  createdAt: Date;
  replies?: Reply[]; // Make sure replies is included
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
  likes: string[]; // Array of User IDs (as strings)
};
export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  
  _id: string;
  user: string;
  restaurantName: string;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl: string;
  lastUpdated: string;
  percentage: number[],
  isApproved: boolean,
  rating:number,
ratingCount: number,
description: string
};

export type OrderStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export type Order = {
  _id: string;
  restaurant: Restaurant;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    addressLine1: string;
    city: string;
    email: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  restaurantId: string;
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
