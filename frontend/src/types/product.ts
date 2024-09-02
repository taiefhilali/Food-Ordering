// export type Product = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   dishType: string;
//   quantity: number;
//   imageUrl: string;
// };
export type Additives = {
  name: string;
  price: number;
  icon: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  cost: number;
  price: number;
  dishType: 'main' | 'side' | 'beverage' | 'entry' | 'dessert';
  restaurant: string; // Assuming ObjectId is a string in TypeScript
  quantity: number;
  imageUrl?: string;
  isApproved?: boolean;
  user?: string; // Assuming ObjectId is a string in TypeScript
  soldQuantity: number;
  revenue?: number;
  createdAt?: Date;
  category: string; // Assuming ObjectId is a string in TypeScript
  likes: string[]; // Assuming ObjectId is a string in TypeScript
  additives: Additives[]; // Array of additives
  totalRevenue?: number;
};
