import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import BottomNav from "../components/BottomNav";
import SmartAssistantModal from "../components/SmartAssistantModal";
import {
  Bell,
  Menu,
  MapPin,
  ArrowUpDown,
  Calendar,
  Search,
  Clock,
  TrendingUp,
  ChevronRight,
  Zap,
  Bus,
  Train,
  Plane,
  Building2,
  Car,
  Bot,
  Sparkles,
  User,
  X,
  Leaf,
} from "lucide-react-native";

const busCities = [
  "Mumbai",
  "Pune",
  "Nashik",
  "Aurangabad",
  "Nagpur",
  "Kolhapur",
  "Solapur",
  "Thane",
  "Satara",
  "Sangli",
  "Nanded",
  "Ratnagiri",
  "Jalgaon",
  "Dhule",
  "Ahmednagar",
  "Goa",
  "Shirdi",
  "Mahabaleshwar",
  "Alibaug",
  "Lonavala",
  "Hyderabad",
  "Bangalore",
  "Surat",
  "Ahmedabad",
  "Indore",
  "Delhi",
];

const trainStations = [
  "Mumbai Central (MMCT)",
  "Mumbai CSMT (CSMT)",
  "Pune Jn (PUNE)",
  "Dadar (DR)",
  "Thane (TNA)",
  "Kalyan Jn (KYN)",
  "Nashik Road (NK)",
  "Nagpur (NGP)",
  "Kolhapur (KOP)",
  "Solapur (SUR)",
  "Ahmedabad Jn (ADI)",
  "Surat (ST)",
  "Vadodara (BRC)",
  "New Delhi (NDLS)",
  "Hyderabad (HYB)",
  "Bangalore (SBC)",
  "Goa Madgaon (MAO)",
];

const flightAirports = [
  "Mumbai (BOM)",
  "Delhi (DEL)",
  "Bangalore (BLR)",
  "Pune (PNQ)",
  "Goa (GOI)",
  "Jaipur (JAI)",
  "Hyderabad (HYD)",
  "Chennai (MAA)",
  "Kolkata (CCU)",
  "Ahmedabad (AMD)",
  "Nagpur (NAG)",
];

const hotelCities = [
  "Goa",
  "Mumbai",
  "Pune",
  "Delhi",
  "Jaipur",
  "Udaipur",
  "Manali",
  "Kerala",
  "Mahabaleshwar",
  "Lonavala",
  "Shirdi",
  "Ooty",
];

const cabLocations = [
  "Chhatrapati Shivaji Terminus (CSMT), Mumbai",
  "Bandra Kurla Complex (BKC), Mumbai",
  "Mumbai Airport T2 (BOM)",
  "Dadar Western Station, Mumbai",
  "Thane Railway Station",
  "Navi Mumbai Vashi",
  "Pune Railway Station",
  "Hinjawadi IT Park, Pune",
  "Viman Nagar / Pune Airport",
  "Kothrud, Pune",
  "Hadapsar Magarpatta, Pune",
  "Swargate, Pune",
];

const categoryRecentSearches = {
  bus: [
    { from: "Mumbai", to: "Pune", date: "25 May 2024" },
    { from: "Pune", to: "Nashik", date: "18 May 2024" },
  ],
  train: [
    { from: "Mumbai Central", to: "Ahmedabad", date: "28 May 2024" },
    { from: "Pune Jn", to: "Hyderabad", date: "04 Jun 2024" },
  ],
  flight: [
    { from: "Mumbai (BOM)", to: "Delhi (DEL)", date: "02 Jun 2024" },
    { from: "Pune (PNQ)", to: "Bangalore (BLR)", date: "15 Jun 2024" },
  ],
  hotel: [
    { from: "Goa", to: "2 Guests · 1 Room", date: "10 Jun - 14 Jun" },
    { from: "Jaipur", to: "2 Guests · 1 Room", date: "20 Jun - 23 Jun" },
  ],
  cab: [
    { from: "Mumbai Airport T2", to: "Bandra Kurla Complex", date: "Today" },
    { from: "CSMT Terminus", to: "Marine Drive", date: "Yesterday" },
  ],
  auto: [
    { from: "Dadar Station", to: "Siddhivinayak Temple", date: "Today" },
    { from: "Pune Station", to: "FC Road, Deccan", date: "Today" },
  ],
};

const categoryPopular = {
  bus: [
    { from: "Mumbai", to: "Goa", price: "₹850", sub: "8h journey", emoji: "🚌" },
    { from: "Pune", to: "Mumbai", price: "₹350", sub: "3h journey", emoji: "🚌" },
    { from: "Nashik", to: "Pune", price: "₹300", sub: "3.5h journey", emoji: "🚌" },
  ],
  train: [
    { from: "Mumbai", to: "Ahmedabad", price: "₹1,450", sub: "Shatabdi Exp", emoji: "🚆" },
    { from: "Mumbai", to: "Delhi", price: "₹2,290", sub: "Rajdhani Exp", emoji: "🚆" },
    { from: "Pune", to: "Hyderabad", price: "₹980", sub: "Superfast Exp", emoji: "🚆" },
  ],
  flight: [
    { from: "Mumbai", to: "Delhi", price: "₹5,490", sub: "SmartAir · Non-stop", emoji: "✈️" },
    { from: "Mumbai", to: "Bangalore", price: "₹4,120", sub: "IndigoSky · Non-stop", emoji: "✈️" },
    { from: "Pune", to: "Delhi", price: "₹4,890", sub: "VistaraLine · Non-stop", emoji: "✈️" },
  ],
  hotel: [
    {
      from: "Taj Holiday Resort",
      to: "Calangute, Goa",
      price: "₹4,500/night",
      sub: "⭐ 4.9 Superb",
      emoji: "🏨",
    },
    {
      from: "Grand Hyatt",
      to: "BKC, Mumbai",
      price: "₹8,200/night",
      sub: "⭐ 4.8 Luxury",
      emoji: "🏨",
    },
    {
      from: "Pink City Palace",
      to: "Jaipur",
      price: "₹3,600/night",
      sub: "⭐ 4.7 Heritage",
      emoji: "🏨",
    },
  ],
  cab: [
    { from: "Mumbai Airport T2", to: "South Mumbai", price: "₹450", sub: "Prime Sedan · 45m", emoji: "🚕" },
    { from: "Pune Station", to: "Hinjawadi IT Park", price: "₹380", sub: "Smart Mini · 35m", emoji: "🚗" },
    { from: "Mumbai", to: "Pune (Outstation)", price: "₹2,100", sub: "One-way AC Cab", emoji: "🚘" },
  ],
  auto: [
    { from: "Local Station", to: "City Center", price: "₹45", sub: "Quick Auto · 8m", emoji: "🛺" },
    { from: "Metro Station", to: "Tech Park", price: "₹60", sub: "EV Green Auto · 12m", emoji: "⚡" },
    { from: "Bus Stand", to: "Market Yard", price: "₹50", sub: "Direct Auto · 10m", emoji: "🛺" },
  ],
};

function LocationInputField({
  label,
  value,
  onChangeText,
  isOpen,
  onToggle,
  onClose,
  placeholder,
  suggestions,
  iconColor,
  IconComponent,
  onSelectSuggestion,
}) {
  const currentVal = value || "";
  const filtered = (suggestions || []).filter((s) =>
    s.toLowerCase().includes(currentVal.toLowerCase())
  );
  const isCustom =
    Boolean(currentVal.trim()) &&
    !suggestions.some((s) => s.toLowerCase() === currentVal.trim().toLowerCase());

  return (
    <View style={styles.pickerBox}>
      <View style={[styles.inputCard, isOpen && styles.inputCardActive]}>
        <View style={[styles.pinBox, { backgroundColor: iconColor }]}>
          <IconComponent size={16} color="#FFFFFF" />
        </View>
        <View style={styles.inputInfo}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={[
              styles.fieldInput,
              { outline: "none", outlineWidth: 0, borderWidth: 0 },
            ]}
            value={currentVal}
            onChangeText={(text) => {
              onChangeText(text);
              if (!isOpen) onToggle(true);
            }}
            onFocus={() => onToggle(true)}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            onSubmitEditing={onClose}
            underlineColorAndroid="transparent"
          />
        </View>
        {Boolean(currentVal) && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView
            style={{ maxHeight: 180 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filtered.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelectSuggestion(item);
                  onClose();
                }}
              >
                <IconComponent size={14} color="#9CA3AF" />
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}

            {isCustom && (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: "#FFF5F5" }]}
                onPress={onClose}
              >
                <IconComponent size={14} color={iconColor} />
                <Text style={[styles.dropdownText, { color: iconColor, fontWeight: "700" }]}>
                  Use "{currentVal}"
                </Text>
              </TouchableOpacity>
            )}

            {filtered.length === 0 && !isCustom && (
              <View style={styles.dropdownEmpty}>
                <Text style={styles.dropdownEmptyText}>Type any city or place name above</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen({ onNavigate, booking, setBooking }) {
  const [activeCategory, setActiveCategory] = useState(booking.category || "bus");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [ecoModalVisible, setEcoModalVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const switchCategory = (cat) => {
    setActiveCategory(cat);
    setBooking({ category: cat });
    setShowFrom(false);
    setShowTo(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (activeCategory === "bus") onNavigate("search-results");
      else if (activeCategory === "train") onNavigate("train-search-results");
      else if (activeCategory === "flight") onNavigate("flight-search-results");
      else if (activeCategory === "hotel") onNavigate("hotel-search-results");
      else if (activeCategory === "cab" || activeCategory === "auto") onNavigate("cab-search-results");
    }, 220);
  };

  const swapRoute = () => {
    if (activeCategory === "bus") {
      setBooking({ from: booking.to, to: booking.from });
    } else if (activeCategory === "train") {
      setBooking({ trainFrom: booking.trainTo, trainTo: booking.trainFrom });
    } else if (activeCategory === "flight") {
      setBooking({ flightFrom: booking.flightTo, flightTo: booking.flightFrom });
    } else if (activeCategory === "cab" || activeCategory === "auto") {
      setBooking({ ridePickup: booking.rideDrop, rideDrop: booking.ridePickup });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <View style={styles.logoRow}>
                <Zap size={18} color="#FFD700" fill="#FFD700" />
                <Text style={styles.appName}>SmartTrip</Text>
              </View>
              <Text style={styles.appTagline}>One App. Every Journey.</Text>
            </View>
            <View style={styles.headerIcons}>
              {/* Green Coins Balance Pill */}
              <TouchableOpacity
                onPress={() => setEcoModalVisible(true)}
                style={styles.greenCoinPill}
                activeOpacity={0.8}
              >
                <Leaf size={13} color="#10B981" />
                <Text style={styles.greenCoinPillText}>480</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onNavigate("notifications")} style={styles.iconBtn}>
                <Bell size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onNavigate("side-menu")} style={styles.iconBtn}>
                <Menu size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location strip */}
          <View style={styles.locationStrip}>
            <MapPin size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>
              Location: <Text style={styles.locationBold}>Mumbai, IN</Text>
            </Text>
          </View>
        </View>

        {/* Travel Category Selector - 3x2 Grid (100% Visible, No Scroll) */}
        <View style={styles.categoryCardContainer}>
          <View style={styles.categoryGridCard}>
            {/* Top Row: Bus, Train, Flight */}
            <View style={styles.categoryGridRow}>
              <TouchableOpacity
                onPress={() => switchCategory("bus")}
                style={[styles.gridCatItem, activeCategory === "bus" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "bus" && styles.gridIconCircleActive]}>
                  <Bus size={17} color={activeCategory === "bus" ? "#FFFFFF" : "#D13239"} />
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "bus" && styles.gridCatLabelActive]}>
                  Bus
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchCategory("train")}
                style={[styles.gridCatItem, activeCategory === "train" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "train" && styles.gridIconCircleActive]}>
                  <Train size={17} color={activeCategory === "train" ? "#FFFFFF" : "#2563EB"} />
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "train" && styles.gridCatLabelActive]}>
                  Train
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchCategory("flight")}
                style={[styles.gridCatItem, activeCategory === "flight" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "flight" && styles.gridIconCircleActive]}>
                  <Plane size={17} color={activeCategory === "flight" ? "#FFFFFF" : "#0284C7"} />
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "flight" && styles.gridCatLabelActive]}>
                  Flight
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Row: Hotel, Cab, Auto */}
            <View style={styles.categoryGridRow}>
              <TouchableOpacity
                onPress={() => switchCategory("hotel")}
                style={[styles.gridCatItem, activeCategory === "hotel" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "hotel" && styles.gridIconCircleActive]}>
                  <Building2 size={17} color={activeCategory === "hotel" ? "#FFFFFF" : "#059669"} />
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "hotel" && styles.gridCatLabelActive]}>
                  Hotels
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchCategory("cab")}
                style={[styles.gridCatItem, activeCategory === "cab" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "cab" && styles.gridIconCircleActive]}>
                  <Car size={17} color={activeCategory === "cab" ? "#FFFFFF" : "#4B5563"} />
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "cab" && styles.gridCatLabelActive]}>
                  Cabs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchCategory("auto")}
                style={[styles.gridCatItem, activeCategory === "auto" && styles.gridCatItemActive]}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconCircle, activeCategory === "auto" && styles.gridIconCircleActive]}>
                  <Text style={{ fontSize: 16 }}>🛺</Text>
                </View>
                <Text style={[styles.gridCatLabel, activeCategory === "auto" && styles.gridCatLabelActive]}>
                  Auto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dynamic Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardHeading}>Where do you want to go?</Text>

          {/* BUS SEARCH CARD */}
          {activeCategory === "bus" && (
            <View>
              <LocationInputField
                label="FROM CITY"
                value={booking.from}
                onChangeText={(c) => setBooking({ from: c })}
                isOpen={showFrom}
                onToggle={(open) => {
                  setShowFrom(open);
                  if (open) setShowTo(false);
                }}
                onClose={() => setShowFrom(false)}
                placeholder="Type departure city (e.g. Pune, Satara...)"
                suggestions={busCities}
                iconColor="#D13239"
                IconComponent={MapPin}
                onSelectSuggestion={(c) => setBooking({ from: c })}
              />

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#D13239" />
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="TO CITY"
                value={booking.to}
                onChangeText={(c) => setBooking({ to: c })}
                isOpen={showTo}
                onToggle={(open) => {
                  setShowTo(open);
                  if (open) setShowFrom(false);
                }}
                onClose={() => setShowTo(false)}
                placeholder="Type destination city (e.g. Goa, Kolhapur...)"
                suggestions={busCities.filter((c) => c !== booking.from)}
                iconColor="#374151"
                IconComponent={MapPin}
                onSelectSuggestion={(c) => setBooking({ to: c })}
              />

              <View style={styles.rowTwoCols}>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={styles.dateIconBox}>
                    <Calendar size={16} color="#2563EB" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>DATE</Text>
                    <Text style={styles.fieldValue}>{booking.date}</Text>
                  </View>
                </View>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={[styles.dateIconBox, { backgroundColor: "#F3E8FF" }]}>
                    <User size={16} color="#9333EA" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>PASSENGERS</Text>
                    <Text style={styles.fieldValue}>{booking.passengers} Traveler(s)</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchBtn}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Search size={18} color="#FFFFFF" />
                    <Text style={styles.searchBtnText}>SEARCH BUSES</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* TRAIN SEARCH CARD */}
          {activeCategory === "train" && (
            <View>
              <View style={styles.tripTypeRow}>
                <TouchableOpacity
                  onPress={() => setBooking({ trainTripType: "one-way" })}
                  style={[
                    styles.tripTypeChip,
                    booking.trainTripType !== "round-trip" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.trainTripType !== "round-trip" && styles.tripTypeTextActive,
                    ]}
                  >
                    One Way
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBooking({ trainTripType: "round-trip" })}
                  style={[
                    styles.tripTypeChip,
                    booking.trainTripType === "round-trip" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.trainTripType === "round-trip" && styles.tripTypeTextActive,
                    ]}
                  >
                    Round Trip
                  </Text>
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="FROM STATION"
                value={booking.trainFrom}
                onChangeText={(c) => setBooking({ trainFrom: c })}
                isOpen={showFrom}
                onToggle={(open) => {
                  setShowFrom(open);
                  if (open) setShowTo(false);
                }}
                onClose={() => setShowFrom(false)}
                placeholder="Type departure station (e.g. CSMT, Pune...)"
                suggestions={trainStations}
                iconColor="#2563EB"
                IconComponent={Train}
                onSelectSuggestion={(c) => setBooking({ trainFrom: c })}
              />

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="TO STATION"
                value={booking.trainTo}
                onChangeText={(c) => setBooking({ trainTo: c })}
                isOpen={showTo}
                onToggle={(open) => {
                  setShowTo(open);
                  if (open) setShowFrom(false);
                }}
                onClose={() => setShowTo(false)}
                placeholder="Type arrival station (e.g. Ahmedabad, Delhi...)"
                suggestions={trainStations.filter((c) => c !== booking.trainFrom)}
                iconColor="#1E3A5F"
                IconComponent={Train}
                onSelectSuggestion={(c) => setBooking({ trainTo: c })}
              />

              <View style={styles.rowTwoCols}>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={styles.dateIconBox}>
                    <Calendar size={16} color="#2563EB" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>JOURNEY DATE</Text>
                    <Text style={styles.fieldValue}>{booking.trainDate}</Text>
                  </View>
                </View>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={[styles.dateIconBox, { backgroundColor: "#FEF3C7" }]}>
                    <Zap size={16} color="#D97706" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>CLASS</Text>
                    <Text style={styles.fieldValue} numberOfLines={1}>
                      {booking.trainClass}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.searchBtn, { backgroundColor: "#2563EB" }]}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Search size={18} color="#FFFFFF" />
                    <Text style={styles.searchBtnText}>SEARCH TRAINS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* FLIGHT SEARCH CARD */}
          {activeCategory === "flight" && (
            <View>
              <View style={styles.tripTypeRow}>
                <TouchableOpacity
                  onPress={() => setBooking({ flightTripType: "one-way" })}
                  style={[
                    styles.tripTypeChip,
                    booking.flightTripType === "one-way" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.flightTripType === "one-way" && styles.tripTypeTextActive,
                    ]}
                  >
                    One Way
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBooking({ flightTripType: "round-trip" })}
                  style={[
                    styles.tripTypeChip,
                    booking.flightTripType === "round-trip" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.flightTripType === "round-trip" && styles.tripTypeTextActive,
                    ]}
                  >
                    Round Trip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBooking({ flightTripType: "multi-city" })}
                  style={[
                    styles.tripTypeChip,
                    booking.flightTripType === "multi-city" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.flightTripType === "multi-city" && styles.tripTypeTextActive,
                    ]}
                  >
                    Multi-City
                  </Text>
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="FROM AIRPORT"
                value={booking.flightFrom}
                onChangeText={(c) => setBooking({ flightFrom: c })}
                isOpen={showFrom}
                onToggle={(open) => {
                  setShowFrom(open);
                  if (open) setShowTo(false);
                }}
                onClose={() => setShowFrom(false)}
                placeholder="Type departure airport or city"
                suggestions={flightAirports}
                iconColor="#0284C7"
                IconComponent={Plane}
                onSelectSuggestion={(c) => setBooking({ flightFrom: c })}
              />

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#0284C7" />
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="TO AIRPORT"
                value={booking.flightTo}
                onChangeText={(c) => setBooking({ flightTo: c })}
                isOpen={showTo}
                onToggle={(open) => {
                  setShowTo(open);
                  if (open) setShowFrom(false);
                }}
                onClose={() => setShowTo(false)}
                placeholder="Type destination airport or city"
                suggestions={flightAirports.filter((c) => c !== booking.flightFrom)}
                iconColor="#0F172A"
                IconComponent={Plane}
                onSelectSuggestion={(c) => setBooking({ flightTo: c })}
              />

              <View style={styles.rowTwoCols}>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={styles.dateIconBox}>
                    <Calendar size={16} color="#0284C7" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>DEPARTURE</Text>
                    <Text style={styles.fieldValue}>{booking.flightDepartureDate}</Text>
                  </View>
                </View>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={[styles.dateIconBox, { backgroundColor: "#E0F2FE" }]}>
                    <User size={16} color="#0284C7" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>CABIN / CLASS</Text>
                    <Text style={styles.fieldValue} numberOfLines={1}>
                      {booking.flightClass}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.searchBtn, { backgroundColor: "#0284C7" }]}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Search size={18} color="#FFFFFF" />
                    <Text style={styles.searchBtnText}>SEARCH FLIGHTS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* HOTEL SEARCH CARD */}
          {activeCategory === "hotel" && (
            <View>
              <LocationInputField
                label="DESTINATION CITY"
                value={booking.hotelDestination}
                onChangeText={(c) => setBooking({ hotelDestination: c })}
                isOpen={showFrom}
                onToggle={(open) => setShowFrom(open)}
                onClose={() => setShowFrom(false)}
                placeholder="Type hotel destination city (e.g. Goa, Jaipur...)"
                suggestions={hotelCities}
                iconColor="#059669"
                IconComponent={Building2}
                onSelectSuggestion={(c) => setBooking({ hotelDestination: c })}
              />

              <View style={styles.rowTwoCols}>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={styles.dateIconBox}>
                    <Calendar size={16} color="#059669" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>CHECK-IN</Text>
                    <Text style={styles.fieldValue}>{booking.checkInDate}</Text>
                  </View>
                </View>
                <View style={[styles.dateCard, { flex: 1 }]}>
                  <View style={[styles.dateIconBox, { backgroundColor: "#D1FAE5" }]}>
                    <Calendar size={16} color="#059669" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>CHECK-OUT</Text>
                    <Text style={styles.fieldValue}>{booking.checkOutDate}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.dateCard}>
                <View style={[styles.dateIconBox, { backgroundColor: "#ECFDF5" }]}>
                  <User size={16} color="#059669" />
                </View>
                <View style={styles.inputInfo}>
                  <Text style={styles.fieldLabel}>ROOMS & GUESTS</Text>
                  <Text style={styles.fieldValue}>
                    {booking.hotelRooms} Room · {booking.hotelGuests} Guests
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.searchBtn, { backgroundColor: "#059669" }]}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Search size={18} color="#FFFFFF" />
                    <Text style={styles.searchBtnText}>SEARCH HOTELS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* CAB SEARCH CARD */}
          {activeCategory === "cab" && (
            <View>
              <View style={styles.tripTypeRow}>
                <TouchableOpacity
                  onPress={() => setBooking({ rideType: "daily" })}
                  style={[
                    styles.tripTypeChip,
                    (booking.rideType || "daily") === "daily" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      (booking.rideType || "daily") === "daily" && styles.tripTypeTextActive,
                    ]}
                  >
                    Daily City Ride
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setBooking({ rideType: "airport" })}
                  style={[
                    styles.tripTypeChip,
                    booking.rideType === "airport" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.rideType === "airport" && styles.tripTypeTextActive,
                    ]}
                  >
                    Airport Drop
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setBooking({ rideType: "outstation" })}
                  style={[
                    styles.tripTypeChip,
                    booking.rideType === "outstation" && styles.tripTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      booking.rideType === "outstation" && styles.tripTypeTextActive,
                    ]}
                  >
                    Outstation
                  </Text>
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="PICKUP LOCATION"
                value={booking.ridePickup}
                onChangeText={(loc) => setBooking({ ridePickup: loc })}
                isOpen={showFrom}
                onToggle={(open) => {
                  setShowFrom(open);
                  if (open) setShowTo(false);
                }}
                onClose={() => setShowFrom(false)}
                placeholder="Type pickup address or landmark"
                suggestions={cabLocations}
                iconColor="#10B981"
                IconComponent={MapPin}
                onSelectSuggestion={(loc) => setBooking({ ridePickup: loc })}
              />

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#1E3A5F" />
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="DROP DESTINATION"
                value={booking.rideDrop}
                onChangeText={(loc) => setBooking({ rideDrop: loc })}
                isOpen={showTo}
                onToggle={(open) => {
                  setShowTo(open);
                  if (open) setShowFrom(false);
                }}
                onClose={() => setShowTo(false)}
                placeholder="Where are you heading?"
                suggestions={cabLocations.filter((l) => l !== booking.ridePickup)}
                iconColor="#EF4444"
                IconComponent={MapPin}
                onSelectSuggestion={(loc) => setBooking({ rideDrop: loc })}
              />

              <View style={styles.cabHighlightsRow}>
                <View style={styles.cabHighlightBadge}>
                  <Text style={styles.cabHighlightText}>⚡ 2-4 mins pickup</Text>
                </View>
                <View style={styles.cabHighlightBadge}>
                  <Text style={styles.cabHighlightText}>🛡️ Zero cancellation fee</Text>
                </View>
                <View style={styles.cabHighlightBadge}>
                  <Text style={styles.cabHighlightText}>❄️ Guaranteed AC</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.searchBtn, { backgroundColor: "#0F172A" }]}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Car size={18} color="#FFFFFF" />
                    <Text style={styles.searchBtnText}>SEARCH CABS & TAXIS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* AUTO SEARCH CARD */}
          {activeCategory === "auto" && (
            <View>
              <View style={styles.autoBanner}>
                <Text style={styles.autoBannerEmoji}>🛺</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.autoBannerTitle}>Smart Auto & Rickshaw</Text>
                  <Text style={styles.autoBannerSub}>Instant meter rates · No bargaining · Direct doorstep pickup</Text>
                </View>
              </View>

              <LocationInputField
                label="AUTO PICKUP SPOT"
                value={booking.ridePickup}
                onChangeText={(loc) => setBooking({ ridePickup: loc })}
                isOpen={showFrom}
                onToggle={(open) => {
                  setShowFrom(open);
                  if (open) setShowTo(false);
                }}
                onClose={() => setShowFrom(false)}
                placeholder="Type auto pickup point"
                suggestions={cabLocations}
                iconColor="#D97706"
                IconComponent={MapPin}
                onSelectSuggestion={(loc) => setBooking({ ridePickup: loc })}
              />

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#D97706" />
                </TouchableOpacity>
              </View>

              <LocationInputField
                label="AUTO DESTINATION"
                value={booking.rideDrop}
                onChangeText={(loc) => setBooking({ rideDrop: loc })}
                isOpen={showTo}
                onToggle={(open) => {
                  setShowTo(open);
                  if (open) setShowFrom(false);
                }}
                onClose={() => setShowTo(false)}
                placeholder="Where to go by auto?"
                suggestions={cabLocations.filter((l) => l !== booking.ridePickup)}
                iconColor="#374151"
                IconComponent={MapPin}
                onSelectSuggestion={(loc) => setBooking({ rideDrop: loc })}
              />

              <View style={styles.autoOptionsPreview}>
                <View style={styles.autoOptionPill}>
                  <Text style={{ fontSize: 16 }}>🛺</Text>
                  <View>
                    <Text style={styles.autoOptionTitle}>Smart Auto</Text>
                    <Text style={styles.autoOptionPrice}>From ₹80</Text>
                  </View>
                </View>

                <View style={[styles.autoOptionPill, { borderColor: "#10B981", backgroundColor: "#ECFDF5" }]}>
                  <Text style={{ fontSize: 16 }}>⚡</Text>
                  <View>
                    <Text style={[styles.autoOptionTitle, { color: "#065F46" }]}>Green EV Auto</Text>
                    <Text style={[styles.autoOptionPrice, { color: "#059669" }]}>From ₹90</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.searchBtn, { backgroundColor: "#D97706" }]}
                activeOpacity={0.8}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={{ fontSize: 18 }}>🛺</Text>
                    <Text style={styles.searchBtnText}>BOOK SMART AUTO NOW</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SMART TRIP TIMELINE CARD */}
        <View style={styles.timelineBanner}>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineTitleRow}>
              <Sparkles size={16} color="#FFD700" />
              <Text style={styles.timelineTitle}>Smart Trip Timeline</Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate("my-trips")} style={styles.timelineViewAll}>
              <Text style={styles.timelineViewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineStepContainer}>
            <View style={styles.timelineStep}>
              <Text style={styles.timelineTime}>10:00 AM</Text>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineDesc}>✈️ Flight ST-402 (BOM ➔ DEL)</Text>
            </View>
            <View style={styles.timelineConnector} />
            <View style={styles.timelineStep}>
              <Text style={styles.timelineTime}>12:15 PM</Text>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineDesc}>🛬 Arrival at New Delhi Airport</Text>
            </View>
            <View style={styles.timelineConnector} />
            <View style={styles.timelineStep}>
              <Text style={styles.timelineTime}>02:00 PM</Text>
              <View style={[styles.timelineDot, { backgroundColor: "#10B981" }]} />
              <Text style={styles.timelineDesc}>🏨 Check-in Taj Hotel, Delhi</Text>
            </View>
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextCol}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>UP TO 20% OFF</Text>
            </View>
            <Text style={styles.promoTitle}>Super Trip Savings!</Text>
            <Text style={styles.promoSub}>
              Use code: <Text style={styles.codeHighlight}>SMARTTRIP20</Text>
            </Text>
          </View>
          <Text style={{ fontSize: 44 }}>✈️</Text>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Clock size={16} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>
                Recent Searches ({activeCategory.toUpperCase()})
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                onNavigate(
                  activeCategory === "bus" ? "search-results" : `${activeCategory}-search-results`,
                )
              }
            >
              <Text style={styles.viewAllText}>Search Again</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listGap}>
            {(categoryRecentSearches[activeCategory] || []).map((r, i) => (
              <TouchableOpacity
                key={i}
                onPress={handleSearch}
                style={styles.recentCard}
                activeOpacity={0.7}
              >
                <View style={styles.recentIconBox}>
                  <Search size={14} color="#D13239" />
                </View>
                <View style={styles.recentRouteRow}>
                  <Text style={styles.recentCity}>{r.from}</Text>
                  <ChevronRight size={14} color="#D1D5DB" />
                  <Text style={styles.recentCity}>{r.to}</Text>
                </View>
                <Text style={styles.recentDate}>{r.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={16} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>
              Popular {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}{" "}
              Destinations
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {(categoryPopular[activeCategory] || []).map((r, i) => (
              <TouchableOpacity
                key={i}
                onPress={handleSearch}
                style={styles.popularCard}
                activeOpacity={0.7}
              >
                <View style={styles.popularEmojiBox}>
                  <Text style={{ fontSize: 22 }}>{r.emoji}</Text>
                </View>
                <Text style={styles.popularFrom}>{r.from}</Text>
                <Text style={styles.popularTo}>{r.to}</Text>
                <View style={styles.popularPriceRow}>
                  <Text style={styles.popularPrice}>{r.price}</Text>
                  <Text style={styles.popularHours}>{r.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Smart Assistant Modal */}
      <SmartAssistantModal
        visible={assistantVisible}
        onClose={() => setAssistantVisible(false)}
        onNavigate={onNavigate}
        setBooking={setBooking}
      />

      {/* Eco Impact & Green Coins Modal */}
      <Modal
        visible={ecoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEcoModalVisible(false)}
      >
        <View style={styles.ecoModalOverlay}>
          <View style={styles.ecoModalCard}>
            <View style={styles.ecoModalHeader}>
              <View style={styles.ecoIconBox}>
                <Leaf size={22} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ecoModalTitle}>SmartTrip Green Rewards</Text>
                <Text style={styles.ecoModalTier}>Tier: Emerald Eco-Traveler 🌿</Text>
              </View>
              <TouchableOpacity onPress={() => setEcoModalVisible(false)} style={styles.ecoCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.ecoBalanceCard}>
              <Text style={styles.ecoBalanceLabel}>AVAILABLE GREEN COINS</Text>
              <Text style={styles.ecoBalanceVal}>480 Coins</Text>
              <Text style={styles.ecoBalanceSub}>Worth ₹120 instant discount at checkout</Text>
            </View>

            <View style={styles.ecoStatsRow}>
              <View style={styles.ecoStatBox}>
                <Text style={styles.ecoStatVal}>142 kg</Text>
                <Text style={styles.ecoStatLabel}>CO2 Saved</Text>
              </View>
              <View style={styles.ecoStatBox}>
                <Text style={styles.ecoStatVal}>6 Trees</Text>
                <Text style={styles.ecoStatLabel}>Offset Equivalent</Text>
              </View>
              <View style={styles.ecoStatBox}>
                <Text style={styles.ecoStatVal}>8 Rides</Text>
                <Text style={styles.ecoStatLabel}>Electric & Rail</Text>
              </View>
            </View>

            <View style={styles.ecoMissionsBox}>
              <Text style={styles.ecoMissionsTitle}>EARN MORE GREEN COINS:</Text>
              <Text style={styles.ecoMissionItem}>• Book an EV Bus or Electric Auto: <Text style={{ fontWeight: '800', color: '#059669' }}>+40 Coins</Text></Text>
              <Text style={styles.ecoMissionItem}>• Choose Trains over domestic flights: <Text style={{ fontWeight: '800', color: '#059669' }}>+60 Coins</Text></Text>
              <Text style={styles.ecoMissionItem}>• Complete 3 eco-trips in a month: <Text style={{ fontWeight: '800', color: '#059669' }}>+150 Bonus</Text></Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setEcoModalVisible(false);
                switchCategory('bus');
              }}
              style={styles.ecoCtaBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.ecoCtaText}>Explore EV & Eco Trips</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Real-world Floating AI Travel Assistant (FAB) */}
      <TouchableOpacity
        onPress={() => setAssistantVisible(true)}
        style={styles.aiFloatingFab}
        activeOpacity={0.88}
      >
        <View style={styles.aiFabGlow}>
          <Bot size={18} color="#FFFFFF" />
          <View style={styles.aiOnlineDot} />
        </View>
        <View style={styles.aiFabContent}>
          <Text style={styles.aiFabText}>Ask AI</Text>
          <Sparkles size={12} color="#FDE047" />
        </View>
      </TouchableOpacity>

      <BottomNav current="home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 68,
    backgroundColor: "#D13239",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  locationText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  locationBold: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  categoryCardContainer: {
    marginHorizontal: 16,
    marginTop: -52,
    zIndex: 20,
  },
  categoryGridCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    gap: 8,
  },
  categoryGridRow: {
    flexDirection: "row",
    gap: 8,
  },
  gridCatItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
  },
  gridCatItemActive: {
    backgroundColor: "#D13239",
    borderColor: "#D13239",
    elevation: 2,
    shadowColor: "#D13239",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gridIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gridIconCircleActive: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  gridCatLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  gridCatLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  searchCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  searchCardHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },
  tripTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tripTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  tripTypeChipActive: {
    backgroundColor: "#1E3A5F",
  },
  tripTypeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  tripTypeTextActive: {
    color: "#FFFFFF",
  },
  pickerBox: {
    position: "relative",
    marginBottom: 4,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  inputCardActive: {
    borderColor: "#D13239",
    backgroundColor: "#FFF5F5",
  },
  pinBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inputInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  fieldInput: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    paddingVertical: 2,
    paddingHorizontal: 0,
    marginTop: 1,
    borderWidth: 0,
    outlineWidth: 0,
    outlineStyle: "none",
    backgroundColor: "transparent",
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  dropdownEmpty: {
    padding: 14,
    alignItems: "center",
  },
  dropdownEmptyText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    marginTop: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  dropdownText: {
    fontSize: 13,
    color: "#374151",
  },
  swapContainer: {
    alignItems: "center",
    marginVertical: -6,
    zIndex: 10,
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  dateIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#D13239",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timelineBanner: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#1E3A5F",
    borderRadius: 20,
    padding: 16,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  timelineTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timelineTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  timelineViewAll: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timelineViewAllText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "700",
  },
  timelineStepContainer: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  timelineStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timelineTime: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "700",
    width: 60,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38BDF8",
  },
  timelineDesc: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  timelineConnector: {
    width: 2,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginLeft: 74,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#0F172A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoTextCol: {
    gap: 4,
  },
  badge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "900",
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  promoSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  codeHighlight: {
    color: "#FFD700",
    fontWeight: "800",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D13239",
  },
  listGap: {
    gap: 8,
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  recentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  recentRouteRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recentCity: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  recentDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  horizontalScroll: {
    gap: 12,
  },
  popularCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    minWidth: 140,
  },
  popularEmojiBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  popularFrom: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  popularTo: {
    fontSize: 11,
    color: "#6B7280",
  },
  popularPriceRow: {
    marginTop: 8,
  },
  popularPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D13239",
  },
  popularHours: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  cabHighlightsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  cabHighlightBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cabHighlightText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
  },
  autoBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  autoBannerEmoji: {
    fontSize: 26,
  },
  autoBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
  },
  autoBannerSub: {
    fontSize: 11,
    color: "#B45309",
    marginTop: 1,
    lineHeight: 15,
  },
  autoOptionsPreview: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },
  autoOptionPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  autoOptionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
  autoOptionPrice: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "600",
    marginTop: 1,
  },
  greenCoinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  greenCoinPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  /* Eco Modal */
  ecoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  ecoModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  ecoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ecoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  ecoModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  ecoModalTier: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    marginTop: 2,
  },
  ecoCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  ecoBalanceCard: {
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
  },
  ecoBalanceLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#047857",
    letterSpacing: 0.5,
  },
  ecoBalanceVal: {
    fontSize: 24,
    fontWeight: "900",
    color: "#065F46",
    marginVertical: 4,
  },
  ecoBalanceSub: {
    fontSize: 11,
    color: "#047857",
  },
  ecoStatsRow: {
    flexDirection: "row",
    gap: 8,
  },
  ecoStatBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  ecoStatVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  ecoStatLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
  ecoMissionsBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  ecoMissionsTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 2,
  },
  ecoMissionItem: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 16,
  },
  ecoCtaBtn: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  ecoCtaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  aiFloatingFab: {
    position: "absolute",
    bottom: 74,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: "#D13239",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 9,
    borderWidth: 1.5,
    borderColor: "rgba(255, 215, 0, 0.4)",
    zIndex: 99,
  },
  aiFabGlow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D13239",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  aiOnlineDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#0F172A",
  },
  aiFabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aiFabText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
