/**
 * SmritiCare - Main Core JavaScript
 * Global State, LocalStorage Management, Multilingual Dictionary,
 * Accessibility Controller, Offline Sync Simulation & PWA Registration.
 */

// ==========================================
// 1. Initial State & Seed Data Initialization
// ==========================================
const SMRITI_STORAGE_KEYS = {
  CURRENT_USER: 'smriti_current_user',
  LANGUAGE: 'smriti_language',
  A11Y_SETTINGS: 'smriti_a11y',
  GAME_HISTORY: 'smriti_game_history',
  REMINDERS: 'smriti_reminders',
  TODAY_MOOD: 'smriti_today_mood',
  HYDRATION: 'smriti_hydration',
  PATIENTS_LIST: 'smriti_patients_list',
  PENDING_SYNC: 'smriti_pending_sync'
};

const DEFAULT_PATIENTS = [
  {
    id: 'p1',
    name: 'Mrs. Ananya Das',
    age: 72,
    location: 'Guwahati, Assam',
    cognitiveScore: 78,
    scores: { memory: 80, attention: 72, recognition: 84, routine: 69 },
    lastActive: 'Today, 10:42 AM',
    status: 'Normal',
    weeklyActivity: [72, 76, 81, 78, 83, 79, 84],
    streak: 5,
    gamesCompleted: 18,
    todayMood: '😊 Positive'
  },
  {
    id: 'p2',
    name: 'Mr. Rajesh Sharma',
    age: 68,
    location: 'Shillong, Meghalaya',
    cognitiveScore: 82,
    scores: { memory: 85, attention: 80, recognition: 86, routine: 78 },
    lastActive: 'Today, 09:15 AM',
    status: 'Normal',
    weeklyActivity: [80, 82, 85, 79, 81, 84, 82],
    streak: 7,
    gamesCompleted: 24,
    todayMood: '🙂 Calm'
  },
  {
    id: 'p3',
    name: 'Mrs. Bina Devi',
    age: 75,
    location: 'Imphal, Manipur',
    cognitiveScore: 61,
    scores: { memory: 58, attention: 62, recognition: 66, routine: 56 },
    lastActive: 'Yesterday',
    status: 'Attention',
    weeklyActivity: [68, 65, 63, 62, 60, 59, 61],
    streak: 2,
    gamesCompleted: 9,
    todayMood: '😟 Worried'
  },
  {
    id: 'p4',
    name: 'Mr. Lalthan Singh',
    age: 70,
    location: 'Aizawl, Mizoram',
    cognitiveScore: 74,
    scores: { memory: 75, attention: 71, recognition: 77, routine: 73 },
    lastActive: 'Today, 08:30 AM',
    status: 'Normal',
    weeklyActivity: [70, 71, 75, 73, 74, 76, 74],
    streak: 4,
    gamesCompleted: 15,
    todayMood: '😊 Positive'
  },
  {
    id: 'p5',
    name: 'Mrs. K. Sangma',
    age: 80,
    location: 'Tura, Meghalaya',
    cognitiveScore: 54,
    scores: { memory: 50, attention: 52, recognition: 58, routine: 55 },
    lastActive: '3 days ago',
    status: 'Attention',
    weeklyActivity: [60, 58, 55, 54, 50, 52, 54],
    streak: 0,
    gamesCompleted: 5,
    todayMood: '😔 Low'
  }
];

const DEFAULT_REMINDERS = [
  { id: 'r1', title: 'Blood Pressure Medicine (Amlodipine)', time: '09:00 AM', category: 'medicine', completed: true },
  { id: 'r2', title: 'Morning Glass of Water & Light Fruit', time: '10:30 AM', category: 'hydration', completed: true },
  { id: 'r3', title: 'Cognitive Brain Match Activity', time: '11:30 AM', category: 'activity', completed: false },
  { id: 'r4', title: 'Afternoon Vitamin D Supplement', time: '02:00 PM', category: 'medicine', completed: false },
  { id: 'r5', title: 'Evening Garden Walk', time: '05:00 PM', category: 'activity', completed: false },
  { id: 'r6', title: 'Night Calcium & Sleep Preparation', time: '08:30 PM', category: 'medicine', completed: false }
];

const DEFAULT_GAME_HISTORY = [
  { date: 'Today', game: 'Memory Match (Assam Flora)', score: 84, timeSec: 42, moves: 10, accuracy: 88, difficulty: 'Medium' },
  { date: 'Yesterday', game: 'Pattern Recognition', score: 78, timeSec: 50, moves: 14, accuracy: 80, difficulty: 'Easy' },
  { date: '2 days ago', game: 'Object Recognition (NER Crafts)', score: 86, timeSec: 38, moves: 8, accuracy: 92, difficulty: 'Medium' },
  { date: '3 days ago', game: 'Memory Match (Local Fruits)', score: 80, timeSec: 45, moves: 12, accuracy: 83, difficulty: 'Easy' }
];

// Initialize Storage if empty
function initializeStorage() {
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.PATIENTS_LIST)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.PATIENTS_LIST, JSON.stringify(DEFAULT_PATIENTS));
  }
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.REMINDERS)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
  }
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.GAME_HISTORY, JSON.stringify(DEFAULT_GAME_HISTORY));
  }
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.HYDRATION)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.HYDRATION, '4');
  }
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.TODAY_MOOD)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.TODAY_MOOD, '😊 Happy');
  }
  if (!localStorage.getItem(SMRITI_STORAGE_KEYS.PENDING_SYNC)) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.PENDING_SYNC, '0');
  }
}

// ==========================================
// 2. Multilingual Dictionary (NER Focus)
// ==========================================
const TRANSLATIONS = {
  en: {
    brand_name: "SmritiCare",
    tagline: "Helping memories stay connected.",
    nav_home: "Home",
    nav_games: "Games",
    nav_reminders: "Reminders",
    nav_caregiver: "Caregiver",
    nav_healthcare: "Healthcare",
    nav_login: "Login",
    hero_title: "A Smarter Way to Support Memory, Care & Connection",
    hero_subtitle: "An AI-powered cognitive assistance platform designed to help elderly individuals stay mentally active, emotionally connected, and supported in their daily lives.",
    btn_start_activity: "Start Brain Activity",
    btn_explore: "Explore Platform",
    greeting_morning: "Good Morning",
    greeting_afternoon: "Good Afternoon",
    greeting_evening: "Good Evening",
    patient_subgreeting: "Let's keep your mind active today.",
    todays_brain_activity: "Today's Brain Activity",
    btn_start: "Start",
    btn_play: "Play",
    btn_complete: "Mark Complete",
    hydration_title: "Hydration",
    drink_water: "Drink Water",
    glasses_label: "glasses",
    routine_title: "Today's Routine",
    voice_tap_speak: "Tap to Speak",
    voice_listening: "Listening... speak now",
    mood_question: "How are you feeling today?",
    mood_thank_you: "Thank you for sharing. You're doing well today! 🌟",
    offline_msg: "You are offline. Your activities are stored locally and will synchronize when connectivity returns.",
    sync_now: "Sync Now",
    sync_success: "Activities synchronized successfully! ☁️"
  },
  hi: {
    brand_name: "स्मृतिकेयर",
    tagline: "यादों को अपनों से जोड़े रखने का सहारा।",
    nav_home: "मुख्य पृष्ठ",
    nav_games: "मस्तिष्क खेल",
    nav_reminders: "स्मरण पत्र",
    nav_caregiver: "देखभालकर्ता",
    nav_healthcare: "स्वास्थ्य कर्मी",
    nav_login: "लॉग इन",
    hero_title: "स्मृति, देखभाल और आत्मीयता का सशक्त सहारा",
    hero_subtitle: "वरिष्ठ नागरिकों को मानसिक रूप से सक्रिय, भावनात्मक रूप से जुड़े और दैनिक जीवन में समर्थ बनाए रखने के लिए एआई-संचालित मंच।",
    btn_start_activity: "मस्तिष्क खेल शुरू करें",
    btn_explore: "मंच देखें",
    greeting_morning: "शुभ प्रभात",
    greeting_afternoon: "शुभ दोपहर",
    greeting_evening: "शुभ संध्या",
    patient_subgreeting: "आइए आज अपने मस्तिष्क को सक्रिय रखें।",
    todays_brain_activity: "आज की मस्तिष्क गतिविधि",
    btn_start: "शुरू करें",
    btn_play: "खेलें",
    btn_complete: "पूरा चिह्नित करें",
    hydration_title: "जलपान (पानी पिएं)",
    drink_water: "पानी पिएं",
    glasses_label: "गिलास",
    routine_title: "आज की दिनचर्या",
    voice_tap_speak: "बोलने के लिए दबाएं",
    voice_listening: "सुन रहे हैं... कृपया बोलें",
    mood_question: "आज आप कैसा महसूस कर रहे हैं?",
    mood_thank_you: "साझा करने के लिए धन्यवाद। आप बहुत अच्छा कर रहे हैं! 🌟",
    offline_msg: "आप ऑफ़लाइन हैं। आपकी गतिविधियां सुरक्षित हैं और नेटवर्क आने पर सिंक हो जाएंगी।",
    sync_now: "अभी सिंक करें",
    sync_success: "गतिविधियां सफलतापूर्वक सिंक हो गईं! ☁️"
  },
  bn: {
    brand_name: "স্মৃতिकेয়ার",
    tagline: "স্মৃতিগুলিকে সংযুক্ত রাখার বিশ্বস্ত সঙ্গী।",
    nav_home: "হোম",
    nav_games: "মস্তিষ্কের খেলা",
    nav_reminders: "অনুস্মারক",
    nav_caregiver: "সেবাকারী",
    nav_healthcare: "স্বাস্থ্যকর্মী",
    nav_login: "লগইন",
    hero_title: "স্মৃতি ও স্বাস্থ্য সেবায় একটি নতুন প্রযুক্তি",
    hero_subtitle: "বয়স্ক ব্যক্তিদের মানসিকভাবে সক্রিয় এবং দৈনন্দিন জীবনে স্বাবলম্বী রাখার জন্য এআই-চালিত ডিজিটাল প্ল্যাটফর্ম।",
    btn_start_activity: "খেলা শুরু করুন",
    btn_explore: "প্ল্যাটফর্মটি দেখুন",
    greeting_morning: "সুপ্রভাত",
    greeting_afternoon: "শুভ অপরাহ্ন",
    greeting_evening: "শুভ সন্ধ্যা",
    patient_subgreeting: "আসুন আজ মনকে সতেজ ও সক্রিয় রাখি।",
    todays_brain_activity: "আজকের মস্তিষ্কের অনুশীলন",
    btn_start: "শুরু করুন",
    btn_play: "খেলুন",
    btn_complete: "সম্পূর্ণ করুন",
    hydration_title: "জলপান",
    drink_water: "জল পান করুন",
    glasses_label: "গ্লাস",
    routine_title: "আজকের দিনলিপি",
    voice_tap_speak: "কথা বলতে চাপুন",
    voice_listening: "শুনছি... এখন কথা বলুন",
    mood_question: "আজ আপনার কেমন লাগছে?",
    mood_thank_you: "জানানোর জন্য ধন্যবাদ। আপনি খুব ভালো করছেন! 🌟",
    offline_msg: "আপনি অফলাইনে আছেন। আপনার ক্রিয়াকলাপ জমা হচ্ছে এবং সংযোগ পেলে ক্লাউডে সংরক্ষিত হবে।",
    sync_now: "এখনই সিঙ্ক করুন",
    sync_success: "ক্রিয়াকলাপ সফলভাবে সংরক্ষিত হয়েছে! ☁️"
  },
  as: {
    brand_name: "স্মৃতিকিয়াৰ",
    tagline: "স্মৃতিক সংযোগ কৰি ৰখাৰ সহজ মাধ্যম।",
    nav_home: "মূল পৃষ্ঠা",
    nav_games: "মগজুৰ খেল",
    nav_reminders: "সোঁৱৰণী",
    nav_caregiver: "যত্নশীল",
    nav_healthcare: "স্বাস্থ্যকৰ্মী",
    nav_login: "লগইন",
    hero_title: "স্মৃতি আৰু স্বাস্থ্যসেৱাৰ এক অভিনৱ পদক্ষেপ",
    hero_subtitle: "বয়োজ্যেষ্ঠ ব্যক্তিসকলৰ মানসিক সক্ৰিয়তা আৰু দৈনিক সহায়ৰ বাবে এআই-চালিত এক বিশ্বস্ত মঞ্চ।",
    btn_start_activity: "খেল আৰম্ভ কৰক",
    btn_explore: "প্লাটফৰ্ম চাওক",
    greeting_morning: "শুভ পুৱা",
    greeting_afternoon: "শুভ দুপৰীয়া",
    greeting_evening: "শুভ সন্ধিয়া",
    patient_subgreeting: "আহক আজি আপোনাৰ মগজুক সক্ৰিয় কৰি ৰাখোঁ।",
    todays_brain_activity: "আজিৰ মগজুৰ কাৰ্যসূচী",
    btn_start: "আৰম্ভ কৰক",
    btn_play: "খেলক",
    btn_complete: "সম্পূৰ্ণ হ'ল",
    hydration_title: "পানী খোৱা",
    drink_water: "পানী খাবলৈ পাহৰিব নালাগে",
    glasses_label: "গিলাচ",
    routine_title: "আজিৰ দৈনন্দিন ৰুটিন",
    voice_tap_speak: "কথা ক'বলৈ স্পৰ্শ কৰক",
    voice_listening: "শুনি আছোঁ... কওক",
    mood_question: "আজি আপোনাৰ মনটো কেনে লাগিছে?",
    mood_thank_you: "কোৱাৰ বাবে ধন্যবাদ। আপুনি অতি উত্তম কৰিছে! 🌟",
    offline_msg: "আপুনি অফলাইনত আছে। আপোনাৰ কামবোৰ সংৰক্ষণ কৰা হৈছে।",
    sync_now: "এতিয়াই সংমিশ্ৰণ কৰক",
    sync_success: "সফলভাৱে সংৰক্ষণ কৰা হ'ল! ☁️"
  },
  mni: {
    brand_name: "SmritiCare",
    tagline: "Ningsingba amadi anouba punsigi panggal.",
    nav_home: "Home",
    nav_games: "Games",
    nav_reminders: "Ningsinghanba",
    nav_caregiver: "Caregiver",
    nav_healthcare: "Healthcare",
    nav_login: "Login",
    hero_title: "Wakhal amadi ningsingbada mateng pangba AI platform",
    hero_subtitle: "Ahal oirabasinggi wakhal maru-oina kanba amadi nungtigi punsi yaifahanbada mateng pangba.",
    btn_start_activity: "Shannaba Houro",
    btn_explore: "Platform Yengbiyu",
    greeting_morning: "Ahaoba Ayuk",
    greeting_afternoon: "Ahaoba Nungthil",
    greeting_evening: "Ahaoba Numidang",
    patient_subgreeting: "Eikhoi ngasi wakhal chet-hankhisi.",
    todays_brain_activity: "Ngasigi Wakhal Shanna",
    btn_start: "Houro",
    btn_play: "Shannaro",
    btn_complete: "Loisire",
    hydration_title: "Eshing Thakpa",
    drink_water: "Eshing Thako",
    glasses_label: "glass",
    routine_title: "Ngasigi Thouram",
    voice_tap_speak: "Wa ngangnaba nammu",
    voice_listening: "Tariko... ngango",
    mood_question: "Ngasi pukning kamdouwi?",
    mood_thank_you: "Pao pibagidamak thagatchari! 🌟",
    offline_msg: "Offline oiri. Connection yauthaba matamda sync tourani.",
    sync_now: "Sync Touro",
    sync_success: "Pumnamak sync toure! ☁️"
  },
  kha: {
    brand_name: "SmritiCare",
    tagline: "Ban kynmaw bad pyniasoh ia ki jingmut.",
    nav_home: "Home",
    nav_games: "Jingialehkai",
    nav_reminders: "Jingpynkynmaw",
    nav_caregiver: "Nongsumar",
    nav_healthcare: "Healthcare",
    nav_login: "Login",
    hero_title: "Ka lad ba khraw ban sumar ia ka jingkynmaw",
    hero_subtitle: "Ka platform AI ban iarap ia ki tymmen ba kin im suk bad kynmaw ia ki kam.",
    btn_start_activity: "Sdang Jingialehkai",
    btn_explore: "Peit ia ka Platform",
    greeting_morning: "Kumno step",
    greeting_afternoon: "Kumno janmiet",
    greeting_evening: "Kumno miet",
    patient_subgreeting: "To ngin pynkhlain ia ka jingmut mynta.",
    todays_brain_activity: "Ka Kam Jingmut Mynta",
    btn_start: "Sdang",
    btn_play: "Ialehkai",
    btn_complete: "Lah Dep",
    hydration_title: "Dih Um",
    drink_water: "Dih Um",
    glasses_label: "khiew um",
    routine_title: "Ki Kam Mynta ka Sngi",
    voice_tap_speak: "Kren hangne",
    voice_listening: "Sngap... kren mynta",
    mood_question: "Kumno phi sngew mynta?",
    mood_thank_you: "Khublei shibun! Phi lah leh bha mynta. 🌟",
    offline_msg: "Phi don offline. Ki kam jong phi kin sync ynda don network.",
    sync_now: "Sync Mynta",
    sync_success: "Lah sync lut! ☁️"
  },
  mzo: {
    brand_name: "SmritiCare",
    tagline: "Hriatrengna vawnhimtu.",
    nav_home: "Home",
    nav_games: "Infiamna",
    nav_reminders: "Hriattirna",
    nav_caregiver: "Enkawltu",
    nav_healthcare: "Healthcare",
    nav_login: "Login",
    hero_title: "Tar te hriatrengna tanpuitu AI Platform",
    hero_subtitle: "Tar te rilru chak leh hrisel zawk neih theihna tura buatsaih.",
    btn_start_activity: "Tan Rawh",
    btn_explore: "Enchhin Rawh",
    greeting_morning: "Chibai zing",
    greeting_afternoon: "Chibai chhun",
    greeting_evening: "Chibai zan",
    patient_subgreeting: "Vawiin chu rilru tihharh nan i hmang ang u.",
    todays_brain_activity: "Vawiin Rilru Sawizawina",
    btn_start: "Tan Rawh",
    btn_play: "Khel Rawh",
    btn_complete: "Zo Ta",
    hydration_title: "Tui In",
    drink_water: "Tui In Rawh",
    glasses_label: "no",
    routine_title: "Vawiin Hun Duang",
    voice_tap_speak: "Tawng turin hmet rawh",
    voice_listening: "Ngaiithla mek... sawi rawh",
    mood_question: "Vawiin i rilru a nuam em?",
    mood_thank_you: "Ka lawm e! I ti tha hle mai. 🌟",
    offline_msg: "Offline i ni. Network awm hunah a in-sync ang.",
    sync_now: "Sync Rawh",
    sync_success: "Sync a hlawhtling e! ☁️"
  },
  nag: {
    brand_name: "SmritiCare",
    tagline: "Maan laga yaad bhal thakibo karne.",
    nav_home: "Home",
    nav_games: "Khel",
    nav_reminders: "Yaad Kariba",
    nav_caregiver: "Caregiver",
    nav_healthcare: "Healthcare",
    nav_login: "Login",
    hero_title: "Dimag aru yaad shakti bhal thakibo karne bhal upay",
    hero_subtitle: "Bura manu khan ke dimag bhal thakibo aru sahay pabo karne AI platform.",
    btn_start_activity: "Khel Shuru Kora",
    btn_explore: "Platform Sabo",
    greeting_morning: "Bhal Pua",
    greeting_afternoon: "Bhal Dupor",
    greeting_evening: "Bhal Sanj",
    patient_subgreeting: "Aji dimag teji koribo ahibi.",
    todays_brain_activity: "Aji Laga Dimag Khel",
    btn_start: "Shuru",
    btn_play: "Khelibi",
    btn_complete: "Khotom Hoise",
    hydration_title: "Pani Khawa",
    drink_water: "Pani Khabi",
    glasses_label: "glass",
    routine_title: "Aji Laga Kaam Khan",
    voice_tap_speak: "Kotha kobole dabao",
    voice_listening: "Huni ase... kotha kobo",
    mood_question: "Aji kineka lagise?",
    mood_thank_you: "Koishe karone shukriya! Bhal kori ase. 🌟",
    offline_msg: "Tumi offline ase. Net ahe time te sync hobo.",
    sync_now: "Sync Kora",
    sync_success: "Kaam shob sync hoise! ☁️"
  }
};

// Apply language to all elements with data-i18n
function setLanguage(langCode) {
  if (!TRANSLATIONS[langCode]) langCode = 'en';
  localStorage.setItem(SMRITI_STORAGE_KEYS.LANGUAGE, langCode);

  const dict = TRANSLATIONS[langCode];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Sync selector dropdowns if present
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = langCode;
  });
}

function getSavedLanguage() {
  return localStorage.getItem(SMRITI_STORAGE_KEYS.LANGUAGE) || 'en';
}

// ==========================================
// 3. Accessibility Engine (A11y)
// ==========================================
const A11Y = {
  getSettings() {
    const defaultSettings = {
      largeText: false,
      extraLargeText: false,
      highContrast: false,
      reduceMotion: false,
      voiceAssist: false
    };
    try {
      const stored = localStorage.getItem(SMRITI_STORAGE_KEYS.A11Y_SETTINGS);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(SMRITI_STORAGE_KEYS.A11Y_SETTINGS, JSON.stringify(settings));
    this.applySettings(settings);
  },

  applySettings(settings) {
    const body = document.body;
    if (!body) return;

    if (settings.extraLargeText) {
      body.classList.add('extra-large-text');
      body.classList.remove('large-text');
    } else if (settings.largeText) {
      body.classList.add('large-text');
      body.classList.remove('extra-large-text');
    } else {
      body.classList.remove('large-text', 'extra-large-text');
    }

    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    if (settings.reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }

    // Sync UI Checkboxes in A11y Panel
    const chkLarge = document.getElementById('a11y-chk-large-text');
    const chkContrast = document.getElementById('a11y-chk-contrast');
    const chkMotion = document.getElementById('a11y-chk-motion');
    const chkVoice = document.getElementById('a11y-chk-voice');

    if (chkLarge) chkLarge.checked = settings.largeText || settings.extraLargeText;
    if (chkContrast) chkContrast.checked = settings.highContrast;
    if (chkMotion) chkMotion.checked = settings.reduceMotion;
    if (chkVoice) chkVoice.checked = settings.voiceAssist;
  },

  togglePanel() {
    const panel = document.getElementById('a11y-panel');
    if (panel) {
      panel.classList.toggle('open');
    }
  }
};

// ==========================================
// 4. Offline / Online Connectivity Simulator
// ==========================================
function setupNetworkListeners() {
  function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const banner = document.getElementById('offline-banner');
    const statusPill = document.getElementById('network-status-pill');

    if (banner) {
      if (!isOnline) {
        banner.classList.add('active');
      } else {
        banner.classList.remove('active');
      }
    }

    if (statusPill) {
      if (isOnline) {
        statusPill.className = 'status-pill';
        statusPill.innerHTML = '<span class="status-dot"></span> 🟢 Online';
      } else {
        statusPill.className = 'status-pill offline';
        statusPill.innerHTML = '<span class="status-dot"></span> 🟠 Offline Mode';
      }
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

function simulateSync() {
  const pendingCount = parseInt(localStorage.getItem(SMRITI_STORAGE_KEYS.PENDING_SYNC) || '3', 10);
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0d7377;color:#fff;padding:12px 24px;border-radius:30px;font-weight:700;z-index:9999;box-shadow:0 8px 20px rgba(0,0,0,0.25);animation:modal-pop 0.3s ease;';
  toast.innerHTML = `✅ ${pendingCount > 0 ? pendingCount : 'All'} activities synchronized with Caregiver Cloud!`;
  document.body.appendChild(toast);

  localStorage.setItem(SMRITI_STORAGE_KEYS.PENDING_SYNC, '0');
  const syncCountEl = document.getElementById('sync-pending-count');
  if (syncCountEl) syncCountEl.textContent = '0';

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ==========================================
// 5. Speech Synthesis Helper
// ==========================================
function speakText(text, lang = 'en-IN') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Calm, deliberate pace for elderly
    utterance.pitch = 1.0;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }
}

// ==========================================
// 6. Navigation Active Link Helper
// ==========================================
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ==========================================
// 7. Global Initialization on DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  
  // Set saved language
  const savedLang = getSavedLanguage();
  setLanguage(savedLang);

  // Bind language selector changes
  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  });

  // Apply A11y settings
  A11Y.applySettings(A11Y.getSettings());

  // Setup A11y Drawer Controls
  const fab = document.getElementById('a11y-fab-btn');
  if (fab) {
    fab.addEventListener('click', () => A11Y.togglePanel());
  }

  const chkLarge = document.getElementById('a11y-chk-large-text');
  const chkContrast = document.getElementById('a11y-chk-contrast');
  const chkMotion = document.getElementById('a11y-chk-motion');

  if (chkLarge) {
    chkLarge.addEventListener('change', (e) => {
      const s = A11Y.getSettings();
      s.largeText = e.target.checked;
      A11Y.saveSettings(s);
    });
  }

  if (chkContrast) {
    chkContrast.addEventListener('change', (e) => {
      const s = A11Y.getSettings();
      s.highContrast = e.target.checked;
      A11Y.saveSettings(s);
    });
  }

  if (chkMotion) {
    chkMotion.addEventListener('change', (e) => {
      const s = A11Y.getSettings();
      s.reduceMotion = e.target.checked;
      A11Y.saveSettings(s);
    });
  }

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.querySelector('.main-navigation');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Network offline/online
  setupNetworkListeners();

  // Active navigation highlight
  highlightActiveNav();

  // Register PWA Service Worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('SmritiCare Service Worker Registered.'))
      .catch((err) => console.log('Service Worker setup skipped or offline:', err));
  }
});
