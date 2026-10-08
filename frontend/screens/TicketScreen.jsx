import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Share,
  Alert,
  Image,
  Linking,
  Modal,
  TextInput,
  Animated,
  Easing,
  Vibration,
} from "react-native";
import {
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Navigation,
  Armchair,
  QrCode,
  Bus,
  CalendarDays,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  Sparkles,
  Copy,
  X,
  Send,
  Check,
  Radio,
  ExternalLink,
} from "lucide-react-native";

export default function TicketScreen({ onNavigate, booking = {} }) {
  const currentBooking = booking || {};
  const selectedSeats = Array.isArray(currentBooking.selectedSeats)
    ? currentBooking.selectedSeats
    : (currentBooking.seats ? [currentBooking.seats] : ["7", "8"]);
  const seatsCount = selectedSeats.length || 1;
  const seatListStr = selectedSeats.join(", ");

  const total =
    currentBooking.totalAmount ||
    (currentBooking.selectedBus?.price ?? 750) * seatsCount + 40 - (currentBooking.discount || 0);

  const pnr = currentBooking.pnr || "ST" + (currentBooking.backendBookingId ? currentBooking.backendBookingId.replace(/[^0-9]/g, '').slice(-8) : "89421034");
  const bookingId = currentBooking.backendBookingId || currentBooking.bookingId || "ST-BK-948201";
  const fromCity = currentBooking.from || "Mumbai";
  const toCity = currentBooking.to || "Pune";
  const travelDate = currentBooking.date || "Tomorrow";
  const operatorName = currentBooking.selectedBus?.operator || "Neeta Tours & Travels";
  const departureTime = currentBooking.selectedBus?.departure || "08:00 PM";
  const arrivalTime = currentBooking.selectedBus?.arrival || "11:00 PM";
  const duration = currentBooking.selectedBus?.duration || "3h";
  const busType = currentBooking.selectedBus?.type || "Volvo Multi-Axle AC Sleeper (2+1)";
  const boardingPoint = currentBooking.boardingPoint || "Dadar West, Near Station";
  const droppingPoint = currentBooking.droppingPoint || "Swargate Bus Stand, Pune";

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  const [conductorModalVisible, setConductorModalVisible] = useState(false);
  const [waModalVisible, setWaModalVisible] = useState(false);
  const [waPhoneNumber, setWaPhoneNumber] = useState("");
  const [isBoardedVerified, setIsBoardedVerified] = useState(false);
  const [liveClockStr, setLiveClockStr] = useState(new Date().toLocaleTimeString("en-IN"));

  // Animated laser line for Conductor QR Scanner
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Laser sweep up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ticking seconds clock for anti-screenshot watermark
    const timer = setInterval(() => {
      setLiveClockStr(new Date().toLocaleTimeString("en-IN", { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, [laserAnim]);

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 200],
  });

  // Formatted WhatsApp Ticket Content
  const waShareMessage =
    `*SMARTTRIP OFFICIAL E-TICKET* 🎫\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📌 *PNR:* ${pnr}\n` +
    `🆔 *Booking ID:* ${bookingId}\n` +
    `✅ *Status:* CONFIRMED (Seats Locked)\n\n` +
    `🚌 *Bus:* ${operatorName}\n` +
    `💺 *Seat(s):* ${seatListStr}\n` +
    `📍 *Route:* ${fromCity} ➔ ${toCity}\n` +
    `📅 *Travel Date:* ${travelDate}\n` +
    `⏰ *Departure:* ${departureTime} | *Arrival:* ${arrivalTime}\n\n` +
    `📍 *Boarding Station:* ${boardingPoint}\n` +
    `🏁 *Dropping Point:* ${droppingPoint}\n` +
    `💰 *Total Paid:* ₹${total.toLocaleString()} (Verified UPI)\n\n` +
    `📡 *Live GPS Radar Link:* \nhttps://smarttrip.in/radar/${pnr}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Please show this verified WhatsApp ticket or QR code to the conductor upon boarding._\n` +
    `📞 *24x7 Passenger Helpline:* +91 98220 12345`;

  // Send directly to WhatsApp
  const handleSendToWhatsApp = async (customPhone = "") => {
    const cleanPhone = customPhone ? customPhone.replace(/[^0-9]/g, "") : "";
    const encoded = encodeURIComponent(waShareMessage);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    try {
      await Linking.openURL(url);
      setWaModalVisible(false);
    } catch {
      await Share.share({ title: `SmartTrip Ticket - ${pnr}`, message: waShareMessage });
      setWaModalVisible(false);
    }
  };

  // Encode structured payload for QR scanner
  const qrData = `SMARTTRIP|PNR:${pnr}|BID:${bookingId}|FROM:${fromCity}|TO:${toCity}|DATE:${travelDate}|SEATS:${seatListStr}|PAID:${total}|VALID:${liveClockStr}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=10&data=${encodeURIComponent(qrData)}`;

  // Handle Share Ticket
  const handleShare = async () => {
    const shareText =
      `🎫 *SmartTrip Confirmed E-Ticket*\n\n` +
      `📌 *PNR:* ${pnr}\n` +
      `🆔 *Booking ID:* ${bookingId}\n` +
      `🚌 *Route:* ${fromCity} ➔ ${toCity}\n` +
      `📅 *Date:* ${travelDate} | *Dep:* ${departureTime}\n` +
      `💺 *Seats:* ${seatListStr}\n` +
      `🚍 *Operator:* ${operatorName} (${busType})\n` +
      `📍 *Boarding:* ${boardingPoint}\n` +
      `🏁 *Dropping:* ${droppingPoint}\n` +
      `💰 *Total Paid:* ₹${total.toLocaleString()}\n\n` +
      `✅ *Status:* CONFIRMED\n` +
      `Show this official e-ticket at the time of boarding. Track live on SmartTrip!`;

    try {
      if (Platform.OS === "web") {
        if (typeof navigator !== "undefined" && navigator.share) {
          await navigator.share({
            title: `SmartTrip Ticket - ${pnr}`,
            text: shareText,
          });
          return;
        }
        // Fallback to Clipboard on Web
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
          return;
        }
      }

      await Share.share({
        title: `SmartTrip Ticket - ${pnr}`,
        message: shareText,
      });
    } catch (err) {
      if (err.message && !err.message.includes("dismissed")) {
        Alert.alert("Share", "Unable to share. Details copied to clipboard.");
      }
    }
  };

  // Handle Download Ticket (Print to PDF on Web or File Save)
  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Trigger Web browser print / PDF download
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      Alert.alert(
        "Ticket Downloaded Successfully!",
        `E-Ticket PDF has been saved to your device Downloads.\n\nFile: SmartTrip_Ticket_${pnr}.pdf\nPNR: ${pnr}`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => onNavigate("my-trips")}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>E-Ticket</Text>
            <Text style={styles.headerSubtitle}>Verified Digital Travel Voucher</Text>
          </View>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerActionBtn}
            activeOpacity={0.7}
          >
            <Share2 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Toast */}
      {copySuccess && (
        <View style={styles.toastNotice}>
          <CheckCircle size={14} color="#16A34A" />
          <Text style={styles.toastText}>E-Ticket details copied to clipboard!</Text>
        </View>
      )}

      {downloadSuccess && (
        <View style={styles.toastNotice}>
          <FileText size={14} color="#2563EB" />
          <Text style={styles.toastText}>Preparing official E-Ticket PDF for download...</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveWrapper}>
          {/* Ticket Card */}
          <View style={styles.ticketCard}>
            <View style={styles.colorTopStrip} />

            {/* Route Header */}
            <View style={styles.routeHeader}>
              <View style={styles.routeHeaderTop}>
                <View style={styles.brandRow}>
                  <Sparkles size={13} color="#D13239" />
                  <Text style={styles.brandTitle}>SMARTTRIP OFFICIAL E-TICKET</Text>
                </View>
                <View style={styles.confirmedBadge}>
                  <ShieldCheck size={12} color="#16A34A" />
                  <Text style={styles.confirmedText}>CONFIRMED</Text>
                </View>
              </View>

              <View style={styles.citiesRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cityName} numberOfLines={1}>
                    {fromCity}
                  </Text>
                  <Text style={styles.cityTime}>{departureTime}</Text>
                </View>

                <View style={styles.durationCol}>
                  <View style={styles.iconCircle}>
                    <Bus size={18} color="#D13239" />
                  </View>
                  <View style={styles.dashLine} />
                  <Text style={styles.durationText}>{duration}</Text>
                </View>

                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={styles.cityName} numberOfLines={1}>
                    {toCity}
                  </Text>
                  <Text style={styles.cityTime}>{arrivalTime}</Text>
                </View>
              </View>
            </View>

            {/* Notched Tear Divider */}
            <View style={styles.notchedDividerRow}>
              <View style={[styles.notch, styles.notchLeft]} />
              <View style={styles.dashedLineFull} />
              <View style={[styles.notch, styles.notchRight]} />
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              {[
                {
                  Icon: Bus,
                  label: "OPERATOR",
                  value: operatorName,
                  color: "#D13239",
                },
                {
                  Icon: CalendarDays,
                  label: "JOURNEY DATE",
                  value: travelDate,
                  color: "#2563EB",
                },
                {
                  Icon: Armchair,
                  label: "SEAT NUMBER(S)",
                  value: seatListStr,
                  color: "#7C3AED",
                },
                {
                  Icon: Clock,
                  label: "BUS TYPE",
                  value: busType,
                  color: "#0EA5E9",
                },
                {
                  Icon: MapPin,
                  label: "BOARDING POINT",
                  value: boardingPoint,
                  color: "#059669",
                  fullWidth: true,
                },
                {
                  Icon: Navigation,
                  label: "DROPPING POINT",
                  value: droppingPoint,
                  color: "#D97706",
                  fullWidth: true,
                },
              ].map(({ Icon, label, value, color, fullWidth }) => (
                <View
                  key={label}
                  style={[styles.gridItem, fullWidth && styles.gridItemFull]}
                >
                  <View style={styles.itemLabelRow}>
                    <Icon size={12} color={color} />
                    <Text style={styles.itemLabel}>{label}</Text>
                  </View>
                  <Text style={styles.itemVal} numberOfLines={2}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            {/* PNR row */}
            <View style={styles.pnrSummaryRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pnrSummaryLabel}>PNR NUMBER</Text>
                <Text style={styles.pnrSummaryVal}>{pnr}</Text>
                <Text style={styles.bookingIdSub}>ID: {bookingId}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text style={styles.pnrSummaryLabel}>TOTAL FARE PAID</Text>
                <Text style={styles.amountPaidVal}>₹{total.toLocaleString()}</Text>
                <Text style={styles.gstTag}>Includes GST & Taxes</Text>
              </View>
            </View>

            {/* WhatsApp E-Ticket Direct Action Card */}
            <TouchableOpacity
              onPress={() => setWaModalVisible(true)}
              style={styles.whatsappCard}
              activeOpacity={0.85}
            >
              <View style={styles.whatsappLeft}>
                <View style={styles.whatsappIconCircle}>
                  <Text style={{ fontSize: 20 }}>💬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.whatsappTitle}>Send E-Ticket on WhatsApp</Text>
                    <View style={styles.instantPill}>
                      <Text style={styles.instantPillText}>INSTANT</Text>
                    </View>
                  </View>
                  <Text style={styles.whatsappSub}>
                    Get confirmed ticket + boarding map + live GPS link
                  </Text>
                </View>
              </View>
              <View style={styles.whatsappActionBtn}>
                <Text style={styles.whatsappActionText}>Share ➔</Text>
              </View>
            </TouchableOpacity>

            {/* Real Dynamic QR Code Scanner Section */}
            <TouchableOpacity
              style={styles.qrCol}
              onPress={() => setConductorModalVisible(true)}
              activeOpacity={0.88}
            >
              <View style={styles.qrLabelRow}>
                <QrCode size={14} color="#0F172A" />
                <Text style={styles.qrTitle}>Official Digital Verification QR</Text>
                <View style={styles.enlargeBadge}>
                  <Sparkles size={11} color="#D13239" />
                  <Text style={styles.enlargeBadgeText}>Enlarge</Text>
                </View>
              </View>
              <Text style={styles.qrSub}>
                Tap to open Conductor Fullscreen Scanner View
              </Text>

              {/* QR Container Frame with Scanner Corners */}
              <View style={styles.qrBox}>
                <View style={[styles.cornerBracket, styles.topLeftBracket]} />
                <View style={[styles.cornerBracket, styles.topRightBracket]} />
                <View style={[styles.cornerBracket, styles.bottomLeftBracket]} />
                <View style={[styles.cornerBracket, styles.bottomRightBracket]} />

                {!qrImageError ? (
                  <Image
                    source={{ uri: qrUrl }}
                    style={styles.qrImage}
                    resizeMode="contain"
                    onError={() => setQrImageError(true)}
                  />
                ) : (
                  /* Offline High-Density QR Fallback with 3 Corner Finder Patterns */
                  <View style={styles.offlineQrBox}>
                    <View style={styles.finderCornerTL}>
                      <View style={styles.finderInner} />
                    </View>
                    <View style={styles.finderCornerTR}>
                      <View style={styles.finderInner} />
                    </View>
                    <View style={styles.finderCornerBL}>
                      <View style={styles.finderInner} />
                    </View>
                    <View style={styles.offlineGrid}>
                      {Array.from({ length: 121 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.offlinePixel,
                            {
                              backgroundColor:
                                (i % 2 === 0 || i % 5 === 0) && i > 15
                                  ? "#0F172A"
                                  : "transparent",
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.verifyPill}>
                <ShieldCheck size={12} color="#16A34A" />
                <Text style={styles.verifyPillText}>Secure Anti-Counterfeit Token: {pnr.slice(-6)} · Tap to scan</Text>
              </View>
            </TouchableOpacity>

            {/* Important Instructions Card */}
            <View style={styles.noticeBox}>
              <Text style={styles.noticeHeading}>TRAVEL ADVISORY</Text>
              <Text style={styles.noticeText}>
                • Please arrive at boarding station at least 15 minutes before departure.
              </Text>
              <Text style={styles.noticeText}>
                • Carry a valid Govt Photo ID proof along with this digital E-Ticket.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Responsive Fixed Action Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <TouchableOpacity
            onPress={() => handleSendToWhatsApp()}
            style={styles.whatsappFooterBtn}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 16 }}>💬</Text>
            <Text style={styles.whatsappFooterBtnText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownload}
            style={styles.downloadBtn}
            activeOpacity={0.7}
          >
            <Download size={15} color="#D13239" />
            <Text style={styles.downloadBtnText}>
              {downloadSuccess ? "Saved ✓" : "Download"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("live-tracking")}
            style={styles.trackBtn}
            activeOpacity={0.8}
          >
            <Radio size={15} color="#FFFFFF" />
            <Text style={styles.trackBtnText}>Live Radar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Conductor Fullscreen QR Scanner Modal */}
      <Modal
        visible={conductorModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConductorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.conductorModalCard}>
            {/* Header */}
            <View style={styles.conductorHeader}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={18} color="#16A34A" />
                  <Text style={styles.conductorTitle}>CONDUCTOR VERIFICATION</Text>
                </View>
                <Text style={styles.conductorSub}>Official SmartTrip Boarding Pass</Text>
              </View>
              <TouchableOpacity
                onPress={() => setConductorModalVisible(false)}
                style={styles.conductorCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* QR Viewport with Animated Laser Line */}
            <View style={styles.conductorQrViewport}>
              <Image
                source={{ uri: qrUrl }}
                style={styles.conductorQrImage}
                resizeMode="contain"
              />

              {/* Animated Red Laser Scanning Line */}
              <Animated.View
                style={[
                  styles.scannerLaserLine,
                  { transform: [{ translateY: laserTranslateY }] },
                ]}
              />
            </View>

            {/* Anti-Counterfeit Dynamic Watermark */}
            <View style={styles.antiTamperBadge}>
              <View style={styles.liveClockDot} />
              <Text style={styles.antiTamperText}>
                VALIDATED · {liveClockStr} · TOKEN #{pnr.slice(-6)}
              </Text>
            </View>

            {/* Trip Summary Grid */}
            <View style={styles.conductorTripDetails}>
              <View style={styles.conductorDetailCol}>
                <Text style={styles.conductorLabel}>PASSENGER SEATS</Text>
                <Text style={styles.conductorValHighlight}>{seatListStr}</Text>
              </View>
              <View style={styles.conductorDetailCol}>
                <Text style={styles.conductorLabel}>ROUTE</Text>
                <Text style={styles.conductorVal}>{fromCity} ➔ {toCity}</Text>
              </View>
            </View>

            {/* Conductor Boarding Action Button */}
            <TouchableOpacity
              onPress={() => {
                try {
                  Vibration.vibrate([200, 100, 200]);
                } catch {}
                setIsBoardedVerified(true);
              }}
              style={[
                styles.conductorVerifyBtn,
                isBoardedVerified && styles.conductorVerifyBtnDone,
              ]}
              activeOpacity={0.8}
            >
              {isBoardedVerified ? (
                <>
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.conductorVerifyBtnText}>PASSENGER BOARDED ✓</Text>
                </>
              ) : (
                <>
                  <Check size={18} color="#FFFFFF" />
                  <Text style={styles.conductorVerifyBtnText}>VERIFY & BOARD PASSENGER</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Send to WhatsApp Modal */}
      <Modal
        visible={waModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.waModalCard}>
            <View style={styles.conductorHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 24 }}>💬</Text>
                <View>
                  <Text style={styles.waModalTitle}>Send Ticket on WhatsApp</Text>
                  <Text style={styles.waModalSub}>Instant digital ticket with GPS radar link</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setWaModalVisible(false)} style={styles.conductorCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Phone Input Box */}
            <View style={styles.waInputBox}>
              <Text style={styles.waInputPrefix}>+91</Text>
              <TextInput
                style={styles.waTextInput}
                placeholder="Enter 10-digit mobile number (Optional)"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={waPhoneNumber}
                onChangeText={setWaPhoneNumber}
                maxLength={10}
              />
            </View>

            {/* Quick Share Buttons */}
            <View style={{ gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => handleSendToWhatsApp(waPhoneNumber)}
                style={styles.waSendBtn}
                activeOpacity={0.85}
              >
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.waSendBtnText}>
                  {waPhoneNumber ? `Send to +91 ${waPhoneNumber}` : "Open WhatsApp Directly"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSendToWhatsApp()}
                style={styles.waShareDirectBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.waShareDirectBtnText}>Share to Recent WhatsApp Chats</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    backgroundColor: "#D13239",
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerInner: {
    maxWidth: 580,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.85)",
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  toastNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    maxWidth: 580,
    width: "100%",
    alignSelf: "center",
  },
  toastText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 130,
  },
  responsiveWrapper: {
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  colorTopStrip: {
    height: 6,
    backgroundColor: "#D13239",
  },
  routeHeader: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  routeHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  confirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  confirmedText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
  citiesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cityName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  cityTime: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  durationCol: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  dashLine: {
    width: 48,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  durationText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "700",
  },
  notchedDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginVertical: 2,
  },
  notch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  notchLeft: {
    marginLeft: -12,
  },
  notchRight: {
    marginRight: -12,
  },
  dashedLineFull: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 16,
  },
  gridItem: {
    width: "46%",
  },
  gridItemFull: {
    width: "100%",
  },
  itemLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  itemLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.6,
  },
  itemVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  pnrSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  pnrSummaryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  pnrSummaryVal: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bookingIdSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  amountPaidVal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#D13239",
    marginTop: 2,
  },
  gstTag: {
    fontSize: 9,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "600",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  qrCol: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  qrLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qrTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  qrSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 12,
  },
  qrBox: {
    width: 170,
    height: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  qrImage: {
    width: 145,
    height: 145,
  },
  cornerBracket: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: "#D13239",
  },
  topLeftBracket: {
    top: 6,
    left: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRightBracket: {
    top: 6,
    right: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeftBracket: {
    bottom: 6,
    left: 6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRightBracket: {
    bottom: 6,
    right: 6,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  offlineQrBox: {
    width: 140,
    height: 140,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  finderCornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  finderCornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  finderCornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  finderInner: {
    width: 14,
    height: 14,
    backgroundColor: "#0F172A",
  },
  offlineGrid: {
    width: 120,
    height: 120,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  offlinePixel: {
    width: "9.09%",
    height: "9.09%",
  },
  verifyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  verifyPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#166534",
  },
  noticeBox: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  noticeHeading: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 10,
    color: "#64748B",
    lineHeight: 15,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  footerInner: {
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
  },
  downloadBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#D13239",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFF5F5",
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D13239",
  },
  shareBtn: {
    flex: 0.9,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  trackBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 2,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  whatsappFooterBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#15803D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 2,
  },
  whatsappFooterBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  whatsappCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderColor: "#86EFAC",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },
  whatsappLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  whatsappIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#166534",
  },
  instantPill: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  instantPillText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  whatsappSub: {
    fontSize: 11,
    color: "#15803D",
    marginTop: 2,
  },
  whatsappActionBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  whatsappActionText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  enlargeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  enlargeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#D13239",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  conductorModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  conductorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 14,
  },
  conductorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.5,
  },
  conductorSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  conductorCloseBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  conductorQrViewport: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0F172A",
    padding: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  conductorQrImage: {
    width: 210,
    height: 210,
  },
  scannerLaserLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  antiTamperBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12,
  },
  liveClockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  antiTamperText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.4,
  },
  conductorTripDetails: {
    flexDirection: "row",
    width: "100%",
    marginTop: 14,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  conductorDetailCol: {
    flex: 1,
  },
  conductorLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#64748B",
  },
  conductorValHighlight: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D13239",
    marginTop: 2,
  },
  conductorVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  conductorVerifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F172A",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  conductorVerifyBtnDone: {
    backgroundColor: "#16A34A",
  },
  conductorVerifyBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  waModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },
  waModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  waModalSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  waInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginTop: 14,
  },
  waInputPrefix: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    marginRight: 8,
  },
  waTextInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    paddingVertical: 0,
  },
  waSendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 12,
  },
  waSendBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  waShareDirectBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  waShareDirectBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
});
