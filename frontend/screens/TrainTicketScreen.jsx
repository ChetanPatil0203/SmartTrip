import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2, QrCode, Download, Share2, Navigation, X, Train, Calendar, User } from 'lucide-react-native';

export default function TrainTicketScreen({ onNavigate, booking }) {
  const pnr = booking.pnr || 'PNR-8829104';
  const trainName = booking.selectedTrain?.name || '12009 Shatabdi Express';
  const trainNo = booking.selectedTrain?.number || '12009';
  const from = booking.trainFrom || 'Mumbai Central';
  const to = booking.trainTo || 'Ahmedabad';
  const classType = booking.trainClass || 'Exec. Chair Car (EC)';
  const passengers = booking.trainPassengerList?.length ? booking.trainPassengerList : [
    { name: 'Rahul Sharma', age: '28', gender: 'Male', berth: 'Lower' }
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
            <Text style={styles.headerTitle}>Train Ticket Confirmed</Text>
            <Text style={styles.headerSub}>IRCTC E-Ticket Voucher</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Container */}
        <View style={styles.ticketCard}>
          {/* Top Banner */}
          <View style={styles.topStatusBanner}>
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text style={styles.statusText}>TRAIN BOOKING CONFIRMED</Text>
          </View>

          <View style={styles.cardPad}>
            {/* PNR Strip */}
            <View style={styles.pnrRow}>
              <View>
                <Text style={styles.pnrLabel}>PNR NUMBER</Text>
                <Text style={styles.pnrValue}>{pnr}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.pnrLabel}>BOOKING ID</Text>
                <Text style={styles.bookingIdVal}>{booking.bookingId || 'ST-TRN-94812'}</Text>
              </View>
            </View>

            {/* Train details */}
            <View style={styles.trainHeaderBox}>
              <Text style={styles.tName}>{trainNo} - {trainName}</Text>
              <Text style={styles.tClass}>{classType}</Text>
            </View>

            {/* Journey Route */}
            <View style={styles.routeBox}>
              <View>
                <Text style={styles.cityTitle}>{from}</Text>
                <Text style={styles.timeSub}>06:30 AM · Day 1</Text>
              </View>
              <View style={styles.arrowCol}>
                <Text style={{ fontSize: 16 }}>🚆</Text>
                <Text style={styles.durationTag}>6h 40m</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cityTitle}>{to}</Text>
                <Text style={styles.timeSub}>01:10 PM · Day 1</Text>
              </View>
            </View>

            {/* Coach & Berth Assignment */}
            <View style={styles.coachGrid}>
              <View style={styles.coachBox}>
                <Text style={styles.coachLabel}>COACH</Text>
                <Text style={styles.coachValue}>B3</Text>
              </View>
              <View style={styles.coachBox}>
                <Text style={styles.coachLabel}>BERTH / SEAT</Text>
                <Text style={styles.coachValue}>42 (Lower)</Text>
              </View>
              <View style={styles.coachBox}>
                <Text style={styles.coachLabel}>QUOTA</Text>
                <Text style={styles.coachValue}>General</Text>
              </View>
            </View>

            {/* Passenger List */}
            <View style={styles.passengersSection}>
              <Text style={styles.passLabel}>PASSENGER DETAILS</Text>
              {passengers.map((p, index) => (
                <View key={index} style={styles.pRow}>
                  <User size={14} color="#2563EB" />
                  <Text style={styles.pText}>{p.name} ({p.age} yrs, {p.gender})</Text>
                  <Text style={styles.pBerth}>Berth: {p.berth}</Text>
                </View>
              ))}
            </View>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <QrCode size={100} color="#0F172A" />
              <Text style={styles.qrText}>Scan at station / TTE Verification</Text>
            </View>

            {/* Total Fare */}
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Total Paid Amount</Text>
              <Text style={styles.fareVal}>₹{booking.totalAmount || 1450}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Download size={16} color="#2563EB" />
            <Text style={styles.actionBtnText}>Download Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Share2 size={16} color="#2563EB" />
            <Text style={styles.actionBtnText}>Share Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('train-live-status')}
            style={[styles.actionBtn, { backgroundColor: '#1E3A5F' }]}
            activeOpacity={0.8}
          >
            <Navigation size={16} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Live Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('cancel-ticket')}
            style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
            activeOpacity={0.8}
          >
            <X size={16} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Cancel Ticket</Text>
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
    backgroundColor: '#1E3A5F',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: '#2563EB',
    marginTop: 2,
  },
  bookingIdVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  trainHeaderBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  tName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  tClass: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
  routeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  timeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  arrowCol: {
    alignItems: 'center',
  },
  durationTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  coachGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  coachBox: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  coachLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 0.5,
  },
  coachValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E3A5F',
    marginTop: 2,
  },
  passengersSection: {
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
  pText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pBerth: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
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
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  fareLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  fareVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
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
    color: '#2563EB',
  },
});
