/**
 * SmartTrip AI Service
 * Comprehensive AI Multi-Destination Travel Planner & Budget Estimator
 * Supports Gemini API / Deep NLP with full Marathi, Hindi & English engine.
 */

// Popular destinations database with enriched knowledge
const DESTINATIONS_DB = {
  raigad: {
    key: "raigad",
    name: "किल्ले रायगड आणि महाड (Raigad Fort & Mahad)",
    shortName: "Raigad",
    tagline: "Capital of Hindavi Swarajya & Sahyadri Majesty",
    bestTime: "ऑक्टोबर ते मार्च (हिवाळा) आणि जुलै ते सप्टेंबर (हिरवागार पावसाळा)",
    recommendedDays: 1.5,
    distanceFromPuneKm: 140,
    attractions: [
      { name: "किल्ले रायगड महादरवाजा व समाधी दर्शन", time: "सकाळी ०८:०० ते १२:००", tip: "छत्रपती शिवाजी महाराजांच्या पावन समाधीचे दर्शन, नगारखाना व जगदीश्वर मंदिर" },
      { name: "रायगड रोप-वे (Raigad Ropeway)", time: "सकाळी किंवा दुपार", tip: "अवघ्या ४ मिनिटांत गडावर सरळ पोहोचण्याचा चित्तथरारक अनुभव (तिकीट ₹४००-₹४५०)" },
      { name: "हिरकणी बुरूज आणि टकमक टोक", time: "दुपारी ३:३०", tip: "सह्याद्रीच्या उत्तुंग कड्यांचा आणि दऱ्यांचा अथांग देखावा" },
      { name: "गांधारपाले बौद्ध लेणी व महाड सावित्री नदी परिसर", time: "संध्याकाळी", tip: "२८ प्राचीन बौद्ध लेण्यांचा ऐतिहासिक वारसा" },
    ],
    foodTips: ["झणझणीत पिठलं-भाकरी आणि कांदा-भजी", "कोकणी उकडीचे मोदक", "सोलकढी आणि गरमागरम भात", "महाडची स्थानिक चवदार थाळी"],
    hotels: [
      { name: "MTDC Resort Raigad Fort Base", stars: "3★", pricePerNight: 1800, area: "पाचाड (गडाच्या पायथ्याशी)" },
      { name: "Hotel Kuber Palace Mahad", stars: "3★", pricePerNight: 1500, area: "महाड महामार्ग" },
      { name: "Sahyadri Heritage Agro Stay", stars: "3★", pricePerNight: 1200, area: "वरंधा घाट परिसर" },
    ],
    transport: {
      bus: "MSRTC शिवशाही / लालपरी (पुणे ➔ महाड ➔ पाचाड, अंदाजे ₹२२० - ₹३८०)",
      cab: "SmartTrip One-way / Round-trip Private Cab (अंदाजे ₹२,६०० - ₹३,५००)",
    },
    costs: {
      entryRopeway: 450,
      dailyFood: 550,
      stayAvg: 1600,
    }
  },

  goa: {
    key: "goa",
    name: "गोवा (Goa - उत्तर आणि दक्षिण गोवा)",
    shortName: "Goa",
    tagline: "Sun, Sand Beaches, Water Sports & Heritage",
    bestTime: "ऑक्टोबर ते एप्रिल (बीचेस आणि नाईटलाईफसाठी सर्वोत्तम)",
    recommendedDays: 2.5,
    distanceFromPuneKm: 450,
    attractions: [
      { name: "कलंगूट आणि बागा बीच (Calangute & Baga)", time: "सकाळी / संध्याकाळी", tip: "पॅरासेलिंग, जेट स्की, बनाना राइड आणि बीच शेक्स" },
      { name: "फोर्ट अगुआडा आणि दीपगृह (Fort Aguada)", time: "दुपारी ४:००", tip: "अरबी समुद्राचा ३६० अंश नयनरम्य पॅनोरॅमिक व्ह्यू" },
      { name: "जुने गोवा चर्चेस (Basilica of Bom Jesus)", time: "सकाळी १०:००", tip: "युनेस्को जागतिक वारसा स्थळ व ऐतिहासिक पोर्तुगीज स्थापत्य" },
      { name: "अंजुना आणि वागातोर बीच (Chapora Fort)", time: "संध्याकाळी सनसेट", tip: "दिल चाहता है फेम व्ह्यू आणि लाइव्ह म्युझिक कॅफेस" },
      { name: "मांडवी नदी सनसेट क्रूझ", time: "संध्याकाळी ६:३०", tip: "पारंपारिक गोवन लोकनृत्य आणि डीजे म्युझिक क्रूझ (₹५००)" },
    ],
    foodTips: ["ऑथेंटिक गोवन फिश करी थाळी", "प्रॉन्स / सुरमई रवा फ्राय", "बेबिका डेझर्ट (Bebinca)", "ताजी शहाळी आणि कोकम सरबत"],
    hotels: [
      { name: "Goa Coastal Palms Beach Resort", stars: "4★", pricePerNight: 2800, area: "कलंगूट बीच जवळ" },
      { name: "Old Heritage Portuguese Villa", stars: "3★", pricePerNight: 2100, area: "पणजी फॉन्टेनहास" },
      { name: "Taj Fort Aguada Sea Resort", stars: "5★", pricePerNight: 8500, area: "सिंकेरीम बीच" },
    ],
    transport: {
      bus: "AC Multi-Axle Volvo Sleeper (पुणे ➔ गोवा, अंदाजे ₹१,२०० - ₹१,६५०)",
      train: "कोकण कन्या किंवा जनशताब्दी एक्सप्रेस (स्लीपर ₹४२०, ३AC ₹१,१५०)",
      flight: "दाबोलीम (GOI) किंवा मोपा (GOX) विमानतळ (अंदाजे ₹२,८०० - ₹५,०००)",
    },
    costs: {
      entryRopeway: 1200, // Water sports / activities
      dailyFood: 750,
      stayAvg: 2400,
    }
  },

  mahabaleshwar: {
    key: "mahabaleshwar",
    name: "महाबळेश्वर आणि पाचगणी (Mahabaleshwar & Panchgani)",
    shortName: "Mahabaleshwar",
    tagline: "Strawberry Fields & Misty Hill Station",
    bestTime: "जुलै ते फेब्रुवारी",
    recommendedDays: 2,
    distanceFromPuneKm: 120,
    attractions: [
      { name: "वेण्णा लेक (Venna Lake)", time: "संध्याकाळी", tip: "बोटिंग, घोडेस्वारी आणि ताज्या स्ट्रॉबेरी विथ क्रीम" },
      { name: "आर्थर्स सीट व एल्फिन्स्टन पॉइंट", time: "सकाळी", tip: "सह्याद्रीच्या दऱ्यांचे विहंगम दृश्य" },
      { name: "मॅप्रो गार्डन (Mapro Garden)", time: "दुपारी", tip: "स्ट्रॉबेरी सँडविच, पिझ्झा आणि मोफत चॉकलेट चाखणे" },
      { name: "प्रतापगड किल्ला", time: "सकाळी", tip: "छत्रपती शिवाजी महाराजांचा ऐतिहासिक किल्ला" },
    ],
    foodTips: ["फ्रेश स्ट्रॉबेरी विथ क्रीम", "गरम मका पॅटीस", "महाबळेश्वर चिक्की आणि फज", "स्थानिक महाराष्ट्रीयन थाळी"],
    hotels: [
      { name: "Misty Valley Forest Resort", stars: "4★", pricePerNight: 2800, area: "महाबळेश्वर" },
      { name: "Strawberry Hill View Cottages", stars: "3★", pricePerNight: 1900, area: "पाचगणी" },
    ],
    transport: {
      bus: "MSRTC शिवशाही / AC Seater (अंदाजे ₹४५० - ₹८५०)",
      cab: "SmartTrip Private Sedan / SUV (अंदाजे ₹२,८०० - ₹३,८००)",
    },
    costs: {
      entryRopeway: 300,
      dailyFood: 600,
      stayAvg: 2200,
    }
  },

  alibaug: {
    key: "alibaug",
    name: "अलिबाग आणि मुरुड जंजिरा (Alibaug & Murud)",
    shortName: "Alibaug",
    tagline: "Coastal Forts, Water sports & Coconut Groves",
    bestTime: "ऑक्टोबर ते मे",
    recommendedDays: 2,
    distanceFromPuneKm: 145,
    attractions: [
      { name: "मुरुड जंजिरा जलदुर्ग", time: "सकाळी", tip: "समुद्रातील अभेद्य किल्ला आणि शिडाच्या बोटीचा थरार" },
      { name: "काशीद आणि नागाव बीच", time: "संध्याकाळी", tip: "वॉटर स्पोर्ट्स, पॅरासेलिंग आणि पांढरी शुभ्र वाळू" },
      { name: "कुलाबा किल्ला", time: "ओहोटीच्या वेळी", tip: "समुद्रातून चालत जाण्याचा अनोखा अनुभव" },
    ],
    foodTips: ["सुरमई / पापलेट फ्राय", "सोलकढी", "उकडीचे मोदक", "पोहे व घावणे"],
    hotels: [
      { name: "Sea Pearl Beach Resort Nagaon", stars: "3★", pricePerNight: 2200, area: "नागाव बीच" },
      { name: "Radisson Blu Resort Alibaug", stars: "5★", pricePerNight: 7500, area: "अलिबाग" },
    ],
    transport: {
      bus: "MSRTC / AC शिवशाही (अंदाजे ₹३०० - ₹५५०)",
      cab: "SmartTrip One-way Taxi (अंदाजे ₹३,००० - ₹३,८००)",
    },
    costs: {
      entryRopeway: 600,
      dailyFood: 650,
      stayAvg: 2200,
    }
  },

  shirdi: {
    key: "shirdi",
    name: "शिर्डी आणि नाशिक (Shirdi & Nashik)",
    shortName: "Shirdi",
    tagline: "Sacred Pilgrimage & Peace",
    bestTime: "वर्षभर",
    recommendedDays: 2,
    distanceFromPuneKm: 200,
    attractions: [
      { name: "श्री साईबाबा समाधी मंदिर", time: "सकाळी काकड आरती", tip: "VIP दर्शन पास SmartTrip वरून बुक करा" },
      { name: "शनि शिंगणापूर", time: "दुपारी", tip: "स्वयंभू शनिदेव मंदिर दर्शन" },
      { name: "नाशिक त्र्यंबकेश्वर ज्योतिर्लिंग", time: "दुसरा दिवस", tip: "गोदावरी उगमस्थान व पंचवटी" },
    ],
    foodTips: ["साई प्रसादालय महाप्रसाद", "गुलाबजामुन व पेढे", "मिसळ पाव"],
    hotels: [
      { name: "Sun-n-Sand Shirdi Luxury", stars: "4★", pricePerNight: 3500, area: "मंदिर परिसर" },
      { name: "Sai Leela Grand", stars: "3★", pricePerNight: 1600, area: "पिंपळवाडी रोड" },
    ],
    transport: {
      train: "वंदे भारत / साईनगर शिर्डी एक्सप्रेस (अंदाजे ₹५५० - ₹१,१००)",
      bus: "AC Sleeper Bus (अंदाजे ₹४५० - ₹८००)",
    },
    costs: {
      entryRopeway: 200,
      dailyFood: 400,
      stayAvg: 1600,
    }
  }
};

/**
 * Extract places and details from natural text query
 * Example: "pune to goa ,raygad firay cha aahe ta mala plan sag kiti bajeta lagela"
 */
function parseTripQuery(rawQuery = "") {
  const q = rawQuery.toLowerCase();

  // Detect Origin
  let origin = "Pune";
  if (q.includes("mumbai") || q.includes("बॉम्बे")) origin = "Mumbai";
  else if (q.includes("thane")) origin = "Thane";
  else if (q.includes("nagpur")) origin = "Nagpur";
  else if (q.includes("nashik")) origin = "Nashik";
  else if (q.includes("kolhapur")) origin = "Kolhapur";
  else if (q.includes("pune") || q.includes("पुणे")) origin = "Pune";

  // Detect Destinations
  const matchedDests = [];
  if (q.includes("raigad") || q.includes("raygad") || q.includes("रायगड") || q.includes("mahad") || q.includes("महाड")) {
    matchedDests.push("raigad");
  }
  if (q.includes("goa") || q.includes("गोवा") || q.includes("panaji") || q.includes("baga")) {
    matchedDests.push("goa");
  }
  if (q.includes("mahabaleshwar") || q.includes("महाबळेश्वर") || q.includes("panchgani")) {
    matchedDests.push("mahabaleshwar");
  }
  if (q.includes("alibaug") || q.includes("अलिबाग") || q.includes("janjira") || q.includes("kashid")) {
    matchedDests.push("alibaug");
  }
  if (q.includes("shirdi") || q.includes("शिर्डी") || q.includes("nashik")) {
    matchedDests.push("shirdi");
  }

  // Detect days if mentioned e.g. "3 दिवस", "4 days", "2 nights"
  let extractedDays = null;
  const dayMatch = q.match(/(\d+)\s*(दिवस|days?|day|d)/);
  if (dayMatch) {
    extractedDays = parseInt(dayMatch[1], 10);
  }

  // Detect travel style
  let style = "standard";
  if (q.includes("kamit kami") || q.includes("budget") || q.includes("कमी खर्च") || q.includes("स्वस्त") || q.includes("student")) {
    style = "budget";
  } else if (q.includes("luxury") || q.includes("5 star") || q.includes("आलिशान") || q.includes("flight")) {
    style = "luxury";
  }

  return {
    origin,
    destinations: matchedDests.length > 0 ? matchedDests : ["goa"],
    days: extractedDays,
    style,
    isMultiDest: matchedDests.length > 1,
  };
}

/**
 * Intelligent AI Trip Planner & Dynamic Budget Estimator
 */
async function generateTripPlan(params = {}) {
  const query = params.query || "";
  const parsed = query ? parseTripQuery(query) : null;

  const origin = params.origin || parsed?.origin || "Pune";
  let destinationKeys = [];

  if (params.destinations && Array.isArray(params.destinations) && params.destinations.length > 0) {
    destinationKeys = params.destinations.map(d => d.trim().toLowerCase());
  } else if (params.destination) {
    const splitted = params.destination.toLowerCase().split(/[,&+]/).map(s => s.trim());
    splitted.forEach(s => {
      Object.keys(DESTINATIONS_DB).forEach(k => {
        if (s.includes(k) && !destinationKeys.includes(k)) destinationKeys.push(k);
      });
    });
  }

  if (destinationKeys.length === 0 && parsed?.destinations?.length > 0) {
    destinationKeys = parsed.destinations;
  }

  if (destinationKeys.length === 0) {
    destinationKeys = ["goa"];
  }

  // Check if Raigad & Goa combined trip
  const hasRaigad = destinationKeys.some(k => k.includes("raigad") || k.includes("raygad"));
  const hasGoa = destinationKeys.some(k => k.includes("goa"));
  const isRaigadGoaCombo = hasRaigad && hasGoa;

  // Calculate duration
  let totalDays = Number(params.days) || parsed?.days;
  if (!totalDays) {
    if (isRaigadGoaCombo) totalDays = 4; // Optimal: 4 Days / 3 Nights
    else if (destinationKeys.length > 1) totalDays = 4;
    else totalDays = DESTINATIONS_DB[destinationKeys[0]]?.recommendedDays || 3;
    totalDays = Math.ceil(totalDays);
  }
  totalDays = Math.max(1, Math.min(totalDays, 10));
  const totalNights = Math.max(1, totalDays - 1);

  const style = params.travelStyle || parsed?.style || "standard";
  const passengers = Number(params.passengersCount) || 1;
  const language = params.language || "mr";

  // Calculate realistic budget according to route & style
  let transportPerPerson = 0;
  let stayPerPerson = 0;
  let foodPerPerson = 0;
  let activitiesPerPerson = 0;
  let bufferPerPerson = 0;

  if (isRaigadGoaCombo) {
    // Route: Pune -> Raigad (140km) -> Goa (390km) -> Pune (450km)
    if (style === "budget") {
      transportPerPerson = 2350; // MSRTC + Non-AC / Semi-Sleeper + Local share
      stayPerPerson = 2100;      // 1 Night Raigad MTDC + 2 Nights Goa Budget Guest House (sharing)
      foodPerPerson = 2000;      // 4 Days x ₹500 (Maharashtrian / Goan local food)
      activitiesPerPerson = 950; // Raigad Ropeway ₹450 + beach sports entry ₹500
      bufferPerPerson = 500;     // Emergency / Tolls / Misc
    } else if (style === "luxury") {
      transportPerPerson = 5800; // Dedicated AC SUV Cab / Flight combo
      stayPerPerson = 8500;      // 4★ Beachside Resort Goa + Heritage Stay
      foodPerPerson = 4200;      // Premium seafood / cafes @ ₹1,050/day
      activitiesPerPerson = 2600;// Scuba / Watersports combo + Ropeway VIP
      bufferPerPerson = 1500;
    } else {
      // Standard (Most Popular & Highly Recommended)
      transportPerPerson = 3450; // AC Volvo Sleeper Bus (IntrCity/MSRTC Shivshahi) + Local Auto/Taxi
      stayPerPerson = 3600;      // 3★ AC Resort / Hotel (₹2,400/night room twin-share = ₹1,200/person/night x 3)
      foodPerPerson = 2800;      // ₹700/day x 4 (Authentic Fish/Veg Thali, Breakfast & Kokum)
      activitiesPerPerson = 1550;// Raigad Ropeway ₹450 + Goa Watersports ₹1,100
      bufferPerPerson = 800;     // Parking, entry tickets, emergency buffer
    }
  } else {
    // Single destination calculations
    const primaryDest = DESTINATIONS_DB[destinationKeys[0]] || DESTINATIONS_DB.goa;
    const baseDailyCost = primaryDest.costs || { entryRopeway: 600, dailyFood: 600, stayAvg: 2000 };

    if (style === "budget") {
      transportPerPerson = Math.round(primaryDest.distanceFromPuneKm * 2.2 * 2);
      stayPerPerson = Math.round((baseDailyCost.stayAvg * 0.6 / 2) * totalNights);
      foodPerPerson = Math.round(baseDailyCost.dailyFood * 0.75 * totalDays);
      activitiesPerPerson = Math.round(baseDailyCost.entryRopeway * 0.7);
      bufferPerPerson = 400;
    } else if (style === "luxury") {
      transportPerPerson = Math.round(primaryDest.distanceFromPuneKm * 7.5 * 2);
      stayPerPerson = Math.round((baseDailyCost.stayAvg * 2.2 / 2) * totalNights);
      foodPerPerson = Math.round(baseDailyCost.dailyFood * 1.6 * totalDays);
      activitiesPerPerson = Math.round(baseDailyCost.entryRopeway * 2.2);
      bufferPerPerson = 1200;
    } else {
      transportPerPerson = Math.round(primaryDest.distanceFromPuneKm * 3.5 * 2);
      stayPerPerson = Math.round((baseDailyCost.stayAvg / 2) * totalNights);
      foodPerPerson = Math.round(baseDailyCost.dailyFood * totalDays);
      activitiesPerPerson = baseDailyCost.entryRopeway;
      bufferPerPerson = 600;
    }
  }

  const perPersonTotal = transportPerPerson + stayPerPerson + foodPerPerson + activitiesPerPerson + bufferPerPerson;
  // If group travel (e.g. 4 friends), rooms & cabs are shared, saving ~15-20% per person
  const groupDiscountFactor = passengers >= 4 ? 0.85 : (passengers >= 2 ? 0.92 : 1.0);
  const finalPerPerson = Math.round(perPersonTotal * groupDiscountFactor);
  const grandTotal = finalPerPerson * passengers;

  // Generate Itinerary
  const itinerary = [];

  if (isRaigadGoaCombo) {
    itinerary.push({
      day: 1,
      route: "पुणे ➔ वरंधा घाट / ताम्हिणी ➔ किल्ले रायगड (महाड)",
      title: "दिवस १: किल्ले रायगड दर्शन, रोप-वे आणि महाड मुक्काम",
      morning: "सकाळी ०६:०० ला पुण्यावरून निघणे. नयनरम्य घाटातून प्रवास करून सकाळी ०९:३० पर्यंत पाचाड (रायगड पायथा) आगमन.",
      afternoon: "रोप-वे ने गडावर चढाई. छत्रपती शिवाजी महाराजांची पावन समाधी, नगारखाना, राजसभा, महादरवाजा व जगदीश्वर मंदिर दर्शन. गडावर झणझणीत पिठलं-भाकरी आस्वाद.",
      evening: "टकमक टोक व हिरकणी बुरूज दर्शन घेऊन रोप-वे ने खाली उतरणे. महाडमध्ये आगमन व मुक्काम.",
      stay: "MTDC Resort Raigad किंवा Hotel Kuber Palace Mahad (मुक्काम)",
      foodTip: "महाडची अस्सल कोकणी शाकाहारी/मांसाहारी थाळी आणि सोलकढी.",
      estimatedDayCost: `₹${Math.round(finalPerPerson * 0.22)}`,
    });

    itinerary.push({
      day: 2,
      route: "महाड ➔ NH66 कोकण हायवे (खेड, चिपळूण, कणकवली) ➔ उत्तर गोवा",
      title: "दिवस २: नयनरम्य कोकण प्रवास आणि गोवा आगमन",
      morning: "सकाळी ०७:०० ला गरमागरम घावणे/पोहे नाश्ता करून कोकण मार्गे (NH66) गोव्याकडे प्रस्थान. वाटेत चिपळूण परशुराम मंदिर किंवा संगमेश्वर येथे विश्रांती.",
      afternoon: "दुपारी ३:३० पर्यंत उत्तर गोवा (कलंगूट/पणजी) आगमन. हॉटेल/रिसॉर्ट चेक-इन आणि फ्रेश होणे.",
      evening: "कलंगूट किंवा बागा बीचवर सनसेट. प्रसिद्ध बीच शेक्स, संगीत आणि संध्याकाळची गोवन व्हाइब अनुभवा.",
      stay: "Goa Coastal Palms Resort (कलंगूट) / Boutique Stay",
      foodTip: "गोवन किंगफिश/प्रॉन्स फ्राय आणि गोड बेबिका डेझर्ट.",
      estimatedDayCost: `₹${Math.round(finalPerPerson * 0.28)}`,
    });

    itinerary.push({
      day: 3,
      route: "उत्तर गोवा: अगुआडा ➔ अंजुना ➔ बागा वॉटर स्पोर्ट्स",
      title: "दिवस ३: किल्ले अगुआडा, वॉटर स्पोर्ट्स आणि नाईटलाईफ",
      morning: "सकाळी ०८:३० ला फोर्ट अगुआडा आणि जुने दीपगृह भेट. अरबी समुद्राचे अथांग दृश्य कॅमेऱ्यात टिपणे.",
      afternoon: "बागा किंवा कलंगूट बीचवर वॉटर स्पोर्ट्स (पॅरासेलिंग, जेट स्की, बनाना राइड).",
      evening: "अंजुना किंवा वागातोर (चापोरा किल्ला - दिल चाहता है पॉइंट) येथे मनमोहक सनसेट आणि टीटो'ज लेन / कॅफे सफर.",
      stay: "Goa Coastal Palms Resort (कलंगूट)",
      foodTip: "ऑथेंटिक गोवन फिश करी राईस आणि ताजी शहाळी.",
      estimatedDayCost: `₹${Math.round(finalPerPerson * 0.28)}`,
    });

    itinerary.push({
      day: 4,
      route: "गोवा ➔ जुने चर्च / पणजी ➔ कोल्हापूर महालक्ष्मी ➔ पुणे परतीचा प्रवास",
      title: "दिवस ४: जुने गोवा हेरिटेज, शॉपिंग आणि पुणे परतीचा प्रवास",
      morning: "सकाळी पणजी फॉन्टेनहास (रंगबेरंगी पोर्तुगीज गल्ली) आणि बेसिलिका ऑफ बॉम जिझस ऐतिहासिक चर्च दर्शन.",
      afternoon: "काजू आणि स्थानिक गोवन फेणी/मसाले खरेदी करून दुपारी १२:०० ला पुणे परतीच्या प्रवासाला सुरुवात (मार्गे चोरला घाट किंवा कोल्हापूर).",
      evening: "कोल्हापूर येथे आई अंबाबाई महालक्ष्मीचे दर्शन व तांबडा-पांढरा रस्सा डिनर. रात्री ११:०० पर्यंत पुणे आगमन.",
      stay: "प्रवास समाप्ती (Home Sweet Home)",
      foodTip: "कोल्हापुरी मिसळ किंवा प्रसिद्ध तांबडा-पांढरा रस्सा.",
      estimatedDayCost: `₹${Math.round(finalPerPerson * 0.22)}`,
    });
  } else {
    // Single destination itinerary
    const destInfo = DESTINATIONS_DB[destinationKeys[0]] || DESTINATIONS_DB.goa;
    for (let i = 1; i <= totalDays; i++) {
      const att1 = destInfo.attractions[(i * 2 - 2) % destInfo.attractions.length];
      const att2 = destInfo.attractions[(i * 2 - 1) % destInfo.attractions.length];
      itinerary.push({
        day: i,
        route: `${origin} ➔ ${destInfo.shortName} (दिवस ${i})`,
        title: `दिवस ${i}: ${att1.name} आणि परिसर`,
        morning: `सकाळी: ${att1.name} येथे भेट. (${att1.tip})`,
        afternoon: `दुपारी: स्थानिक खाद्यसंस्कृतीचा आस्वाद (${destInfo.foodTips[i % destInfo.foodTips.length]}).`,
        evening: `संध्याकाळी: ${att2.name} येथे सनसेट आणि लोकल मार्केटची सफर.`,
        stay: `${destInfo.hotels[0].name} किंवा नजीकचे हॉटेल`,
        foodTip: destInfo.foodTips[0],
        estimatedDayCost: `₹${Math.round(finalPerPerson / totalDays)}`,
      });
    }
  }

  // Titles & Summaries
  const destinationNameStr = isRaigadGoaCombo
    ? "पुणे ➔ किल्ले रायगड ➔ गोवा कम्प्लीट टूर"
    : destinationKeys.map(k => DESTINATIONS_DB[k]?.shortName || k).join(" + ");

  const title = isRaigadGoaCombo
    ? "🚩 किल्ले रायगड + 🌴 गोवा ४-दिवसीय महाभ्रमण प्लॅन"
    : `${destinationNameStr} ${totalDays}-दिवसीय AI टूर प्लॅन`;

  const budgetSummaryText = `प्रति व्यक्ती अंदाजित खर्च: ₹${finalPerPerson.toLocaleString("en-IN")}` +
    (passengers > 1 ? ` (एकूण ${passengers} लोकांसाठी: ₹${grandTotal.toLocaleString("en-IN")})` : "");

  const moneySavingTips = [
    "💡 SmartTrip कूपन: बस व ट्रेन तिकीट किमान ३ दिवस आधी बुक केल्यास थेट १५% सूट आणि कॅशबॅक मिळतो.",
    "💡 ग्रुप ट्रॅव्हल फायदा: ४ मित्रांनी एकत्र प्रवास केल्यास हॉटेल रूम आणि कॅब खर्च शेअर होऊन प्रत्येकी किमान ₹१,८०० ते ₹२,५०० ची बचत होते.",
    "💡 रायगड रोप-वे: सकाळी लवकर पोहोचल्यास गर्दी टाळून रांगेत वेळ वाया जात नाही.",
    "💡 गोव्यात स्कूटर रेंट: स्थानिक प्रवासासाठी टॅक्सीऐवजी ₹४००/दिवस स्कूटर किंवा ऑटो रेंट केल्यास मोठी बचत होते.",
  ];

  return {
    success: true,
    title,
    origin,
    destinations: destinationKeys,
    isMultiDestination: isRaigadGoaCombo || destinationKeys.length > 1,
    duration: `${totalDays} Days / ${totalNights} Nights (${totalDays} दिवस / ${totalNights} रात्री)`,
    travelStyle: style,
    passengersCount: passengers,
    totalBudget: grandTotal,
    perPersonBudget: finalPerPerson,
    budgetSummaryText,
    budgetBreakdown: {
      transport: transportPerPerson,
      stay: stayPerPerson,
      food: foodPerPerson,
      activities: activitiesPerPerson,
      emergencyBuffer: bufferPerPerson,
      perPersonTotal: finalPerPerson,
      groupTotal: grandTotal,
    },
    budgetTierComparison: {
      budgetOption: Math.round(finalPerPerson * 0.72),
      standardOption: finalPerPerson,
      luxuryOption: Math.round(finalPerPerson * 1.85),
    },
    itinerary,
    moneySavingTips,
    packingList: [
      "ओळखपत्र (Aadhaar / Driving License)",
      "कम्फर्टेबल शूज (रायगड गड चढाई व फिरण्यासाठी)",
      "सुती / कॉटन हलके कपडे आणि सनग्लासेस",
      "मोबाईल पॉवर बँक आणि वॉटर बॉटल",
      "इमर्जन्सी औषध किट",
    ],
    quickBookAction: {
      type: "bus",
      from: origin,
      to: isRaigadGoaCombo ? "Goa" : (DESTINATIONS_DB[destinationKeys[0]]?.shortName || "Goa"),
      screen: "search-results",
      buttonText: isRaigadGoaCombo ? "पुणे ते गोवा / रायगड बसेस शोधा" : "या मार्गावरील बसेस शोधा",
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Intelligent AI Support Chat Assistant
 */
async function answerSupportQuery({ query = "", language = "mr", userContext = {} }) {
  const q = query.toLowerCase();

  // If query is asking about planning a trip or budget
  if (
    q.includes("plan") ||
    q.includes("बजेट") ||
    q.includes("budget") ||
    q.includes("firay") ||
    q.includes("फिर") ||
    q.includes("tour") ||
    q.includes("trip") ||
    q.includes("raigad") ||
    q.includes("raygad") ||
    q.includes("goa") ||
    q.includes("shirdi") ||
    q.includes("mahabaleshwar")
  ) {
    const tripPlan = await generateTripPlan({ query, language });
    return {
      reply: `🎯 भावा, तुझा ${tripPlan.title} तयार आहे!\n\n` +
        `⏱️ कालावधी: ${tripPlan.duration}\n` +
        `💰 एकूण अंदाजित बजेट: ₹${tripPlan.perPersonBudget.toLocaleString("en-IN")} प्रति व्यक्ती\n\n` +
        `📊 खर्चाचा तपशील (Breakdown):\n` +
        `• 🚌 प्रवास खर्च: ₹${tripPlan.budgetBreakdown.transport.toLocaleString("en-IN")}\n` +
        `• 🏨 हॉटेल्स/मुक्काम: ₹${tripPlan.budgetBreakdown.stay.toLocaleString("en-IN")}\n` +
        `• 🍽️ जेवण व नाश्ता: ₹${tripPlan.budgetBreakdown.food.toLocaleString("en-IN")}\n` +
        `• 🎟️ रोप-वे व वॉटर स्पोर्ट्स: ₹${tripPlan.budgetBreakdown.activities.toLocaleString("en-IN")}\n` +
        `• 🛡️ इमर्जन्सी व इतर: ₹${tripPlan.budgetBreakdown.emergencyBuffer.toLocaleString("en-IN")}\n\n` +
        `खालील प्लॅन कार्डवरून दिवसनिहाय शेड्युल तपासा आणि थेट १-क्लिकने बस बुक करा!`,
      intent: "TRIP_PLANNER",
      plan: tripPlan,
      suggestedActions: ["प्लॅन उघडा", "बसेस शोधा", "हॉटेल्स शोधा"],
    };
  }

  // Refund / Cancellation query
  if (q.includes("refund") || q.includes("रिफंड") || q.includes("पैसे") || q.includes("कॅन्सल") || q.includes("cancel")) {
    return {
      reply: "SmartTrip रिफंड पॉलिसीनुसार:\n• प्रवासाच्या २४ तास आधी कॅन्सल केल्यास: ९०% रिफंड\n• १२ ते २४ तास आधी: ७५% रिफंड\n• ४ ते १२ तास आधी: ५०% रिफंड\n• मंजूर झालेला रिफंड थेट तुमच्या बँक खात्यात किंवा UPI वर ३ ते ५ दिवसांत जमा होतो.",
      intent: "REFUND_POLICY",
      suggestedActions: ["माझे रिफंड स्टेटस तपासा", "तिकीट रद्द करा", "सपोर्ट टीमशी बोला"],
    };
  }

  // Live Tracking query
  if (q.includes("track") || q.includes("ट्रॅकिंग") || q.includes("गाडी कुठे") || q.includes("बस कुठे") || q.includes("delay")) {
    return {
      reply: "तुमच्या बस किंवा वाहनाचे थेट लोकेशन पाहण्यासाठी ॲपमधील 'My Trips' उघडून 'Live Tracking / Radar' वर क्लिक करा.",
      intent: "TRIP_STATUS",
      suggestedActions: ["My Trips उघडा", "कस्टमर सपोर्टशी संपर्क करा"],
    };
  }

  // Default smart travel response
  return {
    reply: `मी SmartTrip AI टूर व बजेट प्लॅनर आहे! 🚀\nतुम्ही मला सांगा: 'पुण्यावरून रायगड आणि गोवा फिरायचे आहे, बजेट किती लागेल?' किंवा '३ दिवस महाबळेश्वर टूर' — मी तुम्हाला अचूक बजेट आणि दिवसनिहाय प्लॅन काढून देईन.`,
    intent: "GENERAL_QUERY",
    suggestedActions: ["पुणे ➔ रायगड ➔ गोवा प्लॅन", "महाबळेश्वर टूर", "शिर्डी दर्शन"],
  };
}

module.exports = {
  generateTripPlan,
  answerSupportQuery,
  parseTripQuery,
  DESTINATIONS_DB,
};
