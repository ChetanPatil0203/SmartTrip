import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronRight,
  Compass,
  Bus,
  Building2,
  Zap,
} from 'lucide-react-native';

const tripPlannerPresets = [
  {
    label: '🌴 Goa Weekend (under ₹4,000)',
    query: 'Plan a 2-day Goa trip from Pune under ₹4,000',
    plan: {
      title: '2-Day Goa Weekend Getaway',
      destination: 'Goa',
      from: 'Pune',
      budget: '₹3,450 (Within ₹4,000 Budget)',
      transport: {
        mode: 'Bus',
        service: 'IntrCity SmartBus AC Sleeper (Swargate ➔ Panaji)',
        time: 'Fri 09:30 PM ➔ Sat 06:30 AM',
        fare: '₹1,250',
      },
      stay: {
        name: 'Goa Coastal Palms Resort (Calangute)',
        duration: '1 Night / 2 Days',
        fare: '₹1,800',
      },
      localTransfer: 'SmartAuto from Panaji to Calangute (₹400)',
      savings: 'Saved ₹1,200 with SmartTrip AI Combo Deal',
      bookingData: { from: 'Pune', to: 'Goa', bookingType: 'bus' },
    },
  },
  {
    label: '🛕 Shirdi Darshan from Mumbai',
    query: 'Plan a day trip to Shirdi from Mumbai under ₹2,000',
    plan: {
      title: 'Sacred Shirdi One-Day Pilgrimage',
      destination: 'Shirdi',
      from: 'Mumbai',
      budget: '₹1,650 (Within ₹2,000 Budget)',
      transport: {
        mode: 'Train',
        service: '22223 Mumbai CSMT ➔ Sainagar Shirdi Vande Bharat',
        time: '06:20 AM ➔ 11:40 AM (5h 20m)',
        fare: '₹975 (Chair Car)',
      },
      stay: {
        name: 'Sai Palace Express Day-Stay Lounge',
        duration: 'Day Refreshment (6 Hours)',
        fare: '₹550',
      },
      localTransfer: 'Station to Temple Auto Pass (₹125)',
      savings: 'Express Tatkal AI Slot Optimization',
      bookingData: { from: 'Mumbai', to: 'Shirdi', bookingType: 'train' },
    },
  },
  {
    label: '⛰️ Mahabaleshwar Escape',
    query: 'Scenic monsoon weekend trip to Mahabaleshwar',
    plan: {
      title: 'Mahabaleshwar Hills & Strawberry Trails',
      destination: 'Mahabaleshwar',
      from: 'Pune',
      budget: '₹2,800 per person',
      transport: {
        mode: 'Bus',
        service: 'MSRTC Shivshahi AC Seater (Pune ➔ Mahabaleshwar)',
        time: 'Sat 07:00 AM ➔ Sat 10:15 AM',
        fare: '₹420',
      },
      stay: {
        name: 'Strawberry Valley Cottage Resort',
        duration: '1 Night / 2 Days',
        fare: '₹2,100',
      },
      localTransfer: 'SmartCab Hill View Sightseeing (₹280 split)',
      savings: 'Free Early Check-in & Breakfast included',
      bookingData: { from: 'Pune', to: 'Mahabaleshwar', bookingType: 'bus' },
    },
  },
  {
    label: '✈️ Fast Mumbai ➔ Delhi Business',
    query: 'Quick same-day return trip Mumbai to Delhi',
    plan: {
      title: 'Express Executive Business Corridor',
      destination: 'Delhi',
      from: 'Mumbai',
      budget: '₹8,200',
      transport: {
        mode: 'Flight',
        service: 'IndiGo 6E-2041 (BOM T2 ➔ DEL T3)',
        time: 'Morning 07:00 AM ➔ 09:15 AM',
        fare: '₹4,800',
      },
      stay: {
        name: 'Aerocity Day Transit Lounge',
        duration: 'Co-working + Refreshment',
        fare: '₹1,500',
      },
      localTransfer: 'Airport Express Metro & Cab Pass (₹450)',
      savings: 'Free priority baggage + in-flight hot meal',
      bookingData: { from: 'Mumbai (BOM)', to: 'Delhi (DEL)', bookingType: 'flight' },
    },
  },
];

const mockBotResponses = {
  'Where is my bus?': {
    text: '🚌 Your bus (IntrCity SmartBus - MH-12-RN-4820) is 3.8 km away from Swargate pickup point. Estimated arrival in 11 minutes. Live GPS telemetry is active.',
    actionLabel: 'Open Live Bus Radar',
    screen: 'live-tracking',
  },
  'Is my train delayed?': {
    text: '🚆 12127 Mumbai-Pune Intercity SF Express is currently delayed by 25 mins near Kalyan junction. Revised arrival at Pune Jn is 10:22 AM.',
    actionLabel: 'Check Train Live Status',
    screen: 'train-live-status',
  },
  'What is my flight status?': {
    text: '✈️ IndiGo 6E-2041 (BOM ➔ DEL) is ON TIME! Web check-in completed. Gate 44A opens at 01:30 PM.',
    actionLabel: 'View Flight Boarding Pass',
    screen: 'flight-ticket',
  },
  'Where is my hotel?': {
    text: '🏨 Taj Fort Aguada Resort, Goa. Your booking is confirmed with sea-view upgrade request registered. Check-in starts at 02:00 PM.',
    actionLabel: 'View Hotel Voucher',
    screen: 'hotel-ticket',
  },
  'How much refund will I get?': {
    text: '💰 SmartTrip Simulated Guarantee: Full 100% refund credited to your SmartTrip Wallet within 5 minutes of passenger cancellation prior to 12 hours.',
    actionLabel: 'Check Refund Status',
    screen: 'refund-status',
  },
  'Show my upcoming trips': {
    text: '🎫 You have 2 upcoming journeys scheduled:\n1. 🚌 Pune ➔ Goa (Fri 09:30 PM)\n2. 🚆 Mumbai ➔ Pune (Oct 01)',
    actionLabel: 'Go to My Trips',
    screen: 'my-trips',
  },
};

export default function SmartAssistantModal({ visible, onClose, onNavigate, setBooking }) {
  const [activeTab, setActiveTab] = useState('planner'); // 'planner' | 'chat'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! I am SmartTrip AI Genie. Tell me where you want to travel, your budget, or choose an AI-planned weekend itinerary below!',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleApplyPlan = (plan) => {
    if (setBooking && plan.bookingData) {
      setBooking(plan.bookingData);
    }
    onClose();
    if (plan.bookingData?.bookingType === 'train') {
      onNavigate('train-search-results');
    } else if (plan.bookingData?.bookingType === 'flight') {
      onNavigate('flight-search-results');
    } else {
      onNavigate('search-results');
    }
  };

  const handleSend = (userQuery) => {
    const q = userQuery || inputText;
    if (!q.trim()) return;

    const newMsgId = Date.now();
    const userMsg = { id: newMsgId, sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      // Check if it's a trip planning query
      const lower = q.toLowerCase();
      let matchedPlan = null;
      if (lower.includes('goa')) matchedPlan = tripPlannerPresets[0].plan;
      else if (lower.includes('shirdi')) matchedPlan = tripPlannerPresets[1].plan;
      else if (lower.includes('mahabaleshwar')) matchedPlan = tripPlannerPresets[2].plan;
      else if (lower.includes('delhi')) matchedPlan = tripPlannerPresets[3].plan;

      if (matchedPlan) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `🎯 I've crafted a customized AI Itinerary for your trip to ${matchedPlan.destination}:`,
            plan: matchedPlan,
          },
        ]);
        return;
      }

      let botResp = mockBotResponses[q];
      if (!botResp) {
        botResp = {
          text: `I've analyzed the SmartTrip live mobility matrix for "${q}". Schedules, seat inventory, and mock fares are updated. Would you like to view our search recommendations?`,
          actionLabel: 'Search Bus & Train Routes',
          screen: 'home',
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResp.text,
          actionLabel: botResp.actionLabel,
          screen: botResp.screen,
        },
      ]);
    }, 500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.botInfoRow}>
              <View style={styles.botAvatar}>
                <Bot size={22} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={styles.botTitle}>SmartTrip AI Trip Genie</Text>
                  <Sparkles size={15} color="#F59E0B" />
                </View>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Smart Multi-Modal Itinerary Engine</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.modeTabBar}>
            <TouchableOpacity
              onPress={() => setActiveTab('planner')}
              style={[styles.modeTab, activeTab === 'planner' && styles.modeTabActive]}
            >
              <Compass size={15} color={activeTab === 'planner' ? '#D13239' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'planner' && styles.modeTabTextActive]}>
                AI Trip Planner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('chat')}
              style={[styles.modeTab, activeTab === 'chat' && styles.modeTabActive]}
            >
              <Bot size={15} color={activeTab === 'chat' ? '#D13239' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'chat' && styles.modeTabTextActive]}>
                Smart Q&A Assistant
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'planner' ? (
            /* TAB 1: AI TRIP PLANNER */
            <ScrollView contentContainerStyle={styles.plannerContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.plannerHero}>
                <Text style={styles.plannerHeroTitle}>One-Prompt Holiday Planning 🚀</Text>
                <Text style={styles.plannerHeroSub}>
                  Select a popular AI-optimized itinerary or ask anything in the chat below.
                </Text>
              </View>

              {/* Itinerary Cards */}
              <View style={styles.itinerariesGrid}>
                {tripPlannerPresets.map((item, index) => {
                  const p = item.plan;
                  return (
                    <View key={index} style={styles.itineraryCard}>
                      <View style={styles.itineraryHeader}>
                        <View style={styles.badgeRow}>
                          <Text style={styles.itineraryBadge}>AI RECOMMENDED</Text>
                          <Text style={styles.budgetPill}>{p.budget}</Text>
                        </View>
                        <Text style={styles.itineraryTitle}>{p.title}</Text>
                      </View>

                      {/* Journey Breakdown */}
                      <View style={styles.journeyDetails}>
                        <View style={styles.detailRow}>
                          <Bus size={15} color="#D13239" />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.detailLabel}>TRAVEL</Text>
                            <Text style={styles.detailVal}>{p.transport.service}</Text>
                            <Text style={styles.detailSub}>{p.transport.time} • {p.transport.fare}</Text>
                          </View>
                        </View>

                        <View style={styles.detailRow}>
                          <Building2 size={15} color="#059669" />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.detailLabel}>STAY</Text>
                            <Text style={styles.detailVal}>{p.stay.name}</Text>
                            <Text style={styles.detailSub}>{p.stay.duration} • {p.stay.fare}</Text>
                          </View>
                        </View>

                        <View style={styles.detailRow}>
                          <Zap size={14} color="#D97706" />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.detailLabel}>SMART HIGHLIGHT</Text>
                            <Text style={styles.savingsText}>✨ {p.savings}</Text>
                          </View>
                        </View>
                      </View>

                      {/* 1-Click Book Button */}
                      <TouchableOpacity
                        onPress={() => handleApplyPlan(p)}
                        style={styles.bookItineraryBtn}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.bookItineraryText}>Book This Itinerary</Text>
                        <ChevronRight size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            /* TAB 2: CHAT ASSISTANT */
            <View style={{ flex: 1 }}>
              {/* Quick Prompts */}
              <View style={styles.quickPromptsSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
                  {Object.keys(mockBotResponses).map((prompt) => (
                    <TouchableOpacity
                      key={prompt}
                      onPress={() => handleSend(prompt)}
                      style={styles.promptChip}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.promptText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Chat Messages */}
              <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
                {messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.msgWrapper,
                      msg.sender === 'user' ? styles.userMsgWrapper : styles.botMsgWrapper,
                    ]}
                  >
                    {msg.sender === 'bot' && (
                      <View style={styles.botBubbleAvatar}>
                        <Bot size={14} color="#FFFFFF" />
                      </View>
                    )}
                    <View
                      style={[
                        styles.msgBubble,
                        msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                      ]}
                    >
                      <Text style={msg.sender === 'user' ? styles.userMsgText : styles.botMsgText}>
                        {msg.text}
                      </Text>

                      {/* Embedded Itinerary Card inside chat if generated */}
                      {msg.plan && (
                        <View style={styles.embeddedPlanCard}>
                          <Text style={styles.embeddedPlanTitle}>{msg.plan.title}</Text>
                          <Text style={styles.embeddedPlanSub}>Total: {msg.plan.budget}</Text>
                          <TouchableOpacity
                            onPress={() => handleApplyPlan(msg.plan)}
                            style={styles.embeddedPlanBtn}
                          >
                            <Text style={styles.embeddedPlanBtnText}>Apply & Book Now</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {msg.actionLabel && msg.screen && (
                        <TouchableOpacity
                          onPress={() => {
                            onClose();
                            onNavigate(msg.screen);
                          }}
                          style={styles.actionBtn}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.actionBtnText}>{msg.actionLabel}</Text>
                          <ChevronRight size={14} color="#D13239" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Input Bar */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Plan a weekend trip to Goa or Shirdi..."
                  placeholderTextColor="#9CA3AF"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => handleSend()}
                />
                <TouchableOpacity
                  onPress={() => handleSend()}
                  style={[styles.sendBtn, { backgroundColor: inputText.trim() ? '#D13239' : '#9CA3AF' }]}
                  activeOpacity={0.8}
                >
                  <Send size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '88%',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  botInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  modeTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  modeTabActive: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#D13239',
    fontWeight: '800',
  },
  plannerContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  plannerHero: {
    marginBottom: 16,
  },
  plannerHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  plannerHeroSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itinerariesGrid: {
    gap: 16,
  },
  itineraryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itineraryHeader: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itineraryBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D13239',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  budgetPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itineraryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  journeyDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  bookItineraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D13239',
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookItineraryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  quickPromptsSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  promptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  msgWrapper: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '84%',
  },
  userMsgWrapper: {
    alignSelf: 'flex-end',
  },
  botMsgWrapper: {
    alignSelf: 'flex-start',
  },
  botBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  msgBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#D13239',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userMsgText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  botMsgText: {
    color: '#1F2937',
    fontSize: 13,
    lineHeight: 18,
  },
  embeddedPlanCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  embeddedPlanTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  embeddedPlanSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  embeddedPlanBtn: {
    backgroundColor: '#D13239',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  embeddedPlanBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D13239',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#F8FAFC',
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
