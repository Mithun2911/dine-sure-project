
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import { isOnline, storeLocalData, getLocalData } from '../utils';
import { Restaurant } from '@/types/restaurant';

// Fetch restaurants
export async function fetchRestaurants(isVegFilter: boolean | null = null): Promise<Restaurant[]> {
  // Try to fetch from Firebase if online
  if (isOnline()) {
    try {
      const restaurantsCollection = collection(db, 'restaurants');
      let restaurantsQuery: CollectionReference<DocumentData> | Query<DocumentData> = restaurantsCollection;
      
      if (isVegFilter !== null) {
        restaurantsQuery = query(restaurantsCollection, where('isVeg', '==', isVegFilter));
      }
      
      const querySnapshot = await getDocs(restaurantsQuery);
      
      if (!querySnapshot.empty) {
        const restaurantsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
        
        // Store data in localStorage for offline use
        storeLocalData('restaurants', restaurantsData);
        
        return restaurantsData;
      }
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      // Fall back to local data if Firebase fails
    }
  }
  
  // Fetch from localStorage if offline or Firebase fetch failed
  const localData = getLocalData<Restaurant[]>('restaurants');
  
  if (localData) {
    // Apply filter locally if needed
    if (isVegFilter !== null) {
      return localData.filter(r => r.isVeg === isVegFilter);
    }
    return localData;
  }
  
  // If no local data, use mock data
  return generateMockRestaurants(isVegFilter);
}

// Update restaurant table status
export async function updateRestaurantTableStatus(
  restaurantName: string,
  tableNumber: number,
  status: 'Available' | 'Booked'
): Promise<void> {
  if (isOnline()) {
    try {
      const restaurantsCollection = collection(db, 'restaurants');
      const restaurantsQuery = query(
        restaurantsCollection, 
        where('name', '==', restaurantName)
      );
      
      const querySnapshot = await getDocs(restaurantsQuery);
      
      if (!querySnapshot.empty) {
        const restaurantDoc = querySnapshot.docs[0];
        const restaurantData = restaurantDoc.data() as Restaurant;
        
        // Update table status
        const updatedTables = restaurantData.tables.map(table => {
          if (table.number === tableNumber) {
            return { ...table, status };
          }
          return table;
        });
        
        await updateDoc(doc(db, 'restaurants', restaurantDoc.id), {
          tables: updatedTables
        });
        
        // Update local copy
        updateLocalRestaurantTableStatus(restaurantName, tableNumber, status);
      }
    } catch (error) {
      console.error("Error updating restaurant in Firebase:", error);
    }
  } else {
    // Update local data if offline
    updateLocalRestaurantTableStatus(restaurantName, tableNumber, status);
  }
}

// Update restaurant table status in localStorage
export function updateLocalRestaurantTableStatus(
  restaurantName: string,
  tableNumber: number,
  status: 'Available' | 'Booked'
): void {
  const localRestaurants = getLocalData<Restaurant[]>('restaurants');
  
  if (localRestaurants) {
    const updatedRestaurants = localRestaurants.map(restaurant => {
      if (restaurant.name === restaurantName) {
        return {
          ...restaurant,
          tables: restaurant.tables.map(table => 
            table.number === tableNumber 
              ? { ...table, status }
              : table
          )
        };
      }
      return restaurant;
    });
    
    storeLocalData('restaurants', updatedRestaurants);
  }
}

// Generate mock restaurant data
export function generateMockRestaurants(isVegFilter: boolean | null = null): Restaurant[] {
  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "The Fine Diner",
      cuisine: "Continental",
      isVeg: false,
      tables: generateTables(5)
    },
    {
      id: "2",
      name: "Spice Garden",
      cuisine: "Indian",
      isVeg: true,
      tables: generateTables(4)
    },
    {
      id: "3",
      name: "Sushi Express",
      cuisine: "Japanese",
      isVeg: false,
      tables: generateTables(6)
    },
    {
      id: "4",
      name: "Green Delight",
      cuisine: "Vegetarian",
      isVeg: true,
      tables: generateTables(3)
    },
    {
      id: "5",
      name: "Veggie Haven",
      cuisine: "Vegan",
      isVeg: true,
      tables: generateTables(4)
    },
    {
      id: "6",
      name: "Herbivore's Feast",
      cuisine: "Vegetarian",
      isVeg: true,
      tables: generateTables(2)
    },
    {
      id: "7",
      name: "Carnivore's Grill",
      cuisine: "BBQ",
      isVeg: false,
      tables: generateTables(5)
    },
    {
      id: "8",
      name: "Ocean's Catch",
      cuisine: "Seafood", 
      isVeg: false,
      tables: generateTables(3)
    }
  ];
  
  // Store mock data in localStorage
  storeLocalData('restaurants', mockRestaurants);
  
  // Filter by veg/non-veg if needed
  if (isVegFilter !== null) {
    return mockRestaurants.filter(r => r.isVeg === isVegFilter);
  }
  
  return mockRestaurants;
}

// Helper function to generate random tables
function generateTables(count: number) {
  const tables = [];
  for (let i = 1; i <= count; i++) {
    tables.push({
      number: i,
      status: Math.random() > 0.5 ? 'Available' : 'Booked' as 'Available' | 'Booked'
    });
  }
  return tables;
}
