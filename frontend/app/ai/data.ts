export interface SubjectData {
  id: string;
  name: string;
  chapters: string[];
}

export interface ClassData {
  id: string;
  name: string;
  subjects: SubjectData[];
}

export const NCTB_CLASSES: ClassData[] = [
  {
    id: "1",
    name: "Class 1",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Alphabet & Phonics", "Chapter 2: Simple Words", "Chapter 3: Rhymes & Poems"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Greetings & Alphabet", "Chapter 2: Numbers (1-10)", "Chapter 3: Action Words"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Counting & Numbers", "Chapter 2: Simple Addition", "Chapter 3: Shapes & Sizes"],
      },
    ],
  },
  {
    id: "2",
    name: "Class 2",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Stories & Morals", "Chapter 2: Sentence Formation", "Chapter 3: Poems"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Family & Friends", "Chapter 2: Everyday Objects", "Chapter 3: Simple Stories"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Numbers up to 100", "Chapter 2: Addition & Subtraction", "Chapter 3: Geometry Basics"],
      },
    ],
  },
  {
    id: "3",
    name: "Class 3",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Amar Bangla Boi Stories", "Chapter 2: Grammar Basics", "Chapter 3: Poems & Rhymes"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Unit 1: Myself", "Chapter 2: Unit 2: Days & Months", "Chapter 3: Unit 3: Story Time"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Place Values", "Chapter 2: Addition & Subtraction", "Chapter 3: Multiplication & Division", "Chapter 4: Fractions"],
      },
      {
        id: "science",
        name: "Primary Science",
        chapters: ["All Chapters", "Chapter 1: Living & Non-Living", "Chapter 2: Plants & Animals", "Chapter 3: Water & Air", "Chapter 4: Health & Hygiene"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Our Environment", "Chapter 2: Helping Each Other", "Chapter 3: National Heritage"],
      },
    ],
  },
  {
    id: "4",
    name: "Class 4",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Patriotic Stories", "Chapter 2: Grammar & Vocabulary", "Chapter 3: Classical Poems"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Daily Routine", "Chapter 2: Nature & Seasons", "Chapter 3: Short Paragraphs"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Large Numbers", "Chapter 2: Four Basic Operations", "Chapter 3: Factors & Multiples", "Chapter 4: Fractions & Decimals"],
      },
      {
        id: "science",
        name: "Primary Science",
        chapters: ["All Chapters", "Chapter 1: Habitats & Ecosystems", "Chapter 2: Food & Nutrition", "Chapter 3: Matter & Energy", "Chapter 4: Soil & Climate"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Geography of Bangladesh", "Chapter 2: Rights of Citizens", "Chapter 3: Historical Places"],
      },
    ],
  },
  {
    id: "5",
    name: "Class 5",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Boi O Sahitya", "Chapter 2: Shobdo O Bakya", "Chapter 3: Kobita O Golpo"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: My Home District", "Chapter 2: Eat Healthy", "Chapter 3: The Liberation War Museum"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Multiplication & Division", "Chapter 2: Four Rules", "Chapter 3: Fractions", "Chapter 4: Decimals", "Chapter 5: Geometry"],
      },
      {
        id: "science",
        name: "Primary Science",
        chapters: ["All Chapters", "Chapter 1: Our Environment", "Chapter 2: Environmental Pollution", "Chapter 3: Water for Life", "Chapter 4: Energy & Matter"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Our Liberation War", "Chapter 2: British Rule", "Chapter 3: Historical Monuments", "Chapter 4: Human Rights"],
      },
    ],
  },
  {
    id: "6",
    name: "Class 6",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Matribhasha O Sahitya", "Chapter 2: Byakoron", "Chapter 3: Nirmity (Composition)"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Talking to People", "Chapter 2: Little Things", "Chapter 3: Future Lies in Present"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Natural Numbers & Fractions", "Chapter 2: Ratio & Percentage", "Chapter 3: Algebraic Expressions", "Chapter 4: Basic Geometry"],
      },
      {
        id: "science",
        name: "Science",
        chapters: ["All Chapters", "Chapter 1: Scientific Process & Measurement", "Chapter 2: Living World", "Chapter 3: Cell Structure", "Chapter 4: Senses & Nervous System"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: History of Bangladesh", "Chapter 2: World Civilizations", "Chapter 3: Culture of Bangladesh"],
      },
      {
        id: "ict",
        name: "Information and Communication Technology (ICT)",
        chapters: ["All Chapters", "Chapter 1: Introduction to ICT", "Chapter 2: Hardware & Software", "Chapter 3: Safe Use of Internet"],
      },
    ],
  },
  {
    id: "7",
    name: "Class 7",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Shobdo Gothon", "Chapter 2: Bakya Tottho", "Chapter 3: Sahityer Rup O Riti"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: A Dream School", "Chapter 2: Playing with Words", "Chapter 3: If (Poem Analysis)"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Rational & Irrational Numbers", "Chapter 2: Proportions & Profit-Loss", "Chapter 3: Algebraic Formulae", "Chapter 4: Linear Equations"],
      },
      {
        id: "science",
        name: "Science",
        chapters: ["All Chapters", "Chapter 1: Diversity of Lower Organisms", "Chapter 2: Cellular Organization", "Chapter 3: Structure of Matter", "Chapter 4: Energy & Work"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Freedom Movement", "Chapter 2: Socio-Economic System", "Chapter 3: Climate Diversity"],
      },
      {
        id: "ict",
        name: "Information and Communication Technology (ICT)",
        chapters: ["All Chapters", "Chapter 1: Importance of ICT", "Chapter 2: Computer Networking Basics", "Chapter 3: Digital Security"],
      },
    ],
  },
  {
    id: "8",
    name: "Class 8",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Sahityokonika", "Chapter 2: Bhasa O Byakoron", "Chapter 3: Rachana Shomvar"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Beauty in Poetry", "Chapter 2: The Art of Winning", "Chapter 3: Language and Culture"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Patterns", "Chapter 2: Profit & Loss", "Chapter 3: Measurement", "Chapter 4: Algebraic Formulae & Applications", "Chapter 5: Pythagoras Theorem"],
      },
      {
        id: "science",
        name: "Science",
        chapters: ["All Chapters", "Chapter 1: Classification of Animal Kingdom", "Chapter 2: Growth & Heredity", "Chapter 3: Diffusion & Osmosis", "Chapter 4: Chemical Reactions", "Chapter 5: Light & Refraction"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Colonial Era & Independence", "Chapter 2: Liberation War 1971", "Chapter 3: State & Governance"],
      },
      {
        id: "ict",
        name: "Information and Communication Technology (ICT)",
        chapters: ["All Chapters", "Chapter 1: Global Perspective of ICT", "Chapter 2: Network Topology", "Chapter 3: Cyber Security & Ethics"],
      },
    ],
  },
  {
    id: "9",
    name: "Class 9",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: Sahityo Shomvar (Prose)", "Chapter 2: Kabita (Poetry)", "Chapter 3: Bangla Grammar & Composition"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Opinions & Facts", "Chapter 2: Nature's Tapestry", "Chapter 3: The Sense of Beauty", "Chapter 4: Formal Writing"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Set and Function", "Chapter 2: Algebraic Expressions", "Chapter 3: Exponents & Logarithms", "Chapter 4: Practical Geometry", "Chapter 5: Trigonometry", "Chapter 6: Statistics"],
      },
      {
        id: "physics",
        name: "Physics",
        chapters: ["All Chapters", "Chapter 1: Physical Quantities & Measurement", "Chapter 2: Motion", "Chapter 3: Force & Dynamics", "Chapter 4: Work, Power & Energy", "Chapter 5: States of Matter", "Chapter 6: Light & Optics"],
      },
      {
        id: "chemistry",
        name: "Chemistry",
        chapters: ["All Chapters", "Chapter 1: Concepts of Chemistry", "Chapter 2: States of Matter", "Chapter 3: Structure of Atom", "Chapter 4: Periodic Table", "Chapter 5: Chemical Bonds", "Chapter 6: Concept of Mole"],
      },
      {
        id: "biology",
        name: "Biology",
        chapters: ["All Chapters", "Chapter 1: Lessons on Life", "Chapter 2: Cells and Tissues", "Chapter 3: Cell Division", "Chapter 4: Bioenergetics & Photosynthesis", "Chapter 5: Genetics & Heredity"],
      },
      {
        id: "higher_math",
        name: "Higher Mathematics",
        chapters: ["All Chapters", "Chapter 1: Sets and Functions", "Chapter 2: Algebraic Operations", "Chapter 3: Geometry & Coordinate Geometry", "Chapter 4: Vectors", "Chapter 5: Probability"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Eastern Bengal & Rise of Nationalism", "Chapter 2: Independent Bangladesh", "Chapter 3: Constitution of Bangladesh"],
      },
      {
        id: "ict",
        name: "Information and Communication Technology (ICT)",
        chapters: ["All Chapters", "Chapter 1: Information Technology & Our World", "Chapter 2: Computer & User Security", "Chapter 3: Digital Content Creation"],
      },
    ],
  },
  {
    id: "10",
    name: "Class 10",
    subjects: [
      {
        id: "bangla",
        name: "Bangla",
        chapters: ["All Chapters", "Chapter 1: SSC Prose Selection", "Chapter 2: SSC Poetry Selection", "Chapter 3: Advanced Grammar & Essays"],
      },
      {
        id: "english",
        name: "English",
        chapters: ["All Chapters", "Chapter 1: Unit 1: Good Citizens", "Chapter 2: Unit 2: Pastimes", "Chapter 3: Unit 3: Events & Festivals", "Chapter 4: Composition & Letters"],
      },
      {
        id: "math",
        name: "Mathematics",
        chapters: ["All Chapters", "Chapter 1: Real Numbers", "Chapter 2: Sets & Relations", "Chapter 3: Trigonometric Ratios", "Chapter 4: Circle & Tangents", "Chapter 5: Mensuration", "Chapter 6: Statistics"],
      },
      {
        id: "physics",
        name: "Physics",
        chapters: ["All Chapters", "Chapter 1: Waves and Sound", "Chapter 2: Reflection & Refraction of Light", "Chapter 3: Current Electricity", "Chapter 4: Magnetic Effects of Current", "Chapter 5: Modern Physics & Electronics"],
      },
      {
        id: "chemistry",
        name: "Chemistry",
        chapters: ["All Chapters", "Chapter 1: Chemical Reactions & Rates", "Chapter 2: Chemistry and Energy", "Chapter 3: Acid-Base Balance", "Chapter 4: Mineral Resources & Metals", "Chapter 5: Chemistry in Our Lives"],
      },
      {
        id: "biology",
        name: "Biology",
        chapters: ["All Chapters", "Chapter 1: Transport in Organisms", "Chapter 2: Gaseous Exchange", "Chapter 3: Excretion in Humans", "Chapter 4: Reproduction in Plants & Animals", "Chapter 5: Biotechnology"],
      },
      {
        id: "higher_math",
        name: "Higher Mathematics",
        chapters: ["All Chapters", "Chapter 1: Binomial Expansion", "Chapter 2: Trigonometric Equations", "Chapter 3: Coordinate Geometry (Lines & Distances)", "Chapter 4: Solid Geometry", "Chapter 5: Planar Vectors"],
      },
      {
        id: "bgs",
        name: "Bangladesh and Global Studies",
        chapters: ["All Chapters", "Chapter 1: Political Movements 1947-1971", "Chapter 2: Economic Resources of Bangladesh", "Chapter 3: Social Changes & Contemporary Issues"],
      },
      {
        id: "ict",
        name: "Information and Communication Technology (ICT)",
        chapters: ["All Chapters", "Chapter 1: Spreadsheets & Analysis", "Chapter 2: Database Management Systems", "Chapter 3: Multimedia & Graphics"],
      },
    ],
  },
];

export const SAMPLE_QUESTIONS = [
  "What is the difference between photosynthesis and cellular respiration?",
  "How do I prove the Pythagorean theorem geometrically?",
  "Explain Newton's laws of motion with real-life examples.",
  "What was the significance of the 1952 Language Movement in Bangladesh?",
  "How to balance a chemical equation step by step?",
  "What are rational and irrational numbers?",
];
