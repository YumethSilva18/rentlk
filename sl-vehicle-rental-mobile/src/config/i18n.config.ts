// ============================================================================
// Internationalization Configuration
// Supports English, Sinhala, and Tamil
// ============================================================================

export type SupportedLanguage = 'en' | 'si' | 'ta';

export const i18nConfig = {
  defaultLanguage: 'en' as SupportedLanguage,
  supportedLanguages: [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'si' as const, name: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'ta' as const, name: 'Tamil', nativeName: 'தமிழ்' },
  ],
  fallbackLanguage: 'en' as SupportedLanguage,

  // Common translations (extend as needed)
  translations: {
    en: {
      app: {
        name: 'RentLK',
        tagline: 'Rent vehicles across Sri Lanka',
      },
      auth: {
        login: 'Sign In',
        signup: 'Create Account',
        logout: 'Logout',
        email: 'Email Address',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember me',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
      },
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        done: 'Done',
        next: 'Next',
        back: 'Back',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        noResults: 'No results found',
        seeAll: 'See All',
      },
      nav: {
        home: 'Home',
        bookings: 'Bookings',
        messages: 'Messages',
        profile: 'Profile',
      },
      kyc: {
        title: 'KYC Verification',
        pending: 'Verification Pending',
        approved: 'Verified',
        rejected: 'Verification Rejected',
        notStarted: 'Complete KYC to continue',
      },
      booking: {
        status: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          active: 'Active',
          completed: 'Completed',
          cancelled: 'Cancelled',
        },
      },
      payment: {
        methods: {
          payhere: 'PayHere',
          stripe: 'Credit/Debit Card',
          ezcash: 'EZ Cash',
          wallet: 'Wallet',
        },
      },
    },
    si: {
      app: {
        name: 'RentLK',
        tagline: 'ශ්‍රී ලංකාව පුරා වාහන කුලියට ගන්න',
      },
      auth: {
        login: 'පිවිසෙන්න',
        signup: 'ගිණුමක් සාදන්න',
        logout: 'පිටවන්න',
        email: 'ඊමේල් ලිපිනය',
        password: 'මුරපදය',
        forgotPassword: 'මුරපදය අමතකද?',
        rememberMe: 'මතක තබා ගන්න',
        noAccount: 'ගිණුමක් නැද්ද?',
        hasAccount: 'දැනටමත් ගිණුමක් තිබේද?',
        agreeTerms: 'මම සේවා නියමයන් සහ රහස්‍යතා ප්‍රතිපත්තියට එකඟ වෙමි',
      },
      common: {
        loading: 'පූරණය වෙමින්...',
        error: 'යම් දෝෂයක් සිදු විය',
        retry: 'නැවත උත්සාහ කරන්න',
        cancel: 'අවලංගු කරන්න',
        confirm: 'තහවුරු කරන්න',
        save: 'සුරකින්න',
        delete: 'මකන්න',
        edit: 'සංස්කරණය',
        done: 'අවසානයි',
        next: 'ඊළඟ',
        back: 'ආපසු',
        search: 'සොයන්න',
        filter: 'පෙරහන',
        sort: 'වර්ග කරන්න',
        noResults: 'ප්‍රතිඵල හමු නොවීය',
        seeAll: 'සියල්ල බලන්න',
      },
      nav: {
        home: 'මුල් පිටුව',
        bookings: 'වෙන් කිරීම්',
        messages: 'පණිවිඩ',
        profile: 'පැතිකඩ',
      },
      kyc: {
        title: 'KYC සත්‍යාපනය',
        pending: 'සත්‍යාපනය බලාපොරොත්තුවෙන්',
        approved: 'සත්‍යාපිතයි',
        rejected: 'සත්‍යාපනය ප්‍රතික්ෂේප විය',
        notStarted: 'ඉදිරියට යාමට KYC සම්පූර්ණ කරන්න',
      },
      booking: {
        status: {
          pending: 'බලාපොරොත්තුවෙන්',
          confirmed: 'තහවුරු කර ඇත',
          active: 'සක්‍රීයයි',
          completed: 'සම්පූර්ණයි',
          cancelled: 'අවලංගු කර ඇත',
        },
      },
      payment: {
        methods: {
          payhere: 'PayHere',
          stripe: 'ණය/ඩෙබිට් කාඩ්පත',
          ezcash: 'EZ Cash',
          wallet: 'පසුම්බිය',
        },
      },
    },
    ta: {
      app: {
        name: 'RentLK',
        tagline: 'இலங்கை முழுவதும் வாகனங்களை வாடகைக்கு எடுங்கள்',
      },
      auth: {
        login: 'உள்நுழைய',
        signup: 'கணக்கை உருவாக்கு',
        logout: 'வெளியேறு',
        email: 'மின்னஞ்சல் முகவரி',
        password: 'கடவுச்சொல்',
        forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
        rememberMe: 'என்னை நினைவில் வை',
        noAccount: 'கணக்கு இல்லையா?',
        hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
        agreeTerms: 'சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்',
      },
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'ஏதோ தவறு நடந்துவிட்டது',
        retry: 'மீண்டும் முயற்சி',
        cancel: 'ரத்துசெய்',
        confirm: 'உறுதிசெய்',
        save: 'சேமி',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        done: 'முடிந்தது',
        next: 'அடுத்து',
        back: 'பின்',
        search: 'தேடு',
        filter: 'வடிகட்டு',
        sort: 'வரிசைப்படுத்து',
        noResults: 'முடிவுகள் எதுவும் கிடைக்கவில்லை',
        seeAll: 'அனைத்தையும் பார்',
      },
      nav: {
        home: 'முகப்பு',
        bookings: 'முன்பதிவுகள்',
        messages: 'செய்திகள்',
        profile: 'சுயவிவரம்',
      },
      kyc: {
        title: 'KYC சரிபார்ப்பு',
        pending: 'சரிபார்ப்பு நிலுவையில்',
        approved: 'சரிபார்க்கப்பட்டது',
        rejected: 'சரிபார்ப்பு நிராகரிக்கப்பட்டது',
        notStarted: 'தொடர KYC-ஐ முடிக்கவும்',
      },
      booking: {
        status: {
          pending: 'நிலுவையில்',
          confirmed: 'உறுதிசெய்யப்பட்டது',
          active: 'செயலில்',
          completed: 'முடிந்தது',
          cancelled: 'ரத்துசெய்யப்பட்டது',
        },
      },
      payment: {
        methods: {
          payhere: 'PayHere',
          stripe: 'கிரெடிட்/டெபிட் கார்டு',
          ezcash: 'EZ Cash',
          wallet: 'பணப்பை',
        },
      },
    },
  },
} as const;

// Helper to get translation
export function t(
  lang: SupportedLanguage,
  path: string
): string {
  const keys = path.split('.');
  let result: any = i18nConfig.translations[lang];
  for (const key of keys) {
    result = result?.[key];
  }
  return result || path;
}
