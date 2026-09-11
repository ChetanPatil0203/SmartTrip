import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, MessageSquare, Phone, HelpCircle, ChevronDown, ChevronUp, ChevronRight, Bus, Train, Plane, Building2, ShieldAlert } from 'lucide-react-native';

const supportCategories = [
  { id: 'bus', title: 'Bus Booking & Tracking Issues', Icon: Bus, color: '#D13239' },
  { id: 'train', title: 'Train PNR & IRCTC Enquiries', Icon: Train, color: '#2563EB' },
  { id: 'flight', title: 'Flight Baggage & Web Check-in', Icon: Plane, color: '#0284C7' },
  { id: 'hotel', title: 'Hotel Check-in & Room Request', Icon: Building2, color: '#059669' },
  { id: 'safety', title: 'Travel Safety & Emergency SOS', Icon: ShieldAlert, color: '#EAB308' },
];

const faqs = [
  { q: 'How do I track my bus or train in real time?', a: 'Tap on "My Trips", select your active booking, and click "Live Status" or "Live Tracker" to see exact GPS locations and delay ETAs.' },
  { q: 'What is the refund policy for flight cancellations?', a: 'Cancellations 24h prior to departure receive instant refund after deducting airline fee. You can track progress in Refund Tracker.' },
  { q: 'How do I request early check-in at my hotel?', a: 'You can select "Early Check-in" during room booking or tap "Contact Hotel" on your hotel voucher to inform front desk.' },
  { q: 'Can I change my train berth preference after booking?', a: 'Berth preferences are assigned by IRCTC upon confirmation. You can view your coach & seat details directly on your Train Ticket.' },
];

export default function HelpSupportScreen({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Help & Support Center</Text>
            <Text style={styles.headerSub}>24/7 Assistance for all travel journeys</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Contact Bar */}
        <View style={styles.quickContactGrid}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.contactCard} activeOpacity={0.8}>
            <MessageSquare size={20} color="#D13239" />
            <Text style={styles.contactTitle}>Smart AI Chat</Text>
            <Text style={styles.contactSub}>Instant bot answers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
            <Phone size={20} color="#2563EB" />
            <Text style={styles.contactTitle}>Call Helpline</Text>
            <Text style={styles.contactSub}>1800-SMART-TRIP</Text>
          </TouchableOpacity>
        </View>

        {/* Support Categories */}
        <Text style={styles.sectionTitle}>SELECT ISSUE CATEGORY</Text>
        <View style={styles.catGrid}>
          {supportCategories.map((c) => {
            const IconComp = c.Icon;
            return (
              <TouchableOpacity key={c.id} style={styles.catRow} activeOpacity={0.7}>
                <View style={[styles.catIconBox, { backgroundColor: c.color + '15' }]}>
                  <IconComp size={16} color={c.color} />
                </View>
                <Text style={styles.catName}>{c.title}</Text>
                <ChevronRight size={14} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Frequently Asked Questions */}
        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={styles.faqList}>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setOpenFaq(isOpen ? null : i)}
                style={styles.faqCard}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{f.q}</Text>
                  {isOpen ? <ChevronUp size={16} color="#D13239" /> : <ChevronDown size={16} color="#94A3B8" />}
                </View>
                {isOpen && <Text style={styles.faqAnswer}>{f.a}</Text>}
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: '#D13239',
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
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  quickContactGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  contactSub: {
    fontSize: 10,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  catGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  catIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
});
