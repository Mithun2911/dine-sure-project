
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  DocumentData,
  Query,
  CollectionReference,
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { isOnline, storeLocalData, getLocalData, generateLocalId } from './utils';
import { Restaurant } from '@/types/restaurant';
import { BookingDetails } from '@/components/TableBookingModal';

// Interface for booking data
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

// Create a booking
export async function createBooking(
  restaurantInfo: {
    restaurantName: string;
    tableNumber: number;
    time: string;
    capacity: string;
    isVeg: boolean;
  },
  customerDetails: BookingDetails
): Promise<BookingData> {
  // Prepare the booking data
  const bookingData: Omit<BookingData, 'id'> = {
    restaurantName: restaurantInfo.restaurantName,
    tableNumber: restaurantInfo.tableNumber,
    time: restaurantInfo.time,
    capacity: restaurantInfo.capacity,
    isVeg: restaurantInfo.isVeg,
    customerName: customerDetails.customerName,
    contactDetails: customerDetails.contactDetails,
    starter: customerDetails.starter,
    mainCourse: customerDetails.mainCourse,
    dessert: customerDetails.dessert,
    specialInstructions: customerDetails.specialInstructions,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Try to save to Firebase if online
  if (isOnline()) {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const docRef = await addDoc(bookingsCollection, bookingData);
      
      // Update restaurant table status
      await updateRestaurantTableStatus(
        restaurantInfo.restaurantName,
        restaurantInfo.tableNumber,
        'Booked'
      );
      
      const newBooking = { id: docRef.id, ...bookingData };
      
      // Store in localStorage for offline access
      const localBookings = getLocalData<BookingData[]>('bookings') || [];
      storeLocalData('bookings', [...localBookings, newBooking]);
      
      return newBooking;
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      // Continue with local storage if Firebase fails
    }
  }
  
  // Store locally if offline or Firebase failed
  const localId = generateLocalId();
  const newBooking = { id: localId, ...bookingData };
  
  const localBookings = getLocalData<BookingData[]>('bookings') || [];
  storeLocalData('bookings', [...localBookings, newBooking]);
  
  // Update local restaurant data
  updateLocalRestaurantTableStatus(
    restaurantInfo.restaurantName,
    restaurantInfo.tableNumber,
    'Booked'
  );
  
  return newBooking;
}

// Fetch booking details
export async function fetchBookingDetails(bookingId: string): Promise<BookingData | null> {
  // Try to fetch from Firebase if online
  if (isOnline()) {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where("id", "==", bookingId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bookingDoc = querySnapshot.docs[0];
        return { id: bookingDoc.id, ...bookingDoc.data() } as BookingData;
      }
    } catch (error) {
      console.error("Error fetching booking from Firebase:", error);
      // Fall back to local data if Firebase fails
    }
  }
  
  // Try to get from localStorage
  const localBookings = getLocalData<BookingData[]>('bookings') || [];
  const booking = localBookings.find(b => b.id === bookingId);
  
  return booking || null;
}

// Fetch all bookings
export async function fetchAllBookings(limitCount: number = 10): Promise<BookingData[]> {
  // Try to fetch from Firebase if online
  if (isOnline()) {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const q = query(
        bookingsCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookingData[];
        
        // Store in localStorage for offline access
        storeLocalData('bookings', bookings);
        
        return bookings;
      }
    } catch (error) {
      console.error("Error fetching bookings from Firebase:", error);
      // Fall back to local data if Firebase fails
    }
  }
  
  // Get from localStorage
  const localBookings = getLocalData<BookingData[]>('bookings') || [];
  
  // Sort by created date descending and limit
  return localBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limitCount);
}

// Update restaurant table status
async function updateRestaurantTableStatus(
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
function updateLocalRestaurantTableStatus(
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
function generateMockRestaurants(isVegFilter: boolean | null = null): Restaurant[] {
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
