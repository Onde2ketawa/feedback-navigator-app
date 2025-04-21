
export type Sentiment = "positive" | "neutral" | "negative";

// POSITIVE KEYWORDS
export const positiveKeywords = [
  // Bahasa Indonesia - Baku
  "mudah digunakan","cepat","aman","praktis","fitur lengkap","transaksi lancar","notifikasi real-time",
  "antarmuka intuitif","saldo akurat","layanan responsif",
  // Bahasa Indonesia - Slang
  "keren banget","gampang dipakai","nggak lemot","amanah","fiturnya oke punya","top-up cepet",
  "gak ribet","notifnya nyampe real-time","ui-nya user-friendly","cs-nya ramah",
  // English - Formal
  "user-friendly","fast transaction","secure","reliable","great features","smooth performance",
  "instant notification","easy navigation","good customer support","accurate balance",
  // English - Informal/Slang
  "super easy to use","super fast","no lag","super safe","features are lit","money transfer in a snap",
  "no hassle","notifications are on point","ui is clean","cs is helpful",
  // Category based positive
  "aman","secure","verifikasi dua langkah","2fa","transfer instan","instant transfer","cs ramah",
  "helpful support","aplikasi sering update","frequent updates"
];

// NEGATIVE KEYWORDS
export const negativeKeywords = [
  "error","lambat","sulit digunakan","tidak aman","aplikasi crash","transaksi gagal","verifikasi lama",
  "biaya tersembunyi","notifikasi telat","layanan tidak responsif",
  "lemot banget","error mulu","ribet login","kena charge nggak jelas","notif telat nyampe","cs-nya nyebelin",
  "gampang hang","kreditnya nggak cair-cair","aplikasi nge-freeze","banyak bug",
  "glitchy","slow processing","poor security","frequent crashes","transaction failed",
  "hidden fees","unresponsive support","confusing interface","login issues","delayed notifications",
  "so buggy","takes forever to load","keeps crashing","wtf, why so many fees","cs is useless",
  "can’t even log in","money got stuck","worst app ever","notifications mia","ui is a mess",
  "penipuan","fraud","gagal bayar","payment failed","respon lambat","slow response",
  "downtime lama","too much maintenance"
];

// NEUTRAL KEYWORDS
export const neutralKeywords = [
  "standar","biasa saja","cukup memadai","tidak ada masalah","sesuai ekspektasi",
  "lumayanlah","nggak jelek, nggak bagus","ya gitulah","standar aja","gak ada masalah sih",
  "average","nothing special","works fine","no major issues","meets expectations",
  "it’s okay, i guess","not bad, not great","does the job","meh","no complaints"
];

/**
 * Classic keywords logic (unchanged)
 */
export function analyzeSentiment(text: string, threshold = 0.2): { sentiment: Sentiment; sentiment_score: number } {
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;

  positiveKeywords.forEach((kw) => { if (lowerText.includes(kw)) pos++; });
  negativeKeywords.forEach((kw) => { if (lowerText.includes(kw)) neg++; });
  neutralKeywords.forEach((kw) => { if (lowerText.includes(kw)) neu++; });

  const total = pos + neg + neu;
  let score = 0;
  if (total > 0) {
    score = (pos - neg) / total;
  }

  let sentiment: Sentiment = "neutral";
  if (score > threshold) sentiment = "positive";
  else if (score < -threshold) sentiment = "negative";

  return { sentiment, sentiment_score: score };
}
