/**
 * @license MIT
 * ============================================================================
 * src/data/artistLore.mjs — Engine Room Records (engineroom.raggiesoft.com)
 * ============================================================================
 * Architectural Overview:
 * Canonical narrative & roster metadata for all 7 musical projects distributed
 * under Engine Room Records. Combined at build time with the live album/track
 * manifest in `raggiesoft-assets/engine-room-records/catalog.json`.
 *
 * Cross-Property Routing Rules:
 * - Every artist, album, and track reference links directly to The Listening
 *   Room (`https://music.raggiesoft.com/...`).
 * - Every companion novel reference links directly to RaggieSoft Book Reader
 *   (`https://books.raggiesoft.com/books/...`).
 * - The Stardust Engine's deep band lore lives on its dedicated cosmic property
 *   (`https://stardust.raggiesoft.com`), while `engineroom.raggiesoft.com`
 *   provides their executive roster overview and direct handoff.
 * ============================================================================
 */

export const ARTIST_LORE_PROFILES = {
  'the-stardust-engine': {
    errId: 'ERR-001',
    slug: 'the-stardust-engine',
    name: 'The Stardust Engine',
    tagline: '80s Synth-Pop, Progressive Arena Rock & The Cosmic Tidal Lock Sound™',
    origin: 'Blacksburg, Virginia (Commonwealth Polytechnic Institute / CPI)',
    yearsActive: '1985–Present (2004–2014 Burnout Hiatus)',
    primaryGenre: '80s Synth-Pop / Arena Rock / 80s Cosmic Pop',
    listeningRoomUrl: 'https://music.raggiesoft.com/the-stardust-engine',
    dedicatedSiteUrl: 'https://stardust.raggiesoft.com',
    bookReaderUrl: 'https://books.raggiesoft.com/books/stardust-engine',
    secondaryBookUrl: 'https://books.raggiesoft.com/books/erin',
    secondaryBookTitle: 'Before the Distance: The Story of John & Erin',
    heroImage: 'https://assets.raggiesoft.com/stardust-engine/images/stardust-engine-hero.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/the-stardust-engine/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/the-stardust-engine/band-logo.png',
    summary:
      'The founding five-member family unit behind Engine Room Records. Forged at Commonwealth Polytechnic Institute (CPI) in 1985–1986 by siblings Ryan, Cassidy, and Holly O\'Connell and identical twin cousins Evan and Tyler Wright, The Stardust Engine blends soaring 1980s stadium synth-rock with Cassidy\'s zero-gravity Cosmic Tidal Lock Sound™.',
    whatKindOfMusic:
      'High-energy 1980s stadium AOR, driving analog synthesizers, sibling vocal duets, progressive rock suites (including the 15-minute "Escape Velocity / Ad Astra"), and lush zero-gravity "80s Cosmic Pop."',
    members: [
      {
        name: 'Ryan O\'Connell',
        role: 'Co-Lead Vocals, Lead Electric Guitar & Lyricist',
        notes: 'T10 paraplegic wheelchair user following the December 1990 I-81 black-ice crash; Cassidy\'s brother and safe person.'
      },
      {
        name: 'Cassidy O\'Connell',
        role: 'Co-Lead Vocals, Analog Synthesizers, Piano & Chief Audio Architect',
        notes: 'Pioneer of The Cosmic Tidal Lock Sound™ and composer of the 15-minute magnum opus "Escape Velocity (Ad Astra)."'
      },
      {
        name: 'Holly O\'Connell, J.D., CFA',
        role: 'Manager, CEO (Engine Room Records, LLC) & Legal Architect',
        notes: 'Architect of the 1992 Friction walkout, the 1994 Apex settlement, and the $2.4B O\'Connell Family Revocable Trust; Class A CDL co-driver.'
      },
      {
        name: 'Evan Wright',
        role: 'Bass Guitar, Fretless Bass, Moog Taurus Pedals & Systems',
        notes: 'Identical twin maternal cousin; joined Ryan and Cassidy at CPI in 1986; Class A CDL co-driver.'
      },
      {
        name: 'Tyler Wright',
        role: 'Acoustic/Electronic Drums, Percussion & Fleet Logistics',
        notes: 'Identical twin maternal cousin; joined Ryan and Cassidy at CPI in 1986; Class A CDL lead driver of The Iron Horse & RLFD30.'
      }
    ],
    lorePillars: [
      {
        title: 'The 1986 Band Name Canon ("Stardust" + "Engine")',
        body: 'In 1986, when identical twin cousins Evan and Tyler Wright joined Cassidy and Ryan O\'Connell at CPI, the very first song the four of them wrote together was "The Stardust Engine"—celebrating their shared love of the cosmos ("Stardust") and the rockets to get you there ("Engine"). Too scared to shop the song around at first, they used its title to name the band before releasing it in 1987 as Track 13 on Electric Color. When Apex Records signed them, Apex executives cheaply branded Cassidy as their "Stardust" and Ryan as their "Engine"—a 1980s corporate marketing gimmick the band despises because it strips away their genuine love of the cosmos and rocket propulsion.'
      },
      {
        title: 'The 1992 "Friction" Emancipation & Birth of the Fortress',
        body: 'After Ryan\'s December 1990 spinal cord injury, Apex executive Julian Vance attempted to coerce Ryan and Cassidy into a predatory, fabricated tabloid narrative ("The Fatal Assumption") during the October 14, 1992 Friction sessions. Holly O\'Connell intervened, won criminal and civil victories in 1994, reclaimed 100% of the band\'s masters, and founded Engine Room Records, LLC in-universe as an impenetrable artist sanctuary.'
      },
      {
        title: 'Dedicated Cosmic Portal (stardust.raggiesoft.com)',
        body: 'Because The Stardust Engine\'s biography, 12+ album eras, rolling sanctuary fleet (the 2002 Sainte-Claire 45H3 "The Iron Horse" and 2004 Prairie Coachworks RLFD30 Launch Unit #001), and companion novels span four decades, their full band lore now resides on its own dedicated cosmic portal at stardust.raggiesoft.com.'
      }
    ]
  },

  'fractured-prisms': {
    errId: 'ERR-002',
    slug: 'fractured-prisms',
    name: 'Fractured Prisms',
    tagline: 'British Synth-Pop & Gaslamp-Lit 1980s Progressive Art-Rock Operas',
    origin: 'London, England & The Hollow Square Sanctuary (Maryland, USA)',
    yearsActive: '1983–Present (Rescued via the 1999 London Discovery)',
    primaryGenre: '80s Progressive Art-Rock / British Synth-Pop / Victorian Rock Opera',
    listeningRoomUrl: 'https://music.raggiesoft.com/fractured-prisms',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/fractured-prisms',
    bookReaderUrl: 'https://books.raggiesoft.com/books/fractured-prisms',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/band-logo.jpg',
    summary:
      'Formed by surviving British siblings Claire and Rhys Manning after the 1981 Shap Fell train disaster, Fractured Prisms crafts towering 1980s analog modular synthesizer rock operas anchored by Claire\'s sacred wooden concert flute ("Gwen\'s Flute") inside their gaslamp-lit Maryland estate, The Hollow Square.',
    whatKindOfMusic:
      'Lush 1980s British progressive synth-pop, classical wooden concert flute lead melodies, Fairlight CMI and modular analog sequencers, and cinematic Victorian-meets-1980s concept albums.',
    members: [
      {
        name: 'Claire Manning',
        role: 'Lead Concert Flute ("Gwen\'s Flute"), Vocals & Classical Arrangement',
        notes: 'Wheelchair user and survivor of the December 1981 Shap Fell rail tragedy; performs from a custom sensory-safe stage sanctuary.'
      },
      {
        name: 'Rhys Manning',
        role: 'Modular Analog Synthesizers, Sequencers, Vocals & Acoustic Architecture',
        notes: 'Claire\'s fiercely protective older brother; engineered The Hollow Square in Maryland to resurrect their family\'s musical voices.'
      }
    ],
    lorePillars: [
      {
        title: '1981 Shap Fell Tragedy & The Fragile Fortress ("The Hollow Square")',
        body: 'In December 1981, a catastrophic train derailment at Shap Fell claimed the lives of the Manning parents and younger sister Gwen, leaving Claire paralyzed and deeply traumatized. Using their family\'s generational inheritance, Rhys relocated Claire from England to a secluded historic estate in Maryland—"The Hollow Square"—filling its gaslamp-lit halls with towering banks of vintage analog synthesizers mapped to each lost family member\'s musical range.'
      },
      {
        title: '1983 "Carnaby Street" & 1984 "1883 (The Rock Opera)"',
        body: 'Operating under a strictly independent distribution-only arrangement, Rhys and Claire debuted in 1983 with Carnaby Street—marrying driving British synth-pop with Gwen\'s rescued wooden concert flute ("Safe Harbor"). In 1984, they released the monumental two-disc concept album 1883, slipping 100 years backward through time inside The Hollow Square.'
      },
      {
        title: '1985: The Colonial Theatre Incident & Live at Independence Stadium',
        body: 'During their 1985 American Shores tour, an infamous accessibility failure at the historic Colonial Theatre in Phoenixville, Pennsylvania—where venue staff failed to provide safe wheelchair access for Claire—sparked Rhys Manning\'s legendary stage confrontation. Refusing to ever subject Claire to cramped, inaccessible club venues again, the duo rented Philadelphia\'s 90,000-seat Independence Stadium directly, engineering a barrier-free, sensory-controlled stadium triumph captured on 1985\'s Live at Independence Stadium. In 1999, during The Stardust Engine\'s Hard Reset tour in London, Holly and Cassidy O\'Connell uncovered the Carnaby Street master vaults and welcomed Claire and Rhys into the Engine Room Records family.'
      }
    ]
  },

  'the-paper-wall': {
    errId: 'ERR-003',
    slug: 'the-paper-wall',
    name: 'The Paper Wall',
    tagline: 'Cinematic Literary Rock Operas & Alternative Industrial Sanctuary',
    origin: 'Blacksburg, Virginia & Haven City / Seattle, Washington',
    yearsActive: '2000–Present (Signed 2001, formerly working title "Mirage")',
    primaryGenre: 'Literary Rock Opera / Alternative & Industrial Rock',
    listeningRoomUrl: 'https://music.raggiesoft.com/the-paper-wall',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/the-paper-wall',
    bookReaderUrl: 'https://books.raggiesoft.com/books/luna-leo',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/the-paper-wall/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/the-paper-wall/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/the-paper-wall/band-logo.jpg',
    summary:
      'Engine Room Records\' first outside signing (2001). Formed by Julian Croft ("Leo") and Maya Sterling ("Olivia") alongside Julian\'s sisters and cousins, The Paper Wall transforms survival, disability rights, and found-family sanctuary into multi-volume literary rock operas.',
    whatKindOfMusic:
      'Emotionally raw theatrical rock operas, dynamic quiet-to-loud alternative rock builds, industrial percussion, and autobiographical storytelling across multi-book concept albums.',
    members: [
      {
        name: 'Julian Croft ("Leo")',
        role: 'Lead Vocals, Lyricist & Primary Composer',
        notes: 'Wheelchair user who escaped domestic abuse on a cross-country Greyhound bus journey documented in Static & Silence.'
      },
      {
        name: 'Maya Sterling ("Olivia")',
        role: 'Percussion, Co-Lead Vocals & Care Partner',
        notes: 'Julian\'s life partner; legally separated only by the "Paper Wall" trust required to preserve Julian\'s critical healthcare.'
      },
      {
        name: 'The Sisters — Izzy ("Luna"), Bea ("Stella"), & Charlotte ("Charlie") Croft',
        role: 'Guitars, Keys, Harmonies & Protective Inner Circle',
        notes: 'Julian\'s devoted sisters who anchored his recovery and return to Safe Harbor.'
      },
      {
        name: 'The Cousins — Diana Hale, Ellie Cross, & Fiona Croft',
        role: 'Bass, Strings, Stage Security & Operations',
        notes: 'The "Enforcers" ensuring zero boundary violations at rehearsals and live performances.'
      }
    ],
    lorePillars: [
      {
        title: 'October 2000 at Kincaid Hall: "We\'re Going to Build an Engine, Too"',
        body: 'In October 2000, nineteen-year-old Julian Croft—newly arrived at CPI after escaping his abuser ("Vanessa")—rolled into the back of Kincaid Hall during orientation. Watching Ryan O\'Connell command 60,000 Ironheads from his wheelchair during "Ignition (The Forger\'s Call)" surrounded by his protective family, Julian gripped Maya\'s hand and realized he did not need to be "cured" to command a stage: "We\'re going to build an engine, too."'
      },
      {
        title: 'Why the Band Is Named "The Paper Wall" (The SSI/Medicaid Marriage Penalty)',
        body: 'Julian Croft and Maya Sterling live as a devoted married couple, yet remain legally single on paper. Under restrictive federal disability statutes, legal marriage would immediately strip Julian of his SSI and Medicaid coverage—a catastrophic loss of life-sustaining care. Holly O\'Connell drafted a specialized special-needs and IP asset protection trust—colloquially called "The Paper Wall"—allowing Engine Room Records, LLC to fund their housing, touring, and medical autonomy without disqualifying Julian\'s benefits.'
      },
      {
        title: 'Static & Silence (Books 1 & 2) & The Pasco Lock',
        body: 'Released in 2001, the two-volume rock opera Static & Silence (Book 1: The Long Road West and Book 2: The Journey Home) chronicles Julian\'s harrowing escape—from "The Pasco Lock" and "Curbstone, 4 AM" to "165 to Burien," "A TTY Lifeline," and "Sanctuary."'
      }
    ]
  },

  'the-arctic-symphony-project': {
    errId: 'ERR-005',
    slug: 'the-arctic-symphony-project',
    name: 'The Arctic Symphony Project',
    tagline: 'Holiday Symphonic Rock, Neoclassical Metal & Trilingual Winter Operas',
    origin: 'Ewell (Williamsburg), Virginia & Llanfair PG, Anglesey, Wales',
    yearsActive: '1996–Present (Originally recorded as The Winter Palace)',
    primaryGenre: 'Holiday Symphonic Rock / Neoclassical Metal / Rock Opera',
    listeningRoomUrl: 'https://music.raggiesoft.com/the-arctic-symphony-project',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/the-arctic-symphony-project',
    bookReaderUrl: 'https://books.raggiesoft.com/books/julian',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/the-arctic-symphony-project/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/the-arctic-symphony-project/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/the-arctic-symphony-project/band-logo.jpg',
    summary:
      'Born on a freezing December night in 1996 when the Rowlands and Harrison siblings turned their Williamsburg living room into an emergency broadcast studio to guide abducted 14-year-old Julian ("Julep") home across the Appalachian Mountains with "Upon This Winter\'s Night."',
    whatKindOfMusic:
      'Sweeping Trans-Siberian-scale symphonic rock, soaring distorted electric guitars, Baroque cello counter-melodies, silver glockenspiel, Brahms music-box motifs, and trilingual choirs (Cymraeg Welsh, Québécois French, and English).',
    members: [
      {
        name: 'Julian "Julep" Rowlands',
        role: 'Conceptual Heart, Music Box Motif & Archival Narrator',
        notes: '14-year-old wheelchair user whose December 1996 abduction to Ohio and survival sparked "Upon This Winter\'s Night."'
      },
      {
        name: 'Gabriel & Gwendolyn Rowlands',
        role: 'Lead Electric Guitar (Gabriel) & Lead Cello / Orchestral Direction (Gwendolyn)',
        notes: 'Julian\'s fiercely protective older twin siblings who engineered the 1996 Appalachian radio beacon.'
      },
      {
        name: 'Maria Harrison-Rowlands & Clara Harrison',
        role: 'Silver Glockenspiel, Soprano Vocals & Trilingual Choral Arrangements',
        notes: 'Identical twin sisters who wove Julian\'s Brahms "Wiegenlied" music box into the symphonic rock anthem.'
      }
    ],
    lorePillars: [
      {
        title: 'December 1996: The Appalachian Radio Beacon ("Upon This Winter\'s Night")',
        body: 'When fourteen-year-old Julian Rowlands was abducted toward Ohio in December 1996 without his custom wheelchair, his older twin siblings Gabriel and Gwendolyn and twins Maria and Clara transformed their Ewell, Virginia living room into a war room. Sampling Julian\'s cherished brass Brahms "Wiegenlied" music box and pairing it with roaring electric guitars, cello, and silver glockenspiel, they pressed the track to DAT and convinced late-night FM engineers along the Blue Ridge and Appalachian mountain spine to broadcast "Upon This Winter\'s Night" every hour on the hour—giving Julian a coded acoustic compass that he had not been forgotten.'
      },
      {
        title: 'The Vanguard Horizon Vault & The 2007 Trilingual Liberation',
        body: 'In 1996, predatory label Vanguard Horizon forced the family to cut a 3-minute English-only radio edit while locking their full 5-minute Welsh (Cymraeg), Québécois French, and Trilingual "Family Mix" masters in a corporate vault. A decade later, in 2007, Samantha and Engine Room Records acquired and liquidated Vanguard Horizon\'s catalog—returning 100% of the master tapes to the Rowlands family.'
      },
      {
        title: 'Tales from the Solstice (3-Disc Symphonic Rock Opera)',
        body: 'With their masters liberated, the ensemble re-christened themselves The Arctic Symphony Project and recorded the 3-disc symphonic rock opera Tales from the Solstice (2007), uniting Julian\'s 1996 Appalachian beacon with Matthew\'s cross-country survival and culminating in the restored Trilingual "Family Mix" of "Upon This Winter\'s Night." Read the complete companion novel Upon This Winter\'s Night: The Story of Julian Rowlands at books.raggiesoft.com/books/julian.'
      }
    ]
  },

  'crimson-node': {
    errId: 'ERR-006',
    slug: 'crimson-node',
    name: 'Crimson Node',
    tagline: 'The Albemarle County Garage Sessions — Stadium Synth-Prog & DevOps Rock',
    origin: 'Albemarle County (Charlottesville), Virginia ("The Kids House")',
    yearsActive: '2000–Present',
    primaryGenre: 'Stadium Synth-Prog / 80s Arena Rock / Power-Pop',
    listeningRoomUrl: 'https://music.raggiesoft.com/crimson-node',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/crimson-node',
    bookReaderUrl: 'https://books.raggiesoft.com/books/crimson-node',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/crimson-node/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/crimson-node/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/crimson-node/band-logo.jpg',
    summary:
      'Engineered inside a sound-dampened Albemarle County garage by the Miller, Brooks, and Pelletier family phalanx, Crimson Node is directed by non-verbal wheelchair-using producer Matt Miller from his custom Tactile Command Rig and fronted by a powerhouse rotating vocal lineup.',
    whatKindOfMusic:
      'High-octane stadium synth-prog, precision rhythm-section grooves ("Quality of Service", "The Flight Path"), and rotating four-part female lead vocals.',
    members: [
      {
        name: 'Matt Miller ("The Manager / The Crimson Node")',
        role: 'Executive Producer, Sequencer Routing & Tactile Command Rig Architect',
        notes: 'Functionally non-verbal wheelchair user who directs every mix, arrangement, and cue from his custom Vanguard LogicPad rig without speaking a single word.'
      },
      {
        name: 'Emily Miller, Rachel Miller, Sarah Miller, Jessica Brooks, Chloe Brooks, & Shiloh Brooks',
        role: 'The Rotating Vocal Phalanx & Multi-Instrumentalists',
        notes: 'Rejecting a single frontperson, the women of the Albemarle compound trade stadium belts, punk grit, and soaring harmonies track by track.'
      },
      {
        name: 'Elise & Elodie Pelletier ("The Pelletier Twins") + Hailey & Heather Bouchard',
        role: 'Dual Synthesizers, Harmonic Counterpoint & CCC Ensemble',
        notes: 'Provide the locked stereo keyboard and rhythm foundation across the Albemarle sessions.'
      }
    ],
    lorePillars: [
      {
        title: 'Matt Miller\'s Tactile Command Rig (Zero-Verbal Production Mastery)',
        body: 'Crimson Node was never built for commercial industry approval—it was engineered inside a sound-dampened garage at "The Kids House" in Albemarle County, Virginia. At the center of the room sits Matt Miller in his manual wheelchair. Functionally non-verbal, Matt designed a color-coded Tactile Command Rig that routes stems, click tracks, and dynamic bus compression in real time, proving that communication and leadership transcend spoken speech.'
      },
      {
        title: 'The Rotating Vocalist Architecture',
        body: 'Rather than placing the pressure of frontperson duties on one singer, Emily, Jessica, Rachel, and Shiloh rotate through the vocal booth based on the emotional telemetry of each song—moving effortlessly from the arena-sized synth-prog of "The Flight Path" to the DevOps-inspired precision of "Quality of Service."'
      },
      {
        title: 'Northwood, Piedmont & The Family Phalanx',
        body: 'Behind the music stands a fierce narrative of educational advocacy and neurodivergent protection across Northwood and Piedmont—chronicled in the companion narrative archive at books.raggiesoft.com/books/crimson-node.'
      }
    ]
  },

  'mana-canvas': {
    errId: 'ERR-004',
    slug: 'mana-canvas',
    name: 'Mana Canvas',
    tagline: 'Symphonic Fantasy Rock, 16-Bit SNES Chiptune & Acoustic RPG Alchemy',
    origin: 'The Aethelgard Archives / Blacksburg Studio Collective',
    yearsActive: '2017–Present',
    primaryGenre: 'Symphonic Fantasy Rock / 16-Bit Chiptune Prog / Acoustic Alchemy',
    listeningRoomUrl: 'https://music.raggiesoft.com/mana-canvas',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/mana-canvas',
    bookReaderUrl: 'https://books.raggiesoft.com/books/aethel',
    secondaryBookUrl: 'https://books.raggiesoft.com/books/runebreaker',
    secondaryBookTitle: 'Runebreaker',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/band-logo.jpg',
    summary:
      'The official musical voice of the Aethel Saga and Runebreaker universes. Mana Canvas fuses authentic 16-bit Super Famicom / SNES SPC700 synth nostalgia with roaring progressive rock guitars, orchestral strings, and tavern acoustic storytelling.',
    whatKindOfMusic:
      '16-bit SNES RPG chiptune leads fused with symphonic progressive metal, Celtic/fantasy acoustic ballads, and boss-battle rock operas.',
    members: [
      {
        name: 'The Aethelgard Sound Team',
        role: '16-Bit SPC700 Synthesis, Symphonic Orchestration & Progressive Rock Ensemble',
        notes: 'In-house fantasy soundtrack collective scoring Songs of the Untethered and The Silver Gauntlet of Aethel.'
      }
    ],
    lorePillars: [
      {
        title: 'Scoring the Aethel Saga & Runebreaker',
        body: 'Mana Canvas bridges RaggieSoft\'s literary fantasy universes (The Aethel Saga and Runebreaker on books.raggiesoft.com) with Engine Room Records\' audio engineering. Every release is structured like a golden-era 1990s 16-bit RPG soundtrack brought to life with a full rock orchestra.'
      },
      {
        title: 'Songs of the Untethered & The Silver Gauntlet of Aethel',
        body: 'Across releases like Songs of the Untethered and The Silver Gauntlet of Aethel, Mana Canvas pairs nostalgic pixel-era melodies with full-bandwidth progressive rock instrumentation—celebrating characters who break free from predetermined system rules.'
      }
    ]
  },

  'firelight': {
    errId: 'ERR-007',
    slug: 'firelight',
    name: 'Firelight',
    tagline: 'Heartland Acoustic Rock, Warm Campfire Harmonies & Ruby Mountain Anthology',
    origin: 'Ruby Mountain & Blue Ridge Sanctuary, Virginia',
    yearsActive: '1989–Present',
    primaryGenre: 'Heartland Rock / Acoustic Americana / Campfire Folk-Rock',
    listeningRoomUrl: 'https://music.raggiesoft.com/firelight',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/firelight',
    bookReaderUrl: 'https://books.raggiesoft.com/books/ruby-mountain',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/images/og/engine-room-og.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/images/og/engine-room-og.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/images/logos/engine-room-records-logo.png',
    summary:
      'Spanning a 16-album narrative anthology rooted in the Ruby Mountain story world, Firelight trades stadium synthesizers for warm acoustic guitars, mandolin, Hammond organ, and porch-light vocal harmonies chronicling decades of resilience and family healing.',
    whatKindOfMusic:
      'Warm acoustic heartland rock, roots Americana, fingerpicked acoustic guitars, pedal steel, and intimate storytelling.',
    members: [
      {
        name: 'The Ruby Mountain Ensemble',
        role: 'Acoustic Guitars, Mandolin, Upright Bass, Warm Hammond Organ & Ensemble Vocals',
        notes: 'Chronicles the multi-decade Ruby Mountain narrative arc from 1989\'s The Spark in the Pine to 2016\'s Embers of the Dawn.'
      }
    ],
    lorePillars: [
      {
        title: 'A 16-Album Acoustic Chronicle (1989–2016)',
        body: 'While The Stardust Engine and Fractured Prisms explore cosmic and Victorian synth-rock architectures, Firelight anchors the acoustic heartland wing of Engine Room Records. Across sixteen chronological albums—beginning with 1989\'s The Spark in the Pine and 1990\'s Chasing the Horizon through 2016\'s Embers of the Dawn—Firelight scores the quiet triumphs, mountain winters, and enduring bonds of the Ruby Mountain sanctuary.'
      },
      {
        title: 'Companion Literary Archive: Ruby Mountain',
        body: 'Every era of Firelight\'s catalog pairs with the Ruby Mountain literary archives on RaggieSoft Book Reader (books.raggiesoft.com/books/ruby-mountain), while all playable tracks and full lyrics stream in The Listening Room at music.raggiesoft.com/firelight.'
      }
    ]
  }
};
