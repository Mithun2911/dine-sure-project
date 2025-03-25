
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingDetails } from './TableBookingModal';
import { CheckCircle } from 'lucide-react';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    restaurantName: string;
    tableNumber: number;
    time: string;
    capacity: string;
    isVeg: boolean;
    customerDetails: BookingDetails;
  } | null;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
  bookingDetails
}) => {
  if (!bookingDetails) return null;
  
  const { 
    restaurantName, 
    tableNumber, 
    time, 
    capacity, 
    isVeg,
    customerDetails 
  } = bookingDetails;
  
  const foodItems = {
    starter: {
      soup: "Soup",
      salad: "Salad",
      appetizer: "Appetizer"
    },
    vegMainCourse: {
      "vegetable-curry": "Vegetable Curry",
      "paneer-tikka": "Paneer Tikka",
      "mushroom-risotto": "Mushroom Risotto"
    },
    nonVegMainCourse: {
      "chicken-curry": "Chicken Curry",
      "grilled-fish": "Grilled Fish",
      "beef-steak": "Beef Steak"
    },
    dessert: {
      "ice-cream": "Ice Cream",
      cake: "Cake",
      pudding: "Pudding"
    }
  };
  
  // Get food item labels
  const starterLabel = foodItems.starter[customerDetails.starter as keyof typeof foodItems.starter] || customerDetails.starter;
  const mainCourseItems = isVeg ? foodItems.vegMainCourse : foodItems.nonVegMainCourse;
  const mainCourseLabel = mainCourseItems[customerDetails.mainCourse as keyof typeof mainCourseItems] || customerDetails.mainCourse;
  const dessertLabel = foodItems.dessert[customerDetails.dessert as keyof typeof foodItems.dessert] || customerDetails.dessert;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-green-600 text-white p-6 flex flex-col items-center">
            <CheckCircle size={60} className="mb-3" />
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">Booking Confirmed!</DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-center text-white/90">
              Your table is reserved and your meal will be prepared.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Restaurant:</div>
                <div className="font-medium">{restaurantName}</div>
                
                <div>Table Number:</div>
                <div className="font-medium">{tableNumber}</div>
                
                <div>Time:</div>
                <div className="font-medium">{time}</div>
                
                <div>Capacity:</div>
                <div className="font-medium">{capacity} {parseInt(capacity) === 1 ? 'Person' : 'People'}</div>
                
                <div>Customer:</div>
                <div className="font-medium">{customerDetails.customerName}</div>
                
                <div>Contact:</div>
                <div className="font-medium">{customerDetails.contactDetails}</div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Food Order</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Starter:</div>
                <div className="font-medium">{starterLabel}</div>
                
                <div>Main Course:</div>
                <div className="font-medium">{mainCourseLabel}</div>
                
                <div>Dessert:</div>
                <div className="font-medium">{dessertLabel}</div>
                
                {customerDetails.specialInstructions && (
                  <>
                    <div>Special Instructions:</div>
                    <div className="font-medium">{customerDetails.specialInstructions}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-4 border border-amber-300 bg-amber-50 rounded-lg">
              <p className="text-amber-800">
                <strong>Important:</strong> Your food will be ready in 30 minutes and the table will be reserved for 30-45 minutes from your booking time.
              </p>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button onClick={onClose} className="bg-brand-gold hover:bg-brand-gold/90 text-white">
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;
