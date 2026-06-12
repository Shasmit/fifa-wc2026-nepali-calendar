/**
 * FIFA World Cup 2026™ — Nepali Calendar Web Application
 * Complete application logic with Bikram Sambat date conversion,
 * NPT time handling, interactive calendar, and match management.
 *
 * @author FIFA WC2026 Nepali Calendar Project
 * @version 1.0.0
 */

/* ============================================================
   SECTION 1: NEPALI DATE CONVERSION (BIKRAM SAMBAT)
   ============================================================ */

const BS_MONTHS_NP = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत'];
const BS_MONTHS_EN = ['Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const BS_WEEKDAYS_NP = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
const BS_WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BS_WEEKDAYS_FULL_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const NP_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Month days lookup table for BS years */
const BS_CALENDAR_DATA = {
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2078: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2088: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
};

// Reference point: BS 2076/01/01 = AD 2019/04/14
const BS_REF_YEAR = 2076;
const BS_REF_MONTH = 1;
const BS_REF_DAY = 1;
const AD_REF = new Date(2019, 3, 14); // April 14, 2019

/**
 * Convert a number to Nepali digit string
 * @param {number} num - The number to convert
 * @returns {string} Nepali digit string
 */
const getNepaliDigits = (num) => {
  return String(num).split('').map(d => NP_DIGITS[parseInt(d)]).join('');
};

/**
 * Get the number of days in a Bikram Sambat month
 * @param {number} year - BS year
 * @param {number} month - BS month (1-indexed)
 * @returns {number} Number of days in the month
 */
const getBSMonthDays = (year, month) => {
  if (BS_CALENDAR_DATA[year]) {
    return BS_CALENDAR_DATA[year][month - 1];
  }
  // Fallback: approximate with common pattern
  const fallback = [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30];
  return fallback[month - 1];
};

/**
 * Get total days in a BS year
 * @param {number} year - BS year
 * @returns {number} Total days
 */
const getBSYearDays = (year) => {
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    total += getBSMonthDays(year, m);
  }
  return total;
};

/**
 * Calculate the number of days between a Gregorian date and the AD reference
 * @param {number} year - AD year
 * @param {number} month - AD month (1-indexed)
 * @param {number} day - AD day
 * @returns {number} Days since AD reference point (can be negative)
 */
const daysSinceADRef = (year, month, day) => {
  const target = new Date(year, month - 1, day);
  const diffMs = target.getTime() - AD_REF.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Convert Gregorian (AD) date to Bikram Sambat (BS)
 * @param {number} adYear - Gregorian year
 * @param {number} adMonth - Gregorian month (1-indexed)
 * @param {number} adDay - Gregorian day
 * @returns {{year: number, month: number, day: number}} BS date object
 */
const adToBS = (adYear, adMonth, adDay) => {
  let totalDays = daysSinceADRef(adYear, adMonth, adDay);

  let bsYear = BS_REF_YEAR;
  let bsMonth = BS_REF_MONTH;
  let bsDay = BS_REF_DAY;

  if (totalDays >= 0) {
    // Forward from reference
    while (totalDays > 0) {
      const daysInMonth = getBSMonthDays(bsYear, bsMonth);
      const daysRemInMonth = daysInMonth - bsDay;
      if (totalDays <= daysRemInMonth) {
        bsDay += totalDays;
        totalDays = 0;
      } else {
        totalDays -= (daysRemInMonth + 1);
        bsMonth++;
        if (bsMonth > 12) {
          bsMonth = 1;
          bsYear++;
        }
        bsDay = 1;
      }
    }
  } else {
    // Backward from reference
    totalDays = Math.abs(totalDays);
    while (totalDays > 0) {
      if (totalDays < bsDay) {
        bsDay -= totalDays;
        totalDays = 0;
      } else {
        totalDays -= bsDay;
        bsMonth--;
        if (bsMonth < 1) {
          bsMonth = 12;
          bsYear--;
        }
        bsDay = getBSMonthDays(bsYear, bsMonth);
      }
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
};

/**
 * Convert Bikram Sambat (BS) date to Gregorian (AD)
 * @param {number} bsYear - BS year
 * @param {number} bsMonth - BS month (1-indexed)
 * @param {number} bsDay - BS day
 * @returns {{year: number, month: number, day: number}} AD date object
 */
const bsToAD = (bsYear, bsMonth, bsDay) => {
  // Calculate total days from BS reference to target BS date
  let totalDays = 0;

  if (bsYear > BS_REF_YEAR || (bsYear === BS_REF_YEAR && bsMonth > BS_REF_MONTH) ||
      (bsYear === BS_REF_YEAR && bsMonth === BS_REF_MONTH && bsDay >= BS_REF_DAY)) {
    // Forward calculation
    let y = BS_REF_YEAR;
    let m = BS_REF_MONTH;
    let d = BS_REF_DAY;

    // Count days to reach target
    while (y < bsYear || (y === bsYear && m < bsMonth) || (y === bsYear && m === bsMonth && d < bsDay)) {
      const daysInMonth = getBSMonthDays(y, m);
      if (y === bsYear && m === bsMonth) {
        totalDays += (bsDay - d);
        break;
      } else {
        totalDays += (daysInMonth - d + 1);
        d = 1;
        m++;
        if (m > 12) {
          m = 1;
          y++;
        }
      }
    }
  } else {
    // Backward - target is before reference
    let y = BS_REF_YEAR;
    let m = BS_REF_MONTH;
    let d = BS_REF_DAY;

    while (y > bsYear || (y === bsYear && m > bsMonth) || (y === bsYear && m === bsMonth && d > bsDay)) {
      if (y === bsYear && m === bsMonth) {
        totalDays -= (d - bsDay);
        break;
      } else {
        totalDays -= d;
        m--;
        if (m < 1) {
          m = 12;
          y--;
        }
        d = getBSMonthDays(y, m);
      }
    }
  }

  const resultDate = new Date(AD_REF.getTime() + totalDays * 24 * 60 * 60 * 1000);
  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate()
  };
};

/**
 * Get the day of week for a BS date (0=Sun, 6=Sat)
 * @param {number} bsYear - BS year
 * @param {number} bsMonth - BS month (1-indexed)
 * @param {number} bsDay - BS day
 * @returns {number} Day of week (0=Sunday)
 */
const getBSDayOfWeek = (bsYear, bsMonth, bsDay) => {
  const ad = bsToAD(bsYear, bsMonth, bsDay);
  const d = new Date(ad.year, ad.month - 1, ad.day);
  return d.getDay();
};


/* ============================================================
   SECTION 2: NPT TIME CONVERSION
   ============================================================ */

/** NPT offset: +5 hours 45 minutes in milliseconds */
const NPT_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

/**
 * Convert a UTC Date object to NPT time
 * @param {Date} date - UTC Date
 * @returns {Date} Date adjusted to NPT
 */
const toNPT = (date) => {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + NPT_OFFSET_MS);
};

/**
 * Format time in 12-hour format with AM/PM
 * @param {Date} nptDate - NPT date
 * @returns {string} Formatted time string
 */
const formatTime12h = (nptDate) => {
  let hours = nptDate.getHours();
  const minutes = nptDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Format time with seconds in 12-hour format
 * @param {Date} nptDate - NPT date
 * @returns {string} Formatted time string with seconds
 */
const formatTime12hWithSeconds = (nptDate) => {
  let hours = nptDate.getHours();
  const minutes = nptDate.getMinutes().toString().padStart(2, '0');
  const seconds = nptDate.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

/**
 * Format a Nepali date as a full string with day of week
 * @param {number} bsYear - BS year
 * @param {number} bsMonth - BS month
 * @param {number} bsDay - BS day
 * @returns {string} Formatted Nepali date string
 */
const formatNepaliDateFull = (bsYear, bsMonth, bsDay) => {
  const dow = getBSDayOfWeek(bsYear, bsMonth, bsDay);
  return `${BS_MONTHS_NP[bsMonth - 1]} ${getNepaliDigits(bsDay)}, ${getNepaliDigits(bsYear)} ${BS_WEEKDAYS_FULL_NP[dow]}`;
};

/**
 * Format a Nepali date as short string
 * @param {number} bsYear - BS year
 * @param {number} bsMonth - BS month
 * @param {number} bsDay - BS day
 * @returns {string} Short Nepali date
 */
const formatNepaliDateShort = (bsYear, bsMonth, bsDay) => {
  return `${BS_MONTHS_NP[bsMonth - 1]} ${getNepaliDigits(bsDay)}, ${getNepaliDigits(bsYear)}`;
};

/**
 * Format Gregorian date for display
 * @param {Date} date - The date to format
 * @returns {string} E.g., "Saturday, May 25, 2026"
 */
const formatGregorianDateFull = (date) => {
  const dayName = EN_DAYS[date.getDay()];
  const monthName = EN_MONTHS[date.getMonth()];
  return `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Map FIFA team code to ISO 3166-1 alpha-2 code for flag images
 */
const TEAM_CODE_TO_ISO = {
  // Africa
  ALG:'dz', AGO:'ao', BEN:'bj', BOT:'bw', BFA:'bf', BDI:'bi', CMR:'cm', CPV:'cv',
  CAF:'cf', CHA:'td', COM:'km', CGO:'cg', COD:'cd', CIV:'ci', DJI:'dj', EGY:'eg',
  GNQ:'gq', ERI:'er', ETH:'et', GAB:'ga', GAM:'gm', GHA:'gh', GUI:'gn', GNB:'gw',
  KEN:'ke', LES:'ls', LBR:'lr', LBA:'ly', MAD:'mg', MWI:'mw', MLI:'ml', MTN:'mr',
  MRI:'mu', MAR:'ma', MOZ:'mz', MYA:'mm', NAM:'na', NIG:'ne', NGA:'ng', RWA:'rw',
  SEN:'sn', SLE:'sl', SOM:'so', RSA:'za', SDN:'sd', SUR:'sr', SWZ:'sz', TAN:'tz',
  TOG:'tg', TUN:'tn', UGA:'ug', ZAM:'zm', ZIM:'zw',
  // Asia
  AFG:'af', BHR:'bh', BGD:'bd', BHU:'bt', BRN:'bn', CHN:'cn', IND:'in', IDN:'id',
  IRN:'ir', IRQ:'iq', ISR:'il', JPN:'jp', JOR:'jo', KAZ:'kz', PRK:'kp', KOR:'kr',
  KUW:'kw', KGZ:'kg', LAO:'la', LBN:'lb', MAS:'my', MDV:'mv', MNG:'mn', NEP:'np',
  OMA:'om', PAK:'pk', PHI:'ph', QAT:'qa', KSA:'sa', LKA:'lk', SYR:'sy', TWN:'tw',
  TJK:'tj', THA:'th', TLS:'tl', TKM:'tm', UAE:'ae', UZB:'uz', VIE:'vn', YEM:'ye',
  // Europe
  ALB:'al', AND:'ad', ARM:'am', AUT:'at', AZE:'az', BLR:'by', BEL:'be', BIH:'ba',
  BUL:'bg', CRO:'hr', CYP:'cy', CZE:'cz', DEN:'dk', EST:'ee', FIN:'fi', FRA:'fr',
  GEO:'ge', GER:'de', GRE:'gr', HUN:'hu', ISL:'is', IRL:'ie', ITA:'it', LVA:'lv',
  LIE:'li', LTU:'lt', LUX:'lu', MLT:'mt', MDA:'md', MNE:'me', MKD:'mk', NED:'nl',
  NOR:'no', POL:'pl', POR:'pt', ROU:'ro', RUS:'ru', SRB:'rs', SVK:'sk', SVN:'si',
  ESP:'es', SWE:'se', SUI:'ch', TUR:'tr', UKR:'ua',
  ENG:'gb-eng', SCO:'gb-sct', WAL:'gb-wls', NIR:'gb-nir',
  // Americas
  ARG:'ar', BOL:'bo', BRA:'br', CAN:'ca', CHI:'cl', COL:'co', CRC:'cr', CUB:'cu',
  DOM:'do', ECU:'ec', SLV:'sv', GUA:'gt', HAI:'ht', HON:'hn', JAM:'jm', MEX:'mx',
  NCA:'ni', PAN:'pa', PAR:'py', PER:'pe', PUR:'pr', TRI:'tt', URU:'uy', USA:'us',
  VEN:'ve', CUW:'cw',
  // Oceania
  AUS:'au', COK:'ck', FIJ:'fj', NZL:'nz', PNG:'pg', SAM:'ws', SOL:'sb', TGA:'to',
  VAN:'vu',
};

/**
 * Map FIFA team names to their 3-letter codes
 */
const TEAM_NAME_TO_CODE = {
  "Algeria": "ALG",
  "Argentina": "ARG",
  "Australia": "AUS",
  "Austria": "AUT",
  "Belgium": "BEL",
  "Bosnia and Herzegovina": "BIH",
  "Bosnia & Herzegovina": "BIH",
  "Brazil": "BRA",
  "Canada": "CAN",
  "Cape Verde": "CPV",
  "Cabo Verde": "CPV",
  "Colombia": "COL",
  "Congo DR": "COD",
  "DR Congo": "COD",
  "Croatia": "CRO",
  "Curaçao": "CUW",
  "Czechia": "CZE",
  "Czech Republic": "CZE",
  "Ecuador": "ECU",
  "Egypt": "EGY",
  "England": "ENG",
  "France": "FRA",
  "Germany": "GER",
  "Ghana": "GHA",
  "Haiti": "HAI",
  "Iran": "IRN",
  "IR Iran": "IRN",
  "Iraq": "IRQ",
  "Ivory Coast": "CIV",
  "Côte d'Ivoire": "CIV",
  "Japan": "JPN",
  "Jordan": "JOR",
  "Mexico": "MEX",
  "Morocco": "MAR",
  "Netherlands": "NED",
  "New Zealand": "NZL",
  "Norway": "NOR",
  "Panama": "PAN",
  "Paraguay": "PAR",
  "Portugal": "POR",
  "Qatar": "QAT",
  "Saudi Arabia": "KSA",
  "Scotland": "SCO",
  "Senegal": "SEN",
  "South Africa": "RSA",
  "South Korea": "KOR",
  "Korea Republic": "KOR",
  "Spain": "ESP",
  "Sweden": "SWE",
  "Switzerland": "SUI",
  "Tunisia": "TUN",
  "Turkiye": "TUR",
  "Turkey": "TUR",
  "Türkiye": "TUR",
  "United States": "USA",
  "USA": "USA",
  "Uruguay": "URU",
  "Uzbekistan": "UZB",
};

/**
 * Map openfootball ground names to full stadium/location metadata
 */
const GROUND_TO_STADIUM = {
  'Atlanta': { name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA' },
  'Boston (Foxborough)': { name: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA' },
  'Dallas (Arlington)': { name: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA' },
  'Guadalajara (Zapopan)': { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico' },
  'Houston': { name: 'NRG Stadium', city: 'Houston, TX', country: 'USA' },
  'Kansas City': { name: 'GEHA Field at Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA' },
  'Los Angeles (Inglewood)': { name: 'SoFi Stadium', city: 'Inglewood, CA', country: 'USA' },
  'Mexico City': { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
  'Miami (Miami Gardens)': { name: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA' },
  'Monterrey (Guadalupe)': { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' },
  'New York/New Jersey (East Rutherford)': { name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA' },
  'Philadelphia': { name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA' },
  'San Francisco Bay Area (Santa Clara)': { name: "Levi's Stadium", city: 'Santa Clara, CA', country: 'USA' },
  'Seattle': { name: 'Lumen Field', city: 'Seattle, WA', country: 'USA' },
  'Toronto': { name: 'BMO Field', city: 'Toronto', country: 'Canada' },
  'Vancouver': { name: 'BC Place', city: 'Vancouver', country: 'Canada' }
};

/**
 * Get a flag <img> element HTML string for a given FIFA team code.
 * Uses flagcdn.com which works on ALL platforms including Windows.
 * Falls back to a premium CSS placeholder badge if the code is unknown (TBD knockout teams).
 * @param {string} code - FIFA team code (e.g. 'ENG', 'MEX')
 * @param {string} [size='40'] - Height/width in px
 * @param {string} [alt=''] - Alt text
 * @returns {string} HTML img tag or placeholder badge string
 */
const getFlagImg = (code, size = '40', alt = '') => {
  const iso = TEAM_CODE_TO_ISO[code];
  const h = Math.round(parseInt(size) * 2 / 3);
  if (!iso) {
    const displayLabel = code && code.length <= 4 ? code : 'TBD';
    return `<div class="flag-placeholder" style="width: ${size}px; height: ${h}px; line-height: ${h}px;" title="${alt || code}">${displayLabel}</div>`;
  }
  return `<img src="https://flagcdn.com/${iso}.svg" style="height: ${h}px; width: auto; max-width: ${size}px; object-fit: contain; vertical-align: middle;" alt="${alt || code}" class="flag-img" loading="lazy" onerror="this.src='https://flagcdn.com/w40/${iso}.png'">`;
};

/**
 * Get a flag <img> element HTML for a given ISO alpha-2 code directly.
 * @param {string} isoCode - ISO alpha-2 code (e.g. 'us', 'gb-eng')
 * @param {string} [size='20'] - Height in px
 * @param {string} [alt=''] - Alt text
 * @returns {string} HTML img tag string
 */
const getFlagImgFromISO = (isoCode, size = '40', alt = '') => {
  const h = Math.round(parseInt(size) * 2 / 3);
  return `<img src="https://flagcdn.com/${isoCode}.svg" width="${size}" height="${h}" alt="${alt}" class="flag-img" loading="lazy" onerror="this.src='https://flagcdn.com/w40/${isoCode}.png'">`;
};

/**
 * Get English month range approximation for a BS month
 * @param {number} bsYear - BS year
 * @param {number} bsMonth - BS month (1-indexed)
 * @returns {string} E.g., "May-Jun 2026"
 */
const getEnglishMonthRange = (bsYear, bsMonth) => {
  const start = bsToAD(bsYear, bsMonth, 1);
  const endDay = getBSMonthDays(bsYear, bsMonth);
  const end = bsToAD(bsYear, bsMonth, endDay);

  const startMonth = EN_MONTHS[start.month - 1].slice(0, 3);
  const endMonth = EN_MONTHS[end.month - 1].slice(0, 3);

  if (startMonth === endMonth) {
    return `${startMonth} ${start.year}`;
  }
  if (start.year !== end.year) {
    return `${startMonth} ${start.year}-${endMonth} ${end.year}`;
  }
  return `${startMonth}-${endMonth} ${start.year}`;
};


/* ============================================================
   SECTION 3: APPLICATION STATE
   ============================================================ */

const state = {
  fixturesData: null,
  currentBSYear: 2083,
  currentBSMonth: 2, // Jestha (1-indexed)
  selectedDate: null,
  filters: { team: '', stage: '' },
  favorites: JSON.parse(localStorage.getItem('wc2026_favorites') || '[]'),
  theme: localStorage.getItem('wc2026_theme') || 'light',
  audioEnabled: JSON.parse(localStorage.getItem('wc2026_audio') || 'false'),
  touchStartX: 0,
  countdownInterval: null,
  clockInterval: null,
  modalCountdownInterval: null,
  searchDebounceTimer: null,
  reminders: JSON.parse(localStorage.getItem('wc2026_reminders') || '[]'),
  liveStandingsData: null,   // Cached from worldcup26.ir /get/groups
  liveTeamsData: null,       // Cached from worldcup26.ir /get/teams
  standingsLastUpdated: null,
  standingsRefreshInterval: null,
};


/* ============================================================
   SECTION 4: PARTICLE BACKGROUND
   ============================================================ */

let particles = [];
let particleCanvas, particleCtx;

/**
 * Initialize the particle background system
 */
const initParticles = () => {
  particleCanvas = document.getElementById('particles-canvas');
  if (!particleCanvas) return;
  particleCtx = particleCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = [
    'rgba(35, 85, 36, 0.35)',    // dark green
    'rgba(71, 193, 99, 0.3)',    // bright green
    'rgba(156, 200, 160, 0.4)', // pale green
    'rgba(35, 85, 36, 0.25)',   // dark green soft
    'rgba(246, 208, 69, 0.3)',  // warm yellow accent
  ];

  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  animateParticles();
};

/**
 * Resize the particle canvas to match the window
 */
const resizeCanvas = () => {
  if (!particleCanvas) return;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
};

/**
 * Animate particle positions and render
 */
const animateParticles = () => {
  if (!particleCtx || !particleCanvas) return;
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  particles.forEach(p => {
    p.y -= p.speedY;
    p.x += p.speedX;

    // Wrap around
    if (p.y < -10) {
      p.y = particleCanvas.height + 10;
      p.x = Math.random() * particleCanvas.width;
    }
    if (p.x < -10) p.x = particleCanvas.width + 10;
    if (p.x > particleCanvas.width + 10) p.x = -10;

    particleCtx.beginPath();
    particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particleCtx.fillStyle = p.color;
    particleCtx.globalAlpha = p.opacity;
    particleCtx.fill();
  });

  particleCtx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
};

/**
 * Update particle colors based on current theme
 */
const updateParticleColors = () => {
  const isDark = state.theme === 'dark';
  const colors = isDark
    ? [
        'rgba(71, 193, 99, 0.5)',
        'rgba(156, 200, 160, 0.4)',
        'rgba(35, 85, 36, 0.4)',
        'rgba(71, 193, 99, 0.35)',
        'rgba(246, 208, 69, 0.3)',
      ]
    : [
        'rgba(35, 85, 36, 0.25)',
        'rgba(71, 193, 99, 0.2)',
        'rgba(156, 200, 160, 0.3)',
        'rgba(35, 85, 36, 0.15)',
        'rgba(246, 208, 69, 0.2)',
      ];

  particles.forEach(p => {
    p.color = colors[Math.floor(Math.random() * colors.length)];
  });
};


/* ============================================================
   SECTION 5: CALENDAR RENDERING
   ============================================================ */

/**
 * Render the Nepali calendar grid for the current BS month/year
 */
const renderCalendar = () => {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('current-month-label');
  const monthEnglish = document.getElementById('current-month-english');
  const weekdaysContainer = document.getElementById('calendar-weekdays');
  if (!grid) return;

  const bsYear = state.currentBSYear;
  const bsMonth = state.currentBSMonth;

  // Set month label
  if (monthLabel) {
    monthLabel.textContent = `${BS_MONTHS_NP[bsMonth - 1]} ${getNepaliDigits(bsYear)}`;
  }

  // Set English equivalent
  if (monthEnglish) {
    const engRange = getEnglishMonthRange(bsYear, bsMonth);
    monthEnglish.textContent = `${BS_MONTHS_EN[bsMonth - 1]} ${bsYear} (${engRange})`;
  }

  // Render weekday headers
  if (weekdaysContainer) {
    weekdaysContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const div = document.createElement('div');
      div.className = 'weekday-header';
      div.innerHTML = `<span class="weekday-np">${BS_WEEKDAYS_NP[i]}</span><span class="weekday-en">${BS_WEEKDAYS_EN[i]}</span>`;
      weekdaysContainer.appendChild(div);
    }
  }

  // Calculate first day of this BS month
  const firstDayOfWeek = getBSDayOfWeek(bsYear, bsMonth, 1);
  const daysInMonth = getBSMonthDays(bsYear, bsMonth);

  // Previous month info
  let prevMonth = bsMonth - 1;
  let prevYear = bsYear;
  if (prevMonth < 1) { prevMonth = 12; prevYear--; }
  const daysInPrevMonth = getBSMonthDays(prevYear, prevMonth);

  // Get today's BS date
  const now = new Date();
  const nptNow = toNPT(now);
  const todayBS = adToBS(nptNow.getFullYear(), nptNow.getMonth() + 1, nptNow.getDate());

  // Build match lookup by Gregorian date string
  const matchesByDate = {};
  if (state.fixturesData && state.fixturesData.matches) {
    state.fixturesData.matches.forEach(match => {
      const matchNPT = toNPT(new Date(match.dateTime));
      const dateStr = `${matchNPT.getFullYear()}-${String(matchNPT.getMonth() + 1).padStart(2, '0')}-${String(matchNPT.getDate()).padStart(2, '0')}`;
      if (!matchesByDate[dateStr]) matchesByDate[dateStr] = [];
      matchesByDate[dateStr].push(match);
    });
  }

  // Clear grid
  grid.innerHTML = '';

  // Total cells needed: previous month trailing days + current month
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';

    let cellBSDay, cellBSMonth, cellBSYear, isOtherMonth;

    if (i < firstDayOfWeek) {
      // Previous month
      cellBSDay = daysInPrevMonth - firstDayOfWeek + i + 1;
      cellBSMonth = prevMonth;
      cellBSYear = prevYear;
      isOtherMonth = true;
    } else if (i - firstDayOfWeek + 1 > daysInMonth) {
      // Next month
      cellBSDay = i - firstDayOfWeek - daysInMonth + 1;
      let nextMonth = bsMonth + 1;
      let nextYear = bsYear;
      if (nextMonth > 12) { nextMonth = 1; nextYear++; }
      cellBSMonth = nextMonth;
      cellBSYear = nextYear;
      isOtherMonth = true;
    } else {
      // Current month
      cellBSDay = i - firstDayOfWeek + 1;
      cellBSMonth = bsMonth;
      cellBSYear = bsYear;
      isOtherMonth = false;
    }

    // Convert to AD for data attributes and match lookup
    const ad = bsToAD(cellBSYear, cellBSMonth, cellBSDay);
    const dateStr = `${ad.year}-${String(ad.month).padStart(2, '0')}-${String(ad.day).padStart(2, '0')}`;

    cell.setAttribute('data-date', dateStr);
    cell.setAttribute('data-bs-year', cellBSYear);
    cell.setAttribute('data-bs-month', cellBSMonth);
    cell.setAttribute('data-bs-day', cellBSDay);

    if (isOtherMonth) cell.classList.add('other-month');

    // Check if today
    if (cellBSYear === todayBS.year && cellBSMonth === todayBS.month && cellBSDay === todayBS.day) {
      cell.classList.add('today');
    }

    // Check if selected
    if (state.selectedDate === dateStr) {
      cell.classList.add('selected');
    }

    // Nepali number
    const nepaliSpan = document.createElement('span');
    nepaliSpan.className = 'nepali-num';
    nepaliSpan.textContent = getNepaliDigits(cellBSDay);
    cell.appendChild(nepaliSpan);

    // English number
    const englishSpan = document.createElement('span');
    englishSpan.className = 'english-num';
    englishSpan.textContent = ad.day;
    cell.appendChild(englishSpan);

    // Check for matches
    const dayMatches = matchesByDate[dateStr];
    if (dayMatches && dayMatches.length > 0) {
      cell.classList.add('match-day');

      // Check if any match features a favorited team
      const hasFavorite = dayMatches.some(m => state.favorites.includes(m.homeCode) || state.favorites.includes(m.awayCode));
      if (hasFavorite) {
        cell.classList.add('has-favorite');
      }

      if (dayMatches.length === 1) {
        // Render mini flags side-by-side
        const preview = document.createElement('div');
        preview.className = 'cell-match-preview';
        preview.innerHTML = `<span>${getFlagImg(dayMatches[0].homeCode, '20', dayMatches[0].homeTeam)}</span><span class="cell-match-vs">vs</span><span>${getFlagImg(dayMatches[0].awayCode, '20', dayMatches[0].awayTeam)}</span>`;
        cell.appendChild(preview);
      } else {
        // Render mini multi-match soccer badge
        const multiPill = document.createElement('div');
        multiPill.className = 'cell-multi-matches';
        multiPill.innerHTML = `⚽ <span>${dayMatches.length}</span>`;
        cell.appendChild(multiPill);
      }
    }

    // Click handler
    cell.addEventListener('click', () => handleDateClick(dateStr, dayMatches));

    grid.appendChild(cell);
  }
};


/* ============================================================
   SECTION 6: HERO / NEXT MATCH
   ============================================================ */

/**
 * Find and display the next upcoming match in the hero section
 */
const renderHero = () => {
  if (!state.fixturesData || !state.fixturesData.matches) return;

  const now = new Date();
  const nextMatch = state.fixturesData.matches
    .filter(m => new Date(m.dateTime) > now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0];

  const homeFlag = document.getElementById('hero-home-flag');
  const homeName = document.getElementById('hero-home-name');
  const awayFlag = document.getElementById('hero-away-flag');
  const awayName = document.getElementById('hero-away-name');
  const stageEl = document.getElementById('hero-stage');
  const venueEl = document.getElementById('hero-venue');
  const datetimeEl = document.getElementById('hero-datetime');
  const nepaliDateEl = document.getElementById('hero-nepali-date');

  if (!nextMatch) {
    if (homeFlag) homeFlag.innerHTML = '🏆';
    if (homeName) homeName.textContent = '';
    if (awayFlag) awayFlag.innerHTML = '';
    if (awayName) awayName.textContent = '';
    if (stageEl) stageEl.querySelector('.info-text').textContent = 'Tournament Complete';
    if (venueEl) venueEl.querySelector('.info-text').textContent = 'Thank you for watching!';
    if (datetimeEl) datetimeEl.querySelector('.info-text').textContent = '';
    if (nepaliDateEl) nepaliDateEl.querySelector('.info-text').textContent = '';
    return;
  }

  if (homeFlag) homeFlag.innerHTML = getFlagImg(nextMatch.homeCode, '80', nextMatch.homeTeam);
  if (homeName) homeName.textContent = nextMatch.homeTeam;
  if (awayFlag) awayFlag.innerHTML = getFlagImg(nextMatch.awayCode, '80', nextMatch.awayTeam);
  if (awayName) awayName.textContent = nextMatch.awayTeam;

  const stageText = nextMatch.group ? `${nextMatch.stage} - Group ${nextMatch.group}` : nextMatch.stage;
  if (stageEl) stageEl.querySelector('.info-text').textContent = stageText;
  if (venueEl) venueEl.querySelector('.info-text').textContent = `${nextMatch.stadium}, ${nextMatch.city}`;

  const matchNPT = toNPT(new Date(nextMatch.dateTime));
  if (datetimeEl) {
    datetimeEl.querySelector('.info-text').textContent = `${formatGregorianDateFull(matchNPT)} • ${formatTime12h(matchNPT)} NPT`;
  }

  const matchBS = adToBS(matchNPT.getFullYear(), matchNPT.getMonth() + 1, matchNPT.getDate());
  if (nepaliDateEl) {
    nepaliDateEl.querySelector('.info-text').textContent = formatNepaliDateFull(matchBS.year, matchBS.month, matchBS.day);
  }

  startCountdown(nextMatch.dateTime);
};


/* ============================================================
   SECTION 7: COUNTDOWN TIMER
   ============================================================ */

/**
 * Start the countdown timer to the next match
 * @param {string} targetDateTimeISO - ISO 8601 datetime string
 */
const startCountdown = (targetDateTimeISO) => {
  if (state.countdownInterval) clearInterval(state.countdownInterval);

  const updateCountdown = () => {
    const now = new Date();
    const target = new Date(targetDateTimeISO);
    let diff = target - now;

    if (diff <= 0) {
      diff = 0;
      clearInterval(state.countdownInterval);
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (daysEl) animateCountdownValue(daysEl, String(days).padStart(2, '0'));
    if (hoursEl) animateCountdownValue(hoursEl, String(hours).padStart(2, '0'));
    if (minsEl) animateCountdownValue(minsEl, String(mins).padStart(2, '0'));
    if (secsEl) animateCountdownValue(secsEl, String(secs).padStart(2, '0'));
  };

  updateCountdown();
  state.countdownInterval = setInterval(updateCountdown, 1000);
};

/**
 * Animate a countdown value change
 * @param {HTMLElement} el - The element to update
 * @param {string} newValue - The new value string
 */
const animateCountdownValue = (el, newValue) => {
  if (el.textContent !== newValue) {
    el.style.transform = 'scale(1.1)';
    el.textContent = newValue;
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 150);
  }
};


/* ============================================================
   SECTION 8: ANALOG & DIGITAL CLOCK
   ============================================================ */

/**
 * Initialize the analog clock (generate hour marks and start ticking)
 */
const initClock = () => {
  const marksContainer = document.getElementById('clock-marks');
  if (marksContainer) {
    marksContainer.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const mark = document.createElement('div');
      mark.className = 'clock-mark';
      mark.style.transform = `rotate(${i * 30}deg)`;
      marksContainer.appendChild(mark);
    }
  }

  const updateClock = () => {
    const npt = toNPT(new Date());
    const hours = npt.getHours();
    const minutes = npt.getMinutes();
    const seconds = npt.getSeconds();

    const hourHand = document.getElementById('clock-hour');
    const minuteHand = document.getElementById('clock-minute');
    const secondHand = document.getElementById('clock-second');

    if (hourHand) hourHand.style.transform = `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${seconds * 6}deg)`;

    // Digital time
    const digitalTime = document.getElementById('digital-time');
    if (digitalTime) {
      digitalTime.textContent = formatTime12hWithSeconds(npt);
    }

    // Digital date
    const digitalDate = document.getElementById('digital-date');
    if (digitalDate) {
      digitalDate.textContent = formatGregorianDateFull(npt);
    }

    // Nepali date
    const nepaliDisplay = document.getElementById('nepali-date-display');
    if (nepaliDisplay) {
      const bs = adToBS(npt.getFullYear(), npt.getMonth() + 1, npt.getDate());
      nepaliDisplay.textContent = formatNepaliDateFull(bs.year, bs.month, bs.day);
    }
  };

  updateClock();
  state.clockInterval = setInterval(updateClock, 1000);
};


/* ============================================================
   SECTION 9: TODAY'S MATCHES
   ============================================================ */

/**
 * Render today's matches in a horizontal scroll container
 */
const renderTodaysMatches = () => {
  const container = document.getElementById('todays-matches-container');
  if (!container || !state.fixturesData) return;

  const npt = toNPT(new Date());
  const todayStr = `${npt.getFullYear()}-${String(npt.getMonth() + 1).padStart(2, '0')}-${String(npt.getDate()).padStart(2, '0')}`;

  const todaysMatches = state.fixturesData.matches.filter(match => {
    const matchNPT = toNPT(new Date(match.dateTime));
    const matchDateStr = `${matchNPT.getFullYear()}-${String(matchNPT.getMonth() + 1).padStart(2, '0')}-${String(matchNPT.getDate()).padStart(2, '0')}`;
    return matchDateStr === todayStr;
  });

  const todaysSec = document.getElementById('todays-section');
  const calSec = document.getElementById('calendar-section');
  const standingsSec = document.getElementById('standings-section');

  container.innerHTML = '';

  if (todaysMatches.length === 0) {
    // Dynamic Shift: Move 'Today's Matches' below Group Standings when no matches play today
    if (todaysSec && standingsSec) {
      standingsSec.parentNode.insertBefore(todaysSec, standingsSec.nextSibling);
    }

    container.innerHTML = `
      <div class="no-matches-today">
        <span class="no-matches-icon">📅</span>
        <p>No scheduled matches today</p>
      </div>
    `;
    return;
  }

  // Active state: Move 'Today's Matches' to the top (above calendar)
  if (todaysSec && calSec) {
    calSec.parentNode.insertBefore(todaysSec, calSec);
  }

  todaysMatches.forEach(match => {
    const matchNPT    = toNPT(new Date(match.dateTime));
    const nowNPT      = toNPT(new Date());
    const matchMs     = new Date(match.dateTime).getTime();
    const nowMs       = Date.now();
    // A match is considered finished ~110 min after kickoff if not explicitly marked
    const MATCH_DURATION_MS = 110 * 60 * 1000;
    const isFinished  = match.status === 'finished' || nowMs >= matchMs + MATCH_DURATION_MS;
    const isLive      = !isFinished && nowMs >= matchMs && nowMs < matchMs + MATCH_DURATION_MS;
    const hasScore    = match.homeScore !== null && match.awayScore !== null;

    // ── Build the centre section (score or VS or time) ──────────────────
    let centreHtml;
    if (isFinished && hasScore) {
      centreHtml = `
        <div class="today-card-score-block">
          <span class="today-card-score">${match.homeScore} – ${match.awayScore}</span>
          <span class="today-card-ft-badge">FT</span>
        </div>`;
    } else if (isLive) {
      centreHtml = `
        <div class="today-card-score-block">
          <span class="today-card-vs">VS</span>
          <span class="today-card-live-badge">🔴 LIVE</span>
        </div>`;
    } else {
      centreHtml = `<span class="today-card-vs">VS</span>`;
    }

    // ── Build the info row (time or result label) ────────────────────────
    let infoHtml;
    if (isFinished) {
      infoHtml = `<span class="today-card-result-label">Full Time</span>`;
    } else if (isLive) {
      infoHtml = `<span class="today-card-result-label live-text">In Progress</span>`;
    } else {
      infoHtml = `<span>🕐 ${formatTime12h(matchNPT)} NPT</span>`;
    }

    const card = document.createElement('div');
    card.className = `today-match-card${isFinished ? ' match-finished' : isLive ? ' match-live' : ''}`;
    card.setAttribute('data-match-id', match.id);
    card.innerHTML = `
      <div class="today-card-stage">${match.group ? `Group ${match.group}` : match.stage}</div>
      <div class="today-card-teams">
        <div class="today-card-team ${isFinished && hasScore && match.homeScore > match.awayScore ? 'team-winner' : ''}">
          <span class="today-card-flag">${getFlagImg(match.homeCode, '26', match.homeTeam)}</span>
          <span class="today-card-name">${match.homeCode}</span>
        </div>
        ${centreHtml}
        <div class="today-card-team ${isFinished && hasScore && match.awayScore > match.homeScore ? 'team-winner' : ''}">
          <span class="today-card-flag">${getFlagImg(match.awayCode, '26', match.awayTeam)}</span>
          <span class="today-card-name">${match.awayCode}</span>
        </div>
      </div>
      <div class="today-card-info">${infoHtml}</div>
      <div class="today-card-venue">${match.stadium}</div>
    `;
    card.addEventListener('click', () => openMatchModal(match));
    container.appendChild(card);
  });
};


/* ============================================================
   SECTION 10: FILTERS
   ============================================================ */

/**
 * Populate filter dropdowns with data from fixtures
 */
const initFilters = () => {
  const teamFilter = document.getElementById('filter-team');
  const stageFilter = document.getElementById('filter-stage');
  const clearBtn = document.getElementById('clear-filters');

  if (!state.fixturesData) return;

  // Populate teams
  if (teamFilter) {
    const teams = new Set();
    state.fixturesData.matches.forEach(m => {
      if (m.homeCode !== 'TBD') teams.add(m.homeTeam);
      if (m.awayCode !== 'TBD') teams.add(m.awayTeam);
    });

    teamFilter.innerHTML = '<option value="">All Teams</option>';
    [...teams].sort().forEach(team => {
      const opt = document.createElement('option');
      opt.value = team;
      opt.textContent = team;
      teamFilter.appendChild(opt);
    });

    teamFilter.addEventListener('change', () => {
      state.filters.team = teamFilter.value;
      renderFixtures();
    });
  }

  // Populate stages
  if (stageFilter) {
    stageFilter.innerHTML = '<option value="">All Stages</option>';
    state.fixturesData.stages.forEach(stage => {
      const opt = document.createElement('option');
      opt.value = stage;
      opt.textContent = stage;
      stageFilter.appendChild(opt);
    });

    stageFilter.addEventListener('change', () => {
      state.filters.stage = stageFilter.value;
      renderFixtures();
    });
  }

  // Clear filters
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.filters.team = '';
      state.filters.stage = '';
      if (teamFilter) teamFilter.value = '';
      if (stageFilter) stageFilter.value = '';
      renderFixtures();
      showToast('Filters cleared', 'info');
    });
  }
};


/* ============================================================
   SECTION 11: SEARCH
   ============================================================ */

/**
 * Initialize the search functionality with debounce
 */
const initSearch = () => {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  // Header Search CTA scrolls and focuses input
  const headerSearchCta = document.getElementById('header-search-cta');
  if (headerSearchCta) {
    headerSearchCta.addEventListener('click', () => {
      const searchWrapper = document.querySelector('.hero-search-wrapper');
      if (searchWrapper) {
        searchWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          input.focus();
        }, 400);
      } else {
        input.focus();
      }
    });
  }

  // Capsule Search Button focuses input
  const heroSearchBtn = document.getElementById('hero-search-btn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      input.focus();
    });
  }

  input.addEventListener('input', () => {
    clearTimeout(state.searchDebounceTimer);
    state.searchDebounceTimer = setTimeout(() => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        results.classList.add('hidden');
        results.innerHTML = '';
        return;
      }

      if (!state.fixturesData) return;

      const matches = state.fixturesData.matches.filter(m => {
        return m.homeTeam.toLowerCase().includes(query) ||
               m.awayTeam.toLowerCase().includes(query) ||
               m.city.toLowerCase().includes(query) ||
               m.stadium.toLowerCase().includes(query) ||
               m.homeCode.toLowerCase().includes(query) ||
               m.awayCode.toLowerCase().includes(query);
      }).slice(0, 8);

      if (matches.length === 0) {
        results.innerHTML = '<div class="search-no-results">No matches found</div>';
        results.classList.remove('hidden');
        return;
      }

      results.innerHTML = '';
      
      const header = document.createElement('div');
      header.className = 'search-dropdown-header';
      header.innerHTML = `
        <span>Search Results</span>
        <span>${matches.length} Matches</span>
      `;
      results.appendChild(header);

      matches.forEach(match => {
        const matchNPT = toNPT(new Date(match.dateTime));
        const isKnockout = match.stage.toLowerCase().includes('round') || 
                           match.stage.toLowerCase().includes('quarter') || 
                           match.stage.toLowerCase().includes('semi') || 
                           match.stage.toLowerCase().includes('final');
        const stageClass = isKnockout ? 'stage-pill-knockout' : 'stage-pill-group';

        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-left">
            <span class="search-stage-pill ${stageClass}">${match.stage}</span>
          </div>
          <div class="search-result-center">
            <div class="search-team home">
              <span class="search-team-name">${match.homeTeam}</span>
              <span class="search-team-code">${match.homeCode}</span>
              <span class="search-flag">${getFlagImg(match.homeCode, '24', match.homeTeam)}</span>
            </div>
            <span class="search-vs-badge">VS</span>
            <div class="search-team away">
              <span class="search-flag">${getFlagImg(match.awayCode, '24', match.awayTeam)}</span>
              <span class="search-team-code">${match.awayCode}</span>
              <span class="search-team-name">${match.awayTeam}</span>
            </div>
          </div>
          <div class="search-result-right">
            <div class="search-match-time">${formatTime12h(matchNPT)} NPT</div>
            <div class="search-match-venue">${match.city}</div>
          </div>
        `;
        item.addEventListener('click', () => {
          openMatchModal(match);
          results.classList.add('hidden');
          input.value = '';
        });
        results.appendChild(item);
      });

      const footer = document.createElement('div');
      footer.className = 'search-dropdown-footer';
      footer.innerHTML = `Press '/' to search instantly`;
      results.appendChild(footer);

      results.classList.remove('hidden');
    }, 300);
  });

  // Close search results on outside click
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.add('hidden');
    }
  });
};


/* ============================================================
   SECTION 12: UPCOMING FIXTURES
   ============================================================ */

/**
 * Render the upcoming fixtures grid with applied filters
 */
const renderFixtures = () => {
  const container = document.getElementById('fixtures-list');
  if (!container || !state.fixturesData) return;

  const now = new Date();
  let matches = state.fixturesData.matches
    .filter(m => new Date(m.dateTime) > now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  // Apply filters
  if (state.filters.team) {
    matches = matches.filter(m => m.homeTeam === state.filters.team || m.awayTeam === state.filters.team);
  }
  if (state.filters.stage) {
    matches = matches.filter(m => m.stage === state.filters.stage);
  }

  container.innerHTML = '';

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="no-fixtures">
        <span class="no-fixtures-icon">🏟️</span>
        <p>No upcoming fixtures match your filters</p>
      </div>
    `;
    return;
  }

  matches.forEach((match, index) => {
    const matchNPT = toNPT(new Date(match.dateTime));
    const matchBS = adToBS(matchNPT.getFullYear(), matchNPT.getMonth() + 1, matchNPT.getDate());

    const card = document.createElement('div');
    card.className = 'fixture-card';
    card.setAttribute('data-match-id', match.id);
    card.style.animationDelay = `${index * 0.05}s`;

    // Check favorites
    if (state.favorites.includes(match.homeCode) || state.favorites.includes(match.awayCode)) {
      card.classList.add('favorite-team');
    }

    // Check reminders
    const hasReminder = state.reminders.includes(match.id);

    card.innerHTML = `
      <div class="card-header">
        <span class="stage-badge">${match.group ? 'Group ' + match.group : match.stage}</span>
        <span class="card-date-handwritten">${formatNepaliDateShort(matchBS.year, matchBS.month, matchBS.day)}</span>
      </div>
      <div class="card-matchup">
        <div class="card-team-block">
          <div class="card-flag-large">${getFlagImg(match.homeCode, '40', match.homeTeam)}</div>
          <div class="card-team-name">${match.homeTeam}</div>
          <div class="card-team-code">${match.homeCode}</div>
        </div>
        <div class="card-vs-block">
          <span class="card-vs-text">VS</span>
          <span class="card-match-num">#${match.matchNumber}</span>
        </div>
        <div class="card-team-block card-team-block--away">
          <div class="card-flag-large">${getFlagImg(match.awayCode, '40', match.awayTeam)}</div>
          <div class="card-team-name">${match.awayTeam}</div>
          <div class="card-team-code">${match.awayCode}</div>
        </div>
      </div>
      <div class="card-footer">
        <span class="card-time">⏰ ${formatTime12h(matchNPT)} NPT</span>
        <span class="card-venue">📍 ${match.city}</span>
      </div>
      ${hasReminder ? '<div class="reminder-badge">🔔</div>' : ''}
    `;

    card.addEventListener('click', () => openMatchModal(match));
    container.appendChild(card);
  });

  // Initialize IntersectionObserver for fixture cards
  observeElements(container.querySelectorAll('.fixture-card'));
};


/* ============================================================
   SECTION 13: MATCH MODAL
   ============================================================ */

/**
 * Open the match detail modal for a single match
 * @param {Object} match - Match data object
 */
const openMatchModal = (match) => {
  try {
    const modal = document.getElementById('match-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;

    const matchNPT = toNPT(new Date(match.dateTime));
    const matchBS = adToBS(matchNPT.getFullYear(), matchNPT.getMonth() + 1, matchNPT.getDate());

    // Find stadium capacity
    let capacity = 'N/A';
    if (state.fixturesData && state.fixturesData.stadiums) {
      const stadium = state.fixturesData.stadiums.find(s => s.name === match.stadium);
      if (stadium) capacity = stadium.capacity.toLocaleString();
    }

    const isHomeFav = match.homeCode !== 'TBD' && state.favorites.includes(match.homeCode);
    const isAwayFav = match.awayCode !== 'TBD' && state.favorites.includes(match.awayCode);
    const isReminderSet = state.reminders.includes(match.id);

    const homeFavText = isHomeFav ? `⭐ ${match.homeCode} Favorited` : `⭐ Favorite ${match.homeCode}`;
    const awayFavText = isAwayFav ? `⭐ ${match.awayCode} Favorited` : `⭐ Favorite ${match.awayCode}`;
    const reminderText = isReminderSet ? '🔔 Reminder Set' : '🔔 Set Reminder';

    const homeFavClass = isHomeFav ? 'modal-btn active' : 'modal-btn modal-btn-secondary';
    const awayFavClass = isAwayFav ? 'modal-btn active' : 'modal-btn modal-btn-secondary';
    const reminderClass = isReminderSet ? 'modal-btn active-reminder' : 'modal-btn modal-btn-secondary';

    body.innerHTML = `
      <div class="modal-match-header">
        <span class="stage-badge">${match.stage}${match.group ? ' - Group ' + match.group : ''}</span>
        <div class="modal-match-number">Match #${match.matchNumber}</div>
      </div>
      <div class="modal-teams">
        <div class="modal-team modal-team-home">
          <span class="modal-flag">${getFlagImg(match.homeCode, '80', match.homeTeam)}</span>
          <span class="modal-team-name">${match.homeTeam}</span>
        </div>
        <span class="modal-vs">VS</span>
        <div class="modal-team modal-team-away">
          <span class="modal-flag">${getFlagImg(match.awayCode, '80', match.awayTeam)}</span>
          <span class="modal-team-name">${match.awayTeam}</span>
        </div>
      </div>
      <div class="modal-details">
        <div class="modal-detail-row">
          <span class="modal-detail-icon">📅</span>
          <div>
            <div class="modal-detail-label">Date (NPT)</div>
            <div class="modal-detail-value">${formatGregorianDateFull(matchNPT)}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">🗓️</span>
          <div>
            <div class="modal-detail-label">नेपाली मिति</div>
            <div class="modal-detail-value">${formatNepaliDateFull(matchBS.year, matchBS.month, matchBS.day)}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">🕐</span>
          <div>
            <div class="modal-detail-label">Time (NPT)</div>
            <div class="modal-detail-value">${formatTime12h(matchNPT)} NPT</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">🏟️</span>
          <div>
            <div class="modal-detail-label">Stadium</div>
            <div class="modal-detail-value">${match.stadium}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">📍</span>
          <div>
            <div class="modal-detail-label">City</div>
            <div class="modal-detail-value">${match.city}, ${match.country}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">👥</span>
          <div>
            <div class="modal-detail-label">Capacity</div>
            <div class="modal-detail-value">${capacity}</div>
          </div>
        </div>
      </div>
      <div class="modal-countdown">
        <div class="modal-countdown-label">Countdown to Kickoff</div>
        <div class="modal-countdown-timer" id="modal-countdown-timer"></div>
      </div>
      <div class="modal-actions">
        ${match.homeCode !== 'TBD' ? `<button class="${homeFavClass}" id="modal-home-fav-btn">${homeFavText}</button>` : ''}
        ${match.awayCode !== 'TBD' ? `<button class="${awayFavClass}" id="modal-away-fav-btn">${awayFavText}</button>` : ''}
        <button class="${reminderClass}" id="modal-reminder-btn">${reminderText}</button>
      </div>
    `;

    // Bind action buttons
    const homeFavBtn = document.getElementById('modal-home-fav-btn');
    if (homeFavBtn) {
      homeFavBtn.addEventListener('click', () => {
        toggleFavoriteTeam(match.homeCode);
        openMatchModal(match);
      });
    }
    const awayFavBtn = document.getElementById('modal-away-fav-btn');
    if (awayFavBtn) {
      awayFavBtn.addEventListener('click', () => {
        toggleFavoriteTeam(match.awayCode);
        openMatchModal(match);
      });
    }
    const reminderBtn = document.getElementById('modal-reminder-btn');
    if (reminderBtn) {
      reminderBtn.addEventListener('click', () => setReminder(match.id));
    }

    // Start modal countdown
    startModalCountdown(match.dateTime);

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  } catch (err) {
    console.error("Error in openMatchModal:", err);
    showToast("Could not open match modal", "error");
  }
};

/**
 * Open modal showing ALL matches for a given date
 * @param {string} dateStr - Gregorian date string (YYYY-MM-DD)
 * @param {Array} matches - Array of matches for that date
 */
const openDateModal = (dateStr, matches) => {
  try {
    const modal = document.getElementById('match-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;

    const dateParts = dateStr.split('-').map(Number);
    const bs = adToBS(dateParts[0], dateParts[1], dateParts[2]);
    const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

    let matchesHtml = '';
    matches.forEach(match => {
      const matchNPT = toNPT(new Date(match.dateTime));
      matchesHtml += `
        <div class="modal-date-match" data-match-id="${match.id}" style="cursor:pointer;">
          <div class="modal-date-match-header">
            <span class="stage-badge">${match.stage}${match.group ? ' - Group ' + match.group : ''}</span>
            <span>🕐 ${formatTime12h(matchNPT)} NPT</span>
          </div>
          <div class="modal-date-match-teams">
            <span>${getFlagImg(match.homeCode, '20', match.homeTeam)} ${match.homeTeam}</span>
            <span class="modal-date-vs">VS</span>
            <span>${getFlagImg(match.awayCode, '20', match.awayTeam)} ${match.awayTeam}</span>
          </div>
          <div class="modal-date-match-venue">🏟️ ${match.stadium}, ${match.city}</div>
        </div>
      `;
    });

    body.innerHTML = `
      <div class="modal-date-header">
        <div class="modal-date-title">${formatGregorianDateFull(dateObj)}</div>
        <div class="modal-date-nepali">${formatNepaliDateFull(bs.year, bs.month, bs.day)}</div>
        <div class="modal-date-count">${matches.length} matches scheduled</div>
      </div>
      <div class="modal-date-matches">${matchesHtml}</div>
    `;

    // Bind click on each match to open individual modal safely
    body.querySelectorAll('.modal-date-match').forEach(el => {
      el.addEventListener('click', () => {
        const matchId = el.getAttribute('data-match-id');
        const match = state.fixturesData.matches.find(m => String(m.id) === String(matchId));
        if (match) openMatchModal(match);
      });
    });

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  } catch (err) {
    console.error("Error in openDateModal:", err);
    showToast("Could not open date modal", "error");
  }
};

/**
 * Close the modal
 */
const closeModal = () => {
  const modal = document.getElementById('match-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  if (state.modalCountdownInterval) {
    clearInterval(state.modalCountdownInterval);
    state.modalCountdownInterval = null;
  }
};

/**
 * Start a countdown in the modal
 * @param {string} targetISO - ISO datetime string
 */
const startModalCountdown = (targetISO) => {
  if (state.modalCountdownInterval) clearInterval(state.modalCountdownInterval);

  const timerEl = document.getElementById('modal-countdown-timer');
  if (!timerEl) return;

  const update = () => {
    const now = new Date();
    const target = new Date(targetISO);
    let diff = target - now;

    if (diff <= 0) {
      timerEl.innerHTML = '<span class="modal-cd-text">Match time!</span>';
      clearInterval(state.modalCountdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    timerEl.innerHTML = `
      <div class="modal-cd-unit"><span class="modal-cd-val">${days}</span><span class="modal-cd-label">Days</span></div>
      <div class="modal-cd-sep">:</div>
      <div class="modal-cd-unit"><span class="modal-cd-val">${hours}</span><span class="modal-cd-label">Hours</span></div>
      <div class="modal-cd-sep">:</div>
      <div class="modal-cd-unit"><span class="modal-cd-val">${mins}</span><span class="modal-cd-label">Mins</span></div>
      <div class="modal-cd-sep">:</div>
      <div class="modal-cd-unit"><span class="modal-cd-val">${secs}</span><span class="modal-cd-label">Secs</span></div>
    `;
  };

  update();
  state.modalCountdownInterval = setInterval(update, 1000);
};

/**
 * Initialize modal event handlers
 */
const initModal = () => {
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('modal-overlay');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
};


/* ============================================================
   SECTION 14: THEME TOGGLE
   ============================================================ */

/**
 * Initialize and apply the theme
 */
const initTheme = () => {
  applyTheme(state.theme);

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
      localStorage.setItem('wc2026_theme', state.theme);
      updateParticleColors();
    });
  }
};

/**
 * Apply a theme to the document
 * @param {string} theme - 'dark' or 'light'
 */
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.remove('dark-theme', 'light-theme');
  }

  const icon = document.querySelector('#theme-toggle .theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
};


/* ============================================================
   SECTION 15: FULLSCREEN
   ============================================================ */

/**
 * Initialize fullscreen toggle
 */
const initFullscreen = () => {
  const btn = document.getElementById('fullscreen-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', () => {
    btn.textContent = document.fullscreenElement ? '⊡' : '⛶';
  });
};


/* ============================================================
   SECTION 16: AUDIO TOGGLE
   ============================================================ */

/**
 * Initialize audio toggle
 */
const initAudio = () => {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;

  updateAudioIcon();

  btn.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    localStorage.setItem('wc2026_audio', JSON.stringify(state.audioEnabled));
    updateAudioIcon();
    showToast(state.audioEnabled ? 'Sound enabled' : 'Sound muted', 'info');
  });
};

/**
 * Update the audio toggle icon
 */
const updateAudioIcon = () => {
  const icon = document.querySelector('#audio-toggle .audio-icon');
  if (icon) icon.textContent = state.audioEnabled ? '🔊' : '🔇';
};


/* ============================================================
   SECTION 17: LIVE STANDINGS API (worldcup26.ir)
   ============================================================ */

/** Base URL for the free, open, no-auth WC2026 API */
const WC26_API = 'https://worldcup26.ir/get';
/** Auto-refresh interval: every 5 minutes during live matches */
const STANDINGS_REFRESH_MS = 5 * 60 * 1000;

/**
 * Fetch live standings + teams from worldcup26.ir, then re-render.
 * Falls back to computing from fixtures.json on any error.
 */
const fetchLiveStandings = async () => {
  const container = document.getElementById('standings-container');
  const badge = document.getElementById('standings-live-badge');
  const lastUpdEl = document.getElementById('standings-last-updated');

  try {
    const [groupsRes, teamsRes] = await Promise.all([
      fetch(`${WC26_API}/groups`, { cache: 'no-store' }),
      fetch(`${WC26_API}/teams`,  { cache: 'no-store' })
    ]);

    if (!groupsRes.ok || !teamsRes.ok) throw new Error('API response not ok');

    const groupsJson = await groupsRes.json();
    const teamsJson  = await teamsRes.json();

    state.liveStandingsData = groupsJson.groups || [];
    state.liveTeamsData     = teamsJson.teams  || [];
    state.standingsLastUpdated = new Date();

    if (badge) {
      badge.textContent = '🔴 LIVE';
      badge.className = 'standings-badge live';
    }
    if (lastUpdEl) {
      const t = state.standingsLastUpdated;
      const npt = new Date(t.getTime() + (5 * 60 + 45) * 60 * 1000);
      lastUpdEl.textContent = `Updated ${npt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} NPT`;
    }

    renderStandingsFromAPI();
  } catch (err) {
    console.warn('Live standings fetch failed, using computed fallback:', err);
    if (badge) {
      badge.textContent = '📋 Offline';
      badge.className = 'standings-badge offline';
    }
    renderStandingsFallback();
  }
};

/**
 * Render standings from the live API data (worldcup26.ir)
 */
const renderStandingsFromAPI = () => {
  const container = document.getElementById('standings-container');
  if (!container || !state.liveStandingsData || !state.liveTeamsData) return;

  // Build a quick lookup: team_id → team info
  const teamMap = {};
  state.liveTeamsData.forEach(t => {
    teamMap[String(t.id)] = {
      name: t.name_en,
      code: t.fifa_code,
      flag: t.flag,   // URL from flagcdn.com
      group: t.groups
    };
  });

  // Also get our local group ordering from fixturesData for consistency
  const localGroups = state.fixturesData ? state.fixturesData.groups : {};

  // Sort groups alphabetically
  const sorted = [...state.liveStandingsData].sort((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = '';
  sorted.forEach(group => {
    const letter = group.name;

    // Sort teams in the group by pts → gd → gf → name
    const sortedTeams = [...group.teams].sort((a, b) => {
      const aPts = parseInt(a.pts) || 0, bPts = parseInt(b.pts) || 0;
      const aGd  = parseInt(a.gd)  || 0, bGd  = parseInt(b.gd)  || 0;
      const aGf  = parseInt(a.gf)  || 0, bGf  = parseInt(b.gf)  || 0;
      return bPts - aPts || bGd - aGd || bGf - aGf;
    });

    const rows = sortedTeams.map((t, idx) => {
      const info   = teamMap[String(t.team_id)] || { name: `Team ${t.team_id}`, code: '???', flag: '', group: letter };
      const pts    = parseInt(t.pts) || 0;
      const played = parseInt(t.mp)  || 0;
      const gd     = parseInt(t.gd)  || 0;
      const gdStr  = gd > 0 ? `+${gd}` : gd;
      const isTop2 = idx < 2 && played > 0;
      const isFav  = state.favorites.includes(info.code);

      const rowClass = [isFav ? 'favorite-team' : '', isTop2 ? 'qualifying-row' : ''].filter(Boolean).join(' ');

      // Use flag image from API (flagcdn.com) or fallback to our getFlagImg
      const flagHtml = info.flag
        ? `<img src="${info.flag}" alt="${info.name}" width="20" height="14" style="border-radius:2px;object-fit:cover;vertical-align:middle;">`
        : getFlagImg(info.code, '20', info.name);

      return `
        <tr class="${rowClass}">
          <td class="team-cell">
            <span class="standing-pos">${idx + 1}</span>
            <span class="team-flag">${flagHtml}</span>
            <span class="team-name team-name-full">${info.name}</span>
            <span class="team-name team-name-short">${info.code}</span>
          </td>
          <td>${played}</td>
          <td>${parseInt(t.w) || 0}</td>
          <td>${parseInt(t.d) || 0}</td>
          <td>${parseInt(t.l) || 0}</td>
          <td class="${gd > 0 ? 'gd-positive' : gd < 0 ? 'gd-negative' : ''}">${played > 0 ? gdStr : '—'}</td>
          <td class="pts-cell"><strong>${pts}</strong></td>
        </tr>
      `;
    }).join('');

    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `
      <div class="group-header">Group ${letter}</div>
      <table class="group-table">
        <thead>
          <tr>
            <th>Team</th>
            <th title="Played">P</th>
            <th title="Won">W</th>
            <th title="Drawn">D</th>
            <th title="Lost">L</th>
            <th title="Goal Difference">GD</th>
            <th title="Points">Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    container.appendChild(card);
  });
};

/**
 * Fallback: compute standings from local fixtures.json results
 */
const renderStandingsFallback = () => {
  const container = document.getElementById('standings-container');
  if (!container || !state.fixturesData) return;

  container.innerHTML = '';
  const groups = state.fixturesData.groups;
  const matches = state.fixturesData.matches || [];

  const computeGroupStandings = (letter, teamList) => {
    const stats = {};
    teamList.forEach(t => {
      stats[t.code] = { name: t.name, code: t.code, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });
    matches.forEach(m => {
      if (m.group !== letter || m.stage !== 'Group Stage') return;
      if (m.status !== 'finished' || m.homeScore === null || m.awayScore === null) return;
      const h = stats[m.homeCode], a = stats[m.awayCode];
      if (!h || !a) return;
      const hs = m.homeScore, as = m.awayScore;
      h.played++; a.played++; h.gf += hs; h.ga += as; a.gf += as; a.ga += hs;
      if (hs > as) { h.won++; h.pts += 3; a.lost++; }
      else if (hs < as) { a.won++; a.pts += 3; h.lost++; }
      else { h.drawn++; h.pts++; a.drawn++; a.pts++; }
    });
    Object.values(stats).forEach(t => { t.gd = t.gf - t.ga; });
    return Object.values(stats).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name));
  };

  Object.keys(groups).sort().forEach(letter => {
    const teams = groups[letter];
    const sorted = computeGroupStandings(letter, teams);
    const rows = sorted.map((team, idx) => {
      const isTop2 = idx < 2 && team.played > 0;
      const isFav  = state.favorites.includes(team.code);
      const rowClass = [isFav ? 'favorite-team' : '', isTop2 ? 'qualifying-row' : ''].filter(Boolean).join(' ');
      const gdStr = team.gd > 0 ? `+${team.gd}` : team.gd;
      return `
        <tr class="${rowClass}">
          <td class="team-cell">
            <span class="standing-pos">${idx + 1}</span>
            <span class="team-flag">${getFlagImg(team.code, '20', team.name)}</span>
            <span class="team-name team-name-full">${team.name}</span>
            <span class="team-name team-name-short">${team.code}</span>
          </td>
          <td>${team.played}</td><td>${team.won}</td><td>${team.drawn}</td><td>${team.lost}</td>
          <td class="${team.gd > 0 ? 'gd-positive' : team.gd < 0 ? 'gd-negative' : ''}">${team.played > 0 ? gdStr : '—'}</td>
          <td class="pts-cell"><strong>${team.pts}</strong></td>
        </tr>`;
    }).join('');
    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `
      <div class="group-header">Group ${letter}</div>
      <table class="group-table">
        <thead><tr><th>Team</th><th title="Played">P</th><th title="Won">W</th><th title="Drawn">D</th><th title="Lost">L</th><th title="Goal Difference">GD</th><th title="Points">Pts</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    container.appendChild(card);
  });
};

/**
 * Main entry point: inject the header UI, trigger first fetch, start auto-refresh
 */
const initLiveStandings = () => {
  // Inject the status bar above the standings grid
  const section = document.getElementById('standings-section');
  if (section && !document.getElementById('standings-live-badge')) {
    const bar = document.createElement('div');
    bar.className = 'standings-status-bar';
    bar.innerHTML = `
      <span id="standings-live-badge" class="standings-badge loading">⏳ Loading...</span>
      <span id="standings-last-updated" class="standings-last-updated"></span>
      <button id="standings-refresh-btn" class="standings-refresh-btn" title="Refresh standings now">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Refresh
      </button>
    `;
    // Insert the bar before the standings container
    const container = document.getElementById('standings-container');
    if (container) section.insertBefore(bar, container);

    document.getElementById('standings-refresh-btn').addEventListener('click', () => {
      const badge = document.getElementById('standings-live-badge');
      if (badge) { badge.textContent = '⏳ Refreshing...'; badge.className = 'standings-badge loading'; }
      fetchLiveStandings();
    });
  }

  // Initial fetch
  fetchLiveStandings();

  // Auto-refresh every 5 minutes
  if (state.standingsRefreshInterval) clearInterval(state.standingsRefreshInterval);
  state.standingsRefreshInterval = setInterval(fetchLiveStandings, STANDINGS_REFRESH_MS);
};

/**
 * Render group standings — now delegates to live API or fallback
 */
const renderStandings = () => {
  initLiveStandings();
};




/* ============================================================
   SECTION 18: STATISTICS
   ============================================================ */

/**
 * Render tournament statistics cards
 */
const renderStats = () => {
  const container = document.getElementById('stats-grid');
  if (!container) return;

  const stats = [
    { icon: '⚽', value: '104', label: 'Total Matches' },
    { icon: '👥', value: '48', label: 'Total Teams' },
    { icon: '🌎', value: '3', label: 'Host Nations' },
    { icon: '🏟️', value: '16', label: 'Venues' },
    { icon: '📅', value: '39', label: 'Days of Football' },
    { icon: '📊', value: '12', label: 'Groups' },
  ];

  container.innerHTML = '';
  stats.forEach((stat, index) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    container.appendChild(card);
  });
};


/* ============================================================
   SECTION 19: KEYBOARD NAVIGATION
   ============================================================ */

/**
 * Initialize keyboard shortcuts
 */
const initKeyboard = () => {
  document.addEventListener('keydown', (e) => {
    // Escape: close modal
    if (e.key === 'Escape') {
      closeModal();
    }

    // ArrowLeft/ArrowRight: navigate calendar months
    if (e.key === 'ArrowLeft' && !e.target.closest('input, select, textarea')) {
      e.preventDefault();
      navigateMonth(-1);
    }
    if (e.key === 'ArrowRight' && !e.target.closest('input, select, textarea')) {
      e.preventDefault();
      navigateMonth(1);
    }

    // '/': focus search
    if (e.key === '/' && !e.target.closest('input, select, textarea')) {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }
  });
};


/* ============================================================
   SECTION 20: TOUCH SWIPE
   ============================================================ */

/**
 * Initialize touch swipe for calendar navigation
 */
const initTouchSwipe = () => {
  const calendarGrid = document.getElementById('calendar-grid');
  if (!calendarGrid) return;

  calendarGrid.addEventListener('touchstart', (e) => {
    state.touchStartX = e.touches[0].clientX;
  }, { passive: true });

  calendarGrid.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = state.touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Left swipe → next month
        navigateMonth(1);
      } else {
        // Right swipe → previous month
        navigateMonth(-1);
      }
    }
  }, { passive: true });
};


/* ============================================================
   SECTION 21: INTERSECTION OBSERVER ANIMATIONS
   ============================================================ */

/**
 * Initialize IntersectionObserver for section reveal animations
 */
const initRevealObserver = () => {
  const sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
};

/**
 * Observe individual elements for staggered reveal
 * @param {NodeList} elements - Elements to observe
 */
const observeElements = (elements) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
};


/* ============================================================
   SECTION 23: FAVORITES
   ============================================================ */

/**
 * Toggle favorite status for teams
 * @param {string} homeCode - Home team code
 * @param {string} awayCode - Away team code
 */
const toggleFavoriteTeams = (homeCode, awayCode) => {
  const isHomeFav = homeCode !== 'TBD' && state.favorites.includes(homeCode);
  const isAwayFav = awayCode !== 'TBD' && state.favorites.includes(awayCode);
  const isFav = isHomeFav || isAwayFav;

  if (isFav) {
    // Unfavorite both teams if they are favorited
    if (homeCode !== 'TBD') {
      state.favorites = state.favorites.filter(code => code !== homeCode);
    }
    if (awayCode !== 'TBD') {
      state.favorites = state.favorites.filter(code => code !== awayCode);
    }
    showToast('Removed from favorites', 'info');
  } else {
    // Favorite both teams if neither is favorited
    if (homeCode !== 'TBD' && !state.favorites.includes(homeCode)) {
      state.favorites.push(homeCode);
    }
    if (awayCode !== 'TBD' && !state.favorites.includes(awayCode)) {
      state.favorites.push(awayCode);
    }
    showToast('Added to favorites', 'success');
  }

  localStorage.setItem('wc2026_favorites', JSON.stringify(state.favorites));

  const favBtn = document.getElementById('modal-fav-btn');
  if (favBtn) {
    const updatedHomeFav = homeCode !== 'TBD' && state.favorites.includes(homeCode);
    const updatedAwayFav = awayCode !== 'TBD' && state.favorites.includes(awayCode);
    const updatedFav = updatedHomeFav || updatedAwayFav;
    favBtn.textContent = updatedFav ? '⭐ Favorited' : '⭐ Favorite';
    favBtn.className = updatedFav ? 'modal-btn active' : 'modal-btn modal-btn-secondary';
  }

  // Re-render affected components
  renderFixtures();
  renderStandings();

  // Dynamic feed update
  const tabMyFeed = document.getElementById('tab-myfeed');
  if (tabMyFeed && tabMyFeed.classList.contains('active')) {
    renderMyFeed();
  }
};

/**
 * Toggle favorite status for an individual team
 * @param {string} teamCode - Team code (e.g., 'MEX')
 */
const toggleFavoriteTeam = (teamCode) => {
  if (!teamCode || teamCode === 'TBD') return;

  if (state.favorites.includes(teamCode)) {
    state.favorites = state.favorites.filter(code => code !== teamCode);
    showToast(`Removed ${teamCode} from favorites`, 'info');
  } else {
    state.favorites.push(teamCode);
    showToast(`Added ${teamCode} to favorites`, 'success');
  }

  localStorage.setItem('wc2026_favorites', JSON.stringify(state.favorites));

  // Re-render affected components globally
  renderFixtures();
  renderStandings();
  renderCalendar();

  // Dynamic feed update
  const tabMyFeed = document.getElementById('tab-myfeed');
  if (tabMyFeed && tabMyFeed.classList.contains('active')) {
    renderMyFeed();
  }
};

// Make globally accessible for onclick handlers
window.toggleFavoriteTeams = toggleFavoriteTeams;
window.toggleFavoriteTeam = toggleFavoriteTeam;


/* ============================================================
   SECTION 24: REMINDERS
   ============================================================ */

/**
 * Set a reminder for a match
 * @param {number} matchId - Match ID
 */
const setReminder = (matchId) => {
  const reminderBtn = document.getElementById('modal-reminder-btn');
  if (!state.reminders.includes(matchId)) {
    state.reminders.push(matchId);
    localStorage.setItem('wc2026_reminders', JSON.stringify(state.reminders));
    showToast(`Reminder set for Match #${matchId}`, 'success');
    if (reminderBtn) {
      reminderBtn.textContent = '🔔 Reminder Set';
      reminderBtn.className = 'modal-btn active-reminder';
    }
  } else {
    state.reminders = state.reminders.filter(id => id !== matchId);
    localStorage.setItem('wc2026_reminders', JSON.stringify(state.reminders));
    showToast(`Reminder removed for Match #${matchId}`, 'info');
    if (reminderBtn) {
      reminderBtn.textContent = '🔔 Set Reminder';
      reminderBtn.className = 'modal-btn modal-btn-secondary';
    }
  }
  renderFixtures();

  // Dynamic feed update
  const tabMyFeed = document.getElementById('tab-myfeed');
  if (tabMyFeed && tabMyFeed.classList.contains('active')) {
    renderMyFeed();
  }
};

// Make globally accessible
window.setReminder = setReminder;


/* ============================================================
   SECTION 25: TOAST NOTIFICATIONS
   ============================================================ */

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'info', 'success', 'warning', 'error'
 */
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};


/* ============================================================
   SECTION 26: DATE CLICK ON CALENDAR
   ============================================================ */

/**
 * Handle clicking on a calendar day
 * @param {string} dateStr - Gregorian date string (YYYY-MM-DD)
 * @param {Array|undefined} matches - Matches on this date, if any
 */
const handleDateClick = (dateStr, matches) => {
  try {
    // Update selected state
    state.selectedDate = dateStr;

    // Remove previous selection and highlight new cell
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    const cell = document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    if (cell) cell.classList.add('selected');

    // Update Inline Match Explorer dashboard
    renderInlineExplorer(dateStr, matches || []);
  } catch (err) {
    console.error("Error in handleDateClick:", err);
    showToast("Could not select date", "error");
  }
};

/**
 * Render the dynamic Inline Match Explorer details below the calendar grid
 * @param {string} dateStr - Gregorian date string (YYYY-MM-DD)
 * @param {Array} matches - Array of matches for the selected date
 */
const renderInlineExplorer = (dateStr, matches) => {
  const container = document.getElementById('calendar-selected-matches');
  if (!container) return;

  const dateParts = dateStr.split('-').map(Number);
  const bs = adToBS(dateParts[0], dateParts[1], dateParts[2]);
  const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

  if (!matches || matches.length === 0) {
    container.innerHTML = `
      <div class="explorer-title-area">
        <div class="explorer-title">
          <span>📅 Selected Date:</span>
          <span class="explorer-date-np">${formatNepaliDateFull(bs.year, bs.month, bs.day)}</span>
          <span class="explorer-date-en">(${formatGregorianDateFull(dateObj)})</span>
        </div>
      </div>
      <div class="explorer-empty-state">
        <span class="explorer-empty-icon">⚽</span>
        <div class="explorer-empty-text">No matches scheduled for this date. Select another highlighted match day on the calendar grid.</div>
      </div>
    `;
    return;
  }

  let cardsHtml = '';
  matches.forEach(match => {
    const matchNPT = toNPT(new Date(match.dateTime));
    const isHomeFav = match.homeCode !== 'TBD' && state.favorites.includes(match.homeCode);
    const isAwayFav = match.awayCode !== 'TBD' && state.favorites.includes(match.awayCode);
    const isReminderSet = state.reminders.includes(match.id);

    const reminderClass = isReminderSet ? 'active' : '';
    const reminderText = isReminderSet ? '🔔 Active' : '🔔 Remind';

    cardsHtml += `
      <div class="explorer-match-card" data-match-id="${match.id}">
        <div class="explorer-card-header">
          <span class="explorer-card-badge">${match.stage}${match.group ? ' • Group ' + match.group : ''}</span>
          <span class="explorer-card-time">🕐 ${formatTime12h(matchNPT)} NPT</span>
        </div>
        <div class="explorer-card-teams">
          <div class="explorer-team home">
            ${match.homeCode !== 'TBD' ? `<button class="explorer-team-star ${isHomeFav ? 'active' : ''}" data-team-code="${match.homeCode}" title="Toggle Favorite ${match.homeTeam}">${isHomeFav ? '★' : '☆'}</button>` : ''}
            <span class="explorer-team-name">${match.homeTeam}</span>
            <span class="explorer-flag">${getFlagImg(match.homeCode, '24', match.homeTeam)}</span>
          </div>
          <div class="explorer-vs">VS</div>
          <div class="explorer-team away">
            <span class="explorer-flag">${getFlagImg(match.awayCode, '24', match.awayTeam)}</span>
            <span class="explorer-team-name">${match.awayTeam}</span>
            ${match.awayCode !== 'TBD' ? `<button class="explorer-team-star ${isAwayFav ? 'active' : ''}" data-team-code="${match.awayCode}" title="Toggle Favorite ${match.awayTeam}">${isAwayFav ? '★' : '☆'}</button>` : ''}
          </div>
        </div>
        <div class="explorer-card-footer">
          <span>🏟️ ${match.stadium}, ${match.city}</span>
        </div>
        <div class="explorer-actions">
          <button class="explorer-btn btn-reminder ${reminderClass}" data-match-id="${match.id}" title="Toggle Reminder">
            ${reminderText}
          </button>
          <button class="explorer-btn btn-primary btn-details" data-match-id="${match.id}">
            View Details →
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="explorer-title-area">
      <div class="explorer-title">
        <span>⚽ Selected Date:</span>
        <span class="explorer-date-np">${formatNepaliDateFull(bs.year, bs.month, bs.day)}</span>
        <span class="explorer-date-en">(${formatGregorianDateFull(dateObj)})</span>
      </div>
    </div>
    <div class="explorer-matches-grid">
      ${cardsHtml}
    </div>
  `;

  // Bind actions
  // 1. Team Favorite toggles in row
  container.querySelectorAll('.explorer-team-star').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.getAttribute('data-team-code');
      toggleFavoriteTeam(code);
      // Refresh local explorer
      renderInlineExplorer(dateStr, matches);
    });
  });

  // 2. Reminder toggle
  container.querySelectorAll('.btn-reminder').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const matchId = Number(btn.getAttribute('data-match-id'));
      setReminder(matchId);
      // Refresh local explorer
      renderInlineExplorer(dateStr, matches);
    });
  });

  // 3. View Full Details Modal
  container.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const matchId = Number(btn.getAttribute('data-match-id'));
      const match = matches.find(m => m.id === matchId);
      if (match) openMatchModal(match);
    });
  });
};



/* ============================================================
   SECTION 27: MONTH NAVIGATION
   ============================================================ */

/**
 * Navigate the calendar by a given number of months
 * @param {number} direction - +1 for next month, -1 for previous month
 */
const navigateMonth = (direction) => {
  const grid = document.getElementById('calendar-grid');

  // Add animation class
  if (grid) {
    grid.classList.add(direction > 0 ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      grid.classList.remove('slide-left', 'slide-right');
    }, 300);
  }

  state.currentBSMonth += direction;

  if (state.currentBSMonth > 12) {
    state.currentBSMonth = 1;
    state.currentBSYear++;
  } else if (state.currentBSMonth < 1) {
    state.currentBSMonth = 12;
    state.currentBSYear--;
  }

  renderCalendar();
};

/**
 * Initialize month navigation buttons
 */
const initMonthNav = () => {
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');

  if (prevBtn) prevBtn.addEventListener('click', () => navigateMonth(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateMonth(1));
};


/* ============================================================
   SECTION 29: ERROR HANDLING & LOADING
   ============================================================ */

/**
 * Map an openfootball match object to our internal structure
 * @param {Object} m - openfootball match object
 * @param {number} idx - Index of match
 * @returns {Object} mapped match object
 */
const mapApiMatch = (m, idx) => {
  let dateTime = null;
  if (m.date && m.time) {
    try {
      const parts = m.time.split(' ');
      const hhmm = parts[0];
      const utcOffset = parts[1] || 'UTC';
      let formattedOffset = 'Z';
      if (utcOffset.startsWith('UTC')) {
        const offsetVal = utcOffset.substring(3);
        if (offsetVal) {
          const sign = offsetVal.startsWith('-') ? '-' : '+';
          const num = Math.abs(parseInt(offsetVal));
          const padNum = String(num).padStart(2, '0');
          formattedOffset = `${sign}${padNum}:00`;
        }
      }
      dateTime = `${m.date}T${hhmm}:00${formattedOffset}`;
    } catch (e) {
      console.warn('Failed to parse date/time:', m.date, m.time, e);
      dateTime = `${m.date}T12:00:00Z`;
    }
  } else if (m.date) {
    dateTime = `${m.date}T12:00:00Z`;
  }

  let stadium = m.ground || 'TBD Stadium';
  let city = 'TBD';
  let country = 'TBD';
  
  if (m.ground && GROUND_TO_STADIUM[m.ground]) {
    const sDetails = GROUND_TO_STADIUM[m.ground];
    stadium = sDetails.name;
    city = sDetails.city;
    country = sDetails.country;
  }

  const homeTeamName = m.team1 || 'To be announced';
  const awayTeamName = m.team2 || 'To be announced';

  // Normalize mapping (e.g. Turkey -> Türkiye, Bosnia & Herzegovina -> Bosnia and Herzegovina)
  const homeTeamNormalized = homeTeamName === 'Turkey' ? 'Türkiye' : (homeTeamName === 'Bosnia & Herzegovina' ? 'Bosnia and Herzegovina' : homeTeamName);
  const awayTeamNormalized = awayTeamName === 'Turkey' ? 'Türkiye' : (awayTeamName === 'Bosnia & Herzegovina' ? 'Bosnia and Herzegovina' : awayTeamName);

  const homeCode = TEAM_NAME_TO_CODE[homeTeamNormalized] || homeTeamNormalized;
  const awayCode = TEAM_NAME_TO_CODE[awayTeamNormalized] || awayTeamNormalized;

  let stage = 'Group Stage';
  if (m.round) {
    if (m.round.startsWith('Matchday ')) {
      stage = 'Group Stage';
    } else if (m.round === 'Match for third place') {
      stage = 'Third-place Play-off';
    } else {
      stage = m.round;
    }
  }

  let group = null;
  if (m.group) {
    group = m.group.replace('Group ', '').trim();
  }

  return {
    id: idx + 1,
    matchNumber: idx + 1,
    dateTime: dateTime,
    homeTeam: homeTeamNormalized,
    homeCode: homeCode,
    awayTeam: awayTeamNormalized,
    awayCode: awayCode,
    stadium: stadium,
    city: city,
    country: country,
    stage: stage,
    group: group
  };
};

/**
 * Fetch fixtures data with error handling
 * @returns {Promise<Object>} Fixtures data
 */
const fetchFixtures = async () => {
  try {
    const staticResponse = await fetch('fixtures.json');
    if (!staticResponse.ok) throw new Error(`HTTP ${staticResponse.status}: ${staticResponse.statusText}`);
    const staticData = await staticResponse.json();

    const apiResponse = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
    if (!apiResponse.ok) throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
    const apiData = await apiResponse.json();

    let matches = [];
    if (apiData && apiData.matches) {
      const mappedTemp = apiData.matches.map((m, idx) => mapApiMatch(m, idx));
      mappedTemp.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      matches = mappedTemp.map((m, idx) => {
        m.id = idx + 1;
        m.matchNumber = idx + 1;
        return m;
      });
    }

    const stagesSet = new Set();
    matches.forEach(m => {
      if (m.stage) stagesSet.add(m.stage);
    });
    const stages = Array.from(stagesSet);

    return {
      tournament: staticData.tournament || {
        name: "FIFA World Cup 2026™",
        tagline: "We Are 26",
        hosts: ["USA", "Canada", "Mexico"],
        startDate: "2026-06-11",
        endDate: "2026-07-19",
        totalTeams: 48,
        totalMatches: 84
      },
      stadiums: staticData.stadiums || [],
      groups: staticData.groups || {},
      matches: matches,
      stages: stages.length > 0 ? stages : staticData.stages
    };
  } catch (error) {
    console.error('Failed to load fixtures:', error);
    showToast('Failed to load fixture data. Please refresh the page.', 'error');
    return null;
  }
};


/* ============================================================
   SECTION 30: HEADER TABS & MY FEED VIEW
   ============================================================ */

/**
 * Initialize Header Tabs navigation
 */
const initTabs = () => {
  const tabSchedule = document.getElementById('tab-schedule');
  const tabMyFeed = document.getElementById('tab-myfeed');
  const viewSchedule = document.getElementById('view-schedule');
  const viewMyFeed = document.getElementById('view-myfeed');

  if (!tabSchedule || !tabMyFeed || !viewSchedule || !viewMyFeed) return;

  tabSchedule.addEventListener('click', () => {
    tabSchedule.classList.add('active');
    tabMyFeed.classList.remove('active');
    viewSchedule.classList.remove('hidden');
    viewMyFeed.classList.add('hidden');
  });

  tabMyFeed.addEventListener('click', () => {
    tabMyFeed.classList.add('active');
    tabSchedule.classList.remove('active');
    viewMyFeed.classList.remove('hidden');
    viewSchedule.classList.add('hidden');
    renderMyFeed();
  });
};

/**
 * Render My Feed (Favorites & Reminders)
 */
const renderMyFeed = () => {
  const favTeamsList = document.getElementById('fav-teams-list');
  const remindersList = document.getElementById('reminders-list');

  if (!state.fixturesData) return;

  // 1. Render Favorites
  if (favTeamsList) {
    favTeamsList.innerHTML = '';
    
    const favMatches = state.fixturesData.matches.filter(match => {
      return state.favorites.includes(match.homeCode) || state.favorites.includes(match.awayCode);
    }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    if (favMatches.length === 0) {
      favTeamsList.innerHTML = `
        <div class="feed-empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-title">No Favorite Teams</div>
          <div class="empty-text">Click the ⭐ Favorite button in match details to track your favorite teams!</div>
        </div>
      `;
    } else {
      favMatches.forEach(match => {
        const matchNPT = toNPT(new Date(match.dateTime));
        const card = document.createElement('div');
        card.className = 'feed-match-card';
        card.innerHTML = `
          <div class="feed-match-header">
            <span class="stage-badge">${match.stage}</span>
            <span>🕐 ${formatTime12h(matchNPT)} NPT</span>
          </div>
          <div class="feed-match-teams">
            <span class="${state.favorites.includes(match.homeCode) ? 'fav-highlight' : ''}">${getFlagImg(match.homeCode, '20', match.homeTeam)} ${match.homeTeam}</span>
            <span class="feed-vs">VS</span>
            <span class="${state.favorites.includes(match.awayCode) ? 'fav-highlight' : ''}">${getFlagImg(match.awayCode, '20', match.awayTeam)} ${match.awayTeam}</span>
          </div>
          <div class="feed-match-footer">
            <span>🏟️ ${match.stadium}</span>
            <span>${formatNepaliDateShort(adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).year, adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).month, adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).day)}</span>
          </div>
        `;
        card.addEventListener('click', () => openMatchModal(match));
        favTeamsList.appendChild(card);
      });
    }
  }

  // 2. Render Reminders
  if (remindersList) {
    remindersList.innerHTML = '';
    
    const reminderMatches = state.fixturesData.matches.filter(match => {
      return state.reminders.includes(match.id);
    }).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    if (reminderMatches.length === 0) {
      remindersList.innerHTML = `
        <div class="feed-empty-state">
          <div class="empty-icon">🔔</div>
          <div class="empty-title">No Reminders Active</div>
          <div class="empty-text">Click the 🔔 Set Reminder button in match details to never miss a kickoff!</div>
        </div>
      `;
    } else {
      reminderMatches.forEach(match => {
        const matchNPT = toNPT(new Date(match.dateTime));
        const card = document.createElement('div');
        card.className = 'feed-match-card reminder-card';
        card.innerHTML = `
          <div class="feed-match-header">
            <span class="stage-badge">${match.stage}</span>
            <span class="active-bell">🔔 Active</span>
          </div>
          <div class="feed-match-teams">
            <span>${getFlagImg(match.homeCode, '20', match.homeTeam)} ${match.homeTeam}</span>
            <span class="feed-vs">VS</span>
            <span>${getFlagImg(match.awayCode, '20', match.awayTeam)} ${match.awayTeam}</span>
          </div>
          <div class="feed-match-footer">
            <span>🕐 ${formatTime12h(matchNPT)} NPT</span>
            <span>${formatNepaliDateShort(adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).year, adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).month, adToBS(matchNPT.getFullYear(), matchNPT.getMonth()+1, matchNPT.getDate()).day)}</span>
          </div>
        `;
        card.addEventListener('click', () => openMatchModal(match));
        remindersList.appendChild(card);
      });
    }
  }
};


/**
 * Show/hide the loading screen
 * @param {boolean} show - Whether to show or hide
 */
const toggleLoadingScreen = (show) => {
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');

  if (show) {
    if (loadingScreen) loadingScreen.classList.remove('loading-hidden');
    if (app) app.classList.add('hidden');
  } else {
    if (loadingScreen) loadingScreen.classList.add('loading-hidden');
    if (app) {
      app.classList.remove('hidden');
      app.classList.add('visible');
    }
  }
};


/* ============================================================
   SECTION 3 (MAIN INIT): APPLICATION INITIALIZATION
   ============================================================ */

/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Show loading screen
  toggleLoadingScreen(true);

  // Start background operations in parallel
  const fixturesPromise = fetchFixtures();
  const minLoadTime = new Promise(resolve => setTimeout(resolve, 2500));

  // Initialize theme immediately (doesn't need data)
  initTheme();

  // Wait for both data load and minimum display time
  const [fixturesData] = await Promise.all([fixturesPromise, minLoadTime]);

  if (fixturesData && fixturesData.matches) {
    const now = new Date();
    // Find the latest Group Stage match date
    const groupMatches = fixturesData.matches.filter(m => m.stage === 'Group Stage');
    const lastGroupMatchDate = groupMatches.reduce((latest, match) => {
      const d = new Date(match.dateTime);
      return d > latest ? d : latest;
    }, new Date(0));

    // Determine "finished" if the current date has passed the last Group Stage match datetime
    const isGroupStageFinished = now > lastGroupMatchDate;

    if (!isGroupStageFinished) {
      // Hide knockout stages (only keep Group Stage matches for now)
      fixturesData.matches = groupMatches;
      // Also filter the stages list to only include Group Stage
      if (fixturesData.stages) {
        fixturesData.stages = fixturesData.stages.filter(s => s === 'Group Stage');
      }
    }
  }

  state.fixturesData = fixturesData;

  // Hide loading, show app
  toggleLoadingScreen(false);

  // Initialize all components
  initParticles();
  initClock();
  initModal();
  initMonthNav();
  initFilters();
  initSearch();
  initFullscreen();
  initAudio();
  initKeyboard();
  initTouchSwipe();
  initTabs();

  // Render all sections
  renderCalendar();
  renderHero();
  renderTodaysMatches();
  renderFixtures();
  renderStandings();
  renderStats();

  // Pre-select initial date on startup to populate Inline Explorer
  if (state.fixturesData && state.fixturesData.matches && state.fixturesData.matches.length > 0) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    let initialDateStr = todayStr;
    let initialMatches = state.fixturesData.matches.filter(m => {
      const matchNPT = toNPT(new Date(m.dateTime));
      const matchDateStr = `${matchNPT.getFullYear()}-${String(matchNPT.getMonth() + 1).padStart(2, '0')}-${String(matchNPT.getDate()).padStart(2, '0')}`;
      return matchDateStr === todayStr;
    });

    if (initialMatches.length === 0) {
      // No matches today, select the first match in the tournament schedule
      const firstMatch = [...state.fixturesData.matches].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0];
      const matchNPT = toNPT(new Date(firstMatch.dateTime));
      initialDateStr = `${matchNPT.getFullYear()}-${String(matchNPT.getMonth() + 1).padStart(2, '0')}-${String(matchNPT.getDate()).padStart(2, '0')}`;
      initialMatches = state.fixturesData.matches.filter(m => {
        const mNPT = toNPT(new Date(m.dateTime));
        const mDateStr = `${mNPT.getFullYear()}-${String(mNPT.getMonth() + 1).padStart(2, '0')}-${String(mNPT.getDate()).padStart(2, '0')}`;
        return mDateStr === initialDateStr;
      });
      
      // Update the calendar's current month/year to match the selected date so it is in view
      const matchBS = adToBS(matchNPT.getFullYear(), matchNPT.getMonth() + 1, matchNPT.getDate());
      state.currentBSYear = matchBS.year;
      state.currentBSMonth = matchBS.month;
      
      // Re-render calendar so month view is correct
      renderCalendar();
    }

    // Set selected state
    state.selectedDate = initialDateStr;
    const cell = document.querySelector(`.calendar-day[data-date="${initialDateStr}"]`);
    if (cell) cell.classList.add('selected');

    // Populate Inline Explorer
    renderInlineExplorer(initialDateStr, initialMatches);
  }

  // Initialize scroll reveal
  initRevealObserver();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.log('Service Worker registration failed:', err));
    });
  }
});
