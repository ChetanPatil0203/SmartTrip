import React, { createContext, useContext, useState, useCallback } from 'react';
import { initBooking } from '../constants/booking';

const BookingContext = createContext(null);

export const BookingProvider = ({ children, initialBooking = initBooking }) => {
  const [booking, setBookingState] = useState(initialBooking);

  // Partial update
  const setBooking = useCallback((partial) => {
    setBookingState((prev) => ({ ...prev, ...partial }));
  }, []);

  // Isolated category update helper (prevents cross-domain property pollution)
  const updateCategoryBooking = useCallback((category, data) => {
    setBookingState((prev) => ({
      ...prev,
      category,
      ...data,
    }));
  }, []);

  // Optimistic reset helper for a specific modal or trip
  const resetCategory = useCallback((category) => {
    setBookingState((prev) => {
      const fresh = { ...initBooking };
      if (category === 'bus') {
        return {
          ...prev,
          selectedBus: null,
          selectedSeats: [],
          boardingPoint: '',
          droppingPoint: '',
        };
      }
      if (category === 'cab') {
        return {
          ...prev,
          selectedRide: null,
          cabBooking: null,
        };
      }
      return { ...prev, ...fresh };
    });
  }, []);

  const value = {
    booking,
    setBooking,
    updateCategoryBooking,
    resetCategory,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
};

export default BookingContext;
