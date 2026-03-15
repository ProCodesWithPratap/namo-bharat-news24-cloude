import { NAV_CATEGORIES } from "@/lib/utils";

const now = Date.now();

const makeArticle = (id: number, title: string, categorySlug: string, excerpt: string) => ({
  id: `mock-${id}`,
  slug: `mock-story-${id}`,
  headlineHindi: title,
  headline: title,
  excerpt,
  publishDate: new Date(now - id * 3600_000).toISOString(),
  updatedAt: new Date(now - id * 3000_000).toISOString(),
  category: NAV_CATEGORIES.find((c) => c.slug === categorySlug) || NAV_CATEGORIES[0],
  heroMedia: null,
  breakingNews: id % 5 === 0,
});

export const mockArticles = [
  makeArticle(1, "दिल्ली में प्रदूषण पर हाई-लेवल समीक्षा बैठक", "national", "केंद्र और राज्य एजेंसियों ने अगले 48 घंटे के लिए संयुक्त एक्शन प्लान जारी किया।"),
  makeArticle(2, "उत्तर प्रदेश में नई एक्सप्रेसवे परियोजना को मंजूरी", "states", "परियोजना से 8 जिलों में कनेक्टिविटी और औद्योगिक निवेश बढ़ने की उम्मीद।"),
  makeArticle(3, "संसद में आर्थिक सुधार बिल पर आज बहस", "politics", "विपक्ष और सरकार दोनों ने व्यापक चर्चा की मांग की है।"),
  makeArticle(4, "भारतीय टीम की सीरीज जीत, कप्तान ने दी प्रतिक्रिया", "sports", "रोमांचक मुकाबले में भारत ने अंतिम ओवर में जीत दर्ज की।"),
  makeArticle(5, "मनोरंजन जगत की बड़ी रिलीज़: दर्शकों में उत्साह", "entertainment", "वीकेंड बॉक्स ऑफिस पर कई फिल्मों की टक्कर देखने को मिलेगी।"),
  makeArticle(6, "टेक सेक्टर में नई भर्तियां, स्टार्टअप्स को राहत", "technology", "आईटी और एआई प्रोफाइल्स में अगले क्वार्टर तक भर्ती तेज रहने की संभावना।"),
  makeArticle(7, "शिक्षा नीति पर राज्यों के साथ समीक्षा बैठक", "education", "स्कूल इंफ्रास्ट्रक्चर और डिजिटल कंटेंट सुधार पर फोकस किया गया।"),
  makeArticle(8, "बाजार में तेजी, बैंकिंग और ऑटो शेयरों में उछाल", "business", "सेंसेक्स और निफ्टी दोनों ने सत्र के अंत में मजबूती के साथ बंद किया।"),
  makeArticle(9, "लाइफस्टाइल: सर्दियों में सेहतमंद रहने के आसान उपाय", "lifestyle", "विशेषज्ञों ने भोजन, व्यायाम और नींद की दिनचर्या पर जोर दिया।"),
  makeArticle(10, "राष्ट्रीय राजमार्गों पर सुरक्षा अभियान शुरू", "national", "त्योहारों के सीजन में दुर्घटनाएं रोकने के लिए संयुक्त मॉनिटरिंग बढ़ाई गई।"),
  makeArticle(11, "राज्य समाचार: बिहार में बाढ़ राहत कार्य तेज", "states", "प्रशासन ने प्रभावित इलाकों में मेडिकल और खाद्य सहायता बढ़ाई।"),
  makeArticle(12, "खेल अपडेट: एशियाई प्रतियोगिता में भारत का शानदार प्रदर्शन", "sports", "कई स्पर्धाओं में भारतीय खिलाड़ियों ने पदक पक्का किया।"),
];

export function getMockCategoryFeed(slug: string) {
  return mockArticles.filter((article) => article.category.slug === slug).slice(0, 4);
}
