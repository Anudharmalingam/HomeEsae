import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "welcome": "Find the Best Services Near You",
      "search_placeholder": "What service do you need?",
      "voice_search": "Use Voice",
      "login": "Login",
      "signup": "Sign Up",
      "services": {
        "maid": "Maid",
        "cook": "Cooking",
        "vessel_washing": "Vessel Washing",
        "laundry": "Dry Laundry",
        "painter": "Painter",
        "plumber": "Plumber",
        "electrician": "Electrician",
        "carpenter": "Carpenter",
        "appliances": "Appliances Repair"
      }
    }
  },
  ta: {
    translation: {
      "welcome": "உங்களுக்கு அருகிலுள்ள சிறந்த சேவைகளைக் கண்டறியவும்",
      "search_placeholder": "உங்களுக்கு என்ன சேவை தேவை?",
      "voice_search": "குரலை பயன்படுத்துக",
      "login": "உள்நுழைக",
      "signup": "பதிவு செய்க",
      "services": {
        "maid": "பணிப்பெண்",
        "cook": "சமையல்",
        "vessel_washing": "பாத்திரம் கழுவுதல்",
        "laundry": "சலவை",
        "painter": "பெயிண்டர்",
        "plumber": "குழாய் செய்பவர்",
        "electrician": "மின்சார நிபுணர்",
        "carpenter": "தச்சர்",
        "appliances": "வீட்டு உபயோகப் பொருட்கள் சரிபார்ப்பு"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
