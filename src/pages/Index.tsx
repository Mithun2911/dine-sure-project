import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import RestaurantTypeSelector from '@/components/RestaurantTypeSelector';
import RestaurantList from '@/components/RestaurantList';
import TableBookingModal, { BookingDetails } from '@/components/TableBookingModal';
import BookingConfirmation from '@/components/BookingConfirmation';
import { Restaurant } from '@/types/restaurant';
import { useToast } from '@/components/ui/use-toast';
import { fetchRestaurants, createBooking } from '@/lib/api';

// App states
type AppState = 'hero' | 'type-selection' | 'restaurant-list';

const Index = () => {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>('hero');
  const [isVegFilter, setIsVegFilter] = useState<boolean | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<{
    restaurantName: string;
    tableNumber: number;
    selectedTime: string;
    selectedCapacity: string;
    isVeg: boolean;
  } | null>(null);
  
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    restaurantName: string;
    tableNumber: number;
    time: string;
    capacity: string;
    isVeg: boolean;
    customerDetails: BookingDetails;
  } | null>(null);

  // Fetch restaurants when isVegFilter changes
  useEffect(() => {
    if (isVegFilter !== null) {
      loadRestaurants();
    }
  }, [isVegFilter]);

  // Function to load restaurants
  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await fetchRestaurants(isVegFilter);
      
      // Add a small delay to simulate network latency (helps with showing loading state)
      setTimeout(() => {
        setRestaurants(data);
        setLoading(false);
        
        // Show a toast notification with the number of restaurants found
        toast({
          title: `${data.length} Restaurant${data.length !== 1 ? 's' : ''} Found`,
          description: data.length > 0 
            ? `Showing ${data.length} ${isVegFilter ? 'vegetarian' : 'non-vegetarian'} restaurant${data.length !== 1 ? 's' : ''}.`
            : `No ${isVegFilter ? 'vegetarian' : 'non-vegetarian'} restaurants found. Try a different selection.`,
          variant: data.length > 0 ? "default" : "destructive"
        });
      }, 500);
      
    } catch (error) {
      console.error("Error loading restaurants:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load restaurants. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Navigation handlers
  const handleBookTableClick = () => {
    setAppState('type-selection');
  };

  const handleSelectType = (isVeg: boolean) => {
    setIsVegFilter(isVeg);
    setAppState('restaurant-list');
  };

  const handleBack = () => {
    if (appState === 'type-selection') {
      setAppState('hero');
    } else if (appState === 'restaurant-list') {
      setAppState('type-selection');
    }
  };

  // Booking handlers
  const handleBookTable = (
    restaurantName: string,
    tableNumber: number,
    selectedTime: string,
    selectedCapacity: string,
    isVeg: boolean
  ) => {
    setCurrentBooking({
      restaurantName,
      tableNumber,
      selectedTime,
      selectedCapacity,
      isVeg
    });
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (customerDetails: BookingDetails) => {
    if (!currentBooking) return;
    
    try {
      // Create booking using API service
      await createBooking(
        {
          restaurantName: currentBooking.restaurantName,
          tableNumber: currentBooking.tableNumber,
          time: currentBooking.selectedTime,
          capacity: currentBooking.selectedCapacity,
          isVeg: currentBooking.isVeg
        },
        customerDetails
      );
      
      // Update UI
      setBookingConfirmation({
        ...currentBooking,
        time: currentBooking.selectedTime,
        capacity: currentBooking.selectedCapacity,
        customerDetails
      });
      
      setBookingModalOpen(false);
      setConfirmationModalOpen(true);
      
      // Refresh restaurants
      loadRestaurants();
      
    } catch (error) {
      console.error("Error during booking:", error);
      toast({
        title: "Booking Error",
        description: "There was a problem with your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Render different screens based on app state
  return (
    <div className="content-wrapper">
      <AnimatePresence mode="wait">
        {appState === 'hero' && (
          <Hero onBookTable={handleBookTableClick} />
        )}
        
        {appState === 'type-selection' && (
          <RestaurantTypeSelector 
            onSelectType={handleSelectType}
            onBack={handleBack}
          />
        )}
        
        {appState === 'restaurant-list' && (
          <RestaurantList 
            restaurants={restaurants}
            onBack={handleBack}
            onBookTable={handleBookTable}
            loading={loading}
          />
        )}
      </AnimatePresence>
      
      {/* Table Booking Modal */}
      {currentBooking && (
        <TableBookingModal 
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          restaurantName={currentBooking.restaurantName}
          tableNumber={currentBooking.tableNumber}
          selectedTime={currentBooking.selectedTime}
          selectedCapacity={currentBooking.selectedCapacity}
          isVeg={currentBooking.isVeg}
          onConfirm={handleConfirmBooking}
        />
      )}
      
      {/* Booking Confirmation Modal */}
      <BookingConfirmation
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        bookingDetails={bookingConfirmation}
      />
    </div>
  );
};

export default Index;
