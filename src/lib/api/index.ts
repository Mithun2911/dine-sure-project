
// Main API entry point that re-exports all API functions

// Export types
export type { BookingData } from './types';

// Export restaurant-related functions
export {
  fetchRestaurants,
  updateRestaurantTableStatus,
  updateLocalRestaurantTableStatus,
  generateMockRestaurants
} from './restaurants';

// Export booking-related functions
export {
  createBooking,
  fetchBookingDetails,
  fetchAllBookings
} from './bookings';
