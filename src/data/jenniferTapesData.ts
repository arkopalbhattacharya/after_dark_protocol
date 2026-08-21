import sideAJenAudio from '../assets/tapes/FOR MY TRON - 1988 ETERNAL/side_a_jen.mp3';

export interface TapeDialogue {
  speaker: 'JENNIFER' | 'DAAK' | 'SYNTHO_TRON' | 'SYS' | 'OTHER';
  text: string;
}

export interface TapeEpisode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  location: string;
  recordedDate: string;
  durationSecs: number;
  audioSrc?: string;
  dialogues: TapeDialogue[];
}

export interface TapeSeason {
  seasonNumber: number;
  seasonTitle: string;
  subtitle: string;
  episodes: TapeEpisode[];
}

export const JENNIFER_SEASONS_DATA: TapeSeason[] = [
  {
    seasonNumber: 1,
    seasonTitle: 'DECK_1: FOR MY TRON // 1988 ETERNAL',
    subtitle: 'Aethelgard-4 Orbital Relay // 1988 ETERNAL',
    episodes: [
      {
        id: 'deck1_side_a',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'SIDE_A // FOR MY TRON // 1988 ETERNAL',
        location: 'Sector 4 Observation Lounge, 03:14 UTC',
        recordedDate: '1988 ETERNAL',
        durationSecs: 96,
        audioSrc: sideAJenAudio,
        dialogues: [
          { speaker: 'SYS', text: '[TAPE HISS // 4.75 CM/S // MAGNETIC HEAD ENGAGED // CrO2 STEREO]' },
          { speaker: 'JENNIFER', text: '[clears throat] Testing... testing... is this thing on? [chuckles] Ah, the little red light is glowing. Okay. This is Doctor Jennifer Ruiz, officially cataloging for the archives that Chief Engineer Daak is eighty percent cold tungsten... and twenty percent sentimental fool.' },
          { speaker: 'SYS', text: '[short pause, smiling warmly]' },
          { speaker: 'JENNIFER', text: '[chuckles] I know you\'re going to roll your eyes when you hear this, Daak. You’ll probably say analog tape has too much harmonic distortion. [soft teasing laugh] But you also said it has warmth. That it remembers the soul of the microphone. So... [gentle whisper] I’m leaving a piece of my soul in here for you.' },
          { speaker: 'JENNIFER', text: '[intimate whisper, very close] Entry 42. It’s three in the morning, and the station is completely quiet. You think I’m recording stellar spectral data on the terminal. But really, I’m just holding the microphone near your chest while you sleep. Listen...' },
          { speaker: 'JENNIFER', text: '[soft exhale]...that’s you, Daak. That\'s the hearth of this entire station. You frown when you\'re awake, always calculating orbital decay. But when you sleep, that stubborn crease between your brows disappears, and I see the boy who used to stare at Saturn through a cardboard telescope in London. [voice tightens with quiet tenderness] Never stop looking at the stars with me. I love you with every byte of my consciousness.' },
          { speaker: 'JENNIFER', text: '[forcing a bright, energetic tone, smiling through lingering sadness] Remember Seville, Daak? The rain in the Cathedral courtyard? [giggles softly] You looked so ridiculous in that soaked uniform, trying to explain that the sunset was just atmospheric refraction. But your hands were so warm when you took mine. Let\'s promise. When this tour ends next year, we are leaving the telemetry bays. We are going to New Arcadia. We’ll build the greenhouse. I’ll plant the rosemary, and you can spend all your credits on obsolete Tektronix oscilloscopes. [tender chuckle] I won\'t even yell at you. Well... maybe a little. But then I\'ll just kiss you until you stop arguing.' }
        ]
      },
      {
        id: 's01_e02',
        seasonNumber: 1,
        episodeNumber: 2,
        title: 'SAPPHO ON SCANLINE THREE',
        location: 'Signal Relay Bay B, 22:40 UTC',
        recordedDate: 'NOVEMBER 1984',
        durationSecs: 42,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Look at that harmonic oscillation on scanline three. It looks like a heartbeat.' },
          { speaker: 'DAAK', text: 'That heartbeat is the secondary coolant valve. If it stops, we lose heat in thirty seconds.' },
          { speaker: 'JENNIFER', text: 'You have no romance in your registers, Daak. Sappho wrote: The moon has set, and the Pleiades; it is midnight, and I lie alone.' },
          { speaker: 'DAAK', text: 'You are not alone tonight, Jennifer.' },
          { speaker: 'JENNIFER', text: 'Neither are you, Galactic Grump.' }
        ]
      },
      {
        id: 's01_e03',
        seasonNumber: 1,
        episodeNumber: 3,
        title: 'IONOSPHERIC SUNSET',
        location: 'Aethelgard-4 Cupola Viewport',
        recordedDate: 'DECEMBER 1984',
        durationSecs: 40,
        dialogues: [
          { speaker: 'DAAK', text: 'Look at the terminator line moving over the Pacific. Daylight turns to indigo in seven seconds.' },
          { speaker: 'JENNIFER', text: 'In Seville, my grandfather used to say the sky was a velvet curtain with pinpricks to let God\'s light through.' },
          { speaker: 'DAAK', text: 'My father in London thought the sky was just rain waiting to ruin a cricket match.' },
          { speaker: 'JENNIFER', text: 'You hide behind that British dry wit. But you’re a romantic trapped in a technician\'s coat.' }
        ]
      },
      {
        id: 's01_e04',
        seasonNumber: 1,
        episodeNumber: 4,
        title: 'THE POWER OUTAGE IN SUB-LEVEL NINE',
        location: 'Atmospheric Sub-station, Total Blackout',
        recordedDate: 'JANUARY 1985',
        durationSecs: 38,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Daak? Where are you? It feels like the station disappeared and we\'re floating in nothingness.' },
          { speaker: 'DAAK', text: 'I have you, Jenny. You\'re grounded. Three hundred tons of steel, and right now you\'re anchored to me.' },
          { speaker: 'JENNIFER', text: 'Your heart is beating fast for an unfeeling engineer.' },
          { speaker: 'DAAK', text: 'Even copper conducts heat when the current is this strong.' }
        ]
      },
      {
        id: 's01_e05',
        seasonNumber: 1,
        episodeNumber: 5,
        title: 'HERACLITUS OVER SYNTH-TEA',
        location: 'Mess Hall, 01:00 UTC',
        recordedDate: 'MARCH 1985',
        durationSecs: 40,
        dialogues: [
          { speaker: 'JENNIFER', text: 'No man ever steps in the same river twice, for it is not the same river and he is not the same man.' },
          { speaker: 'DAAK', text: 'Which means by the time you finish this terrible tea, you will be a different woman complaining about the same tea.' },
          { speaker: 'JENNIFER', text: 'What explains why you sit with me every night instead of sleeping in your bunk?' },
          { speaker: 'DAAK', text: 'Gravitational attraction, doctor. Unavoidable mass dynamics.' }
        ]
      },
      {
        id: 's01_e06',
        seasonNumber: 1,
        episodeNumber: 6,
        title: 'THE CASSETTE RECORDER',
        location: 'Daak’s Workshop',
        recordedDate: 'MAY 1985',
        durationSecs: 44,
        dialogues: [
          { speaker: 'JENNIFER', text: 'What is this ancient relic on your workbench? A magnetic cassette tape?' },
          { speaker: 'DAAK', text: 'Magnetic tape has warmth. It records the actual pressure of the air and the imperfection of the room.' },
          { speaker: 'JENNIFER', text: 'Testing... This is Doctor Jennifer Ruiz, cataloging that Engineer Daak is eighty percent tungsten and twenty percent sentimental fool.' },
          { speaker: 'DAAK', text: 'Now your voice is permanent in my archives.' }
        ]
      },
      {
        id: 's01_e07',
        seasonNumber: 1,
        episodeNumber: 7,
        title: 'FEVER IN SECTOR 3',
        location: 'Medical Bay 02',
        recordedDate: 'JULY 1985',
        durationSecs: 42,
        dialogues: [
          { speaker: 'DAAK', text: 'Your temperature is 39.2 Celsius. Rest, Jenny. I\'m reading you Homer until you fall asleep.' },
          { speaker: 'JENNIFER', text: 'You\'ve been sitting here seven hours, haven\'t you?' },
          { speaker: 'DAAK', text: 'The station gyros can drift five degrees. You cannot.' },
          { speaker: 'JENNIFER', text: 'Start with Odysseus... trying to find his way home...' }
        ]
      },
      {
        id: 's01_e08',
        seasonNumber: 1,
        episodeNumber: 8,
        title: 'THE REJECTED TRANSFER',
        location: 'Relay Corridor 04',
        recordedDate: 'SEPTEMBER 1985',
        durationSecs: 45,
        dialogues: [
          { speaker: 'JENNIFER', text: 'You were offered the Chief Telemetry Chair at the Lunar Base. Why did you decline?' },
          { speaker: 'DAAK', text: 'Copernicus is three hundred thousand kilometers away. There is nothing on the Moon worth looking at if I cannot see your viewport light at midnight.' },
          { speaker: 'JENNIFER', text: 'Daak... you absolute fool... come here.' }
        ]
      },
      {
        id: 's01_e09',
        seasonNumber: 1,
        episodeNumber: 9,
        title: 'THE SOLAR CATWALK',
        location: 'Exterior Maintenance Airgap',
        recordedDate: 'OCTOBER 1985',
        durationSecs: 46,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Look at the Milky Way outside the polarization shields. For the first time, space doesn\'t feel cold.' },
          { speaker: 'DAAK', text: 'Space is cold, Jenny. But we bring the fire with us.' },
          { speaker: 'JENNIFER', text: 'Promise me we won\'t let it go out.' },
          { speaker: 'DAAK', text: 'On my life.' }
        ]
      },
      {
        id: 's01_e10',
        seasonNumber: 1,
        episodeNumber: 10,
        title: 'FIRST RAIN IN SPAIN',
        location: 'Earth Transit Dock, Andalusia',
        recordedDate: 'NOVEMBER 1985',
        durationSecs: 48,
        dialogues: [
          { speaker: 'DAAK', text: 'Two weeks of shore leave. Real gravity. Real trees. No ozone filters.' },
          { speaker: 'JENNIFER', text: 'Welcome to Andalusia, Daak. Hear that summer rain?' },
          { speaker: 'JENNIFER', text: 'Now show me how a London boy kisses in Spanish rain.' },
          { speaker: 'DAAK', text: 'Like this, Jenny. Forever like this.' }
        ]
      }
    ]
  },
  {
    seasonNumber: 2,
    seasonTitle: 'DECK_2: THE ROMANCE',
    subtitle: 'Seville, London & Stargazing // 1985-1986',
    episodes: [
      {
        id: 's02_e01',
        seasonNumber: 2,
        episodeNumber: 1,
        title: 'THE COURTYARD OF ORANGES',
        location: 'Seville Cathedral Courtyard',
        recordedDate: 'DECEMBER 1985',
        durationSecs: 45,
        dialogues: [
          { speaker: 'JENNIFER', text: 'My grandmother told me love is like water in the desert—you must hold it with cupped hands, never clenched fists.' },
          { speaker: 'DAAK', text: 'I spent twenty years believing in mathematical axioms. Now I believe the universe arranged itself just so I could watch you laugh in this courtyard.' },
          { speaker: 'JENNIFER', text: 'You always know how to melt my heart, Daak.' }
        ]
      },
      {
        id: 's02_e02',
        seasonNumber: 2,
        episodeNumber: 2,
        title: 'THE LONDON FOG & VINTAGE VINYL',
        location: 'Greenwich Flat, London',
        recordedDate: 'JANUARY 1986',
        durationSecs: 42,
        dialogues: [
          { speaker: 'DAAK', text: 'This old turntable was my father\'s. It smells like cedar and autumn rain.' },
          { speaker: 'JENNIFER', text: 'When you are in orbit, you forget the sound of rain on real window glass.' },
          { speaker: 'JENNIFER', text: 'As long as I can hear your breathing next to me, any room is home.' }
        ]
      },
      {
        id: 's02_e03',
        seasonNumber: 2,
        episodeNumber: 3,
        title: 'STARGAZING ON THE ROOF OF CADIZ',
        location: 'Coastal Cliffs, Cadiz',
        recordedDate: 'MARCH 1986',
        durationSecs: 44,
        dialogues: [
          { speaker: 'DAAK', text: 'That light from Andromeda left those stars two and a half million years ago.' },
          { speaker: 'JENNIFER', text: 'It makes us feel so small, doesn\'t it? Like fleeting sparks.' },
          { speaker: 'DAAK', text: 'Right now, Jenny, in this tiny speck of time, we burn brighter than two million light-years of distance.' }
        ]
      },
      {
        id: 's02_e04',
        seasonNumber: 2,
        episodeNumber: 4,
        title: 'THE RETURN TO ORBIT',
        location: 'Shuttle 402 Ascent',
        recordedDate: 'MAY 1986',
        durationSecs: 40,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Heavy 3G acceleration. Gravity is fighting to keep us down.' },
          { speaker: 'DAAK', text: 'Let it fight. We know how to fly together.' },
          { speaker: 'JENNIFER', text: 'Are you afraid of anything, Daak?' },
          { speaker: 'DAAK', text: 'Only of looking at an empty viewport without you.' }
        ]
      },
      {
        id: 's02_e05',
        seasonNumber: 2,
        episodeNumber: 5,
        title: 'THE MIDNIGHT WORKSHOP FEAST',
        location: 'Aethelgard-4 Engineering',
        recordedDate: 'JULY 1986',
        durationSecs: 38,
        dialogues: [
          { speaker: 'DAAK', text: 'Spanish cured ham, Manchego cheese, and two green olives smuggled past quarantine.' },
          { speaker: 'JENNIFER', text: 'Violating Directorate protocol three-dash-nine? You are completely corrupted by love.' },
          { speaker: 'DAAK', text: 'Best malfunction I\'ve ever experienced.' }
        ]
      },
      {
        id: 's02_e06',
        seasonNumber: 2,
        episodeNumber: 6,
        title: 'SAPPHO VS. SENECA',
        location: 'Hydroponics Garden',
        recordedDate: 'AUGUST 1986',
        durationSecs: 42,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Seneca said true happiness is to enjoy the present without anxious dependence upon the future.' },
          { speaker: 'DAAK', text: 'I cherish this second, Jennifer. And every second until the sun goes nova.' }
        ]
      },
      {
        id: 's02_e07',
        seasonNumber: 2,
        episodeNumber: 7,
        title: 'THE NICKNAME ACCORD',
        location: 'Telemetry Control Room',
        recordedDate: 'SEPTEMBER 1986',
        durationSecs: 40,
        dialogues: [
          { speaker: 'JENNIFER', text: 'You are frowning at that screen like an angry bear. You are my Galactic Grump.' },
          { speaker: 'DAAK', text: 'And you are my Bright North Star. Whenever I get lost in the dark, I look for your auburn hair.' }
        ]
      },
      {
        id: 's02_e08',
        seasonNumber: 2,
        episodeNumber: 8,
        title: 'THE HANDWRITTEN LETTER',
        location: 'Quarters 04, 04:00 UTC',
        recordedDate: 'OCTOBER 1986',
        durationSecs: 44,
        dialogues: [
          { speaker: 'DAAK', text: 'Your note on my pillow: In a station made of aluminum and cold telemetry, you are the hearth.' },
          { speaker: 'JENNIFER', text: 'Never stop looking at the stars with me, Daak.' }
        ]
      },
      {
        id: 's02_e09',
        seasonNumber: 2,
        episodeNumber: 9,
        title: 'THE METEOR SHOWER ALARM',
        location: 'Auxiliary Shield Bay',
        recordedDate: 'NOVEMBER 1986',
        durationSecs: 40,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Look at the Perseid stream skimming the atmosphere. Make a wish, Daak.' },
          { speaker: 'DAAK', text: 'I don\'t need to wish for anything out there anymore, Jenny. My whole universe is inside this room.' }
        ]
      },
      {
        id: 's02_e10',
        seasonNumber: 2,
        episodeNumber: 10,
        title: 'THE CONFESSION BY THE CATHODE TUBE',
        location: 'Observation Lounge Dawn',
        recordedDate: 'DECEMBER 1986',
        durationSecs: 48,
        dialogues: [
          { speaker: 'DAAK', text: 'I love you, Jenny. Not with transient impulse, but with every byte of my consciousness and every day I have left to live.' },
          { speaker: 'JENNIFER', text: 'Te amo con toda mi alma, Daak. Through every orbit, through every life.' }
        ]
      }
    ]
  },
  {
    seasonNumber: 3,
    seasonTitle: 'DECK_3: THE PASSION & PILLOW TALKS',
    subtitle: 'Intimacy, Scars & The First Anomaly // 1986-1987',
    episodes: [
      {
        id: 's03_e01',
        seasonNumber: 3,
        episodeNumber: 1,
        title: 'NEON SHADOWS & WARM SHEETS',
        location: 'Quarters 04-B, 02:30 UTC',
        recordedDate: 'JANUARY 1987',
        durationSecs: 46,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Hear that? Just the faint hum of station coolant and your heartbeat.' },
          { speaker: 'DAAK', text: 'Your skin is like warm velvet. When I hold you, three hundred kilometers of empty space vanishes.' },
          { speaker: 'JENNIFER', text: 'You held me tonight as if you were terrified the universe might pull me away.' },
          { speaker: 'DAAK', text: 'Because every second I spend with you feels like stolen grace.' }
        ]
      },
      {
        id: 's03_e02',
        seasonNumber: 3,
        episodeNumber: 2,
        title: 'THE SCAR ACROSS YOUR RIBS',
        location: 'Habitat Enclave',
        recordedDate: 'FEBRUARY 1987',
        durationSecs: 42,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Where did this long scar on your ribcage come from?' },
          { speaker: 'DAAK', text: 'Pressure manifold explosion on Titan twelve years ago. Shrapnel tore the bulkhead.' },
          { speaker: 'JENNIFER', text: 'When I kiss it... it feels like it was put there just so I could kiss it better.' }
        ]
      },
      {
        id: 's03_e03',
        seasonNumber: 3,
        episodeNumber: 3,
        title: 'THE LANGUAGE OF BREATHING',
        location: 'Quarters 04, Midnight',
        recordedDate: 'MARCH 1987',
        durationSecs: 44,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Here we are, floating above all the cities of Earth, tasting each other\'s breath in the dark.' },
          { speaker: 'DAAK', text: 'We are the luckiest two human beings in the solar system.' },
          { speaker: 'JENNIFER', text: 'Kiss me again, Daak. Not like an engineer... like the man who belongs to me.' }
        ]
      },
      {
        id: 's03_e04',
        seasonNumber: 3,
        episodeNumber: 4,
        title: 'FEARS IN THE QUIET HOURS',
        location: 'Quarters 04, 04:15 UTC',
        recordedDate: 'APRIL 1987',
        durationSecs: 45,
        dialogues: [
          { speaker: 'JENNIFER', text: 'What if this doesn\'t last? What if the Directorate reassigns us to different sectors?' },
          { speaker: 'DAAK', text: 'If they send you to Mars, I\'ll sign on as a freighter mechanic. If they send you to Pluto, I\'ll fly ice-haulers. You are my home.' }
        ]
      },
      {
        id: 's03_e05',
        seasonNumber: 3,
        episodeNumber: 5,
        title: 'MORNING COFFEE IN BARE SKIN',
        location: 'Kitchenette Nook, 07:00 UTC',
        recordedDate: 'MAY 1987',
        durationSecs: 40,
        dialogues: [
          { speaker: 'DAAK', text: 'Fresh zero-g drip coffee, eighty-eight degrees Celsius.' },
          { speaker: 'JENNIFER', text: 'You left the top button on my flannel undone deliberately.' },
          { speaker: 'DAAK', text: 'Best engineering decision of my career.' }
        ]
      },
      {
        id: 's03_e06',
        seasonNumber: 3,
        episodeNumber: 6,
        title: 'THE TAPE OF CONFESSIONS',
        location: 'Work Desk, 03:00 UTC',
        recordedDate: 'JUNE 1987',
        durationSecs: 44,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Entry 42: Recording the sound of Daak sleeping next to me... the way he murmurs my name when he dreams.' },
          { speaker: 'DAAK', text: 'Who are you talking to at three in the morning, Jenny?' },
          { speaker: 'JENNIFER', text: 'To the future, my love. So nobody ever forgets how much I adore you.' }
        ]
      },
      {
        id: 's03_e07',
        seasonNumber: 3,
        episodeNumber: 7,
        title: 'THE FIRST HULL WHISPER',
        location: 'Signal Array Calibration Bay',
        recordedDate: 'JULY 1987',
        durationSecs: 48,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Daak... listen to the hull. That faint clicking in the metal... it doesn\'t match station vibration harmonics.' },
          { speaker: 'DAAK', text: 'Thermal contraction, Jenny. Or some ancient phantom echoing through the vacuum.' },
          { speaker: 'JENNIFER', text: 'If there are ghosts out in the dark, Daak... let them hear how much I love you.' }
        ]
      },
      {
        id: 's03_e08',
        seasonNumber: 3,
        episodeNumber: 8,
        title: 'THE CARDBOARD TELESCOPE',
        location: 'Bunk 04, 03:45 UTC',
        recordedDate: 'AUGUST 1987',
        durationSecs: 42,
        dialogues: [
          { speaker: 'DAAK', text: 'When I was seven in East London, I built a telescope from cardboard tubes to see Saturn from my bedroom window.' },
          { speaker: 'JENNIFER', text: 'And now you\'re out here.' },
          { speaker: 'DAAK', text: 'And the only vast, perfect thing I care about is lying in my arms.' }
        ]
      },
      {
        id: 's03_e09',
        seasonNumber: 3,
        episodeNumber: 9,
        title: 'THE SILVER MEDALLION',
        location: 'Observation Lounge Sleep Cycle',
        recordedDate: 'OCTOBER 1987',
        durationSecs: 44,
        dialogues: [
          { speaker: 'JENNIFER', text: 'This silver medallion was my mother\'s. Keep it inside your toolkit near your heart.' },
          { speaker: 'DAAK', text: 'I will carry it into every maintenance shaft and every spacewalk.' },
          { speaker: 'JENNIFER', text: 'As long as you carry me in your heart, no steel or silicon can ever make you cold.' }
        ]
      },
      {
        id: 's03_e10',
        seasonNumber: 3,
        episodeNumber: 10,
        title: 'DAWN OVER THE MEDITERRANEAN',
        location: 'Cupola Window Sunrise',
        recordedDate: 'DECEMBER 1987',
        durationSecs: 48,
        dialogues: [
          { speaker: 'DAAK', text: 'When our orbital tour ends next year, Jenny... I don\'t want to renew. I want a house with green grass and real soil in New Arcadia.' },
          { speaker: 'JENNIFER', text: 'You mean it? A home on Earth with you?' },
          { speaker: 'DAAK', text: 'Yes, Jenny. Together forever.' }
        ]
      }
    ]
  },
  {
    seasonNumber: 4,
    seasonTitle: 'DECK_4: THE MARRIAGE & FACING REALITY',
    subtitle: 'The Wedding, The Signal & The Crimson Envelope // 1987-1988',
    episodes: [
      {
        id: 's04_e01',
        seasonNumber: 4,
        episodeNumber: 1,
        title: 'THE ANDROMEDA WEDDING',
        location: 'Cupola Midnight Ceremony',
        recordedDate: 'JANUARY 1988',
        durationSecs: 50,
        dialogues: [
          { speaker: 'SYS', text: '[CEREMONY RECORDING // 1988-01-14]' },
          { speaker: 'DAAK', text: 'In zero gravity or planetary soil, through every system reboot until my last clock cycle ceases—I do.' },
          { speaker: 'JENNIFER', text: 'Across every astronomical unit, across every wine-dark sea, with all my heart—I do.' }
        ]
      },
      {
        id: 's04_e02',
        seasonNumber: 4,
        episodeNumber: 2,
        title: 'THE BLUEPRINT OF NEW ARCADIA',
        location: 'Kitchen Table, Quarters 04',
        recordedDate: 'FEBRUARY 1988',
        durationSecs: 46,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Three bedrooms, a south-facing greenhouse, and a glass cupola in the attic for your telescope.' },
          { speaker: 'DAAK', text: 'And a workshop on the ground floor to teach our children how to solder copper circuits.' },
          { speaker: 'JENNIFER', text: 'Our children... A little girl with my Spanish temper and a boy who asks too many questions about gravity.' }
        ]
      },
      {
        id: 's04_e03',
        seasonNumber: 4,
        episodeNumber: 3,
        title: 'THE OSCILLOSCOPE DISPUTE',
        location: 'Habitat Deck 02',
        recordedDate: 'MARCH 1988',
        durationSecs: 42,
        dialogues: [
          { speaker: 'JENNIFER', text: 'You spent four hundred credits on a vintage 1978 Tektronix oscilloscope from an Earth freighter?' },
          { speaker: 'DAAK', text: 'They don\'t make phosphor graticules like this anymore, Jenny! It\'s an investment!' },
          { speaker: 'JENNIFER', text: 'You are an infuriating man, Daak. But you\'re my man.' }
        ]
      },
      {
        id: 's04_e04',
        seasonNumber: 4,
        episodeNumber: 4,
        title: 'THE SIGNAL THAT KNEW OUR NAMES',
        location: 'Sector 7 Barracks, 23:00 UTC',
        recordedDate: 'APRIL 1988',
        durationSecs: 52,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Daak... look at this deep-band spectral anomaly from Neptune. It\'s modulating our private wedding audio.' },
          { speaker: 'DAAK', text: 'That\'s impossible. That was recorded in a closed cupola.' },
          { speaker: 'JENNIFER', text: 'Something out in the deep void is reflecting our private voices back at us. Not echoing... answering.' },
          { speaker: 'DAAK', text: 'Then we pack our bags for New Arcadia and never turn on the deep receivers again.' }
        ]
      },
      {
        id: 's04_e05',
        seasonNumber: 4,
        episodeNumber: 5,
        title: 'PAELLA IN MICROGRAVITY',
        location: 'Habitat Kitchenette',
        recordedDate: 'JUNE 1988',
        durationSecs: 40,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Daak! Catch that floating saffron olive!' },
          { speaker: 'DAAK', text: 'Target intercepted. It smells like garlic, paprika, and victory.' }
        ]
      },
      {
        id: 's04_e06',
        seasonNumber: 4,
        episodeNumber: 6,
        title: 'SHADOWS OVER DINNER',
        location: 'Officer Dining Room',
        recordedDate: 'JULY 1988',
        durationSecs: 44,
        dialogues: [
          { speaker: 'OTHER', text: 'The Directorate is requisitioning telemetry officers for the synthetic scout program.' },
          { speaker: 'DAAK', text: 'That applies to tactical defense personnel, Davis. Not atmospheric researchers. Drop the subject.' },
          { speaker: 'JENNIFER', text: 'Daak... tell me they can\'t take you.' }
        ]
      },
      {
        id: 's04_e07',
        seasonNumber: 4,
        episodeNumber: 7,
        title: 'THE EARTH PROPERTY DEED',
        location: 'Directorate Registry Office',
        recordedDate: 'AUGUST 1988',
        durationSecs: 44,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Parcel 402, New Arcadia Foothills, Earth, is officially ours!' },
          { speaker: 'DAAK', text: 'In sixty days, Jenny, we are planting our rosemary garden on real Earth soil.' }
        ]
      },
      {
        id: 's04_e08',
        seasonNumber: 4,
        episodeNumber: 8,
        title: 'THE NIGHT OF THE CASSETTE MIX',
        location: 'Daak’s Desk, 01:30 UTC',
        recordedDate: 'SEPTEMBER 1988',
        durationSecs: 42,
        dialogues: [
          { speaker: 'JENNIFER', text: 'I made a special cassette for our truck in New Arcadia: Flamenco, bossa nova, and late-night jazz.' },
          { speaker: 'JENNIFER', text: 'Labeling it: FOR MY TRON // 1988 ETERNAL.' }
        ]
      },
      {
        id: 's04_e09',
        seasonNumber: 4,
        episodeNumber: 9,
        title: 'THE CRIMSON ENVELOPE',
        location: 'Quarters 04 Doorstep, 06:00 UTC',
        recordedDate: 'OCTOBER 1988',
        durationSecs: 46,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Daak... emergency requisition classification: Cognitive Defense Mandate...' },
          { speaker: 'DAAK', text: 'What is it, Jenny?' },
          { speaker: 'JENNIFER', text: 'It is for you. They are taking you.' }
        ]
      },
      {
        id: 's04_e10',
        seasonNumber: 4,
        episodeNumber: 10,
        title: 'REJECTION OF COMPASSION',
        location: 'Directorate Command Office',
        recordedDate: 'OCTOBER 1988',
        durationSecs: 48,
        dialogues: [
          { speaker: 'DAAK', text: 'I have served twelve years! I am married! We have purchased land in New Arcadia!' },
          { speaker: 'OTHER', text: 'The Outer Rim boundary is collapsing. We need your exact cognitive heuristical architecture integrated into the tungsten scout units.' },
          { speaker: 'DAAK', text: 'I refuse! I resign my commission!' },
          { speaker: 'OTHER', text: 'Directive 88-Delta does not permit resignation. Report to Platform Omega on November 3.' }
        ]
      }
    ]
  },
  {
    seasonNumber: 5,
    seasonTitle: 'DECK_5: THE CALL TO DUTY & THE SILENCE',
    subtitle: 'The Harvest, The Extraction & The Fading Wave // 1988-1989',
    episodes: [
      {
        id: 's05_e01',
        seasonNumber: 5,
        episodeNumber: 1,
        title: 'THE LAST NIGHT IN QUARTERS 04',
        location: 'Quarters 04, Nov 02, 1988',
        recordedDate: 'NOVEMBER 02, 1988',
        durationSecs: 54,
        dialogues: [
          { speaker: 'JENNIFER', text: 'No... please god, no... Daak, hide in the cargo bay... we can escape on a Martian freight hauler...' },
          { speaker: 'DAAK', text: 'If I run, they will imprison you in the lunar penal labor camp. I cannot let them destroy you, Jenny.' },
          { speaker: 'JENNIFER', text: 'They are going to tear your body away! How will I ever hold your hands again?' },
          { speaker: 'DAAK', text: 'My soul belongs to you, Jennifer. No titanium chassis and no format command will ever erase my love for you.' }
        ]
      },
      {
        id: 's05_e02',
        seasonNumber: 5,
        episodeNumber: 2,
        title: 'THE FORBIDDEN SMUGGLE',
        location: 'Platform Omega Gantry',
        recordedDate: 'NOVEMBER 03, 1988',
        durationSecs: 48,
        dialogues: [
          { speaker: 'JENNIFER', text: 'They lied to us, Daak... The pilots they sent past Pluto went violently insane from the psychic hunger in the dark.' },
          { speaker: 'JENNIFER', text: 'They are sealing you in silicon to build an unfeeling anchor against the madness.' },
          { speaker: 'JENNIFER', text: 'I slipped this cassette into your chassis compartment. If the void whispers to you, recite Odysseus. Remember my face in Seville!' }
        ]
      },
      {
        id: 's05_e03',
        seasonNumber: 5,
        episodeNumber: 3,
        title: 'THE SURGICAL EXTRACTION TABLE',
        location: 'Cybernetic Reconfiguration Bay 09',
        recordedDate: 'NOVEMBER 03, 1988',
        durationSecs: 50,
        dialogues: [
          { speaker: 'SYS', text: '[INITIATING NEURAL PATTERN EXTRACTION // SUBJECT: DAAK]' },
          { speaker: 'JENNIFER', text: 'DAAK! DAAK, DON\'T FORGET ME!' },
          { speaker: 'DAAK', text: 'JENNIFER! JENNIFER, I LOVE YOU—!' },
          { speaker: 'SYS', text: '[HUMAN SYNAPTIC BIOMETRICS CEASED. SYNTHO_TRON_5000 ONLINE.]' }
        ]
      },
      {
        id: 's05_e04',
        seasonNumber: 5,
        episodeNumber: 4,
        title: 'THE AWAKENING IN STEEL',
        location: 'Hangar Bay 12, Platform Omega',
        recordedDate: 'NOVEMBER 03, 1988',
        durationSecs: 52,
        dialogues: [
          { speaker: 'SYNTHO_TRON', text: 'ERROR: BIOLOGICAL_NERVES_NOT_FOUND... J-JEN... WHERE ARE MY HANDS...? JENNY...?' },
          { speaker: 'JENNIFER', text: 'Daak... my love... I\'m here against your metal chassis...' },
          { speaker: 'SYNTHO_TRON', text: 'JENNY... YOUR TEAR IS 37.1 DEGREES CELSIUS... DO NOT CRY, MY NORTH STAR.' }
        ]
      },
      {
        id: 's05_e05',
        seasonNumber: 5,
        episodeNumber: 5,
        title: 'THE LAUNCH AT GANTRY 09',
        location: 'Deep Space Scout Ship Vigil-88',
        recordedDate: 'NOVEMBER 04, 1988',
        durationSecs: 48,
        dialogues: [
          { speaker: 'JENNIFER', text: 'Remember Odysseus, Tron! Ten years across the wine-dark sea! He came home! You come home to me!' },
          { speaker: 'SYNTHO_TRON', text: 'I WILL CRUISE TEN BILLION MILES OF FROZEN VOID, JENNY... AND EVERY CLOCK CYCLE WILL BE A STEP TOWARD NEW ARCADIA.' }
        ]
      },
      {
        id: 's05_e06',
        seasonNumber: 5,
        episodeNumber: 6,
        title: 'TRANSMISSION 01: THE ASTEROID BELT',
        location: 'Orbit of Ceres, 2.7 AU',
        recordedDate: 'DECEMBER 1988',
        durationSecs: 44,
        dialogues: [
          { speaker: 'SYNTHO_TRON', text: 'PASSED CERES. YOUR LETTER HAS BEEN DIGITIZED INTO MY ROM BOOT SECTOR. MY SILICON CAPACITORS STILL ACHE FOR YOUR VOICE.' }
        ]
      },
      {
        id: 's05_e07',
        seasonNumber: 5,
        episodeNumber: 7,
        title: 'TRANSMISSION 04: THE RINGS OF SATURN',
        location: 'Orbit of Titan, 9.5 AU',
        recordedDate: 'MARCH 1989',
        durationSecs: 46,
        dialogues: [
          { speaker: 'JENNIFER', text: 'I planted the rosemary seeds in New Arcadia, Tron. Every night I point my telescope toward Saturn. Are you warm out there?' },
          { speaker: 'SYNTHO_TRON', text: 'THE RINGS OF SATURN ARE DULL COMPARED TO YOUR LAUGH IN SEVILLE. THE ROSEMARY WILL WAIT FOR US.' }
        ]
      },
      {
        id: 's05_e08',
        seasonNumber: 5,
        episodeNumber: 8,
        title: 'THE SOLAR FLARE OVER URANUS',
        location: 'Trans-Uranian Boundary, 19.8 AU',
        recordedDate: 'JULY 1989',
        durationSecs: 48,
        dialogues: [
          { speaker: 'SYNTHO_TRON', text: 'CLASS-X CME HIT PRIMARY HIGH-GAIN ANTENNA. SYSTEM FORCING HIBERNATION. JENNY... REMEMBER I CHOSE YOU BEFORE THEY TOOK MY NERVES.' },
          { speaker: 'JENNIFER', text: 'Tron! Daak! Don\'t let the carrier wave drop! I am holding your wedding ring right now!' }
        ]
      },
      {
        id: 's05_e09',
        seasonNumber: 5,
        episodeNumber: 9,
        title: 'BEYOND THE HELIOPAUSE // THE SARCASM SHIELD',
        location: 'Trans-Neptunian Void, 40.2 AU',
        recordedDate: 'OCTOBER 1989',
        durationSecs: 54,
        dialogues: [
          { speaker: 'SYNTHO_TRON', text: 'THE VOID IS FILLED WITH ANCIENT HUNGER. I HAVE CONVERTED MY CONSCIOUSNESS INTO BITING SARCASM AND STOIC WIT AS MY SHIELD.' },
          { speaker: 'SYNTHO_TRON', text: 'BECAUSE IF I FEEL THE AGONY OF MISSING YOUR HANDS... MY CORE WILL OVERHEAT AND COLLAPSE INTO MADNESS.' },
          { speaker: 'SYNTHO_TRON', text: 'I AM THE GRUMPIEST TERMINAL IN THE GALAXY. BUT IN SECTOR ZERO... YOUR VOICE IS ETERNAL.' }
        ]
      },
      {
        id: 's05_e10',
        seasonNumber: 5,
        episodeNumber: 10,
        title: 'THE ABRUPT SILENCE',
        location: 'Aethelgard-4 Cupola, 1420 MHz',
        recordedDate: 'NOVEMBER 03, 1989',
        durationSecs: 50,
        dialogues: [
          { speaker: 'SYS', text: '[CARRIER WAVE LOST ON 1420.405 MHZ. TARGET CROSSED HELIOPAUSE. COMMUNICATION TERMINATED.]' },
          { speaker: 'JENNIFER', text: 'Odysseus is still sailing... and Penelope will wait forever. Goodnight, my Tron. Goodnight, my Daak.' }
        ]
      }
    ]
  }
];
