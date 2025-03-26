
// Type definitions for the API

export interface BookingData {
  id: string;
  restaurantName: string;
  tableNumber: number;
  time: string;
  capacity: string;
  isVeg: boolean;
  customerName: string;
  contactDetails: string;
  starter: string;
  mainCourse: string;
  dessert: string;
  specialInstructions: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
