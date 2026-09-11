import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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
  Bot,
  Sparkles,
  User,
  ShieldCheck,
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
  "Goa",
];
const trainStations = [
  "Mumbai Central (MMCT)",
  "Ahmedabad Jn (ADI)",
  "Surat (ST)",
  "Vadodara (BRC)",
  "Pune Jn (PUNE)",
  "New Delhi (NDLS)",
  "Hyderabad (HYB)",
];
const flightAirports = [
  "Mumbai (BOM)",
  "Delhi (DEL)",
  "Bangalore (BLR)",
  "Pune (PNQ)",
  "Goa (GOI)",
  "Jaipur (JAI)",
];
const hotelCities = ["Goa", "Mumbai", "Pune", "Delhi", "Jaipur", "Udaipur", "Manali", "Kerala"];

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
};

export default function HomeScreen({ onNavigate, booking, setBooking }) {
  const [activeCategory, setActiveCategory] = useState(booking.category || "bus");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);
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
    }, 220);
  };

  const swapRoute = () => {
    if (activeCategory === "bus") {
      setBooking({ from: booking.to, to: booking.from });
    } else if (activeCategory === "train") {
      setBooking({ trainFrom: booking.trainTo, trainTo: booking.trainFrom });
    } else if (activeCategory === "flight") {
      setBooking({ flightFrom: booking.flightTo, flightTo: booking.flightFrom });
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
              <TouchableOpacity
                onPress={() => setAssistantVisible(true)}
                style={[styles.iconBtn, { backgroundColor: "#FFD700" }]}
                activeOpacity={0.8}
              >
                <Bot size={18} color="#000000" />
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

        {/* Travel Category Selector */}
        <View style={styles.categoryCardContainer}>
          <View style={styles.categoryBar}>
            <TouchableOpacity
              onPress={() => switchCategory("bus")}
              style={[styles.catTab, activeCategory === "bus" && styles.catTabActive]}
            >
              <Bus size={18} color={activeCategory === "bus" ? "#FFFFFF" : "#6B7280"} />
              <Text
                style={[styles.catTabText, activeCategory === "bus" && styles.catTabTextActive]}
              >
                Bus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => switchCategory("train")}
              style={[styles.catTab, activeCategory === "train" && styles.catTabActive]}
            >
              <Train size={18} color={activeCategory === "train" ? "#FFFFFF" : "#6B7280"} />
              <Text
                style={[styles.catTabText, activeCategory === "train" && styles.catTabTextActive]}
              >
                Train
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => switchCategory("flight")}
              style={[styles.catTab, activeCategory === "flight" && styles.catTabActive]}
            >
              <Plane size={18} color={activeCategory === "flight" ? "#FFFFFF" : "#6B7280"} />
              <Text
                style={[styles.catTabText, activeCategory === "flight" && styles.catTabTextActive]}
              >
                Flight
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => switchCategory("hotel")}
              style={[styles.catTab, activeCategory === "hotel" && styles.catTabActive]}
            >
              <Building2 size={18} color={activeCategory === "hotel" ? "#FFFFFF" : "#6B7280"} />
              <Text
                style={[styles.catTabText, activeCategory === "hotel" && styles.catTabTextActive]}
              >
                Hotels
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardHeading}>Where do you want to go?</Text>

          {/* BUS SEARCH CARD */}
          {activeCategory === "bus" && (
            <View>
              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFrom(!showFrom);
                    setShowTo(false);
                  }}
                  style={[styles.inputCard, showFrom && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#D13239" }]}>
                    <MapPin size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>FROM CITY</Text>
                    <Text style={styles.fieldValue}>{booking.from || "Select departure city"}</Text>
                  </View>
                </TouchableOpacity>

                {showFrom && (
                  <View style={styles.dropdown}>
                    {busCities.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setBooking({ from: c });
                          setShowFrom(false);
                        }}
                      >
                        <MapPin size={14} color="#9CA3AF" />
                        <Text style={styles.dropdownText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#D13239" />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowTo(!showTo);
                    setShowFrom(false);
                  }}
                  style={[styles.inputCard, showTo && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#374151" }]}>
                    <MapPin size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>TO CITY</Text>
                    <Text style={styles.fieldValue}>{booking.to || "Select destination city"}</Text>
                  </View>
                </TouchableOpacity>

                {showTo && (
                  <View style={styles.dropdown}>
                    {busCities
                      .filter((c) => c !== booking.from)
                      .map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setBooking({ to: c });
                            setShowTo(false);
                          }}
                        >
                          <MapPin size={14} color="#9CA3AF" />
                          <Text style={styles.dropdownText}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>

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

              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFrom(!showFrom);
                    setShowTo(false);
                  }}
                  style={[styles.inputCard, showFrom && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#2563EB" }]}>
                    <Train size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>FROM STATION</Text>
                    <Text style={styles.fieldValue}>
                      {booking.trainFrom || "Select departure station"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showFrom && (
                  <View style={styles.dropdown}>
                    {trainStations.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setBooking({ trainFrom: c });
                          setShowFrom(false);
                        }}
                      >
                        <Train size={14} color="#9CA3AF" />
                        <Text style={styles.dropdownText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowTo(!showTo);
                    setShowFrom(false);
                  }}
                  style={[styles.inputCard, showTo && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#1E3A5F" }]}>
                    <Train size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>TO STATION</Text>
                    <Text style={styles.fieldValue}>
                      {booking.trainTo || "Select arrival station"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showTo && (
                  <View style={styles.dropdown}>
                    {trainStations
                      .filter((c) => c !== booking.trainFrom)
                      .map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setBooking({ trainTo: c });
                            setShowTo(false);
                          }}
                        >
                          <Train size={14} color="#9CA3AF" />
                          <Text style={styles.dropdownText}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>

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

              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFrom(!showFrom);
                    setShowTo(false);
                  }}
                  style={[styles.inputCard, showFrom && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#0284C7" }]}>
                    <Plane size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>FROM AIRPORT</Text>
                    <Text style={styles.fieldValue}>{booking.flightFrom}</Text>
                  </View>
                </TouchableOpacity>

                {showFrom && (
                  <View style={styles.dropdown}>
                    {flightAirports.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setBooking({ flightFrom: c });
                          setShowFrom(false);
                        }}
                      >
                        <Plane size={14} color="#9CA3AF" />
                        <Text style={styles.dropdownText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.swapContainer}>
                <TouchableOpacity onPress={swapRoute} style={styles.swapBtn} activeOpacity={0.8}>
                  <ArrowUpDown size={16} color="#0284C7" />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => {
                    setShowTo(!showTo);
                    setShowFrom(false);
                  }}
                  style={[styles.inputCard, showTo && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#0F172A" }]}>
                    <Plane size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>TO AIRPORT</Text>
                    <Text style={styles.fieldValue}>{booking.flightTo}</Text>
                  </View>
                </TouchableOpacity>

                {showTo && (
                  <View style={styles.dropdown}>
                    {flightAirports
                      .filter((c) => c !== booking.flightFrom)
                      .map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setBooking({ flightTo: c });
                            setShowTo(false);
                          }}
                        >
                          <Plane size={14} color="#9CA3AF" />
                          <Text style={styles.dropdownText}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>

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
              <View style={styles.pickerBox}>
                <TouchableOpacity
                  onPress={() => setShowFrom(!showFrom)}
                  style={[styles.inputCard, showFrom && styles.inputCardActive]}
                >
                  <View style={[styles.pinBox, { backgroundColor: "#059669" }]}>
                    <Building2 size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.inputInfo}>
                    <Text style={styles.fieldLabel}>DESTINATION CITY</Text>
                    <Text style={styles.fieldValue}>{booking.hotelDestination}</Text>
                  </View>
                </TouchableOpacity>

                {showFrom && (
                  <View style={styles.dropdown}>
                    {hotelCities.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setBooking({ hotelDestination: c });
                          setShowFrom(false);
                        }}
                      >
                        <Building2 size={14} color="#9CA3AF" />
                        <Text style={styles.dropdownText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

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
      />

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
  categoryBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 6,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    gap: 4,
  },
  catTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
  },
  catTabActive: {
    backgroundColor: "#D13239",
  },
  catTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  catTabTextActive: {
    color: "#FFFFFF",
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
});
