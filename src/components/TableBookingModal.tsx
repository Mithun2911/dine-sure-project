
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  tableNumber: number;
  selectedTime: string;
  selectedCapacity: string;
  isVeg: boolean;
  onConfirm: (details: BookingDetails) => void;
}

export interface BookingDetails {
  customerName: string;
  contactDetails: string;
  starter: string;
  mainCourse: string;
  dessert: string;
  specialInstructions: string;
}

const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  tableNumber,
  selectedTime,
  selectedCapacity,
  isVeg,
  onConfirm
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<BookingDetails>({
    customerName: '',
    contactDetails: '',
    starter: '',
    mainCourse: '',
    dessert: '',
    specialInstructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: keyof BookingDetails) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerName || !formData.contactDetails || !formData.starter || !formData.mainCourse || !formData.dessert) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    onConfirm(formData);
    
    // Reset form
    setFormData({
      customerName: '',
      contactDetails: '',
      starter: '',
      mainCourse: '',
      dessert: '',
      specialInstructions: ''
    });
  };

  const vegMainCourses = [
    { value: "vegetable-curry", label: "Vegetable Curry" },
    { value: "paneer-tikka", label: "Paneer Tikka" },
    { value: "mushroom-risotto", label: "Mushroom Risotto" },
  ];

  const nonVegMainCourses = [
    { value: "chicken-curry", label: "Chicken Curry" },
    { value: "grilled-fish", label: "Grilled Fish" },
    { value: "beef-steak", label: "Beef Steak" },
  ];

  const starters = [
    { value: "soup", label: "Soup" },
    { value: "salad", label: "Salad" },
    { value: "appetizer", label: "Appetizer" },
  ];

  const desserts = [
    { value: "ice-cream", label: "Ice Cream" },
    { value: "cake", label: "Cake" },
    { value: "pudding", label: "Pudding" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-lg p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-brand-gold text-white p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Pre-order Your Food</DialogTitle>
                </DialogHeader>
                <p className="mt-2 text-white/90">
                  Restaurant: {restaurantName} | Table: {tableNumber} | Time: {selectedTime}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name*</Label>
                    <Input 
                      id="customerName" 
                      name="customerName" 
                      value={formData.customerName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactDetails">Contact Details*</Label>
                    <Input 
                      id="contactDetails" 
                      name="contactDetails" 
                      value={formData.contactDetails} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="starter">Starter*</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, 'starter')} 
                    value={formData.starter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Starter" />
                    </SelectTrigger>
                    <SelectContent>
                      {starters.map(starter => (
                        <SelectItem key={starter.value} value={starter.value}>
                          {starter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mainCourse">Main Course*</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, 'mainCourse')} 
                    value={formData.mainCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Main Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {(isVeg ? vegMainCourses : nonVegMainCourses).map(course => (
                        <SelectItem key={course.value} value={course.value}>
                          {course.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dessert">Dessert*</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, 'dessert')} 
                    value={formData.dessert}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dessert" />
                    </SelectTrigger>
                    <SelectContent>
                      {desserts.map(dessert => (
                        <SelectItem key={dessert.value} value={dessert.value}>
                          {dessert.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea 
                    id="specialInstructions" 
                    name="specialInstructions" 
                    value={formData.specialInstructions} 
                    onChange={handleChange} 
                    rows={3} 
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={onClose} 
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-brand-gold hover:bg-brand-gold/90 text-white"
                  >
                    Confirm Order
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TableBookingModal;
