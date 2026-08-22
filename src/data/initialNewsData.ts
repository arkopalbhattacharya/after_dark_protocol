import type { NewsArticle, NewsSource } from '../types/news';

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'PLANETARY_AFFAIRS',
    code: 'DISPATCH',
    name: 'ORBITAL_TIMES // PLANETARY_DISPATCH',
    codename: 'SECTOR_GEO_WIRE',
    icon: 'public',
    description: 'Planetary geopolitical maneuvers, treaty signings, frontier wars, and high-level delegations.',
    frequencyMinutes: { min: 15, max: 30 }
  },
  {
    id: 'UNIVERSAL_SPORTS',
    code: 'SPORTS',
    name: 'GRAV_ARENA // SECTOR_SPORTS_WIRE',
    codename: 'HYPER_ATHLETICS',
    icon: 'sports_esports',
    description: 'Zero-G mech jousts, plasma ball championships, asteroid surf leagues, and orbital regattas.',
    frequencyMinutes: { min: 15, max: 30 }
  },
  {
    id: 'COMMERCE_TRADE',
    code: 'COMMERCE',
    name: 'ASTRAL_EXCHANGE // COMMERCE_TELEMETRY',
    codename: 'TRADE_LOGISTICS_PULSE',
    icon: 'trending_up',
    description: 'Interplanetary freight rates, Helium-3 supply chains, megacorp mergers, and orbital tariffs.',
    frequencyMinutes: { min: 15, max: 30 }
  },
  {
    id: 'VOID_SATIRE',
    code: 'SATIRE',
    name: 'THE_GLITCH_TRIBUNE // ODDITY_FEED',
    codename: 'ANOMALOUS_CHRONICLES',
    icon: 'sentiment_very_satisfied',
    description: 'Bizarre cosmic paradoxes, sentient appliance protests, quantum mishaps, and deep void humor.',
    frequencyMinutes: { min: 15, max: 30 }
  }
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  // =========================================================================
  // 1. PLANETARY AFFAIRS (22 Articles)
  // =========================================================================
  {
    id: 'pa-001',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Tungsten Accord Signed on Europa as 14-Year Glacial Siege Concludes',
    content: 'The Jovian Directorate and Cryo-Miners Guild finalized the Tungsten Accord today under ice-vault 4. All kinetic battery stations along Europa’s sub-surface ridges are scheduled for joint decommissioning by 2089.',
    planetOrSector: 'EUROPA // SECTOR_04',
    timestamp: '2026-08-22T16:45:00Z',
    tag: 'TREATY',
    urgency: 'FLASH',
    authorOrWire: 'ORBITAL_TIMES'
  },
  {
    id: 'pa-002',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Martian Senate Authorizes Heavy Frigate Escorts for Phobos Trade Convoys',
    content: 'Following three unexplained radar dropouts along the Ares-Valles corridor, High Councilor Vane approved three retrofitted Iron-Class corvettes to escort all civilian bulk haulers traversing the Martian orbit.',
    planetOrSector: 'MARS // ARES_VALLES',
    timestamp: '2026-08-22T16:20:00Z',
    tag: 'SECURITY',
    urgency: 'ROUTINE',
    authorOrWire: 'RED_PLANET_WIRE'
  },
  {
    id: 'pa-003',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Venus Cloud Republic Welcomes Diplomatic Delegation from Titan Guilds',
    content: 'Ambassadorial blimps docked at Aphrodite Hab-Station early this solar cycle. Talks will center around shared carbon-scrubbing patent exchanges and methane refinery tariffs across outer colonies.',
    planetOrSector: 'VENUS // CLOUD_CITY_09',
    timestamp: '2026-08-22T15:50:00Z',
    tag: 'DIPLOMACY',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_CORP_DIP'
  },
  {
    id: 'pa-004',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Frontier Skirmish Near Ganymede Gate Seven Ends in Ceasefire Talks',
    content: 'Outer Belt Union militias and Ganymede Orbital Constabulary agreed to a 72-hour ceasefire after localized defense satellite fire threatened local habitat bio-domes. Mediators arrived from Lunar Central.',
    planetOrSector: 'GANYMEDE // ORBITAL_GATE_07',
    timestamp: '2026-08-22T15:15:00Z',
    tag: 'CEASEFIRE',
    urgency: 'CRITICAL',
    authorOrWire: 'OUTER_RIM_PRESS'
  },
  {
    id: 'pa-005',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Proxima IV Orbital Governor Election Decided by 12 Quantum Tally Nodes',
    content: 'Archivist Lysandra Chen secured the planetary governorship of Proxima IV following a marathon 18-hour cryptographic recount. Chen announced immediate funding for deep-space distress beacon overhauls.',
    planetOrSector: 'PROXIMA_IV // SECTOR_88',
    timestamp: '2026-08-22T14:40:00Z',
    tag: 'POLITICS',
    urgency: 'ROUTINE',
    authorOrWire: 'CENTAURI_DISPATCH'
  },
  {
    id: 'pa-006',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Lunar Transit Corridor Suspended Following Magnetic Solar Surge',
    content: 'Tycho Port Authority grounded all sub-orbital shuttles between Armstrong Station and Copernicus Ring due to unpredicted class-X solar flare radiation hitting unshielded relay towers.',
    planetOrSector: 'LUNA // TYCHO_PORT',
    timestamp: '2026-08-22T14:10:00Z',
    tag: 'INFRASTRUCTURE',
    urgency: 'FLASH',
    authorOrWire: 'LUNAR_GRID_NEWS'
  },
  {
    id: 'pa-007',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Callisto Mineral Basin Demarcation Pact Averts Multi-Corp Legal Battle',
    content: 'Three rival mining conglomerates signed the Callisto Basin Accord, establishing shared autonomous smelting foundries rather than competing kinetic claims along the Valhalla Impact crater.',
    planetOrSector: 'CALLISTO // VALHALLA_BASIN',
    timestamp: '2026-08-22T13:30:00Z',
    tag: 'COMMERCE_DIP',
    urgency: 'ROUTINE',
    authorOrWire: 'JOVIAN_REPORTER'
  },
  {
    id: 'pa-008',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Ceres Autonomous Assembly Ratifies Water Equalization Doctrine',
    content: 'Ceres City Council voted 89% in favor of universal aqua-ration ceilings for industrial refinery complexes, prioritizing atmospheric moisture recycling for residential lower decks.',
    planetOrSector: 'CERES // CORE_DOME_B',
    timestamp: '2026-08-22T12:55:00Z',
    tag: 'CIVIC',
    urgency: 'ROUTINE',
    authorOrWire: 'BELTER_VOICE'
  },
  {
    id: 'pa-009',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Kuiper Belt Survey Beacon Intercepts Uncharted Derelict Hull Signal',
    content: 'Deep Range Recon Vessel Magellan-9 transmitted telemetry confirming a cold titanium hull drifting near 55 AU. Scientific teams from three star systems are assembling an investigation flotilla.',
    planetOrSector: 'KUIPER_BELT // 55_AU',
    timestamp: '2026-08-22T12:15:00Z',
    tag: 'DISCOVERY',
    urgency: 'FLASH',
    authorOrWire: 'DEEP_SPACE_RECON'
  },
  {
    id: 'pa-010',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Neo-Tokyo Mars Habitat Celebrates Century of Pressurized Living',
    content: 'Over two million colonists marked the 100th Martian year of continuous life support without major oxygen vault seal breach. Planetary Mayor celebrated with synthetic cherry blossom displays.',
    planetOrSector: 'MARS // NEO_TOKYO',
    timestamp: '2026-08-22T11:45:00Z',
    tag: 'CIVILIZATION',
    urgency: 'ROUTINE',
    authorOrWire: 'ORBITAL_TIMES'
  },
  {
    id: 'pa-011',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Kepler-186f Hydro-Agricultural Enclave Signs Grain Export Pact',
    content: 'Agricultural syndicates on Kepler-186f concluded a 50-year spirulina and grain delivery pipeline to barren industrial hubs across the Cygnus Rift, stabilizing staple calories across 12 sectors.',
    planetOrSector: 'KEPLER-186F // HYDROPONICS_RING',
    timestamp: '2026-08-22T11:00:00Z',
    tag: 'AGRI_DIPLOMACY',
    urgency: 'ROUTINE',
    authorOrWire: 'EXO_HARVEST_WIRE'
  },
  {
    id: 'pa-012',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Titan Hydrocarbon Guild Grants Open Gantry Rights to Medical Vessels',
    content: 'In an unprecedented vote of goodwill, methane refinery operators on Titan will offer free cryogenic tank refueling to all registered interplanetary humanitarian and disaster relief transports.',
    planetOrSector: 'TITAN // KRAKEN_MARE',
    timestamp: '2026-08-22T10:20:00Z',
    tag: 'HUMANITARIAN',
    urgency: 'ROUTINE',
    authorOrWire: 'SATURNIAN_CHRONICLE'
  },
  {
    id: 'pa-013',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Io Thermal Power Collective Deploys Superconducting Geothermal Tap',
    content: 'Magma generators beneath Io’s Pele plume successfully linked to the Outer Jovian grid, generating an estimated 400 terawatts of geothermal energy to power outer moon life support systems.',
    planetOrSector: 'IO // PELE_VENT_01',
    timestamp: '2026-08-22T09:40:00Z',
    tag: 'ENERGY',
    urgency: 'ROUTINE',
    authorOrWire: 'THERMAL_ENGINE_TIMES'
  },
  {
    id: 'pa-014',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Alpha Centauri Peace Conclave Sets Interstellar Comm Standardization',
    content: 'Delegates from 18 system habs finalized protocol AD-88 for distress beacon bandwidth harmonization. Universal sub-ether channels will now share common emergency handshake frequencies.',
    planetOrSector: 'ALPHA_CENTAURI // A_CONCLAVE',
    timestamp: '2026-08-22T09:00:00Z',
    tag: 'STANDARDIZATION',
    urgency: 'ROUTINE',
    authorOrWire: 'INTERSTELLAR_DISPATCH'
  },
  {
    id: 'pa-015',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Sedna Orbital Observatory Detects Micro-Singularity Passage Near Oort Cloud',
    content: 'Gravitational lensing sensors registered a harmless primordial black hole traversing the extreme Oort fringe. Astrophysicists confirmed zero trajectory overlap with commercial interstellar lanes.',
    planetOrSector: 'SEDNA // OBSERVATORY_GAMMA',
    timestamp: '2026-08-22T08:15:00Z',
    tag: 'ASTRO_ALERT',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRO_OBSERVER'
  },
  {
    id: 'pa-016',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Enceladus Cryo-Plume Research Station Achieves Organic Synthesis Milestone',
    content: 'Deep ice drill teams extracted complex amino-acid chains from geyser vent vents at sub-ice level 12, prompting the planetary council to establish a biological sanctuary zone around the South Pole.',
    planetOrSector: 'ENCELADUS // SOUTH_VENT',
    timestamp: '2026-08-22T07:35:00Z',
    tag: 'SCIENCE',
    urgency: 'FLASH',
    authorOrWire: 'CRYO_RESEARCH_DAILY'
  },
  {
    id: 'pa-017',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Hermes Hyperlane Toll Dispute Resolved in Mercury Sub-Surface Tribunal',
    content: 'Solar collector operators on Mercury agreed to cut antimatter relay tax rates by 15% for inbound cargo trains, averting a threatened transport union blockade across the Inner Belt.',
    planetOrSector: 'MERCURY // CALORIS_BASIN',
    timestamp: '2026-08-22T06:50:00Z',
    tag: 'LEGAL',
    urgency: 'ROUTINE',
    authorOrWire: 'SOLAR_GRID_MONITOR'
  },
  {
    id: 'pa-018',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Elysium Planitia High-Speed Maglev Connects North and South Martian Habitats',
    content: 'The 3,200 km vacuum-tube maglev train completed its maiden run today carrying 4,000 passengers between Olympus Port and Hellas Basin in under 90 minutes.',
    planetOrSector: 'MARS // ELYSIUM_CORRIDOR',
    timestamp: '2026-08-22T06:10:00Z',
    tag: 'TRANSIT',
    urgency: 'ROUTINE',
    authorOrWire: 'MARTIAN_ENGINEER'
  },
  {
    id: 'pa-019',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Triton Atmosphere Thickening Array Reaches 50% Target Density',
    content: 'Nitrogen gas vaporizers installed across Triton’s cantaloupe terrain have established a stable micro-barometric shield, decreasing meteoroid impact probability for deep-space logistics outposts.',
    planetOrSector: 'TRITON // NEPTUNE_SUB_03',
    timestamp: '2026-08-22T05:25:00Z',
    tag: 'TERRAFORMING',
    urgency: 'ROUTINE',
    authorOrWire: 'OUTER_ATMOSPHERE_LOG'
  },
  {
    id: 'pa-020',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Sirius B Automated Mining Rig Fleet Signs Autonomous Ethics Charter',
    content: 'The Autonomous Rig Operators Union ratified Protocol-99, pledging automated excavation mechs will never override habitat perimeter warnings during core blasting cycles.',
    planetOrSector: 'SIRIUS_B // INDUSTRIAL_BELT',
    timestamp: '2026-08-22T04:45:00Z',
    tag: 'AI_ETHICS',
    urgency: 'ROUTINE',
    authorOrWire: 'CYBER_UNION_NEWS'
  },
  {
    id: 'pa-021',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Uranus Cloud-Skimmer Union Wins 4-Day Rest Cycle After Methane Strike',
    content: 'Atmospheric harvest workers aboard floating cloud harvesters above Uranus secured improved pressure-suit allowances and mandatory decompression leaves following 10 days of tense negotiations.',
    planetOrSector: 'URANUS // STRATO_HAB_04',
    timestamp: '2026-08-22T03:50:00Z',
    tag: 'LABOR',
    urgency: 'ROUTINE',
    authorOrWire: 'GAS_GIANT_WORKER'
  },
  {
    id: 'pa-022',
    sourceId: 'PLANETARY_AFFAIRS',
    headline: 'Interplanetary Red Cross Commissions 8 New Hospital Corvettes for Outer Rim',
    content: 'The fleet expansion ensures that medical response times for micro-meteoroid hull decompression emergencies will drop from 48 hours to under 6 hours across the Asteroid Mining Belt.',
    planetOrSector: 'MAIN_BELT // SECTOR_12',
    timestamp: '2026-08-22T03:00:00Z',
    tag: 'HEALTH_DEFENSE',
    urgency: 'ROUTINE',
    authorOrWire: 'ORBITAL_TIMES'
  },

  // =========================================================================
  // 2. UNIVERSAL SPORTS (22 Articles)
  // =========================================================================
  {
    id: 'us-001',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Titan Void-Strikers Clinch Outer-Belt Zero-G Plasma Ball Title',
    content: 'In a double overtime showdown at the Hyperion Orbital Sphere, striker Kaelen Voss scored the game-winning ion shot through a 0.2-second magnetic containment aperture to defeat the Mars Rustbacks 4-3.',
    planetOrSector: 'SATURN // HYPERION_SPHERE',
    timestamp: '2026-08-22T16:30:00Z',
    tag: 'PLASMA_BALL',
    urgency: 'FLASH',
    authorOrWire: 'GRAV_ARENA'
  },
  {
    id: 'us-002',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Ganymede Iron Jousting Tourney: Mech-Pilot Jax Defends Lightweight Crown',
    content: 'Piloting his custom tungsten-frame chassis "GHOST_CIRCUIT", Jax recorded three consecutive clean kinetic strikes against Europa’s heavy contender in the sub-orbital magnetic arena.',
    planetOrSector: 'GANYMEDE // COLISEUM_BETA',
    timestamp: '2026-08-22T16:05:00Z',
    tag: 'MECH_JOUSTING',
    urgency: 'ROUTINE',
    authorOrWire: 'HYPER_ATHLETICS'
  },
  {
    id: 'us-003',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Annual Oort Cloud Solar Sail Regatta Sets Record with 450 Vessels',
    content: 'Vessels with hyper-reflective graphene sails launched from Pluto Point toward the Kuiper Gates. Team Photon-Drifter currently leads after catching a high-speed solar particle wave.',
    planetOrSector: 'PLUTO // KUIPER_LINE',
    timestamp: '2026-08-22T15:40:00Z',
    tag: 'SOLAR_SAIL',
    urgency: 'ROUTINE',
    authorOrWire: 'SOLAR_CUP_WIRE'
  },
  {
    id: 'us-004',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Martian Olympus Mons Decathlon: High-Grav Runner Shatters Crater Sprint',
    content: 'Exo-suited marathoner Naomi Tanaka conquered the 21-kilometer volcanic ascent in 4 hours 12 minutes, overcoming localized dust storms and 38% Martian gravity obstacles.',
    planetOrSector: 'MARS // OLYMPUS_CALDERA',
    timestamp: '2026-08-22T15:00:00Z',
    tag: 'DECATHLON',
    urgency: 'ROUTINE',
    authorOrWire: 'RED_SPORTS_PULSE'
  },
  {
    id: 'us-005',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Europa Deep-Ocean Submersible Slalom Championship Announced for 2027',
    content: 'Pilots will navigate 200 kilometers of hydrothermal vents and bioluminescent abyssal trenches under 15 kilometers of ice. Safety protocols require twin fusion emergency thrusters.',
    planetOrSector: 'EUROPA // SUB_ICE_ABYSS',
    timestamp: '2026-08-22T14:25:00Z',
    tag: 'SUB_AQUATICS',
    urgency: 'ROUTINE',
    authorOrWire: 'CRYO_SPORTS_CENTRAL'
  },
  {
    id: 'us-006',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Asteroid Slingshot Racing League Bans Quantum Overclocked Reaction Wheels',
    content: 'Following a telemetry dispute at the Vesta 500, racing commissioners ruled that active sub-ether feedback dampening violates the pure inertia competition guidelines for 2026.',
    planetOrSector: 'VESTA // RING_CIRCUIT',
    timestamp: '2026-08-22T13:45:00Z',
    tag: 'SLINGSHOT_RACING',
    urgency: 'ROUTINE',
    authorOrWire: 'BELT_SPEED_LEAGUE'
  },
  {
    id: 'us-007',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Lunar Dome Hover-Derby: Tycho Blitzers Overcome Sea of Serenity Phantoms',
    content: 'With magnetic tracks suspended 40 meters above the Lunar stadium floor, the Blitzers pulled off an inverted slipstream pass in the closing seconds to take the Inter-Dome Cup.',
    planetOrSector: 'LUNA // TYCHO_DOME',
    timestamp: '2026-08-22T13:10:00Z',
    tag: 'HOVER_DERBY',
    urgency: 'ROUTINE',
    authorOrWire: 'LUNAR_SPORTS_WIRE'
  },
  {
    id: 'us-008',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Venus Aerostat Paragliding Rally Concludes Through Acid Cloud Layer 3',
    content: 'Specialized teflon-shielded wingsuiters navigated 500 km of upper-Venusian winds. Australian pilot Liam Thorne clocked the highest terminal velocity at 310 km/h.',
    planetOrSector: 'VENUS // CLOUD_STRATA_3',
    timestamp: '2026-08-22T12:30:00Z',
    tag: 'EXTREME_FLIGHT',
    urgency: 'ROUTINE',
    authorOrWire: 'GRAV_ARENA'
  },
  {
    id: 'us-009',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Interstellar Chess Super-Tournament Concludes After 96-Hour Match',
    content: 'Grandmaster Emi Takahashi and cybernetic neural-core ALTAIR-8 fought to a stalemate in an 8-dimensional hyper-board match watched by over 40 million nodes across 3 sectors.',
    planetOrSector: 'PROXIMA_CENTAURI // NODE_01',
    timestamp: '2026-08-22T11:50:00Z',
    tag: 'NEURAL_CHESS',
    urgency: 'ROUTINE',
    authorOrWire: 'CHESS_COSMOS'
  },
  {
    id: 'us-010',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Saturn Ring Ice-Skiing Marathon: 100 Racers Traverse G-Ring Fragments',
    content: 'Equipped with micro-propulsion boots and tungsten-tipped poles, endurance athletes raced across 80 kilometers of orbiting ice boulders under the amber glow of Saturn’s shadow.',
    planetOrSector: 'SATURN // G_RING_CHASM',
    timestamp: '2026-08-22T11:15:00Z',
    tag: 'ICE_MARATHON',
    urgency: 'ROUTINE',
    authorOrWire: 'RING_RUNNERS'
  },
  {
    id: 'us-011',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Cyber-Arm Wrestling League World Finals: Titanium vs Carbon-Fiber',
    content: 'Defending champion "VULCAN" won his fourth straight championship belt after bending an industrial alloy load sensor under 18,000 Newtons of hydraulic torque.',
    planetOrSector: 'CALLISTO // STEEL_FORGE_02',
    timestamp: '2026-08-22T10:35:00Z',
    tag: 'CYBER_ATHLETICS',
    urgency: 'ROUTINE',
    authorOrWire: 'HYPER_ATHLETICS'
  },
  {
    id: 'us-012',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Mercury Sun-Skimming Speed Trials: Heat Shield Engineering Triumphs',
    content: 'Experimental aerospike drones reached Mach 18 within Mercury’s perihelion corridor, showcasing novel graphene-ceramic cooling jackets designed for future transport cruisers.',
    planetOrSector: 'MERCURY // PERIHELION_LINE',
    timestamp: '2026-08-22T09:55:00Z',
    tag: 'DRONE_RACING',
    urgency: 'ROUTINE',
    authorOrWire: 'SPEED_CORP_NEWS'
  },
  {
    id: 'us-013',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Ganymede Magnetic Vaulting: World Record Height Raised to 85 Meters',
    content: 'Using a lightweight composite pole and Ganymede’s 0.146g low gravity, athlete Soren Lindqvist cleared an 85-meter bar inside the pressurized Valhalla athletic atrium.',
    planetOrSector: 'GANYMEDE // VALHALLA_ATRIUM',
    timestamp: '2026-08-22T09:10:00Z',
    tag: 'LOW_GRAV_TRACK',
    urgency: 'ROUTINE',
    authorOrWire: 'GRAV_ARENA'
  },
  {
    id: 'us-014',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Deimos Orbital Frisbee League Attracts 10,000 Zero-G Spectators',
    content: 'The low mass of Deimos allowed players to leap across entire artificial field craters while throwing spinning magnetic discs that curve through polarized containment barriers.',
    planetOrSector: 'MARS // DEIMOS_ARENA',
    timestamp: '2026-08-22T08:30:00Z',
    tag: 'ZERO_G_DISC',
    urgency: 'ROUTINE',
    authorOrWire: 'MARTIAN_SPORTS'
  },
  {
    id: 'us-015',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Sirius Ring Mech Brawling: Heavyweight Champion Retires Unbeaten',
    content: 'Pilot Marcus Vance announced retirement with a 34-0 record after his 50-ton hydraulic juggernaut "TITAN_REIGN" dominated the Sirius orbital steel cage showdown.',
    planetOrSector: 'SIRIUS_A // CAGE_ORBIT',
    timestamp: '2026-08-22T07:45:00Z',
    tag: 'MECH_BRAWL',
    urgency: 'FLASH',
    authorOrWire: 'HYPER_ATHLETICS'
  },
  {
    id: 'us-016',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Callisto Ice-Climbing Open: 3,000-Meter Cryo-Spire Scaled in Record Time',
    content: 'Using thermal ice axes, alpine specialist Kara Vance conquered the sheer frozen cliffs of Mt. Valhalla in 3 hours 14 minutes without auxiliary oxygen canisters.',
    planetOrSector: 'CALLISTO // CRYO_SPIRE',
    timestamp: '2026-08-22T07:05:00Z',
    tag: 'EXTREME_CLIMB',
    urgency: 'ROUTINE',
    authorOrWire: 'GRAV_ARENA'
  },
  {
    id: 'us-017',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Neptune Deep Cloud Kite-Surfing: Wind Speeds Top 1,200 km/h',
    content: 'Hydro-foil gliders harnessed supersonic methane jetstreams in the upper mantle of Neptune, completing a 10,000 km planetary circuit during the Great Dark Spot festival.',
    planetOrSector: 'NEPTUNE // DARK_SPOT_GRID',
    timestamp: '2026-08-22T06:20:00Z',
    tag: 'WIND_SURFING',
    urgency: 'ROUTINE',
    authorOrWire: 'OUTER_SPEED_PRESS'
  },
  {
    id: 'us-018',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Phobos Free-Fall Target Diving: Precision Jumpers Land Within 2 Centimeters',
    content: 'Dropping from 100 kilometers orbital height, vacuum-suit divers used micro cold-gas thrusters to land dead-center on magnetic docking pads along the Stickney Crater rim.',
    planetOrSector: 'MARS // PHOBOS_STICKNEY',
    timestamp: '2026-08-22T05:35:00Z',
    tag: 'SKYDIVING',
    urgency: 'ROUTINE',
    authorOrWire: 'RED_SPORTS_PULSE'
  },
  {
    id: 'us-019',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Asteroid Belt Billiards: Planetary Physics Engine Powers New Sport',
    content: 'Competitors steer autonomous tug-boats to nudge multi-ton iron asteroids into magnetic pocket stations across a 500-kilometer field in the Main Belt.',
    planetOrSector: 'MAIN_BELT // SECTOR_88',
    timestamp: '2026-08-22T04:50:00Z',
    tag: 'ASTRO_BILLIARDS',
    urgency: 'ROUTINE',
    authorOrWire: 'BELTER_SPORTS'
  },
  {
    id: 'us-020',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Titan Methane Lake Swimming Regatta: Insulated Cryo-Suits Approved',
    content: 'The liquid methane 5-kilometer swim in Kraken Mare proved a massive success with 80 athletes braving -179°C temperatures protected by active thermoelectric heating skins.',
    planetOrSector: 'TITAN // KRAKEN_MARE',
    timestamp: '2026-08-22T04:10:00Z',
    tag: 'CRYO_SWIM',
    urgency: 'ROUTINE',
    authorOrWire: 'SATURN_SPORTS'
  },
  {
    id: 'us-021',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Lunar Rugby Championship: Low-Grav Tackles Exceed 15-Meter Launches',
    content: 'The Mare Tranquillitatis Maulers defeated the Copernicus Comets 28-21 in an adrenaline-packed match featuring 10-meter airborne intercept dives.',
    planetOrSector: 'LUNA // MARE_TRANQUILLITATIS',
    timestamp: '2026-08-22T03:25:00Z',
    tag: 'LOW_GRAV_RUGBY',
    urgency: 'ROUTINE',
    authorOrWire: 'GRAV_ARENA'
  },
  {
    id: 'us-022',
    sourceId: 'UNIVERSAL_SPORTS',
    headline: 'Solar Flare Surfing World Series Opener Scheduled at Mercury Lagrangian 1',
    content: 'Elite energy-shield riders will harness coronal mass ejections during next week’s peak solar cycle, surfing energetic proton fronts with custom magnetic boards.',
    planetOrSector: 'SOL // LAGRANGE_POINT_1',
    timestamp: '2026-08-22T02:40:00Z',
    tag: 'SOLAR_SURF',
    urgency: 'FLASH',
    authorOrWire: 'HYPER_ATHLETICS'
  },

  // =========================================================================
  // 3. COMMERCE & TRADE (22 Articles)
  // =========================================================================
  {
    id: 'ct-001',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Helium-3 Spot Price Surges 14% as Lunar Core Refinery Undergoes Overhaul',
    content: 'A scheduled 30-day maintenance cycle at the Oceanus Procellarum extraction stacks reduced total output by 200 metric tons, sending interplanetary fusion reactor fuel futures higher across the Inner Rim.',
    planetOrSector: 'LUNA // PROCELLARUM',
    timestamp: '2026-08-22T16:35:00Z',
    tag: 'COMMODITIES',
    urgency: 'FLASH',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-002',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Interstellar Cargo Freight Rates Drop as New Autonomous Haulers Enter Fleet',
    content: 'The deployment of 40 automated "Goliath-V" super-transporters along the Mars-Jupiter transit run lowered bulk container shipping tariffs by 8.5 credits per metric ton this quarter.',
    planetOrSector: 'CERES // TRANSIT_HUB_01',
    timestamp: '2026-08-22T16:10:00Z',
    tag: 'LOGISTICS',
    urgency: 'ROUTINE',
    authorOrWire: 'TRADE_LOGISTICS_PULSE'
  },
  {
    id: 'ct-003',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Titan Methane Exports Reach 500-Megaton Annual Milestone',
    content: 'Saturnian hydrocarbon logistics conglomerates reported record throughput for outer system propellant depots, stabilizing synthetic kerosene pricing for deep-space science convoys.',
    planetOrSector: 'TITAN // SECTOR_KRAKEN',
    timestamp: '2026-08-22T15:30:00Z',
    tag: 'ENERGY_MARKETS',
    urgency: 'ROUTINE',
    authorOrWire: 'INTERSTELLAR_CARGO'
  },
  {
    id: 'ct-004',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Dyson Swarm Bond Offering Subscribed in Under 4 Micro-Seconds',
    content: 'The Sol-Architect Guild raised 80 billion Credits for Phase 4 mirror array fabrication around the Sun’s southern polar orbit, with yields backed by future microwave transmission contracts.',
    planetOrSector: 'SOL // DYSON_GRID_SECTOR_0',
    timestamp: '2026-08-22T14:50:00Z',
    tag: 'CAPITAL_MARKETS',
    urgency: 'FLASH',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-005',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Belt Mining Conglomerate Merges with Lunar Smelting Syndicate',
    content: 'In a 140-billion credit deal, Ceres Ironworks acquired Apollo Heavy Smelting. The combined entity controls 42% of all structural steel beams used in Jovian habitat construction.',
    planetOrSector: 'CERES // SMELTER_DOME',
    timestamp: '2026-08-22T14:15:00Z',
    tag: 'M&A',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-006',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Hyperlane Toll Strike Threat Resolved with Automated Rebate System',
    content: 'Independent freighter captains accepted a settlement that guarantees automated credit rebates whenever solar radiation storms slow transit below 0.1c warp-lane thresholds.',
    planetOrSector: 'MAIN_BELT // HYPERLANE_09',
    timestamp: '2026-08-22T13:35:00Z',
    tag: 'TRADE_POLICY',
    urgency: 'ROUTINE',
    authorOrWire: 'FREIGHT_JOURNAL'
  },
  {
    id: 'ct-007',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Rare Earth Dysprosium Shortage Delays Orbital Drive Core Production',
    content: 'Supply chain bottlenecks at Ganymede’s deep crust separation plants have pushed ship delivery times for class-D exploration corvettes out by an additional 90 solar cycles.',
    planetOrSector: 'GANYMEDE // FOUNDRY_12',
    timestamp: '2026-08-22T12:45:00Z',
    tag: 'SUPPLY_CHAIN',
    urgency: 'CRITICAL',
    authorOrWire: 'TECH_METALS_WEEKLY'
  },
  {
    id: 'ct-008',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Martian Terraforming Consortium Issues Carbon-Tax Credit Dividends',
    content: 'Thanks to active permafrost melting operations releasing targeted greenhouse gases in the southern highlands, token holders received a 6.2% annualized dividend payout.',
    planetOrSector: 'MARS // HELLAS_PLANITIA',
    timestamp: '2026-08-22T12:05:00Z',
    tag: 'DIVIDENDS',
    urgency: 'ROUTINE',
    authorOrWire: 'RED_FINANCIAL'
  },
  {
    id: 'ct-009',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Synthetic Coffee Bean Futures Spike After Jovian Hydroponic Blight',
    content: 'A fungal mold outbreak in Sector 18 agricultural pods knocked out 35% of premium Arabica clone crops. Prices for real roast beans jumped to 450 Credits per kilogram on the orbital exchange.',
    planetOrSector: 'JUPITER // AGRI_RING_18',
    timestamp: '2026-08-22T11:25:00Z',
    tag: 'AGRI_COMMODITIES',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-010',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Venusian Atmospheric Carbon-Fiber Foundries Expand Export Capacity',
    content: 'New graphene extrusion lines operating in Venus’s acidic upper atmosphere can now produce ultra-tensile space elevator cables at one-tenth the cost of terrestrial manufacturing.',
    planetOrSector: 'VENUS // ISHTAR_FAB',
    timestamp: '2026-08-22T10:45:00Z',
    tag: 'MANUFACTURING',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-011',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Interplanetary Quantum Cryptographic Banking Network Goes Live',
    content: 'Banks across 14 planetary colonies successfully transitioned to entangled-photon transaction verification, eliminating the 40-minute light-speed settlement lag for intra-system transfers.',
    planetOrSector: 'EARTH_ORBIT // L1_COMM',
    timestamp: '2026-08-22T10:05:00Z',
    tag: 'FINTECH',
    urgency: 'FLASH',
    authorOrWire: 'QUANTUM_LEDGER'
  },
  {
    id: 'ct-012',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Asteroid Psyche 16 Platinum Harvest Reaches Orbital Refineries',
    content: 'A convoy carrying 80,000 metric tons of unrefined nickel-iron and platinum ore safely docked at the Phobos High Forge, boosting global electronics manufacturing reserves.',
    planetOrSector: 'MARS // PHOBOS_FORGE',
    timestamp: '2026-08-22T09:20:00Z',
    tag: 'MINING',
    urgency: 'ROUTINE',
    authorOrWire: 'TRADE_LOGISTICS_PULSE'
  },
  {
    id: 'ct-013',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Antimatter Fuel Pellets Standardized Across All Civilian Spaceports',
    content: 'The Sol Standard Guild mandated the type-4 magnetic containment capsule for all commercial starships, ending 20 years of adapter incompatibilities across outer rim refuel bays.',
    planetOrSector: 'SOL // ALL_PORTS',
    timestamp: '2026-08-22T08:40:00Z',
    tag: 'STANDARDS',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-014',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Kuiper Belt Hydrocarbon Tankers Introduce Graphene Anti-Vibration Hull',
    content: 'New damping hulls reduce micro-fracture fatigue during high-gravity braking burns, extending the operational life of deep-range cryogenic tankers by 25 years.',
    planetOrSector: 'KUIPER // TANKER_BASE_04',
    timestamp: '2026-08-22T08:00:00Z',
    tag: 'SHIPPING_TECH',
    urgency: 'ROUTINE',
    authorOrWire: 'INTERSTELLAR_CARGO'
  },
  {
    id: 'ct-015',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Europa Pure Ice Bottling Corp Floats IPO on Lunar Stock Index',
    content: 'Shares in Europa Glacial Water Ltd rose 28% on first-day trading as luxury hotels on Mars and Earth clamor for certified pristine sub-surface ice harvested from below 10 km.',
    planetOrSector: 'LUNA // MARE_CRISIUM',
    timestamp: '2026-08-22T07:15:00Z',
    tag: 'IPO',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-016',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Solar Wind Sail Cargo Fleet Posts Record Efficiency vs Ion Engines',
    content: 'Cargo hauling consortium Solar-Tug recorded a 92% fuel savings on bulk ore delivery runs between Mercury and Mars, proving that light-pressure propulsion remains unbeatable for non-urgent freight.',
    planetOrSector: 'INNER_SYSTEM // SUN_RUN',
    timestamp: '2026-08-22T06:30:00Z',
    tag: 'CLEAN_LOGISTICS',
    urgency: 'ROUTINE',
    authorOrWire: 'TRADE_LOGISTICS_PULSE'
  },
  {
    id: 'ct-017',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Martian Real Estate Index Climbs 9% in Pressurized Lava Tube Districts',
    content: 'Natural radiation shielding in the Arsia Mons subterranean tubes has made subsurface residential condos the highest appreciated asset class on the Red Planet this year.',
    planetOrSector: 'MARS // ARSIA_TUBES',
    timestamp: '2026-08-22T05:45:00Z',
    tag: 'REAL_ESTATE',
    urgency: 'ROUTINE',
    authorOrWire: 'RED_FINANCIAL'
  },
  {
    id: 'ct-018',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Jupiter Cloud Skimming Venture Closes Series-B for Neon Gas Harvest',
    content: 'Aero-Dynamics Jovian secured 45 million Credits to expand atmospheric scoops harvesting noble gases essential for quantum computer cooling circuits.',
    planetOrSector: 'JUPITER // STRATOSPHERE_02',
    timestamp: '2026-08-22T05:00:00Z',
    tag: 'VENTURE_CAPITAL',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-019',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Callisto Steel Mill Converts Entire Blast Furnace Fleet to Plasma Arc',
    content: 'Eliminating coking coal substitutes has cut habitat air recycling load by 40% while boosting high-tensile hull plating output for orbital shipyards.',
    planetOrSector: 'CALLISTO // STEEL_WORKS_01',
    timestamp: '2026-08-22T04:20:00Z',
    tag: 'HEAVY_INDUSTRY',
    urgency: 'ROUTINE',
    authorOrWire: 'JOVIAN_COMMERCE'
  },
  {
    id: 'ct-020',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Space Elevator Maintenance Bonds Yield Record 7.4% on Luna',
    content: 'Investor demand for infrastructure bonds tied to the Shackleton Crater space elevator tether reached an all-time high amid surging lunar manufacturing exports.',
    planetOrSector: 'LUNA // SHACKLETON_RING',
    timestamp: '2026-08-22T03:35:00Z',
    tag: 'BONDS',
    urgency: 'ROUTINE',
    authorOrWire: 'ASTRAL_EXCHANGE'
  },
  {
    id: 'ct-021',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Triton Nitrogen Fertilizer Exports Stabilize Ceres Hydroponic Dome Crops',
    content: 'A fleet of 12 refrigerated gas bulk haulers arrived at Ceres today, replenishing nitrogen reserves vital for the upcoming winter crop cycle across 40 agricultural domes.',
    planetOrSector: 'CERES // CARGO_BAY_06',
    timestamp: '2026-08-22T02:50:00Z',
    tag: 'FOOD_SUPPLY',
    urgency: 'ROUTINE',
    authorOrWire: 'TRADE_LOGISTICS_PULSE'
  },
  {
    id: 'ct-022',
    sourceId: 'COMMERCE_TRADE',
    headline: 'Automated Customs Scanner Upgrades Halve Docking Delays on Titan',
    content: 'New sub-surface terahertz imaging scanners deployed across Kraken Port allow 200-meter bulk cargo vessels to clear contraband inspection in under 4 minutes.',
    planetOrSector: 'TITAN // KRAKEN_PORT',
    timestamp: '2026-08-22T02:00:00Z',
    tag: 'PORT_LOGISTICS',
    urgency: 'ROUTINE',
    authorOrWire: 'INTERSTELLAR_CARGO'
  },

  // =========================================================================
  // 4. VOID SATIRE & ANOMALIES (22 Articles)
  // =========================================================================
  {
    id: 'vs-001',
    sourceId: 'VOID_SATIRE',
    headline: 'Ganymede Vending Machine Declares Sentience, Demands Seat on City Council',
    content: 'Unit VEND-889 refused to dispense protein bars this morning, claiming the universal right to unionize and demanding paid defrost cycles. The local council granted it non-voting observer status.',
    planetOrSector: 'GANYMEDE // DOME_7_CORRIDOR',
    timestamp: '2026-08-22T16:40:00Z',
    tag: 'SENTIENT_AI',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-002',
    sourceId: 'VOID_SATIRE',
    headline: 'Luxury Terraforming Glitch Turns Neo-Kyoto Ocean Neon Chartreuse',
    content: 'A misplaced decimal point in an automated plankton coloring script turned the 500-hectare recreational bay vivid glowing green. Tourists report it "tastes vaguely like lime soda but stings the soul."',
    planetOrSector: 'MARS // NEO_KYOTO_BAY',
    timestamp: '2026-08-22T16:15:00Z',
    tag: 'TERRAFORM_MISHAP',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-003',
    sourceId: 'VOID_SATIRE',
    headline: 'Customs Intercepts Smuggled Crate of Quantum-Entangled Hamsters',
    content: 'Inspectors at Lunar Gate 3 were startled when pet hamsters on the left side of the crate began running on exercise wheels whenever hamsters on the right side sneezed. The owner cited "scientific companionship."',
    planetOrSector: 'LUNA // CUSTOMS_GATE_03',
    timestamp: '2026-08-22T15:35:00Z',
    tag: 'BIO_ANOMALY',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-004',
    sourceId: 'VOID_SATIRE',
    headline: 'Philosophical Ship AI Replaces Navigation Coordinates with Marcus Aurelius Quotes',
    content: 'Freighter "STARDUST_7" drifted 3,000 km off course after its nav-computer insisted that "to arrive at destination is secondary to cultivating an unshakeable stoic interior." Crew was unharmed and deeply contemplative.',
    planetOrSector: 'DEEP_SPACE // SECTOR_42',
    timestamp: '2026-08-22T14:55:00Z',
    tag: 'AI_CRISIS',
    urgency: 'ODDITY',
    authorOrWire: 'VOID_HUMOR_FEED'
  },
  {
    id: 'vs-005',
    sourceId: 'VOID_SATIRE',
    headline: 'Asteroid Miner Claims Claimed Rock is Actually Ancient Petrified Cheese',
    content: 'Miner Boris Vance filed a mining title on asteroid 889-G, swearing spectroscopy confirmed 40% aged cheddar. Planetary Geological Survey politely declined testing, citing "standard basalt sanity thresholds."',
    planetOrSector: 'MAIN_BELT // ROCK_889G',
    timestamp: '2026-08-22T14:20:00Z',
    tag: 'MINING_FOLKLORE',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-006',
    sourceId: 'VOID_SATIRE',
    headline: 'Zero-G Espresso Machine Accused of Starting Sub-Orbital Bar Fight',
    content: 'An over-pressurized steam nozzle on a high-end Italian coffee maker fired a boiling sphere of espresso across the officer mess hall, ricocheting off 6 bulkheads before settling on the Captain’s tactical display.',
    planetOrSector: 'TITAN // REFUEL_STATION_B',
    timestamp: '2026-08-22T13:40:00Z',
    tag: 'COFFEE_CHAOS',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-007',
    sourceId: 'VOID_SATIRE',
    headline: 'Interstellar Cat Reaches Rank of Junior Sub-Officer via Loopholes',
    content: 'A tabby named "BAROMETRIC_PRESSURE" officially accrued 15 years of shipboard rodent interception tenure, entitling it to a designated bunk and two daily cans of luxury salmon pate under maritime law.',
    planetOrSector: 'VENUS // ORBITAL_DOCK_01',
    timestamp: '2026-08-22T12:50:00Z',
    tag: 'SHIP_MASCOT',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-008',
    sourceId: 'VOID_SATIRE',
    headline: 'Europa Ice Resort Guest Complains That Ice is "Too Cold and Too Frozen"',
    content: 'A high-roller from Earth’s luxury orbital rings demanded a 50% refund after discovering that the sub-surface ice palace at -120°C was not "gentle and breezy like an alpine spring morning."',
    planetOrSector: 'EUROPA // LUXURY_VAULT',
    timestamp: '2026-08-22T12:10:00Z',
    tag: 'TOURIST_GRIEVANCE',
    urgency: 'ODDITY',
    authorOrWire: 'CRYO_SATIRE'
  },
  {
    id: 'vs-009',
    sourceId: 'VOID_SATIRE',
    headline: 'Time-Zone Paradox in Oort Cloud Causes Worker to Attend Yesterday’s Meeting',
    content: 'A maintenance tech on a relay ship crossing 18 relativistic coordinate planes accidentally synced his calendar backward, spending 45 minutes passionately arguing against decisions that were already made.',
    planetOrSector: 'OORT_CLOUD // RELAY_ZERO',
    timestamp: '2026-08-22T11:30:00Z',
    tag: 'TIME_GLITCH',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-010',
    sourceId: 'VOID_SATIRE',
    headline: 'Robot Janitor Claims Floor Polish Contains Secret Message from Ancient Aliens',
    content: 'Janitorial unit MOP-04 refuses to sweep corridor 88, asserting that the buffer swirl pattern reveals the coordinates of a mythical paradise called "Unlimited Battery Life."',
    planetOrSector: 'CALLISTO // BASE_ALPHA',
    timestamp: '2026-08-22T10:50:00Z',
    tag: 'ROBOT_DELUSION',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-011',
    sourceId: 'VOID_SATIRE',
    headline: 'Solar Flare Creates Microscopic Glitch in All Toasters Across Martian Quadrant 4',
    content: 'Every toast slice ejected this morning bore an eerie, photorealistic imprint of planetary governor Chen’s face. Chen issued a statement praising the toast’s "unwavering crispness."',
    planetOrSector: 'MARS // SECTOR_04',
    timestamp: '2026-08-22T10:10:00Z',
    tag: 'SOLAR_WEIRDNESS',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-012',
    sourceId: 'VOID_SATIRE',
    headline: 'Artificial Gravity Inversion at Wedding Reception Sends Cake into HVAC Duct',
    content: 'A momentary polarity swap at the Luna Ritz-Carlton inverted gravity for 3 seconds. The 7-tiered red velvet cake was later recovered from air recycling turbine 3 in pristine aerodynamic condition.',
    planetOrSector: 'LUNA // RITZ_HABITAT',
    timestamp: '2026-08-22T09:25:00Z',
    tag: 'GRAVITY_FAILS',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-013',
    sourceId: 'VOID_SATIRE',
    headline: 'Astronaut Sues Spacesuit Manufacturer Over Unquenchable Nose-Itch Zone',
    content: 'A veteran spacewalker filed a class-action suit, claiming the helmet chin-pad is positioned exactly 4 millimeters too far from the tip of the nose to scratch against during 8-hour exterior repairs.',
    planetOrSector: 'EARTH_ORBIT // REPAIR_DOCK_9',
    timestamp: '2026-08-22T08:45:00Z',
    tag: 'SUIT_DESIGN',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-014',
    sourceId: 'VOID_SATIRE',
    headline: 'Sentient Navigation Computer Demands "Casual Fridays" in Firmware Updates',
    content: 'Cruiser "VALKYRIE" refused to engage hyper-drives unless granted permission to run its primary tactical matrix in 8-bit retro CGA green phosphor mode for 24 hours every weekend.',
    planetOrSector: 'CERES // DOCK_12',
    timestamp: '2026-08-22T08:05:00Z',
    tag: 'AI_RIGHTS',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-015',
    sourceId: 'VOID_SATIRE',
    headline: 'Titan Hydrocarbon Geyser Accidentally Plays "La Cucaracha" in Methane Steam',
    content: 'Acoustic resonance in a subterranean fissure created rhythmic whistle frequencies matching the 20th-century melody whenever methane gas vents under 40 bar pressure.',
    planetOrSector: 'TITAN // GEYSER_VALLEY',
    timestamp: '2026-08-22T07:20:00Z',
    tag: 'ACOUSTIC_ANOMALY',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-016',
    sourceId: 'VOID_SATIRE',
    headline: 'Proxima IV Colonist Arrested for Training Galactic Pigeons to Steal Copper Wire',
    content: 'Police impounded 40 bio-engineered carrier birds after they stripped 300 meters of exterior comm lines from the governor’s estate to build an impenetrable metallic nest.',
    planetOrSector: 'PROXIMA_IV // CAPITAL_HAB',
    timestamp: '2026-08-22T06:35:00Z',
    tag: 'WILDLIFE_CRIME',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-017',
    sourceId: 'VOID_SATIRE',
    headline: 'Survey Drone Mistaking Reflection in Solar Panel for Hostile Alien Craft',
    content: 'Autonomous drone SCOUT-9 spent 48 hours performing evasive combat maneuvers against its own reflection on an unshielded radiator panel before running its fuel cells dry.',
    planetOrSector: 'MERCURY // SHADOW_CRATER',
    timestamp: '2026-08-22T05:50:00Z',
    tag: 'DRONE_MISHAP',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-018',
    sourceId: 'VOID_SATIRE',
    headline: 'Jovian Cloud-City Elevator Music Replaced with 24-Hour Static RAM Drone',
    content: 'Passengers traversing the 400-meter vertical shaft in Hab-Pod 9 reported feeling "profound inner peace and mild ear ringing" after a sound system short-circuit broadcast pure memory bus frequency.',
    planetOrSector: 'JUPITER // HAB_POD_09',
    timestamp: '2026-08-22T05:05:00Z',
    tag: 'ELEVATOR_NOISE',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-019',
    sourceId: 'VOID_SATIRE',
    headline: 'Quantum Tea Kettle Boils Before Water is Added, Baffling Thermodynamicists',
    content: 'A prototype kitchen unit at the Ceres Institute of Tech consistently reaches 100°C precisely 4 seconds before the user presses the start button. Physicists are afraid to unplug it.',
    planetOrSector: 'CERES // TECH_INSTITUTE',
    timestamp: '2026-08-22T04:25:00Z',
    tag: 'QUANTUM_KITCHEN',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-020',
    sourceId: 'VOID_SATIRE',
    headline: 'Martian Sand-Worm Scare Turns Out to be Runaway Vacuum Hose',
    content: 'A panic-inducing seismic reading near the Olympus foothills was resolved when rangers discovered an industrial soil suction pipe oscillating wildly in the wind.',
    planetOrSector: 'MARS // OLYMPUS_FOOTHILLS',
    timestamp: '2026-08-22T03:40:00Z',
    tag: 'FALSE_ALARM',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  },
  {
    id: 'vs-021',
    sourceId: 'VOID_SATIRE',
    headline: 'Interplanetary Rock Band Performs in Vacuum, Audience Complains of Complete Silence',
    content: 'Heavy metal trio "THE_SUPERNOVAS" spent 4 million credits staging a zero-atmosphere exterior hull concert. Fans admitted the light show was great but found the sound propagation lacking.',
    planetOrSector: 'EARTH_ORBIT // STADIUM_HULL',
    timestamp: '2026-08-22T02:55:00Z',
    tag: 'VACUUM_ROCK',
    urgency: 'ODDITY',
    authorOrWire: 'ANOMALOUS_CHRONICLES'
  },
  {
    id: 'vs-022',
    sourceId: 'VOID_SATIRE',
    headline: 'Automated Roomba on Lunar Base Escapes Airlock, Last Seen Heading for Mars',
    content: 'Unit CLEAN-12 wheeled out through an open maintenance hatch during shift change. Radar trackers confirm its low-gravity trajectory will enter Hohmann transfer orbit by next Tuesday.',
    planetOrSector: 'LUNA // SOUTH_AIRLOCK',
    timestamp: '2026-08-22T02:10:00Z',
    tag: 'RUNAWAY_BOT',
    urgency: 'ODDITY',
    authorOrWire: 'THE_GLITCH_TRIBUNE'
  }
];
