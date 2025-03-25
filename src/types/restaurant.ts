
export interface RestaurantTable {
  number: number;
  capacity?: string;
  status: 'Available' | 'Booked';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  isVeg: boolean;
  tables: RestaurantTable[];
}
