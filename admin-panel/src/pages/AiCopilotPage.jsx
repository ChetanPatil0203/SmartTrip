import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Send,
  Bot,
  User,
  CheckCircle,
  Copy,
  Share2,
  Hotel,
  HelpCircle,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import adminApi from '../services/api';
import { useAdmin } from '../context/AdminContext';

export default function AiCopilotPage() {
  const { showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('planner'); // 'planner' or 'support'
  const [language, setLanguage] = useState('mr'); // 'mr', 'hi', 'en'

  // Planner Form State
  const [origin, setOrigin] = useState('Pune');
  const [destination, setDestination] = useState('Goa');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(12000);
  const [travelType, setTravelType] = useState('Friends');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // AI Support Bot State
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'नमस्कार! मी SmartTrip AI सहाय्यक आहे. मी तुम्हाला तिकीट बुकिंग, रिफंड, गाडीचे लोकेशन ट्रॅकिंग, आणि ट्रिप प्लॅनिंगमध्ये मदत करू शकतो. मी तुम्हाला काय मदत करू?',
      time: '10:30 AM',
      actions: ['रिफंड पॉलिसी काय आहे?', 'गाडीचे लोकेशन कसे ट्रॅक करायचे?', 'इमर्जन्सी SOS मदत कशी मिळते?'],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Quick destination presets
  const presets = [
    { name: 'Goa', label: 'Goa (गोवा)' },
    { name: 'Mahabaleshwar', label: 'Mahabaleshwar (महाबळेश्वर)' },
    { name: 'Lonavala', label: 'Lonavala (लोणावळा)' },
    { name: 'Manali', label: 'Manali (मनाली)' },
    { name: 'Jaipur', label: 'Jaipur (जयपूर)' },
  ];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const result = await adminApi.planTripWithAi({
        origin,
        destination,
        days: Number(days),
        budget: Number(budget),
        travelType,
        language,
      });
      setGeneratedPlan(result);
      showToast('AI द्वारे ट्रिप प्लॅन यशस्वीपणे तयार झाला!', 'success');
    } catch (err) {
      console.warn('AI Trip planner error:', err);
      showToast('ट्रिप प्लॅन तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendQuery = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const response = await adminApi.askAiSupport(text, language);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.suggestedActions || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI Support error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'माफ करा, सर्व्हरशी कनेक्ट होताना अडचण आली. कृपया काही वेळाने प्रयत्न करा.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPlan) return;
    const text = `SmartTrip AI Plan for ${generatedPlan.destination}:\n${generatedPlan.intro}\n\nBudget: ₹${generatedPlan.budgetBreakdown?.total}\nDuration: ${generatedPlan.duration}`;
    navigator.clipboard.writeText(text);
    showToast('ट्रिप माहिती कॉपी झाली!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles className="w-80 h-80" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Next-Gen AI Travel Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SmartTrip AI Copilot</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              स्मार्ट ट्रिप प्लॅनिंग, आपत्कालीन सहाय्य आणि ग्राहक सेवा ऑटोमेशन — एकाच ठिकाणी.
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            <span className="text-xs text-slate-300 px-2 font-medium">भाषा:</span>
            {[
              { code: 'mr', label: 'मराठी' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === lang.code
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-3 mt-6 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'planner'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4" /> AI Trip Planner (ट्रिप प्लॅनर)
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'support'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4" /> AI Support & Policy Bot (सहाय्यक)
          </button>
        </div>
      </div>

      {/* TAB 1: AI TRIP PLANNER */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600" /> ट्रिप तपशील निवडा
            </h2>

            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                प्रसिद्ध ठिकाणे (Quick Picks):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setDestination(p.name)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      destination.toLowerCase() === p.name.toLowerCase()
                        ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  कुठून (Origin)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="उदा. Pune"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  कुठे (Destination)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    placeholder="उदा. Goa"
                  />
                </div>
              </div>
            </div>

            {/* Days Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  प्रवासाचे दिवस (Days)
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  {days} दिवस / {days - 1} रात्री
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Budget Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  अंदाजे बजेट (Budget)
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{Number(budget).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="relative">
                <Wallet className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  step="1000"
                  min="2000"
                  max="100000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>
            </div>

            {/* Travel Type */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                प्रवासाचा प्रकार (Travel Style)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Friends', 'Family', 'Solo', 'Romantic / Couple', 'Adventure'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTravelType(type)}
                    className={`text-xs py-2 px-3 rounded-xl border font-medium text-left transition-all ${
                      travelType === type
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating || !destination}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI ट्रिप प्लॅन तयार करत आहे...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> AI द्वारे ट्रिप प्लॅन तयार करा
                </>
              )}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 space-y-6">
            {!generatedPlan && !isGenerating && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  कोणतीही ट्रिप एका क्लिकमध्ये प्लॅन करा
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6">
                  डाव्या बाजूला शहराचे नाव, दिवस आणि बजेट निवडा. SmartTrip चे AI इंजिन सर्वोत्तम प्रवासाचे पर्याय, हॉटेल्स आणि दिवसनिहाय वेळापत्रक तयार करेल.
                </p>
                <button
                  onClick={handleGeneratePlan}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                  उदा. Pune ते Goa प्लॅन तयार करा
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[420px]">
                <Sparkles className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {destination} साठी सर्वोत्तम प्रवास, हॉटेल्स आणि वेळापत्रक AI शोधत आहे...
                </h3>
                <p className="text-slate-500 text-xs mt-2">
                  बजेट विभागणी, फिरण्याची ठिकाणे आणि ट्रॅव्हल टिप्स लोड होत आहेत.
                </p>
              </div>
            )}

            {generatedPlan && !isGenerating && (
              <div className="space-y-6 animate-fadeIn">
                {/* Plan Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          {generatedPlan.destination}
                        </h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold">
                          {generatedPlan.duration}
                        </span>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                        {generatedPlan.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" /> प्रत कॉपी करा
                      </button>
                      <button
                        onClick={() => showToast('प्रवाशाला WhatsApp वर पाठवले!', 'success')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                      >
                        <Share2 className="w-3.5 h-3.5" /> WhatsApp वर पाठवा
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    {generatedPlan.intro}
                  </p>

                  {/* Budget Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <span className="text-xs text-slate-500 block">प्रवास खर्च (Travel)</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ₹{generatedPlan.budgetBreakdown?.travel.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <span className="text-xs text-slate-500 block">हॉटेल मुक्काम (Stay)</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ₹{generatedPlan.budgetBreakdown?.stay.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <span className="text-xs text-slate-500 block">जेवण आणि खाणे (Food)</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ₹{generatedPlan.budgetBreakdown?.food.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800/40">
                      <span className="text-xs text-purple-700 dark:text-purple-300 block">एकूण बजेट (Total)</span>
                      <span className="text-base font-bold text-purple-700 dark:text-purple-300">
                        ₹{generatedPlan.budgetBreakdown?.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day-by-day Itinerary */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" /> दिवसनिहाय संपूर्ण वेळापत्रक (Day-by-Day Schedule)
                  </h3>

                  <div className="space-y-4">
                    {generatedPlan.itinerary?.map((dayItem) => (
                      <div
                        key={dayItem.day}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                              {dayItem.day}
                            </span>
                            {dayItem.title}
                          </h4>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {dayItem.estimatedDayCost}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-purple-600 block mb-0.5">🌅 सकाळ:</span>
                            {dayItem.morning}
                          </div>
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-amber-600 block mb-0.5">☀️ दुपार:</span>
                            {dayItem.afternoon}
                          </div>
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-indigo-600 block mb-0.5">🌆 संध्याकाळ:</span>
                            {dayItem.evening}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                          <Hotel className="w-3.5 h-3.5 text-slate-400" />
                          <span>मुक्काम: <strong className="text-slate-700 dark:text-slate-300">{dayItem.stay}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotels & Transport */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recommended Hotels */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-purple-600" /> शिफारस केलेली हॉटेल्स (Recommended Stays)
                    </h4>
                    <div className="space-y-2">
                      {generatedPlan.recommendedHotels?.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{h.name}</span>
                            <span className="text-slate-500">{h.area} • {h.stars}</span>
                          </div>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            ₹{h.pricePerNight}/रात्र
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Travel Advice & Packing Tips */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> पॅकिंग आणि ट्रॅव्हल टिप्स (Pro Tips)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {generatedPlan.packingTips?.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {tip}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-200">
                      {generatedPlan.smartAdvice}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI CUSTOMER SUPPORT CHATBOT */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Support Info Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" /> AI सपोर्ट बॉट वैशिष्ट्ये
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                हा AI बॉट प्रवाशांच्या सामान्य अडचणी तात्काळ सोडवतो, जसे की रिफंड कालावधी, तिकीट कॅन्सलेशन, लाइव्ह लोकेशन आणि इमर्जन्सी SOS मार्गदर्शक.
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                  त्वरित विचारण्यासाठी प्रश्न (Quick Prompts):
                </span>
                {[
                  'तिकीट कॅन्सल केल्यावर किती रिफंड मिळेल?',
                  'माझ्या बसचे लाइव्ह लोकेशन कुठे आहे?',
                  'आपत्कालीन SOS चा वापर कसा करायचा?',
                  'ट्रेनमध्ये सामान नेण्याचे काय नियम आहेत?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(prompt)}
                    className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 transition-all font-medium"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency SOS Quick Dispatch Callout */}
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-4 text-xs text-rose-800 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" /> इमर्जन्सी SOS प्रोटोकॉल
              </div>
              <p>
                कोणत्याही प्रवाशाने ॲपमध्ये SOS बटण दाबल्यास ॲडमिन पॅनेलवर लाल बीप वाजते आणि थेट हायवे पेट्रोल टीमला सूचना दिली जाते.
              </p>
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[560px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    SmartTrip AI प्रवासी सहाय्यक (Live Simulator)
                  </h4>
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ऑनलाइन • बहुभाषिक (मराठी/हिंदी/इंग्रजी)
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-slate-700 text-white'
                        : 'bg-purple-600 text-white shadow-sm'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendQuery(act)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-all font-medium"
                          >
                            👉 {act}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isAsking && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/60 rounded-tl-none text-xs text-slate-500 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" /> उत्तर तयार करत आहे...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="येथे तुमचा प्रश्न विचारा (उदा. रिफंड कधी येणार?)..."
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={!inputQuery.trim() || isAsking}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> पाठवा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
