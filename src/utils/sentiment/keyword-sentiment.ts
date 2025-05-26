
export type Sentiment = 'positive' | 'neutral' | 'negative';

// Enhanced keyword lists for Indonesian and English
export const positiveKeywords = [
  // Indonesian positive keywords
  'bagus', 'baik', 'suka', 'senang', 'mantap', 'keren', 'hebat', 'luar biasa',
  'memuaskan', 'sempurna', 'oke', 'ok', 'terima kasih', 'thanks', 'makasih',
  'puas', 'recommended', 'sukses', 'lancar', 'mudah', 'cepat', 'responsive',
  
  // English positive keywords
  'excellent', 'amazing', 'great', 'good', 'love', 'awesome', 'fantastic', 
  'wonderful', 'perfect', 'outstanding', 'brilliant', 'superb', 'nice',
  'satisfied', 'happy', 'pleased', 'impressed', 'recommend', 'helpful'
];

export const negativeKeywords = [
  // Indonesian negative keywords
  'buruk', 'jelek', 'tidak suka', 'kecewa', 'mengecewakan', 'lambat', 'lelet',
  'rusak', 'error', 'bermasalah', 'sulit', 'ribet', 'susah', 'payah', 'parah',
  'lemot', 'hang', 'lag', 'stuck', 'loading', 'tidak bisa', 'gabisa',
  
  // English negative keywords
  'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 
  'slow', 'broken', 'useless', 'frustrating', 'annoying', 'confusing',
  'difficult', 'hard', 'impossible', 'crash', 'freeze', 'stuck', 'failed'
];

export const neutralKeywords = [
  // Indonesian neutral keywords
  'standar', 'biasa saja', 'cukup memadai', 'tidak ada masalah', 'sesuai ekspektasi',
  'lumayanlah', 'nggak jelek, nggak bagus', 'ya gitulah', 'standar aja', 'gak ada masalah sih',
  
  // English neutral keywords
  'average', 'nothing special', 'works fine', 'no major issues', 'meets expectations',
  'it\'s okay, i guess', 'not bad, not great', 'does the job', 'meh', 'no complaints'
];
