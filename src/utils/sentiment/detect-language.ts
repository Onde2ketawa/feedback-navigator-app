
/**
 * Basic language detection function
 * Returns 'id' for Indonesian, 'en' for English, or 'other'
 */
export function detectLanguage(text: string): 'id' | 'en' | 'other' {
  if (!text) return 'en';

  const lowerText = text.toLowerCase();

  // Indonesian-specific words
  const idWords = [
    'yang','dengan','tidak','ini','dan','di','itu','untuk','adalah','ada',
    'pada','juga','dari','akan','bisa','dalam','oleh','saya','kamu','dia','mereka',
    'nya','gak','nggak','gak bisa','ga','gimana','kenapa','banget','sih','dong','mah',
    'aja','deh','kok','mau','udah','sudah','belum','jadi','kalo','kalau','sama','buat'
  ];

  // Count Indonesian words
  let idWordCount = 0;
  for (const word of idWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      idWordCount += matches.length;
    }
  }

  const wordCount = lowerText.split(/\s+/).length;

  // If more than 10% of words are Indonesian-specific, classify as Indonesian
  if (idWordCount / wordCount > 0.1) {
    return 'id';
  }

  // Default to English for now
  return 'en';
}
