export const commonLanguageCode = ['ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'et', 'fi', 'fr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'] as const;

export type CommonLanguageCodeType = typeof commonLanguageCode[number];

export const sourceLanguageCode = [...commonLanguageCode, 'en', 'pt'] as const;

export type SourceLanguageCodeType = typeof sourceLanguageCode[number];

export const targetLanguageCode = [...commonLanguageCode, 'en-GB', 'en-US', 'pt-BR', 'pt-PT', 'zh-HANS', 'zh-HANT'] as const;

export type TargetLanguageCodeType = typeof targetLanguageCode[number];

export const languageNames: Record<string, string> = {
  ar: 'Arabic',
  bg: 'Bulgarian',
  cs: 'Czech',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  'en-GB': 'English (British)',
  'en-US': 'English (American)',
  es: 'Spanish',
  et: 'Estonian',
  fi: 'Finnish',
  fr: 'French',
  hu: 'Hungarian',
  id: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  nb: 'Norwegian (Bokmål)',
  nl: 'Dutch',
  pl: 'Polish',
  'pt-BR': 'Portuguese (Brazilian)',
  'pt-PT': 'Portuguese (Portugal)',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sv: 'Swedish',
  tr: 'Turkish',
  uk: 'Ukrainian',
  zh: 'Chinese',
  'zh-HANS': 'Chinese (Simplified)',
  'zh-HANT': 'Chinese (Traditional)',
}; 

export const tesseractLanguageCodeMap = {
  ar: 'ara',
  bg: 'bul',
  cs: 'ces',
  da: 'dan',
  de: 'deu',
  el: 'ell',
  es: 'spa',
  et: 'est',
  fi: 'fin',
  fr: 'fra',
  hu: 'hun',
  id: 'ind',
  it: 'ita',
  ja: 'jpn',
  ko: 'kor',
  lt: 'lit',
  lv: 'lav',
  nb: 'nor',
  nl: 'nld',
  pl: 'pol',
  ro: 'ron',
  ru: 'rus',
  sk: 'slk',
  sl: 'slv',
  sv: 'swe',
  tr: 'tur',
  uk: 'ukr',
  zh: 'chi_sim',
  en: 'eng',
  pt: 'por'
};

export const sourceLanguageOptions = sourceLanguageCode.map((o) => ({ code: o, label: languageNames[o] }));

export const targetLanguageOptions = targetLanguageCode.map((o) => ({ code: o, label: languageNames[o] }));
