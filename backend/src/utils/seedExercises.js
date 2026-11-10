// Run with: node src/utils/seedExercises.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Exercise = require("../models/Exercise");

const sampleExercises = [
  // ==========================================
  // ENGLISH (EN) CURRICULUM & CONVERSATIONS
  // ==========================================
  // Unit 1: Foundations & Greetings
  {
    title: "Basic Greeting",
    type: "sentence",
    category: "greetings",
    language: "en",
    targetText: "Hello, how are you doing today?",
    translation: "Hello, how are you doing today?",
    phonetic: "heh-LOH, how ahr yoo DOO-ing tuh-DAY",
    difficulty: "beginner",
  },
  {
    title: "Polite Pleasantries",
    type: "sentence",
    category: "greetings",
    language: "en",
    targetText: "Good morning! It is wonderful to see you.",
    translation: "Good morning! It is wonderful to see you.",
    phonetic: "good MOR-ning, it iz WUN-der-ful too SEE yoo",
    difficulty: "beginner",
  },
  {
    title: "Expressing Gratitude",
    type: "sentence",
    category: "greetings",
    language: "en",
    targetText: "Thank you so much for your kind support.",
    translation: "Thank you so much for your kind support.",
    phonetic: "THANK yoo soh much for yoor kynd suh-PORT",
    difficulty: "beginner",
  },

  // Unit 2: Introductions
  {
    title: "Introducing Yourself",
    type: "sentence",
    category: "introductions",
    language: "en",
    targetText: "Hi, my name is Alex and I am happy to meet you.",
    translation: "Hi, my name is Alex and I am happy to meet you.",
    phonetic: "hy, my naym iz AL-eks and eye am HAP-ee too meet yoo",
    difficulty: "beginner",
  },
  {
    title: "Sharing Your Hometown",
    type: "sentence",
    category: "introductions",
    language: "en",
    targetText: "I am originally from Chicago, but I live here now.",
    translation: "I am originally from Chicago, but I live here now.",
    phonetic: "eye am uh-RIJ-uh-nul-ee frum shih-KAH-goh, but eye liv heer now",
    difficulty: "intermediate",
  },

  // Unit 3: Cafe & Dining Conversations
  {
    title: "Ordering Coffee",
    type: "sentence",
    category: "cafe-dining",
    language: "en",
    targetText: "I would like a warm cup of coffee with oat milk, please.",
    translation: "I would like a warm cup of coffee with oat milk, please.",
    phonetic: "eye wood lyk uh worm kup uv KOF-ee with oht milk, pleez",
    difficulty: "intermediate",
  },
  {
    title: "Asking for the Bill",
    type: "dialogue",
    category: "cafe-dining",
    language: "en",
    dialoguePrompt: "Waiter: Did you enjoy your meal tonight?",
    targetText: "Yes, everything was delicious. Could we please have the bill?",
    translation: "Yes, everything was delicious. Could we please have the bill?",
    phonetic: "yes, EV-ree-thing wuz dih-LISH-us. kood wee pleez hav thuh bil?",
    difficulty: "intermediate",
  },

  // Unit 4: Directions & Getting Around
  {
    title: "Asking for Directions",
    type: "dialogue",
    category: "directions",
    language: "en",
    dialoguePrompt: "Local: Can I help you find something?",
    targetText: "Excuse me, where is the nearest subway station?",
    translation: "Excuse me, where is the nearest subway station?",
    phonetic: "ek-SKYOOZ mee, wear iz thuh NEER-est SUB-way STAY-shun?",
    difficulty: "intermediate",
  },

  // Unit 5: Tongue Twisters & Articulation Masters
  {
    title: "Tongue Twister: S-Sound Seashells",
    type: "sentence",
    category: "tongue-twisters",
    language: "en",
    targetText: "She sells seashells by the seashore.",
    translation: "She sells seashells by the seashore.",
    phonetic: "shee selz SEE-shelz by thuh SEE-shor",
    difficulty: "intermediate",
  },
  {
    title: "Tongue Twister: Rubber Buggy",
    type: "sentence",
    category: "tongue-twisters",
    language: "en",
    targetText: "Rubber baby buggy bumpers bounce brightly.",
    translation: "Rubber baby buggy bumpers bounce brightly.",
    phonetic: "RUB-er BAY-bee BUG-ee BUMP-erz bowns BRYT-lee",
    difficulty: "advanced",
  },

  // Unit 6: Real-World Conversation Dialogue
  {
    title: "Making Weekend Plans",
    type: "dialogue",
    category: "conversation",
    language: "en",
    dialoguePrompt: "Friend: What are you planning to do this weekend?",
    targetText: "I am going to visit the art museum on Saturday morning.",
    translation: "I am going to visit the art museum on Saturday morning.",
    phonetic: "eye am GOH-ing too VIZ-it thuh ahrt myoo-ZEE-um on SAT-er-day MOR-ning",
    difficulty: "intermediate",
  },

  // ==========================================
  // SPANISH (ES) CURRICULUM & CONVERSATIONS
  // ==========================================
  // Unit 1: Foundations & Greetings
  {
    title: "Saludo Básico (Basic Greeting)",
    type: "sentence",
    category: "greetings",
    language: "es",
    targetText: "Hola, ¿cómo estás hoy?",
    translation: "Hello, how are you today?",
    phonetic: "OH-lah, KOH-moh ess-TAHS oy?",
    difficulty: "beginner",
  },
  {
    title: "Buenos Días (Good Morning)",
    type: "sentence",
    category: "greetings",
    language: "es",
    targetText: "Buenos días, mucho gusto en saludarte.",
    translation: "Good morning, nice to greet you.",
    phonetic: "BWAY-nohs DEE-ahs, MOO-choh GOOS-toh en sah-loo-DAR-teh.",
    difficulty: "beginner",
  },
  {
    title: "Por Favor y Gracias (Please & Thanks)",
    type: "sentence",
    category: "greetings",
    language: "es",
    targetText: "Muchas gracias por tu valiosa ayuda.",
    translation: "Thank you very much for your valuable help.",
    phonetic: "MOO-chahs GRAH-syahs por too vah-LYOH-sah ah-YOO-dah.",
    difficulty: "beginner",
  },

  // Unit 2: Introductions & Origin
  {
    title: "Presentarse (Introducing Yourself)",
    type: "sentence",
    category: "introductions",
    language: "es",
    targetText: "Hola, me llamo Carlos y estoy encantado de conocerte.",
    translation: "Hello, my name is Carlos and I am delighted to meet you.",
    phonetic: "OH-lah, meh YAH-moh KAR-lohs ee ess-TOY en-kahn-TAH-doh deh koh-noh-SEHR-teh.",
    difficulty: "beginner",
  },
  {
    title: "¿De Dónde Eres? (Where Are You From?)",
    type: "dialogue",
    category: "introductions",
    language: "es",
    dialoguePrompt: "Duo: ¿De dónde eres tú?",
    targetText: "Soy de México y me encanta aprender idiomas.",
    translation: "I am from Mexico and I love learning languages.",
    phonetic: "soy deh MEH-hee-koh ee meh en-KAHN-tah ah-pren-DEHR ee-DYOH-mahs.",
    difficulty: "intermediate",
  },

  // Unit 3: En el Café (Cafe & Dining)
  {
    title: "Pedir un Café (Ordering a Coffee)",
    type: "dialogue",
    category: "cafe-dining",
    language: "es",
    dialoguePrompt: "Camarero: ¿Qué le gustaría tomar?",
    targetText: "Quisiera un café con leche y un vaso de agua, por favor.",
    translation: "I would like a coffee with milk and a glass of water, please.",
    phonetic: "kee-SYEH-rah oon kah-FEH kohn LEH-cheh ee oon VAH-soh deh AH-gwah, por fah-VOR.",
    difficulty: "intermediate",
  },
  {
    title: "La Cuenta (The Bill)",
    type: "dialogue",
    category: "cafe-dining",
    language: "es",
    dialoguePrompt: "Camarero: ¿Desean algo más de postre?",
    targetText: "No gracias, ¿nos puede traer la cuenta, por favor?",
    translation: "No thank you, could you bring us the bill, please?",
    phonetic: "noh GRAH-syahs, nohs PWEH-deh trah-EHR lah KWEHN-tah, por fah-VOR?",
    difficulty: "intermediate",
  },

  // Unit 4: Direcciones (Directions & City)
  {
    title: "Buscar la Estación (Finding the Station)",
    type: "dialogue",
    category: "directions",
    language: "es",
    dialoguePrompt: "Transeúnte: ¿Necesitas ayuda para encontrar un lugar?",
    targetText: "Disculpe, ¿dónde está la estación de metro más cercana?",
    translation: "Excuse me, where is the nearest metro station?",
    phonetic: "dees-KOOL-peh, DOHN-deh ess-TAH lah ess-tah-SYOHN deh MEH-troh mahs sehr-KAH-nah?",
    difficulty: "intermediate",
  },

  // Unit 5: Trabalenguas (Tongue Twisters & Rolling R)
  {
    title: "Trabalenguas: Erre con Erre",
    type: "sentence",
    category: "tongue-twisters",
    language: "es",
    targetText: "Erre con erre guitarra, erre con erre barril.",
    translation: "R with R guitar, R with R barrel.",
    phonetic: "EHR-reh kohn EHR-reh gee-TAHR-rah, EHR-reh kohn EHR-reh bah-REEL.",
    difficulty: "advanced",
  },
  {
    title: "Trabalenguas: Tres Tristes Tigres",
    type: "sentence",
    category: "tongue-twisters",
    language: "es",
    targetText: "Tres tristes tigres tragaban trigo en un trigal.",
    translation: "Three sad tigers were swallowing wheat in a wheat field.",
    phonetic: "trehs TREES-tehs TEE-grehs trah-GAH-bahn TREE-goh en oon tree-GAHL.",
    difficulty: "advanced",
  },

  // ==========================================
  // FRENCH (FR) CURRICULUM & CONVERSATIONS
  // ==========================================
  // Unit 1: Foundations & Greetings
  {
    title: "Salutation de Base (Basic Greeting)",
    type: "sentence",
    category: "greetings",
    language: "fr",
    targetText: "Bonjour, comment allez-vous aujourd'hui?",
    translation: "Hello, how are you today?",
    phonetic: "bon-ZHOOR, koh-mahn tah-lay VOO oh-zhoor-DWEE?",
    difficulty: "beginner",
  },
  {
    title: "Formules de Politesse (Polite Expressions)",
    type: "sentence",
    category: "greetings",
    language: "fr",
    targetText: "S'il vous plaît et merci beaucoup pour votre aide.",
    translation: "Please and thank you very much for your help.",
    phonetic: "seel voo PLEH ay mehr-SEE boh-KOO poor vohtr EHD.",
    difficulty: "beginner",
  },

  // Unit 2: Introductions
  {
    title: "Se Présenter (Introducing Yourself)",
    type: "sentence",
    category: "introductions",
    language: "fr",
    targetText: "Je m'appelle Thomas et je suis très heureux de vous rencontrer.",
    translation: "My name is Thomas and I am very happy to meet you.",
    phonetic: "zhuh mah-PEL toh-MAH ay zhuh swee tray zew-RUH duh voo rahn-kohn-TRAY.",
    difficulty: "intermediate",
  },

  // Unit 3: Au Café (At the Cafe)
  {
    title: "Commander un Café (Ordering at a French Cafe)",
    type: "dialogue",
    category: "cafe-dining",
    language: "fr",
    dialoguePrompt: "Serveur: Bonjour, qu'est-ce qui vous ferait plaisir?",
    targetText: "Bonjour, je voudrais un croissant et un café au lait, s'il vous plaît.",
    translation: "Hello, I would like a croissant and a coffee with milk, please.",
    phonetic: "bon-ZHOOR, zhuh voo-DREH oon krwah-SAHN ay oon kah-FAY oh LEH, seel voo PLEH.",
    difficulty: "intermediate",
  },
  {
    title: "Demander l'Addition (Asking for the Bill)",
    type: "dialogue",
    category: "cafe-dining",
    language: "fr",
    dialoguePrompt: "Serveur: Avez-vous terminé votre repas?",
    targetText: "Oui, c'était délicieux! L'addition, s'il vous plaît.",
    translation: "Yes, it was delicious! The bill, please.",
    phonetic: "wee, say-TEH day-lee-SYUH! lah-dee-SYOHN, seel voo PLEH.",
    difficulty: "intermediate",
  },

  // Unit 4: Demander son Chemin (Directions)
  {
    title: "Où est la Gare? (Where is the Station?)",
    type: "dialogue",
    category: "directions",
    language: "fr",
    dialoguePrompt: "Passant: Vous cherchez quelque chose?",
    targetText: "Pardonnez-moi, où se trouve la station de métro la plus proche?",
    translation: "Pardon me, where is the nearest metro station?",
    phonetic: "par-doh-NAY mwah, oo suh TROOV lah stah-SYOHN duh may-TROH lah ploo PROHSH?",
    difficulty: "intermediate",
  },

  // Unit 5: Virelangues (French Tongue Twisters)
  {
    title: "Virelangue: Les Chaussettes de l'Archiduchesse",
    type: "sentence",
    category: "tongue-twisters",
    language: "fr",
    targetText: "Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches?",
    translation: "Are the archduchess's socks dry, very dry?",
    phonetic: "lay shoh-SET duh lar-shee-doo-SHES sohn-TELL SESH, ar-shee-SESH?",
    difficulty: "advanced",
  },

  // ==========================================
  // GERMAN (DE) CURRICULUM & CONVERSATIONS
  // ==========================================
  // Unit 1: Foundations & Greetings
  {
    title: "Begrüßung (Greeting)",
    type: "sentence",
    category: "greetings",
    language: "de",
    targetText: "Guten Tag! Wie geht es Ihnen heute?",
    translation: "Good day! How are you today?",
    phonetic: "GOO-ten TAHK! vee GAYT es EE-nen HOY-tuh?",
    difficulty: "beginner",
  },
  {
    title: "Sich Vorstellen (Introducing Yourself)",
    type: "sentence",
    category: "introductions",
    language: "de",
    targetText: "Hallo, mein Name ist Lukas und ich freue mich, Sie kennenzulernen.",
    translation: "Hello, my name is Lukas and I am pleased to meet you.",
    phonetic: "HAH-loh, myn NAH-muh ist LOO-kas oont ikh FROY-uh mikh, zee KEN-en-tsoo-lehr-nen.",
    difficulty: "beginner",
  },
  {
    title: "Im Café Bestellen (Ordering in German)",
    type: "dialogue",
    category: "cafe-dining",
    language: "de",
    dialoguePrompt: "Kellner: Was darf ich Ihnen bringen?",
    targetText: "Ich hätte gerne einen Kaffee mit Hafermilch und ein Wasser, bitte.",
    translation: "I would like a coffee with oat milk and a water, please.",
    phonetic: "ikh HET-tuh GEHR-nuh EYE-nen KAH-fay mit HAH-fer-milkh oont eyn VAH-ser, BIH-tuh.",
    difficulty: "intermediate",
  },
  {
    title: "Nach dem Weg Fragen (Directions in German)",
    type: "dialogue",
    category: "directions",
    language: "de",
    dialoguePrompt: "Passant: Kann ich Ihnen helfen?",
    targetText: "Entschuldigung, wo ist der nächste Bahnhof?",
    translation: "Excuse me, where is the nearest train station?",
    phonetic: "ent-SHOOL-dee-goong, voh ist dehr NEKH-stuh BAHN-hohf?",
    difficulty: "intermediate",
  },
  {
    title: "Zungenbrecher (Tongue Twister)",
    type: "sentence",
    category: "tongue-twisters",
    language: "de",
    targetText: "Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.",
    translation: "Fisherman Fritz fishes fresh fish, fresh fish fishes Fisherman Fritz.",
    phonetic: "FISH-erz frits fisht FRISH-uh FISH-uh, FRISH-uh FISH-uh fisht FISH-erz frits.",
    difficulty: "advanced",
  },

  // ==========================================
  // HINDI (HI) CURRICULUM & CONVERSATIONS
  // ==========================================
  // Unit 1: Foundations & Greetings
  {
    title: "नमस्ते (Namaste Greeting)",
    type: "sentence",
    category: "greetings",
    language: "hi",
    targetText: "नमस्ते, आज आप कैसे हैं?",
    translation: "Hello, how are you today?",
    phonetic: "nuh-muh-STAY, aaj aap KAI-say hain?",
    difficulty: "beginner",
  },
  {
    title: "अपना परिचय (Introducing Yourself)",
    type: "sentence",
    category: "introductions",
    language: "hi",
    targetText: "मेरा नाम राहुल है और आपसे मिलकर बहुत खुशी हुई।",
    translation: "My name is Rahul and I am very happy to meet you.",
    phonetic: "MAY-rah naam RAA-hool hai aur AAP-say MIL-kar bahoot KHOO-shee hoo-ee.",
    difficulty: "beginner",
  },
  {
    title: "चाय मंगाना (Ordering Tea / Cafe)",
    type: "dialogue",
    category: "cafe-dining",
    language: "hi",
    dialoguePrompt: "दुकानदार: आपको क्या चाहिए?",
    targetText: "कृपया मुझे एक कप गर्म अदरक वाली चाय दीजिए।",
    translation: "Please give me a cup of warm ginger tea.",
    phonetic: "krip-YAH MOO-jhay ek kup GARM UD-ruk VAH-lee CHAI dee-jee-ye.",
    difficulty: "intermediate",
  },
  {
    title: "रास्ता पूछना (Asking for Directions)",
    type: "dialogue",
    category: "directions",
    language: "hi",
    dialoguePrompt: "व्यक्ति: क्या मैं आपकी कोई मदद कर सकता हूँ?",
    targetText: "माफ़ कीजिए, सबसे नज़दीकी मेट्रो स्टेशन कहाँ है?",
    translation: "Excuse me, where is the nearest metro station?",
    phonetic: "maaf KEE-jee-ye, SUB-say nuz-DEE-kee MET-roh STAY-shun ka-HAAN hai?",
    difficulty: "intermediate",
  },
  {
    title: "हिंदी जीभ-घुमाव (Hindi Tongue Twister)",
    type: "sentence",
    category: "tongue-twisters",
    language: "hi",
    targetText: "चंदू के चाचा ने चंदू की चाची को चांदनी चौक में चटनी चटाई।",
    translation: "Chandu's uncle fed Chandu's aunt chutney at Chandni Chowk.",
    phonetic: "CHUN-doo kay CHAH-chah nay CHUN-doo kee CHAH-chee koh chaand-NEE CHOWK may CHUT-nee chuh-TAA-ee.",
    difficulty: "advanced",
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  await Exercise.deleteMany({});
  await Exercise.insertMany(sampleExercises);

  console.log(`Seeded ${sampleExercises.length} comprehensive language tutorial & conversation exercises across en, es, fr, de, hi!`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
