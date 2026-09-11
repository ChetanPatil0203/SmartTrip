import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2, QrCode, Download, Share2, Plane, Luggage, User, X, CheckSquare } from 'lucide-react-native';

export default function FlightTicketScreen({ onNavigate, booking }) {
  const pnr = booking.pnr || 'PNR-FL77291';
  const flight = booking.selectedFlight || {
    airline: 'SmartAir',
    flightNo: 'ST-402',
    from: 'Mumbai (BOM)',
    to: 'Delhi (DEL)',
    depTime: '09:30 AM',
    arrTime: '11:45 AM',
  };
  const seat = booking.selectedFlightSeats?.[0] || '2A';
  const passengers = booking.flightPassengerList?.length ? booking.flightPassengerList : [
    { name: 'Rahul Sharma', gender: 'Male', dob: '15/08/1995' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('my-trips')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Flight Ticket Confirmed</Text>
            <Text style={styles.headerSub}>Boarding Pass & Booking Pass</Text>
          </View>
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
                <Text style={styles.pnrLabel}>AIRLINE PNR</Text>
                <Text style={styles.pnrValue}>{pnr}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.pnrLabel}>BOOKING REF</Text>
                <Text style={styles.bookingIdVal}>{booking.bookingId || 'ST-AIR-88192'}</Text>
              </View>
            </View>

            {/* Flight info */}
            <View style={styles.flightHeaderBox}>
              <Text style={styles.airlineTitle}>{flight.airline} · {flight.flightNo}</Text>
              <Text style={styles.classSubtitle}>Economy Class · Boeing 737</Text>
            </View>

            {/* Route */}
            <View style={styles.routeBox}>
              <View>
                <Text style={styles.cityTitle}>{flight.from.split(' ')[0]}</Text>
                <Text style={styles.airportSub}>{flight.from}</Text>
                <Text style={styles.timeVal}>{flight.depTime}</Text>
                <Text style={styles.terminalVal}>T2 Gate 4B</Text>
              </View>

              <View style={styles.planeCol}>
                <Text style={styles.durationTag}>2h 15m</Text>
                <Plane size={18} color="#0284C7" style={{ transform: [{ rotate: '90deg' }] }} />
                <Text style={styles.nonStopTag}>Non-Stop</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cityTitle}>{flight.to.split(' ')[0]}</Text>
                <Text style={styles.airportSub}>{flight.to}</Text>
                <Text style={styles.timeVal}>{flight.arrTime}</Text>
                <Text style={styles.terminalVal}>T3 Terminal</Text>
              </View>
            </View>

            {/* Boarding Info Grid */}
            <View style={styles.boardingGrid}>
              <View style={styles.boardingBox}>
                <Text style={styles.bLabel}>BOARDING TIME</Text>
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
                    <Text style={styles.baggageText}>15 KG</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* QR Code */}
            <View style={styles.qrSection}>
              <QrCode size={100} color="#0F172A" />
              <Text style={styles.qrText}>Scan at Airport E-Gate / Web Check-in</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0284C7' }]} activeOpacity={0.8}>
            <CheckSquare size={16} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Web Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Download size={16} color="#0284C7" />
            <Text style={styles.actionBtnText}>Download Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
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
