import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Share, Alert, Image } from 'react-native';
import { ArrowLeft, CheckCircle2, QrCode, Download, Share2, Plane, Luggage, User, X, CheckSquare } from 'lucide-react-native';

export default function FlightTicketScreen({ onNavigate, booking = {} }) {
  const currentBooking = booking || {};
  const pnr = currentBooking.pnr || 'PNR-FL77291';
  const flight = currentBooking.selectedFlight || {
    airline: 'SmartAir Indigo',
    flightNo: '6E-402',
    from: currentBooking.from || 'Mumbai (BOM)',
    to: currentBooking.to || 'Delhi (DEL)',
    depTime: '09:30 AM',
    arrTime: '11:45 AM',
  };
  const seat = currentBooking.selectedFlightSeats?.[0] || '12A';
  const passengers = currentBooking.flightPassengerList?.length ? currentBooking.flightPassengerList : [
    { name: 'Chetan Patil', gender: 'Male', dob: '15/08/1998' }
  ];
  const totalAmount = currentBooking.totalAmount || 4200;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=6&data=${encodeURIComponent(`FLIGHT|PNR:${pnr}|AIRLINE:${flight.airline}|FLIGHT:${flight.flightNo}|SEAT:${seat}|FARE:${totalAmount}`)}`;

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleShare = async () => {
    const text = `✈️ SmartTrip Confirmed Flight Boarding Pass\nPNR: ${pnr}\nFlight: ${flight.airline} (${flight.flightNo})\nRoute: ${flight.from} ➔ ${flight.to}\nDeparture: ${flight.depTime}\nSeat: ${seat}\nFare: ₹${totalAmount}\nStatus: CONFIRMED ✅\n\nShow at airport security & gate. SmartTrip.`;
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title: `Boarding Pass ${pnr}`, text });
          return;
        }
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          Alert.alert('Copied', 'Flight pass details copied to clipboard!');
          return;
        }
      }
      await Share.share({ title: `Flight Pass ${pnr}`, message: text });
    } catch { /* ignored */ }
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.print();
    } else {
      Alert.alert('Pass Downloaded', `Flight Boarding Pass PDF saved to Downloads.\nPNR: ${pnr}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Flight Ticket Confirmed</Text>
            <Text style={styles.headerSub}>Boarding Pass & Booking Pass</Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.backBtn} activeOpacity={0.7}>
            <Share2 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Voucher */}
        <View style={styles.ticketCard}>
          {/* Top Banner */}
          <View style={styles.topStatusBanner}>
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text style={styles.statusText}>FLIGHT BOOKING CONFIRMED</Text>
          </View>

          <View style={styles.cardPad}>
            {/* PNR Strip */}
            <View style={styles.pnrRow}>
              <View>
                <Text style={styles.pnrLabel}>PNR / E-TICKET NUMBER</Text>
                <Text style={styles.pnrValue}>{pnr}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.pnrLabel}>BOOKING ID</Text>
                <Text style={styles.bookingIdVal}>{currentBooking.bookingId || 'ST-FL-99120'}</Text>
              </View>
            </View>

            {/* Flight info */}
            <View style={styles.flightHeaderBox}>
              <Text style={styles.airlineTitle}>{flight.airline}</Text>
              <Text style={styles.classSubtitle}>Flight: {flight.flightNo} • Economy</Text>
            </View>

            {/* Route */}
            <View style={styles.routeBox}>
              <View>
                <Text style={styles.cityTitle}>{flight.from?.split(' ')?.[0] || 'Mumbai'}</Text>
                <Text style={styles.airportSub}>{flight.from}</Text>
                <Text style={styles.timeVal}>{flight.depTime}</Text>
              </View>
              <View style={styles.planeCol}>
                <Plane size={20} color="#0284C7" />
                <Text style={styles.durationTag}>2h 15m</Text>
                <Text style={styles.nonStopTag}>Non-stop</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cityTitle}>{flight.to?.split(' ')?.[0] || 'Delhi'}</Text>
                <Text style={styles.airportSub}>{flight.to}</Text>
                <Text style={styles.timeVal}>{flight.arrTime}</Text>
              </View>
            </View>

            {/* Boarding Info Grid */}
            <View style={styles.boardingGrid}>
              <View style={styles.boardingBox}>
                <Text style={styles.bLabel}>TERMINAL</Text>
                <Text style={styles.bVal}>T2</Text>
              </View>
              <View style={styles.boardingBox}>
                <Text style={styles.bLabel}>BOARDING</Text>
                <Text style={styles.bVal}>08:45 AM</Text>
              </View>
              <View style={styles.boardingBox}>
                <Text style={styles.bLabel}>GATE</Text>
                <Text style={styles.bVal}>4B</Text>
              </View>
              <View style={styles.boardingBox}>
                <Text style={styles.bLabel}>SEAT</Text>
                <Text style={styles.bVal}>{seat}</Text>
              </View>
            </View>

            {/* Passengers */}
            <View style={styles.passSection}>
              <Text style={styles.passLabel}>PASSENGERS & BAGGAGE</Text>
              {passengers.map((p, i) => (
                <View key={i} style={styles.pRow}>
                  <User size={14} color="#0284C7" />
                  <Text style={styles.pName}>{p.name}</Text>
                  <View style={styles.baggageChip}>
                    <Luggage size={10} color="#0284C7" />
                    <Text style={styles.baggageText}>15 KG Check-in</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* QR Code */}
            <View style={styles.qrSection}>
              <View style={styles.qrImageBox}>
                <Image source={{ uri: qrUrl }} style={styles.qrImg} resizeMode="contain" />
              </View>
              <Text style={styles.qrText}>Scan at Airport E-Gate / Web Check-in</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            onPress={() => Alert.alert('Web Check-in', 'Web Check-in is active. Boarding pass is confirmed.')}
            style={[styles.actionBtn, { backgroundColor: '#0284C7' }]}
            activeOpacity={0.8}
          >
            <CheckSquare size={16} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Web Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDownload} style={styles.actionBtn} activeOpacity={0.8}>
            <Download size={16} color="#0284C7" />
            <Text style={styles.actionBtnText}>{downloadSuccess ? 'Downloaded ✓' : 'Download Pass'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionBtn} activeOpacity={0.8}>
            <Share2 size={16} color="#0284C7" />
            <Text style={styles.actionBtnText}>Share Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('cancel-ticket')}
            style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
            activeOpacity={0.8}
          >
            <X size={16} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Cancel Flight</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#0284C7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
  },
  topStatusBanner: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardPad: {
    padding: 18,
    gap: 14,
  },
  pnrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  pnrLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  pnrValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
    marginTop: 2,
  },
  bookingIdVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  flightHeaderBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 12,
  },
  airlineTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  classSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 2,
  },
  routeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  airportSub: {
    fontSize: 10,
    color: '#64748B',
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 4,
  },
  terminalVal: {
    fontSize: 10,
    color: '#94A3B8',
  },
  planeCol: {
    alignItems: 'center',
    gap: 2,
  },
  durationTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  nonStopTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981',
  },
  boardingGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  boardingBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  bLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  bVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  passSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 6,
  },
  passLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  pRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  baggageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  baggageText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  qrImageBox: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  qrImg: {
    width: 124,
    height: 124,
  },
  qrText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
});
