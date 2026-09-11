import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { initBooking } from './frontend/constants/booking';

import SplashScreen from './frontend/screens/SplashScreen';
import OnboardingScreen from './frontend/screens/OnboardingScreen';
import LoginScreen from './frontend/screens/LoginScreen';
import RegisterScreen from './frontend/screens/RegisterScreen';
import OTPScreen from './frontend/screens/OTPScreen';
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

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [booking, setBookingState] = useState(initBooking);

  const setBooking = (partial) => {
    setBookingState(prev => ({ ...prev, ...partial }));
  };

  const nav = (s) => setScreen(s);

  const props = { onNavigate: nav, booking, setBooking };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.screenContainer}>
        {/* Auth & Splash */}
        {screen === 'splash' && <SplashScreen onNavigate={nav} />}
        {screen === 'onboarding' && <OnboardingScreen onNavigate={nav} />}
        {screen === 'login' && <LoginScreen onNavigate={nav} />}
        {screen === 'register' && <RegisterScreen onNavigate={nav} />}
        {screen === 'otp' && <OTPScreen onNavigate={nav} />}

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

        {/* Universal Travel Screens */}
        {screen === 'payment' && <PaymentScreen {...props} />}
        {screen === 'my-trips' && <MyTripsScreen onNavigate={nav} booking={booking} />}
        {screen === 'cancel-ticket' && <CancelTicketScreen onNavigate={nav} booking={booking} />}
        {screen === 'refund-status' && <RefundStatusScreen onNavigate={nav} booking={booking} />}
        {screen === 'safety-center' && <SafetyCenterScreen onNavigate={nav} booking={booking} />}
        {screen === 'trip-sharing' && <TripSharingScreen onNavigate={nav} booking={booking} />}
        {screen === 'profile' && <ProfileScreen onNavigate={nav} />}
        {screen === 'saved-passengers' && <SavedPassengersScreen onNavigate={nav} />}
        {screen === 'offers' && <OffersScreen onNavigate={nav} />}
        {screen === 'help-support' && <HelpSupportScreen onNavigate={nav} />}
        {screen === 'notifications' && <NotificationsScreen onNavigate={nav} />}
        {screen === 'settings' && <SettingsScreen onNavigate={nav} />}
        {screen === 'side-menu' && <SideMenuScreen onNavigate={nav} />}
      </View>
    </SafeAreaView>
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
