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
  MapPin,
  Clock,
  Ticket,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';

const quickPrompts = [
  'Where is my bus?',
  'Is my train delayed?',
  'What is my flight status?',
  'Where is my hotel?',
  'How much refund will I get?',
  'Show my upcoming trips',
];

const mockBotResponses = {
  'Where is my bus?': {
    text: '🚌 Your bus (Neeta Tours - SB12345678) is currently 4.2 km away from your boarding point at Dadar TT Circle. Estimated arrival is in 12 minutes.',
    actionLabel: 'Live Bus Tracking',
    screen: 'live-tracking',
  },
  'Is my train delayed?': {
    text: '🚆 12009 Shatabdi Express is running ON TIME! Current location: Approaching Surat Junction. Scheduled arrival at Ahmedabad: 01:10 PM.',
    actionLabel: 'View Train Live Status',
    screen: 'train-live-status',
  },
  'What is my flight status?': {
    text: '✈️ SmartAir Flight ST-402 (BOM ➔ DEL) is ON SCHEDULE! Web check-in is open. Boarding starts at Gate 4B at 08:45 AM.',
    actionLabel: 'View Flight Pass',
    screen: 'flight-ticket',
  },
  'Where is my hotel?': {
    text: '🏨 Taj Holiday Resort, Calangute, Goa. Check-in starts at 02:00 PM. Free early check-in requested!',
    actionLabel: 'View Hotel Voucher',
    screen: 'hotel-ticket',
  },
  'How much refund will I get?': {
    text: '💰 If you cancel 24 hours prior, you get 90% refund (₹1,386). Refund is processed instantly to your original payment method within 2-4 business days.',
    actionLabel: 'Check Cancellation Policy',
    screen: 'cancel-ticket',
  },
  'Show my upcoming trips': {
    text: '🎫 You have 3 upcoming trips:\n1. 🚌 Bus to Pune (25 May)\n2. 🚆 Train to Ahmedabad (28 May)\n3. ✈️ Flight to Delhi (02 Jun)',
    actionLabel: 'Go to My Trips',
    screen: 'my-trips',
  },
};

export default function SmartAssistantModal({ visible, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am SmartTrip AI Assistant. How can I help with your bus, train, flight, or hotel journey today?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (userQuery) => {
    const q = userQuery || inputText;
    if (!q.trim()) return;

    const newMsgId = Date.now();
    const userMsg = { id: newMsgId, sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Process bot response
    setTimeout(() => {
      let botResp = mockBotResponses[q];
      if (!botResp) {
        botResp = {
          text: `I've checked our live SmartTrip network for "${q}". Everything looks optimal! You can manage your bookings, live tracking, and support directly in your dashboard.`,
          actionLabel: 'View All Bookings',
          screen: 'my-trips',
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
    }, 600);
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
                  <Text style={styles.botTitle}>SmartTrip Assistant</Text>
                  <Sparkles size={14} color="#FFD700" />
                </View>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>AI Travel Companion · Online</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Quick Prompts */}
          <View style={styles.quickPromptsSection}>
            <Text style={styles.quickLabel}>QUICK ASSIST</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {quickPrompts.map((prompt) => (
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
              placeholder="Ask anything about your bus, train, flight..."
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '82%',
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F3F4F6',
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
    borderRadius: 22,
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
    fontWeight: '700',
    color: '#111827',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    color: '#6B7280',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPromptsSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    backgroundColor: '#FAFAFA',
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginLeft: 20,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  promptsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promptText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  chatScroll: {
    padding: 20,
    gap: 12,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userMsgWrapper: {
    justifyContent: 'flex-end',
  },
  botMsgWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  botBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D13239',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#D13239',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  userMsgText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  botMsgText: {
    fontSize: 13,
    color: '#111827',
    lineHeight: 19,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D13239',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#111827',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
