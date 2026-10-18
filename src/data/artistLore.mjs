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
 *   (`https://books.raggiesoft.com/...`).
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
    bookReaderUrl: 'https://books.raggiesoft.com/stardust-engine',
    secondaryBookUrl: 'https://books.raggiesoft.com/erin',
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
    origin: 'Romford (East London), UK & Williamsport / Hagerstown, Maryland',
    yearsActive: '1983–Present (Rescued via the 1999 London Discovery)',
    primaryGenre: '80s Progressive Art-Rock / British Synth-Pop / Victorian Rock Opera',
    listeningRoomUrl: 'https://music.raggiesoft.com/fractured-prisms',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/fractured-prisms',
    bookReaderUrl: 'https://books.raggiesoft.com/fractured-prisms',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/fractured-prisms/band-logo.jpg',
    summary:
      'Formed by surviving British-American siblings Claire Manning (older sister; autistic and living with lifelong cerebral palsy, uses a manual wheelchair) and Rhys Manning (younger brother; neurotypical synthesizer architect and lifelong safe person) after the winter 1981 M6 Shap Fell motorway pileup claimed the other four members of the Manning Family Orchestra. Fleeing to their father\'s vacant 1960s ranch house in Williamsport, Maryland, they built "The Fragile Fortress"—weaving the salvaged instruments of their lost family (including Cousin Gwen\'s wooden concert flute) into towering 1980s analog synthesizer rock operas set inside the gaslamp-lit 1883 Victorian sanctuary of The Hollow Square.',
    whatKindOfMusic:
      'Lush 1980s British progressive synth-pop, classical wooden concert flute lead melodies ("Gwen\'s Flute"), Roland/Yamaha analog sequencers and LinnDrum gated percussion, and cinematic Victorian-meets-1980s concept albums.',
    members: [
      {
        name: 'Claire Manning ("The Voice in the Fog")',
        role: 'Lead Vocals, Cousin Gwen\'s Wooden Concert Flute & Lyrical Vanguard',
        notes: 'Older sister (20 in 1981; 22 in 1983). Has lived with cerebral palsy her entire life (uses a manual wheelchair) and is autistic (highly verbal), experiencing intense sensory depth and nighttime terrors anchored by her brother Rhys.'
      },
      {
        name: 'Rhys Manning ("The Mechanical Heart")',
        role: 'Analog Synthesizers, Sequencers, LinnDrum Programming, Julian\'s Rickenbacker Bass, Simon\'s Guitars & Lifelong Safe Person',
        notes: 'Younger brother (18 in 1981; 20 in 1983). Neurotypical anchor and 24/7 caretaker for Claire since childhood in their accessible Romford home; engineered the Williamsport Fragile Fortress and Hagerstown Colonial Theatre sanctuary.'
      },
      {
        name: 'Gwen Manning — In Memoriam (The Missing Four)',
        role: 'Cousin • Woodwinds (Oboe, Clarinet & Wooden Concert Flute)',
        notes: 'Lost in the winter 1981 M6 Shap Fell motorway crash. Composed the centering "Safe Harbor" melody before shows; her wooden concert flute—the very first instrument the family ever purchased—was salvaged from the wreckage and is played by Claire on "Mirrors of Yesterday" and "The Hollow Square."'
      },
      {
        name: 'Alistair Manning — In Memoriam (The Missing Four)',
        role: 'Older Brother • Acoustic Drum Kit, Gongs & Orchestral Chimes',
        notes: 'Lost in the winter 1981 M6 Shap Fell motorway crash. The powerhouse heartbeat of the original Manning Family Orchestra; Rhys\'s heavy 1983 LinnDrum programming and gated toms mechanically rebuild Alistair\'s pulse.'
      },
      {
        name: 'Julian Hayes — In Memoriam (The Missing Four)',
        role: 'Cousin • Rickenbacker Bass Guitar & Classical Cello',
        notes: 'Lost in the winter 1981 M6 Shap Fell motorway crash. Wove deep, cinematic low-end melodies; Rhys plays Julian\'s actual salvaged Rickenbacker bass paired with fretless bass synthesizers.'
      },
      {
        name: 'Simon Hayes — In Memoriam (The Missing Four)',
        role: 'Cousin • Acoustic & Electric Lead Guitars',
        notes: 'Lost in the winter 1981 M6 Shap Fell motorway crash. Architect of their soaring guitar solos; Rhys plays Simon\'s actual guitars using his old picks and loops them into sequencers, while Claire\'s virtuoso flute solo replaces the guitar solo on "Mirrors of Yesterday."'
      }
    ],
    lorePillars: [
      {
        title: 'Winter 1981: The M6 Shap Fell Motorway Disaster & The Missing Four',
        body: 'Originally a six-piece family ensemble—the Manning Family Orchestra—tragedy struck in the winter of 1981 when a sudden freezing-fog white-out and black-ice multi-car pileup on the M6 motorway over Shap Fell in Cumbria claimed the four touring members of their generation: cousin Gwen Manning (woodwinds), older brother Alistair Manning (percussion), cousin Julian Hayes (Rickenbacker bass & cello), and cousin Simon Hayes (lead guitars). Claire (20) and Rhys (18) survived only because they were hundreds of miles south at their accessible childhood home in Romford, East London—a house built with wider door frames, gentle transitions, and no sharp corners, surrounded by understanding lifelong neighbors like Mrs. Allen and the Bennetts.'
      },
      {
        title: 'Romford, 1982: Why Martin Never Legally Married Claire & "The Day the Telly Man Knocked"',
        body: 'In 1982, grieving and seeking normalcy, Claire moved into a Romford flat with Martin (surname-less by design)—who deliberately skipped civil marriage registration and a legal certificate so he could call her "my wife" socially while avoiding paper trails and spousal obligations. When Martin refused to assist with Claire\'s daily physical care, she packed her bags and called Rhys. That mid-morning, while Martin was away on the 5:25 PM commuter train schedule, a TV Licence Enquiry Officer ("the telly man") knocked because Martin had cheaped out and held only a black-and-white licence for a colour television. Respecting polite officials who followed rules, Claire welcomed the officer at eye level with real tea and fresh canary creams, truthfully showed mail proving her permanent address was with her brother Rhys, and handed over the colour TV receipt in Martin\'s name. Rhys arrived early to bring her home; because there was never a legal marriage, no divorce was required, and at 5:25 PM Martin returned to an empty flat and a formal TV Licence enforcement notice.'
      },
      {
        title: 'Williamsport, Maryland ("The Fragile Fortress"), Route 441 & The 1983 IRS Reality Check',
        body: 'Born to an American father from Williamsport, Maryland (Washington County) and a British mother, Rhys and Claire used their dual citizenship and generational inheritance to relocate to their father\'s vacant 1960s ranch house in Williamsport, relying on the Route 441 County Commuter bus for daytime autonomy. Inside this "Fragile Fortress," they recorded 1983\'s Carnaby Street with zero session musicians—playing the salvaged instruments of Gwen, Alistair, Julian, and Simon alongside Roland and Yamaha synthesizers. When "The Hollow Square" spent 14 weeks at #1 on the US and UK charts, the sudden royalty windfall triggered an unexpected IRS tax bill (having paid HMRC in the UK, the young siblings hadn\'t realized dual citizens owed US tax filings).'
      },
      {
        title: '1984–1985: 1883 (The Rock Opera) & Live at Independence Stadium (Philadelphia, PA)',
        body: 'After releasing their 1984 two-disc Victorian concept album 1883, Fractured Prisms bypassed inaccessible clubs entirely by renting Philadelphia\'s 100,000-capacity Independence Stadium directly for their 1985 American Shores live spectacle. Claire and Rhys treated the stagehands, road crew, lighting engineers, and top-tier salaried "Session Ghosts" backing musicians with deep respect, warmth, and generosity—working together as a collaborative effort so long as Claire\'s wheelchair access, autistic sensory accommodations ("Play the Ink" predictability and the "Hold the Line" static blue-wash synth drone), and the sacred family instruments were respected. Following the encore ("The Hollow Square"), a soundproofed conversion van with a flat ADA ramp and warm amber train-carriage lighting carried them down I-95 South to I-70 West back to Williamsport.'
      },
      {
        title: 'The Hagerstown 70mm Soundstage, The Soho Mail-Drop Decoy & The 1914 Colonial Theatre',
        body: 'To protect their privacy in Washington County, MD, the siblings routed all fan mail through a rented Soho, London P.O. Box decoy while filming 35mm and 70mm optical-double-exposure music videos inside an industrial hangar in Hagerstown ("Apex Industrial Holdings") housing a 360-degree 1883 Victorian set with hidden hydraulic lifts. In 1984, they purchased Downtown Hagerstown\'s 1914 Colonial Theatre in cash before demolition—reopening it in late 1987 for 39-minute live sets at 8:00 PM with a stepless sloped auditorium floor, a hidden locking standing frame beneath Claire\'s 1883 Victorian gowns, a disguised 1914 mahogany "birdcage" hydraulic elevator, a strictly dry British refreshment room (serving proper tea, canary creams, and newspaper-cone fish & chips), and the lead-and-velvet soundproofed Subterranean Vault basement apartment.'
      },
      {
        title: 'The 1999 London Discovery & Engine Room Records Sanctuary',
        body: 'In 1999, during The Stardust Engine\'s Hard Reset tour stop in London, Holly and Cassidy O\'Connell uncovered the archival Carnaby Street and 1883 master vaults and traced the Soho mail drop back to Maryland—welcoming Claire and Rhys Manning into the permanent artist-first sanctuary of Engine Room Records.'
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
    bookReaderUrl: 'https://books.raggiesoft.com/luna-leo',
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
    bookReaderUrl: 'https://books.raggiesoft.com/julian',
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
        body: 'With their masters liberated, the ensemble re-christened themselves The Arctic Symphony Project and recorded the 3-disc symphonic rock opera Tales from the Solstice (2007), uniting Julian\'s 1996 Appalachian beacon with Matthew\'s cross-country survival and culminating in the restored Trilingual "Family Mix" of "Upon This Winter\'s Night." Read the complete companion novel Upon This Winter\'s Night: The Story of Julian Rowlands at books.raggiesoft.com/julian.'
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
    bookReaderUrl: 'https://books.raggiesoft.com/crimson-node',
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
        body: 'Behind the music stands a fierce narrative of educational advocacy and neurodivergent protection across Northwood and Piedmont—chronicled in the companion narrative archive at books.raggiesoft.com/crimson-node.'
      }
    ]
  },

  'mana-canvas': {
    errId: 'ERR-004',
    slug: 'mana-canvas',
    name: 'Mana Canvas',
    tagline: 'Symphonic Fantasy Rock, 16-Bit SNES Chiptune & Acoustic RPG Alchemy',
    origin: 'The Runebreaker Soundstage / Blacksburg Studio Collective',
    yearsActive: '1992–Present',
    primaryGenre: 'Symphonic Fantasy Rock / 16-Bit Chiptune Prog / JRPG Soundtrack',
    listeningRoomUrl: 'https://music.raggiesoft.com/mana-canvas',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/mana-canvas',
    bookReaderUrl: 'https://books.raggiesoft.com/dream-kingdom',
    secondaryBookUrl: 'https://runebreaker.raggiesoft.com',
    secondaryBookTitle: 'Runebreaker Portal',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/mana-canvas/band-logo.jpg',
    summary:
      'The official musical voice of the Runebreaker / Dream Kingdom universe. Mana Canvas fuses authentic 16-bit Super Famicom / SNES SPC-700 synth nostalgia with roaring progressive rock guitars, orchestral strings, and arena singalongs.',
    whatKindOfMusic:
      '16-bit SNES RPG chiptune leads fused with symphonic progressive rock, fantasy acoustic ballads, and live concert rock operas.',
    members: [
      {
        name: 'The Mana Canvas Ensemble',
        role: '16-Bit SPC-700 Synthesis, Symphonic Orchestration & Progressive Rock Ensemble',
        notes: 'In-house JRPG and progressive rock collective scoring Runebreaker (1992) and Runebreaker Live (1993).'
      }
    ],
    lorePillars: [
      {
        title: 'Scoring Runebreaker & The 16-Bit Digital Realm',
        body: 'Mana Canvas bridges RaggieSoft\'s Runebreaker / Dream Kingdom narrative universe (books.raggiesoft.com/dream-kingdom and runebreaker.raggiesoft.com) with Engine Room Records\' audio engineering. Every release is structured like a golden-era 1990s 16-bit Super Famicom RPG soundtrack brought to life with a full rock orchestra.'
      },
      {
        title: 'From SPC-700 Chiptunes to the 1993 Live Concert Stage',
        body: 'Following the 1992 release of the ambient 16-bit Runebreaker soundtrack chronicling Ocea\'s journey into the digital realm, Mana Canvas took the score on the road for 1993\'s Runebreaker Live—translating 8-channel SPC-700 melodies into full-bandwidth progressive rock instrumentation and culminating in a 6-minute arena singalong of "The Grand Decree."'
      }
    ]
  },

  'firelight': {
    errId: 'ERR-007',
    slug: 'firelight',
    name: 'Firelight',
    tagline: '1980s Fantasy-Adventure Movie Soundtracks, Synth-Pop Themes & Symphonic Rock',
    origin: 'The Aethelgard Soundstage / Engine Room Records Soundtrack Division',
    yearsActive: '1987–Present',
    primaryGenre: '80s Movie Soundtracks / 80s Synth-Pop / Fantasy-Adventure Score',
    listeningRoomUrl: 'https://music.raggiesoft.com/firelight',
    dedicatedSiteUrl: 'https://engineroom.raggiesoft.com/artists/firelight',
    bookReaderUrl: 'https://books.raggiesoft.com/aethel-saga',
    secondaryBookUrl: 'https://books.raggiesoft.com/aethel/',
    secondaryBookTitle: 'The Silver Gauntlet of Aethel (Full Novel)',
    heroImage: 'https://assets.raggiesoft.com/engine-room-records/artists/firelight/1987-silver-gauntlet-of-aethel/social-preview.jpg',
    ogImage: 'https://assets.raggiesoft.com/engine-room-records/artists/firelight/1987-silver-gauntlet-of-aethel/social-preview.jpg',
    logoUrl: 'https://assets.raggiesoft.com/engine-room-records/artists/firelight/band-logo.png',
    summary:
      'The official 1980s motion picture soundtrack ensemble behind The Silver Gauntlet of Aethel—Michael P. Ragsdale\'s love letter to 1980s fantasy-adventure cinema. Anchored by its flagship main theme "A Sister\'s Love" (heavily inspired by Limahl\'s iconic NeverEnding Story theme song), Firelight fuses shimmering 1980s analog synth-pop arpeggios and soaring melodic hooks with widescreen fantasy orchestration.',
    whatKindOfMusic:
      '1980s fantasy-adventure movie soundtracks, shimmering Limahl-inspired 80s synth-pop title themes ("A Sister\'s Love"), power-rock villain and battle anthems, and sweeping orchestral film scores.',
    members: [
      {
        name: 'The Firelight Soundtrack Ensemble',
        role: '1980s Analog Synthesizers, Soaring Lead Vocals, Electric Guitars & Symphonic Fantasy Orchestra',
        notes: 'Composed and performed the 1987 Theatrical Soundtrack LP and the definitive 2017 3-disc "Leviathan Cut" Original Motion Picture Soundtrack for The Silver Gauntlet of Aethel.'
      }
    ],
    lorePillars: [
      {
        title: 'A Love Letter to 1980s Fantasy-Adventure Cinema & Limahl\'s "NeverEnding Story"',
        body: 'The Silver Gauntlet of Aethel was created as Michael P. Ragsdale\'s personal love letter to 1980s fantasy-adventure movies. When composing the saga\'s signature main theme, "A Sister\'s Love (Main Theme)," Michael took very heavy inspiration from Limahl\'s iconic 1984 theme song to The NeverEnding Story—marrying propulsive 1980s synth-pop arpeggios, shimmering electronic basslines, and an unforgettable, sky-scraping chorus that captures the wonder, peril, and unbreakable sibling bond between twins Kaelan and Kaela.'
      },
      {
        title: 'The 1987 Truncated Theatrical LP vs. The 2017 3-Disc "Leviathan Cut" Soundtrack',
        body: 'In-universe, Firelight\'s original 1987 release—The Silver Gauntlet of Aethel (Theatrical Soundtrack)—was heavily edited down to fit a single vinyl LP, reflecting the studio-mandated truncated theatrical cut of the film that omitted the final two eras in favor of a tidy "happily ever after." Thirty years later, in 2017, Engine Room Records released the definitive 3-disc "Leviathan Cut" Original Motion Picture Soundtrack across Book I: The Unwinding Path, Book II: The Shadow\'s Heart, and Book III: The Dawn of the Twins—restoring the complete four-era mythic arc.'
      },
      {
        title: 'Companion Literary Saga: The Silver Gauntlet of Aethel',
        body: 'Every movement of Firelight\'s soundtrack score pairs directly with the four-era fantasy saga The Silver Gauntlet of Aethel on RaggieSoft Book Reader (books.raggiesoft.com/aethel-saga), while all four soundtrack albums and full lyrics stream in The Listening Room at music.raggiesoft.com/firelight.'
      }
    ]
  }
};
