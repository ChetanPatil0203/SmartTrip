import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initBooking } from './frontend/constants/booking';
import { BookingProvider } from './frontend/context/BookingContext';

import SplashScreen from './frontend/screens/SplashScreen';
import OnboardingScreen from './frontend/screens/OnboardingScreen';
import LoginScreen from './frontend/screens/LoginScreen';
import RegisterScreen from './frontend/screens/RegisterScreen';
import OTPScreen from './frontend/screens/OTPScreen';
import ForgotPasswordScreen from './frontend/screens/ForgotPasswordScreen';
import HomeScreen from './frontend/screens/HomeScreen';

// Bus screens (100% preserved)
import SearchResultsScreen from './frontend/screens/SearchResultsScreen';
import FilterScreen from './frontend/screens/FilterScreen';
import BusDetailsScreen from './frontend/screens/BusDetailsScreen';
import SeatSelectionScreen from './frontend/screens/SeatSelectionScreen';
import BoardingDroppingScreen from './frontend/screens/BoardingDroppingScreen';
import PassengerDetailsScreen from './frontend/screens/PassengerDetailsScreen';

// Train screens
import TrainSearchResultsScreen from './frontend/screens/TrainSearchResultsScreen';
import TrainDetailsScreen from './frontend/screens/TrainDetailsScreen';
import TrainSeatSelectionScreen from './frontend/screens/TrainSeatSelectionScreen';
import TrainPassengerDetailsScreen from './frontend/screens/TrainPassengerDetailsScreen';
import TrainLiveStatusScreen from './frontend/screens/TrainLiveStatusScreen';
import TrainTicketScreen from './frontend/screens/TrainTicketScreen';

// Flight screens
import FlightSearchResultsScreen from './frontend/screens/FlightSearchResultsScreen';
import FlightFilterScreen from './frontend/screens/FlightFilterScreen';
import FlightDetailsScreen from './frontend/screens/FlightDetailsScreen';
import FlightSeatSelectionScreen from './frontend/screens/FlightSeatSelectionScreen';
import FlightAddonsScreen from './frontend/screens/FlightAddonsScreen';
import FlightPassengerDetailsScreen from './frontend/screens/FlightPassengerDetailsScreen';
import FlightTicketScreen from './frontend/screens/FlightTicketScreen';

// Hotel screens
import HotelSearchResultsScreen from './frontend/screens/HotelSearchResultsScreen';
import HotelFilterScreen from './frontend/screens/HotelFilterScreen';
import HotelDetailsScreen from './frontend/screens/HotelDetailsScreen';
import HotelGuestDetailsScreen from './frontend/screens/HotelGuestDetailsScreen';
import HotelTicketScreen from './frontend/screens/HotelTicketScreen';

// Cab & Auto screens
import CabSearchResultsScreen from './frontend/screens/CabSearchResultsScreen';
import CabTrackingScreen from './frontend/screens/CabTrackingScreen';

// Universal & App screens
import PaymentScreen from './frontend/screens/PaymentScreen';
import BookingConfirmationScreen from './frontend/screens/BookingConfirmationScreen';
import TicketScreen from './frontend/screens/TicketScreen';
import MyTripsScreen from './frontend/screens/MyTripsScreen';
import LiveTrackingScreen from './frontend/screens/LiveTrackingScreen';
import DelayAlertScreen from './frontend/screens/DelayAlertScreen';
import AlternativeBusScreen from './frontend/screens/AlternativeBusScreen';
import MissedBusScreen from './frontend/screens/MissedBusScreen';
import CancelTicketScreen from './frontend/screens/CancelTicketScreen';
import RefundStatusScreen from './frontend/screens/RefundStatusScreen';
import SafetyCenterScreen from './frontend/screens/SafetyCenterScreen';
import TripSharingScreen from './frontend/screens/TripSharingScreen';
import ProfileScreen from './frontend/screens/ProfileScreen';
import SavedPassengersScreen from './frontend/screens/SavedPassengersScreen';
import OffersScreen from './frontend/screens/OffersScreen';
import HelpSupportScreen from './frontend/screens/HelpSupportScreen';
import NotificationsScreen from './frontend/screens/NotificationsScreen';
import SettingsScreen from './frontend/screens/SettingsScreen';
import SideMenuScreen from './frontend/screens/SideMenuScreen';

import { useEffect, useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';

export default function App() {
  const [history, setHistory] = useState(['splash']);
  const [booking, setBookingState] = useState(initBooking);

  const screen = history[history.length - 1] || 'home';

  const setBooking = useCallback((partial) => {
    setBookingState(prev => ({ ...prev, ...partial }));
  }, []);

  const nav = useCallback((nextScreen, options = {}) => {
    setHistory(prev => {
      if (options.reset || nextScreen === 'home' || nextScreen === 'login') {
        return [nextScreen];
      }
      if (prev[prev.length - 1] === nextScreen) {
        return prev;
      }
      return [...prev, nextScreen];
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

  // Native Android Hardware Back Button listener
  useEffect(() => {
    const onBackPress = () => {
      if (history.length > 1 && screen !== 'home' && screen !== 'splash') {
        goBack();
        return true; // prevent app exit
      }
      if (screen === 'home') {
        Alert.alert('Exit SmartTrip', 'Are you sure you want to close the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [history.length, screen, goBack]);

  const props = { onNavigate: nav, goBack, booking, setBooking };

  return (
    <SafeAreaProvider>
      <BookingProvider initialBooking={booking}>
        <SafeAreaView style={[styles.container, screen === 'splash' && { backgroundColor: '#CDE7FD' }]}>
          <StatusBar barStyle="dark-content" backgroundColor={screen === 'splash' ? '#CDE7FD' : '#ffffff'} />
          <View style={styles.screenContainer}>
            {/* Auth & Splash */}
            {screen === 'splash' && <SplashScreen onNavigate={nav} />}
            {screen === 'onboarding' && <OnboardingScreen onNavigate={nav} />}
            {screen === 'login' && <LoginScreen onNavigate={nav} />}
            {screen === 'register' && <RegisterScreen onNavigate={nav} />}
            {screen === 'otp' && <OTPScreen onNavigate={nav} />}
            {screen === 'forgot-password' && <ForgotPasswordScreen onNavigate={nav} />}

            {/* Dashboard */}
            {screen === 'home' && <HomeScreen {...props} />}

            {/* Bus Flow (Preserved 100%) */}
            {screen === 'search-results' && <SearchResultsScreen {...props} />}
            {screen === 'filter' && <FilterScreen onNavigate={nav} />}
            {screen === 'bus-details' && <BusDetailsScreen onNavigate={nav} booking={booking} />}
            {screen === 'seat-selection' && <SeatSelectionScreen {...props} />}
            {screen === 'boarding-dropping' && <BoardingDroppingScreen {...props} />}
            {screen === 'passenger-details' && <PassengerDetailsScreen {...props} />}
            {screen === 'booking-confirmation' && <BookingConfirmationScreen onNavigate={nav} booking={booking} />}
            {screen === 'ticket' && <TicketScreen onNavigate={nav} booking={booking} />}
            {screen === 'live-tracking' && <LiveTrackingScreen onNavigate={nav} booking={booking} />}
            {screen === 'delay-alert' && <DelayAlertScreen onNavigate={nav} booking={booking} />}
            {screen === 'alternative-bus' && <AlternativeBusScreen onNavigate={nav} booking={booking} setBooking={setBooking} />}
            {screen === 'missed-bus' && <MissedBusScreen onNavigate={nav} booking={booking} />}

            {/* Train Flow */}
            {screen === 'train-search-results' && <TrainSearchResultsScreen {...props} />}
            {screen === 'train-details' && <TrainDetailsScreen {...props} />}
            {screen === 'train-seat-selection' && <TrainSeatSelectionScreen {...props} />}
            {screen === 'train-passenger-details' && <TrainPassengerDetailsScreen {...props} />}
            {screen === 'train-live-status' && <TrainLiveStatusScreen {...props} />}
            {screen === 'train-ticket' && <TrainTicketScreen {...props} />}

            {/* Flight Flow */}
            {screen === 'flight-search-results' && <FlightSearchResultsScreen {...props} />}
            {screen === 'flight-filter' && <FlightFilterScreen {...props} />}
            {screen === 'flight-details' && <FlightDetailsScreen {...props} />}
            {screen === 'flight-seat-selection' && <FlightSeatSelectionScreen {...props} />}
            {screen === 'flight-addons' && <FlightAddonsScreen {...props} />}
            {screen === 'flight-passenger-details' && <FlightPassengerDetailsScreen {...props} />}
            {screen === 'flight-ticket' && <FlightTicketScreen {...props} />}

            {/* Hotel Flow */}
            {screen === 'hotel-search-results' && <HotelSearchResultsScreen {...props} />}
            {screen === 'hotel-filter' && <HotelFilterScreen {...props} />}
            {screen === 'hotel-details' && <HotelDetailsScreen {...props} />}
            {screen === 'hotel-guest-details' && <HotelGuestDetailsScreen {...props} />}
            {screen === 'hotel-ticket' && <HotelTicketScreen {...props} />}

            {/* Cab & Auto Flow */}
            {screen === 'cab-search-results' && <CabSearchResultsScreen {...props} />}
            {screen === 'auto-search-results' && <CabSearchResultsScreen {...props} />}
            {screen === 'cab-tracking' && <CabTrackingScreen {...props} />}

            {/* Universal Travel Screens */}
            {screen === 'payment' && <PaymentScreen {...props} />}
            {screen === 'my-trips' && <MyTripsScreen {...props} />}
            {screen === 'cancel-ticket' && <CancelTicketScreen {...props} />}
            {screen === 'refund-status' && <RefundStatusScreen {...props} />}
            {screen === 'safety-center' && <SafetyCenterScreen {...props} />}
            {screen === 'trip-sharing' && <TripSharingScreen {...props} />}
            {screen === 'profile' && <ProfileScreen {...props} />}
            {screen === 'saved-passengers' && <SavedPassengersScreen {...props} />}
            {screen === 'offers' && <OffersScreen {...props} />}
            {screen === 'help-support' && <HelpSupportScreen {...props} />}
            {screen === 'notifications' && <NotificationsScreen {...props} />}
            {screen === 'settings' && <SettingsScreen {...props} />}
            {screen === 'side-menu' && <SideMenuScreen {...props} />}
          </View>
        </SafeAreaView>
      </BookingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenContainer: {
    flex: 1,
  },
});
