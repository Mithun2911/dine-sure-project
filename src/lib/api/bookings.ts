
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc,
  query, 
  where,
  orderBy,
  limit as firestoreLimit,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { isOnline, storeLocalData, getLocalData, generateLocalId } from '../utils';
import type { BookingData } from './types';
import { updateRestaurantTableStatus } from './restaurants';
import { BookingDetails } from '@/components/TableBookingModal';

// Firebase collection name constant - changed for better identification
const BOOKINGS_COLLECTION = 'restaurant_orders';

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
      const bookingsCollection = collection(db, BOOKINGS_COLLECTION);
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
      
      console.log(`Booking saved to ${BOOKINGS_COLLECTION} collection with ID:`, docRef.id);
      return newBooking;
    } catch (error) {
      console.error(`Error saving to Firebase ${BOOKINGS_COLLECTION} collection:`, error);
      // Continue with local storage if Firebase fails
    }
  }
  
  // Store locally if offline or Firebase failed
  const localId = generateLocalId();
  const newBooking = { id: localId, ...bookingData };
  
  const localBookings = getLocalData<BookingData[]>('bookings') || [];
  storeLocalData('bookings', [...localBookings, newBooking]);
  
  // Update local restaurant data
  updateRestaurantTableStatus(
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
      const bookingsCollection = collection(db, BOOKINGS_COLLECTION);
      const q = query(bookingsCollection, where("id", "==", bookingId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bookingDoc = querySnapshot.docs[0];
        return { id: bookingDoc.id, ...bookingDoc.data() } as BookingData;
      }
    } catch (error) {
      console.error(`Error fetching booking from Firebase ${BOOKINGS_COLLECTION} collection:`, error);
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
      const bookingsCollection = collection(db, BOOKINGS_COLLECTION);
      const q = query(
        bookingsCollection,
        orderBy("createdAt", "desc"),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookingData[];
        
        // Store in localStorage for offline access
        storeLocalData('bookings', bookings);
        
        console.log(`Fetched ${bookings.length} bookings from ${BOOKINGS_COLLECTION} collection`);
        return bookings;
      }
    } catch (error) {
      console.error(`Error fetching bookings from Firebase ${BOOKINGS_COLLECTION} collection:`, error);
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
