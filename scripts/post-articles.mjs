const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD. Provide both as environment variables.");
  process.exit(1);
}

const ARTICLES = [
  {
    headline: "India GDP grows 3 percent in Q4",
    headlineHindi: "भारत की GDP चौथी तिमाही में 3 प्रतिशत बढ़ी, अर्थव्यवस्था मजबूत",
    slug: "bharat-gdp-chauthi-timai-teen-pratishat-badhi",
    categorySlug: "national",
    body: `नई दिल्ली। भारत की अर्थव्यवस्था ने चौथी तिमाही में मजबूत प्रदर्शन किया है। सांख्यिकी मंत्रालय के ताजा आंकड़ों के अनुसार, देश की GDP में 3 प्रतिशत की वृद्धि दर्ज की गई है, जो विशेषज्ञों के अनुमान से अधिक है।

वित्त मंत्रालय के सूत्रों के अनुसार, यह वृद्धि मुख्य रूप से विनिर्माण और सेवा क्षेत्र में तेजी के कारण संभव हुई। कृषि क्षेत्र में भी स्थिरता बनी रही, जिससे ग्रामीण अर्थव्यवस्था को बल मिला।

अर्थशास्त्रियों का मानना है कि आने वाली तिमाहियों में भी भारतीय अर्थव्यवस्था की रफ्तार बनी रहेगी। सरकार ने बुनियादी ढांचे में निवेश बढ़ाने की योजना बनाई है, जिससे रोजगार सृजन में और तेजी आएगी।`,
  },
  {
    headline: "New expressway inaugurated connecting 5 states",
    headlineHindi: "पांच राज्यों को जोड़ने वाले नए एक्सप्रेसवे का उद्घाटन, यात्रा समय आधा होगा",
    slug: "panch-rajyon-ko-jodne-wala-naya-expressway-udghaatan",
    categorySlug: "national",
    body: `नई दिल्ली। देश के बुनियादी ढांचे को एक नई उड़ान मिली है। सरकार ने पांच राज्यों को जोड़ने वाले एक नए आधुनिक एक्सप्रेसवे का उद्घाटन किया, जिससे इन राज्यों के बीच यात्रा का समय लगभग आधा हो जाएगा।

इस एक्सप्रेसवे की कुल लंबाई 850 किलोमीटर है और इसे बनाने में करीब 35,000 करोड़ रुपये खर्च हुए हैं। यह परियोजना राष्ट्रीय राजमार्ग प्राधिकरण द्वारा तीन वर्षों में पूरी की गई है।

सड़क परिवहन मंत्री ने उद्घाटन के अवसर पर कहा कि यह एक्सप्रेसवे न केवल आम यात्रियों के लिए सुविधाजनक होगा, बल्कि माल परिवहन की लागत भी कम करेगा।`,
  },
  {
    headline: "India ranks 5th in global renewable energy",
    headlineHindi: "नवीकरणीय ऊर्जा में भारत पांचवें स्थान पर, सौर ऊर्जा में रिकॉर्ड उत्पादन",
    slug: "navikaraniya-urja-mein-bharat-paanchvein-sthan-par",
    categorySlug: "national",
    body: `नई दिल्ली। भारत ने नवीकरणीय ऊर्जा के क्षेत्र में एक बड़ी उपलब्धि हासिल की है। अंतर्राष्ट्रीय ऊर्जा एजेंसी की ताजा रिपोर्ट के अनुसार, भारत अब वैश्विक नवीकरणीय ऊर्जा उत्पादन में पांचवें स्थान पर पहुंच गया है।

देश में सौर ऊर्जा उत्पादन ने इस वर्ष रिकॉर्ड स्तर छू लिया है। राजस्थान, गुजरात और मध्य प्रदेश में स्थापित सौर पार्कों से रोजाना करोड़ों यूनिट बिजली का उत्पादन हो रहा है।

ऊर्जा मंत्रालय के सचिव ने बताया कि 2030 तक 500 गीगावाट नवीकरणीय ऊर्जा उत्पादन का लक्ष्य निर्धारित किया गया है।`,
  },
  {
    headline: "Parliament passes landmark education bill",
    headlineHindi: "संसद ने ऐतिहासिक शिक्षा विधेयक पास किया, सरकारी स्कूलों में बड़े बदलाव होंगे",
    slug: "sansad-ne-shiksha-vidheyak-pass-kiya-badlaav-honge",
    categorySlug: "politics",
    body: `नई दिल्ली। संसद के दोनों सदनों ने एक ऐतिहासिक शिक्षा विधेयक को मंजूरी दे दी है। इस विधेयक के तहत देशभर के सरकारी स्कूलों में बड़े बदलाव किए जाएंगे।

विधेयक के प्रमुख प्रावधानों में सरकारी स्कूलों में डिजिटल शिक्षा की सुविधा, शिक्षकों की नियमित ट्रेनिंग और छात्रों के लिए छात्रवृत्ति का विस्तार शामिल है।

शिक्षाविदों और अभिभावकों ने इस विधेयक का स्वागत किया है। उनका मानना है कि इससे सरकारी स्कूलों की स्थिति में सुधार होगा।`,
  },
  {
    headline: "Chief Ministers conference held on water crisis",
    headlineHindi: "जल संकट पर मुख्यमंत्रियों की बैठक, 10 राज्यों के लिए विशेष योजना घोषित",
    slug: "jal-sankat-par-mukhyamantriyon-ki-baithak-yojana",
    categorySlug: "politics",
    body: `नई दिल्ली। देश में बढ़ते जल संकट को देखते हुए प्रधानमंत्री ने सभी राज्यों के मुख्यमंत्रियों की एक उच्चस्तरीय बैठक बुलाई।

इस योजना के तहत 50,000 करोड़ रुपये की राशि अगले पांच वर्षों में जल संरक्षण और वितरण के बुनियादी ढांचे पर खर्च की जाएगी।

जल शक्ति मंत्री ने बताया कि हर घर जल योजना के तहत अब तक 12 करोड़ से अधिक परिवारों को नल से जल की सुविधा मिल चुकी है।`,
  },
  {
    headline: "New foreign policy initiative with 15 countries",
    headlineHindi: "15 देशों के साथ नई विदेश नीति पहल, भारत की कूटनीति को मिली नई ऊंचाई",
    slug: "15-deshon-ke-saath-nayi-videsh-niti-pahal-bharatiya-kutneeti",
    categorySlug: "politics",
    body: `नई दिल्ली। भारत ने अपनी विदेश नीति में एक नई पहल करते हुए 15 देशों के साथ व्यापार, रक्षा और सांस्कृतिक सहयोग के समझौते किए हैं।

इन समझौतों में एशिया, अफ्रीका और लैटिन अमेरिका के देश शामिल हैं। भारत ने इन देशों के साथ न केवल व्यापार बल्कि तकनीकी सहयोग और शिक्षा के क्षेत्र में भी साझेदारी बढ़ाने पर सहमति जताई है।

कूटनीतिक विशेषज्ञों का मानना है कि इन समझौतों से भारत की वैश्विक छवि और मजबूत होगी।`,
  },
  {
    headline: "Team India wins T20 series against Australia",
    headlineHindi: "टीम इंडिया ने ऑस्ट्रेलिया को 3-1 से हराया, विराट कोहली ने जड़ा शानदार अर्धशतक",
    slug: "team-india-ne-australia-ko-t20-mein-3-1-se-haraya",
    categorySlug: "sports",
    body: `मुंबई। टीम इंडिया ने ऑस्ट्रेलिया के खिलाफ पांच मैचों की T20 सीरीज में 3-1 की शानदार जीत दर्ज की।

भारतीय पारी की शुरुआत जोरदार रही। मध्य क्रम में विराट कोहली ने 48 गेंदों पर 67 रन की शानदार पारी खेली, जिसमें 6 चौके और 3 छक्के शामिल थे।

गेंदबाजी में जसप्रीत बुमराह ने 4 ओवरों में मात्र 18 रन देते हुए 3 विकेट लिए। इस जीत से भारत T20 रैंकिंग में दूसरे स्थान पर पहुंच गया है।`,
  },
  {
    headline: "Neeraj Chopra wins gold at Asian Athletics Championship",
    headlineHindi: "नीरज चोपड़ा ने एशियाई एथलेटिक्स चैंपियनशिप में स्वर्ण पदक जीता, 89.5 मीटर भाला फेंका",
    slug: "neeraj-chopra-ne-asiayi-championship-mein-swarn-padak-jeeta",
    categorySlug: "sports",
    body: `बैंकॉक। भारत के स्टार जेवलिन थ्रोअर नीरज चोपड़ा ने एशियाई एथलेटिक्स चैंपियनशिप में स्वर्ण पदक जीतकर देश का नाम रोशन किया। उन्होंने 89.5 मीटर भाला फेंककर पहला स्थान हासिल किया।

यह नीरज का इस चैंपियनशिप में लगातार तीसरा स्वर्ण पदक है।

खेल मंत्री ने नीरज को बधाई देते हुए कहा कि वे भारतीय युवाओं के लिए प्रेरणा हैं।`,
  },
  {
    headline: "Pro Kabaddi League Season 12 to begin next month",
    headlineHindi: "प्रो कबड्डी लीग का सीजन 12 अगले महीने शुरू होगा, 12 टीमें लेंगी भाग",
    slug: "pro-kabaddi-league-season-12-agale-mahine-shuru-hoga",
    categorySlug: "sports",
    body: `नई दिल्ली। प्रो कबड्डी लीग के 12वें सीजन की तारीखों का ऐलान कर दिया गया है। लीग का आगाज अगले महीने की 15 तारीख से होगा और इसमें देश की 12 टीमें भाग लेंगी।

इस सीजन में कुल 132 मैच खेले जाएंगे। मुंबई, दिल्ली, पटना, जयपुर, बेंगलुरु और चेन्नई में मैच होंगे।

कबड्डी फेडरेशन ऑफ इंडिया के अध्यक्ष ने कहा कि इस सीजन से प्रो कबड्डी लीग और अधिक लोकप्रिय होगी।`,
  },
  {
    headline: "Bollywood blockbuster crosses 500 crore in 2 weeks",
    headlineHindi: "बॉलीवुड की नई फिल्म ने 2 हफ्तों में 500 करोड़ की कमाई की, ऑस्कर की दौड़ में शामिल",
    slug: "bollywood-film-ne-2-hafte-mein-500-crore-kamai-oscar",
    categorySlug: "entertainment",
    body: `मुंबई। भारतीय सिनेमा ने एक नया कीर्तिमान स्थापित किया है। हाल ही में रिलीज हुई एक बड़ी बॉलीवुड फिल्म ने महज दो हफ्तों में 500 करोड़ रुपये की कमाई कर ली है।

फिल्म देश-विदेश में एक साथ रिलीज हुई थी और विदेशों में भी इसे जबरदस्त प्रतिक्रिया मिली है।

भारतीय फिल्म उद्योग की ओर से इस फिल्म को ऑस्कर के लिए भेजने की तैयारी भी की जा रही है।`,
  },
  {
    headline: "Popular OTT show gets season 2 after record viewership",
    headlineHindi: "रिकॉर्ड व्यूअरशिप के बाद लोकप्रिय OTT शो का सीजन 2 होगा, स्टार कास्ट बरकरार",
    slug: "ott-show-record-viewership-season-2-ki-ghoshna",
    categorySlug: "entertainment",
    body: `मुंबई। एक प्रमुख OTT प्लेटफॉर्म पर रिलीज हुई लोकप्रिय हिंदी वेब सीरीज ने रिकॉर्ड व्यूअरशिप हासिल की है। पहले सीजन को रिलीज के पहले हफ्ते में ही 5 करोड़ से अधिक बार देखा गया।

सीजन 2 में पुरानी स्टार कास्ट के साथ कुछ नए चेहरे भी जोड़े जाएंगे।

मनोरंजन उद्योग के जानकारों का कहना है कि OTT प्लेटफॉर्म पर हिंदी कंटेंट की मांग तेजी से बढ़ रही है।`,
  },
  {
    headline: "Iconic singer announces comeback concert tour",
    headlineHindi: "दिग्गज गायक ने कमबैक कॉन्सर्ट टूर का किया ऐलान, 10 शहरों में होगा शो",
    slug: "diggaj-gayak-ne-comeback-concert-tour-10-shahron-mein",
    categorySlug: "entertainment",
    body: `मुंबई। भारतीय संगीत जगत के एक दिग्गज गायक ने लंबे अंतराल के बाद कमबैक कॉन्सर्ट टूर की घोषणा की है।

यह टूर अगले महीने से शुरू होगा। मुंबई, दिल्ली, कोलकाता, चेन्नई, बेंगलुरु सहित 10 शहरों में कॉन्सर्ट होंगे। टिकट बुकिंग शुरू होते ही कुछ शहरों के शो हाउसफुल हो गए।

इस कॉन्सर्ट टूर के आयोजक ने बताया कि यह अब तक का सबसे बड़ा भारतीय म्यूजिक टूर होगा।`,
  },
  {
    headline: "Sensex crosses 85000 mark for first time",
    headlineHindi: "सेंसेक्स ने पहली बार 85000 का आंकड़ा पार किया, निवेशकों में उत्साह",
    slug: "sensex-ne-pahli-baar-85000-ka-aankda-para-kiya",
    categorySlug: "business",
    body: `मुंबई। भारतीय शेयर बाजार ने एक नया इतिहास रच दिया है। बीएसई का प्रमुख सूचकांक सेंसेक्स पहली बार 85,000 अंकों के पार चला गया।

बाजार में इस तेजी का मुख्य कारण विदेशी संस्थागत निवेशकों की बड़ी खरीदारी, मजबूत तिमाही नतीजे और सकारात्मक वैश्विक संकेत हैं।

विश्लेषकों का कहना है कि भारतीय अर्थव्यवस्था की मजबूत बुनियाद के कारण बाजार में यह तेजी आई है।`,
  },
  {
    headline: "Indian startup raises record 2 billion dollar funding",
    headlineHindi: "भारतीय स्टार्टअप ने 2 अरब डॉलर की रिकॉर्ड फंडिंग जुटाई, यूनिकॉर्न क्लब में शामिल",
    slug: "bharatiya-startup-ne-2-arab-dollar-ki-funding-jutayi",
    categorySlug: "business",
    body: `बेंगलुरु। एक भारतीय फिनटेक स्टार्टअप ने 2 अरब डॉलर की रिकॉर्ड फंडिंग जुटाई है और इसके साथ ही यह देश का सबसे मूल्यवान यूनिकॉर्न बन गया है।

कंपनी का मूल्यांकन अब 15 अरब डॉलर से अधिक हो गया है। इस फंडिंग से 5,000 नई नौकरियां भी पैदा होंगी।

उद्योग विशेषज्ञों का मानना है कि यह भारतीय स्टार्टअप इकोसिस्टम की परिपक्वता का संकेत है।`,
  },
  {
    headline: "RBI keeps repo rate unchanged, EMIs to stay stable",
    headlineHindi: "RBI ने रेपो रेट में कोई बदलाव नहीं किया, होम लोन और कार लोन की EMI स्थिर रहेगी",
    slug: "rbi-ne-repo-rate-mein-badlaav-nahi-kiya-emi-sthir",
    categorySlug: "business",
    body: `मुंबई। भारतीय रिजर्व बैंक ने अपनी मौद्रिक नीति समीक्षा में रेपो रेट को 6.5 प्रतिशत पर अपरिवर्तित रखने का फैसला किया है।

RBI के गवर्नर ने कहा कि महंगाई को नियंत्रण में रखना और आर्थिक वृद्धि को बनाए रखना दोनों प्राथमिकताएं हैं।

बैंकिंग विशेषज्ञों का मानना है कि आने वाले महीनों में ब्याज दरों में कमी हो सकती है, जिससे आम लोगों को और राहत मिलेगी।`,
  },
  {
    headline: "India launches domestic AI chip developed by IIT researchers",
    headlineHindi: "IIT के शोधकर्ताओं ने स्वदेशी AI चिप विकसित की, विदेशी चिप से 3 गुना तेज",
    slug: "iit-ne-swadeshi-ai-chip-viksit-ki-videshi-se-teen-guna-tez",
    categorySlug: "technology",
    body: `नई दिल्ली। भारतीय प्रौद्योगिकी संस्थान के शोधकर्ताओं ने एक स्वदेशी आर्टिफिशियल इंटेलिजेंस चिप विकसित की है जो मौजूदा विदेशी चिपों से तीन गुना अधिक तेज है।

इस चिप में 22 भारतीय भाषाओं को समझने और प्रोसेस करने की क्षमता है।

इलेक्ट्रॉनिक्स और IT मंत्री ने इस उपलब्धि पर शोधकर्ताओं को बधाई दी और कहा कि सरकार इस तकनीक को व्यावसायिक रूप देने के लिए पूरा समर्थन करेगी।`,
  },
  {
    headline: "Government launches free 5G broadband for rural India",
    headlineHindi: "सरकार ने ग्रामीण भारत के लिए मुफ्त 5G ब्रॉडबैंड योजना शुरू की, 1 लाख गांवों को फायदा",
    slug: "sarkar-ne-gramin-bharat-ke-liye-muft-5g-broadband-yojana-shuru",
    categorySlug: "technology",
    body: `नई दिल्ली। सरकार ने ग्रामीण भारत के एक लाख गांवों में मुफ्त 5G ब्रॉडबैंड सेवा शुरू करने की घोषणा की है।

संचार मंत्री ने बताया कि इस योजना से किसान मौसम की जानकारी, बाजार भाव और सरकारी योजनाओं का लाभ सीधे अपने मोबाइल पर ले सकेंगे।

इसे ग्रामीण डिजिटल क्रांति का दूसरा चरण माना जा रहा है।`,
  },
  {
    headline: "Indian app overtakes global competitor with 200 million users",
    headlineHindi: "भारतीय ऐप ने 20 करोड़ यूजर्स के साथ विदेशी प्रतिद्वंद्वी को पछाड़ा",
    slug: "bharatiya-app-ne-20-crore-users-ke-saath-videshi-pratidvandvi-pachhadaa",
    categorySlug: "technology",
    body: `बेंगलुरु। एक भारतीय ऐप ने 20 करोड़ से अधिक सक्रिय उपयोगकर्ताओं का आंकड़ा पार करते हुए अपने एक बड़े विदेशी प्रतिद्वंद्वी को पीछे छोड़ दिया है।

यह ऐप 15 भारतीय भाषाओं में उपलब्ध है, जिससे छोटे शहरों और गांवों के लोगों के बीच इसकी लोकप्रियता तेजी से बढ़ी है।

कंपनी के CEO ने कहा कि उनका लक्ष्य अगले एक वर्ष में 50 करोड़ यूजर्स तक पहुंचना है।`,
  },
  {
    headline: "IIT admissions to expand to 25000 seats from next year",
    headlineHindi: "IIT में अगले साल से 25000 सीटें होंगी, SC-ST-OBC को मिलेंगे अधिक अवसर",
    slug: "iit-mein-agale-saal-se-25000-seaten-hongi-sc-st-obc",
    categorySlug: "education",
    body: `नई दिल्ली। शिक्षा मंत्रालय ने घोषणा की है कि अगले शैक्षणिक वर्ष से IIT में कुल सीटें बढ़ाकर 25,000 की जाएंगी।

नए IIT परिसरों के निर्माण की भी घोषणा की गई है। पूर्वोत्तर भारत, जम्मू-कश्मीर और लद्दाख में नए IIT खोले जाएंगे।

JEE की तैयारी करने वाले छात्रों ने इस खबर का स्वागत किया है।`,
  },
  {
    headline: "CBSE introduces coding and AI as mandatory subjects from class 6",
    headlineHindi: "CBSE ने कक्षा 6 से कोडिंग और AI को अनिवार्य विषय बनाया",
    slug: "cbse-ne-class-6-se-coding-ai-anivarya-vishay-banaya",
    categorySlug: "education",
    body: `नई दिल्ली। केंद्रीय माध्यमिक शिक्षा बोर्ड ने कक्षा 6 से कोडिंग और आर्टिफिशियल इंटेलिजेंस को अनिवार्य विषय बना दिया है।

इस पहल के तहत सभी CBSE स्कूलों में कंप्यूटर लैब को अपग्रेड किया जाएगा। सरकार ने इसके लिए 2,000 करोड़ रुपये का बजट निर्धारित किया है।

शिक्षाविदों का मानना है कि यह कदम भारत के बच्चों को भविष्य की तकनीकी अर्थव्यवस्था के लिए तैयार करेगा।`,
  },
  {
    headline: "Scholarship scheme for 10 lakh students from poor families",
    headlineHindi: "गरीब परिवारों के 10 लाख छात्रों को मिलेगी छात्रवृत्ति, हर साल मिलेंगे 50 हजार रुपये",
    slug: "garib-parivaron-ke-10-lakh-chhatron-ko-milegi-chhatravritti",
    categorySlug: "education",
    body: `नई दिल्ली। सरकार ने एक महत्वाकांक्षी छात्रवृत्ति योजना की घोषणा की है जिसके तहत आर्थिक रूप से कमजोर परिवारों के 10 लाख मेधावी छात्रों को प्रतिवर्ष 50,000 रुपये की छात्रवृत्ति दी जाएगी।

जिन परिवारों की सालाना आय 3 लाख रुपये से कम है, उनके बच्चे इस योजना के पात्र होंगे।

छात्र संगठनों ने इस योजना का स्वागत किया है और कहा है कि यह सामाजिक न्याय की दिशा में एक महत्वपूर्ण कदम है।`,
  },
  {
    headline: "Yoga tourism boom with 5 million foreign visitors",
    headlineHindi: "योग पर्यटन में बूम, 50 लाख विदेशी पर्यटक आए भारत, ऋषिकेश सबसे लोकप्रिय",
    slug: "yoga-paryatan-mein-boom-50-lakh-videshi-paryatak-aaye-bharat",
    categorySlug: "lifestyle",
    body: `ऋषिकेश। भारत में योग पर्यटन ने एक नई ऊंचाई छू ली है। इस वर्ष 50 लाख से अधिक विदेशी पर्यटक योग और आध्यात्मिक अनुभव के लिए भारत आए हैं।

पर्यटन मंत्रालय के अनुसार, योग पर्यटन से देश को इस वर्ष 15,000 करोड़ रुपये की विदेशी मुद्रा प्राप्त हुई है।

विशेषज्ञों का कहना है कि अगले पांच वर्षों में योग पर्यटन और दोगुना हो सकता है।`,
  },
  {
    headline: "Millets declared superfood of the year, sales surge 300 percent",
    headlineHindi: "मिलेट्स को साल का सुपरफूड घोषित किया गया, बिक्री में 300 प्रतिशत की वृद्धि",
    slug: "millets-ko-saal-ka-superfood-ghoshit-kiya-gaya-bikri-300-pratishat",
    categorySlug: "lifestyle",
    body: `नई दिल्ली। भारत सरकार और विश्व स्वास्थ्य संगठन ने मिलेट्स को इस वर्ष का सुपरफूड घोषित किया है। इसके बाद से देशभर में मिलेट्स की बिक्री में 300 प्रतिशत की असाधारण वृद्धि हुई है।

पोषण विशेषज्ञों का कहना है कि मिलेट्स डायबिटीज, हृदय रोग और मोटापे की रोकथाम में बेहद प्रभावी हैं।

किसानों के लिए भी यह एक अच्छी खबर है — मिलेट्स की बढ़ती मांग से इन फसलों की कीमत बढ़ी है।`,
  },
  {
    headline: "Work from home policy becomes permanent at major Indian companies",
    headlineHindi: "बड़ी भारतीय कंपनियों में वर्क फ्रॉम होम स्थायी, कर्मचारियों की खुशी बढ़ी",
    slug: "work-from-home-policy-sthayi-badi-bharatiya-kampaniyon-mein",
    categorySlug: "lifestyle",
    body: `बेंगलुरु। भारत की 50 से अधिक प्रमुख कंपनियों ने वर्क फ्रॉम होम नीति को स्थायी रूप से लागू करने का निर्णय लिया है।

एक सर्वेक्षण के अनुसार, 78 प्रतिशत कर्मचारियों ने WFH नीति को पसंद किया है। महिला कर्मचारियों ने विशेष रूप से इसे परिवार और काम के बीच बेहतर संतुलन बनाने में सहायक पाया है।

रियल एस्टेट उद्योग पर इसका मिश्रित प्रभाव पड़ा है।`,
  },
];

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildLexicalBody(bodyText) {
  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

function excerptFromBody(bodyText) {
  return bodyText.replace(/\s+/g, " ").trim().slice(0, 160);
}

async function login() {
  const result = await request("/users/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  const token = result.data?.token;
  if (!result.ok || !token) {
    throw new Error(`Login failed: ${JSON.stringify(result.data)}`);
  }

  return token;
}

async function fetchCategories(token) {
  const result = await request("/categories?limit=100", { token });
  if (!result.ok) {
    throw new Error(`Failed to fetch categories: ${JSON.stringify(result.data)}`);
  }

  const map = new Map();
  for (const category of result.data?.docs || []) {
    if (category?.slug && category?.id) {
      map.set(category.slug, category.id);
    }
  }
  return map;
}

function buildArticlePayload(article, categoryId) {
  return {
    headline: article.headline,
    headlineHindi: article.headlineHindi,
    slug: article.slug,
    body: buildLexicalBody(article.body),
    category: categoryId,
    status: "published",
    _status: "published",
    publishDate: new Date().toISOString(),
    excerpt: excerptFromBody(article.body),
  };
}

async function fetchExistingArticles(token) {
  const result = await request("/articles?limit=100&depth=0", { token });
  if (!result.ok) {
    throw new Error(`Failed to fetch existing articles: ${JSON.stringify(result.data)}`);
  }

  const map = new Map();
  for (const article of result.data?.docs || []) {
    if (article?.slug && article?.id) {
      map.set(article.slug, article);
    }
  }
  return map;
}

async function updateArticle(existingArticle, article, categoryId, token) {
  const alreadyPublished = existingArticle.status === "published" && existingArticle._status === "published";
  if (alreadyPublished) {
    console.warn(`⚠️ Already published: ${article.slug}`);
    return { status: "skipped" };
  }

  const result = await request(`/articles/${existingArticle.id}`, {
    method: "PATCH",
    body: buildArticlePayload(article, categoryId),
    token,
  });

  if (result.ok) {
    console.log(`✅ Updated: ${article.slug}`);
    return { status: "success" };
  }

  if (result.status === 409 || result.status === 400) {
    console.warn(`⚠️ Skipped conflict/invalid article: ${article.slug}`);
    return { status: "skipped", error: result.data };
  }

  console.error(`❌ Failed: ${article.slug}`, result.data?.errors || result.data);
  return { status: "failed", error: result.data };
}

async function run() {
  console.log(`
📰 Updating article pack on ${BASE}
`);

  const token = await login();
  console.log("🔐 Logged in successfully");

  const categories = await fetchCategories(token);
  console.log(`📚 Loaded ${categories.size} categories`);

  const existingArticles = await fetchExistingArticles(token);
  console.log(`🗂️ Loaded ${existingArticles.size} existing articles`);

  let successCount = 0;
  let failedCount = 0;

  for (const article of ARTICLES) {
    const categoryId = categories.get(article.categorySlug);

    if (!categoryId) {
      failedCount += 1;
      console.error(`❌ Missing category for slug: ${article.categorySlug} (${article.slug})`);
      await sleep(300);
      continue;
    }

    const existingArticle = existingArticles.get(article.slug);
    if (!existingArticle) {
      failedCount += 1;
      console.error(`❌ Existing article not found for slug: ${article.slug}`);
      await sleep(300);
      continue;
    }

    const result = await updateArticle(existingArticle, article, categoryId, token);
    if (result.status === "success") {
      successCount += 1;
    } else if (result.status === "failed") {
      failedCount += 1;
    }

    await sleep(300);
  }

  console.log(`
📊 Summary: ${successCount} articles updated successfully, ${failedCount} failed
`);
}

run().catch((error) => {
  console.error("❌ Article posting failed", error);
  process.exit(1);
});
