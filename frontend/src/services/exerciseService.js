import api from "./api";

const FALLBACK_EXERCISES = [
  // ENGLISH
  {
    _id: "en-1",
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
    _id: "en-2",
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
    _id: "en-3",
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
    _id: "en-4",
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
    _id: "en-5",
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
  {
    _id: "en-6",
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
  {
    _id: "en-7",
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
    _id: "en-8",
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

  // SPANISH
  {
    _id: "es-1",
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
    _id: "es-2",
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
    _id: "es-3",
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
    _id: "es-4",
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
    _id: "es-5",
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
  {
    _id: "es-6",
    title: "Trabalenguas: Erre con Erre",
    type: "sentence",
    category: "tongue-twisters",
    language: "es",
    targetText: "Erre con erre guitarra, erre con erre barril.",
    translation: "R with R guitar, R with R barrel.",
    phonetic: "EHR-reh kohn EHR-reh gee-TAHR-rah, EHR-reh kohn EHR-reh bah-REEL.",
    difficulty: "advanced",
  },

  // FRENCH
  {
    _id: "fr-1",
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
    _id: "fr-2",
    title: "Se Présenter (Introducing Yourself)",
    type: "sentence",
    category: "introductions",
    language: "fr",
    targetText: "Je m'appelle Thomas et je suis très heureux de vous rencontrer.",
    translation: "My name is Thomas and I am very happy to meet you.",
    phonetic: "zhuh mah-PEL toh-MAH ay zhuh swee tray zew-RUH duh voo rahn-kohn-TRAY.",
    difficulty: "intermediate",
  },
  {
    _id: "fr-3",
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
    _id: "fr-4",
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

  // GERMAN
  {
    _id: "de-1",
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
    _id: "de-2",
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

  // HINDI
  {
    _id: "hi-1",
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
    _id: "hi-2",
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
    _id: "hi-3",
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
];

// filters: { type, difficulty, category, language }
export const getExercises = (filters = {}) => {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.category) params.category = filters.category;
  if (filters.language) params.language = filters.language;

  return api
    .get("/exercises", { params })
    .then((res) => (res.data?.length > 0 ? res.data : FALLBACK_EXERCISES))
    .catch(() => {
      let filtered = [...FALLBACK_EXERCISES];
      if (filters.language) filtered = filtered.filter((e) => e.language === filters.language);
      if (filters.difficulty) filtered = filtered.filter((e) => e.difficulty === filters.difficulty);
      if (filters.category) filtered = filtered.filter((e) => e.category === filters.category);
      return filtered;
    });
};

export const getCategories = () =>
  api
    .get("/exercises/categories")
    .then((res) =>
      res.data?.length > 0
        ? res.data
        : ["greetings", "introductions", "cafe-dining", "directions", "conversation", "tongue-twisters"]
    )
    .catch(() => ["greetings", "introductions", "cafe-dining", "directions", "conversation", "tongue-twisters"]);

export const getLanguages = () =>
  api
    .get("/exercises/languages")
    .then((res) => (res.data?.length > 0 ? res.data : ["en", "es", "fr", "de", "hi"]))
    .catch(() => ["en", "es", "fr", "de", "hi"]);

export const getExerciseById = (id) =>
  api
    .get(`/exercises/${id}`)
    .then((res) => res.data)
    .catch(() => {
      const found = FALLBACK_EXERCISES.find((e) => e._id === id);
      if (found) return found;
      return FALLBACK_EXERCISES[0];
    });

export const createExercise = (exercise) =>
  api.post("/exercises", exercise).then((res) => res.data);

export const deleteExercise = (id) => api.delete(`/exercises/${id}`).then((res) => res.data);
