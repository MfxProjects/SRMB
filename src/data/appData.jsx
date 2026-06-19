import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';

// Main navigation and home-card configuration. Adding an item here exposes it in both places.
export const sections = [
  { label: 'DEFAULT PAGE', shortLabel: 'DEFAULT', icon: '/assets/navIcons/default-page.svg', image: '/assets/cardImage/generated-png/default-page.webp', page: 'home' },
  { label: 'ABOUT US', icon: '/assets/navIcons/about-us.png', image: '/assets/cardImage/generated-png/about-us.webp', page: 'about' },
  { label: 'INFRASTRUCTURE', icon: '/assets/navIcons/infra.png', image: '/assets/cardImage/generated-png/infrastructure.webp', page: 'infrastructure' },
  { label: 'MEDIA CORNER', icon: '/assets/navIcons/media-corner.svg', image: '/assets/cardImage/generated-png/media-corner.webp', page: 'media-corner' },
  { label: 'CUSTOMER TESTIMONY', shortLabel: 'TESTIMONY', icon: '/assets/navIcons/customer-testimony.svg', image: '/assets/cardImage/generated-png/customer-testimony.webp', page: 'customer-testimony' },
  { label: 'PRODUCTS', icon: '/assets/navIcons/products.png', image: '/assets/cardImage/generated-png/products.webp', page: 'products' },
  { label: 'PROJECTS', icon: '/assets/navIcons/projects.png', image: '/assets/cardImage/generated-png/projects.webp', page: 'projects' },
  { label: 'CERTIFICATES', icon: '/assets/navIcons/certificate.png', image: '/assets/cardImage/generated-png/certificates.webp', page: 'certificate' },
  { label: 'SUSTAINABILITY', icon: '/assets/navIcons/sustainability.png', image: '/assets/cardImage/generated-png/sustainability.webp', page: 'sustainability' },
  { label: 'SRMB WE CARE', shortLabel: 'CSR', icon: '/assets/navIcons/csr.svg', image: '/assets/cardImage/generated-png/csr.webp', page: 'csr' },
  { label: 'AWARDS', icon: '/assets/navIcons/awards.svg', image: '/assets/cardImage/generated-png/awards.webp', page: 'awards' },
  { label: 'GALLERY', icon: '/assets/navIcons/gallery.svg', image: '/assets/cardImage/generated-png/gallery.webp', page: 'gallery' },
  { label: 'GAME CORNER', icon: '/assets/navIcons/game-corner.svg', image: '/assets/cardImage/generated-png/game-corner.webp', page: 'game-corner' },
  { label: 'GROUP OF COMPANIES', shortLabel: 'GROUP', icon: '/assets/navIcons/group-companies.svg', image: '/assets/cardImage/generated-png/group-companies.webp', page: 'group-companies' },
  { label: 'FEEDBACK', icon: '/assets/navIcons/feedback.svg', image: '/assets/cardImage/generated-png/feedback.webp', page: 'contact' },
];

export const cards = sections;

export function formatHomeDateTime(value) {
  return formatHomeDate(value);
}

export function formatHomeDate(value) {
  return formatLongDate(value);
}

export function formatDigitalTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(value);
}

export function formatLongDate(value) {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(value);
  const day = String(value.getDate()).padStart(2, '0');
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(value);
  const year = value.getFullYear();

  return `${weekday} ${day} ${month} ${year}`;
}

export function formatMonthTitle(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(value);
}

export function toCalendarKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Events displayed inside the calendar popup on the home screen.
export const calendarEvents = [
  { date: '2026-06-05', title: 'World Environment Day', type: 'event', note: 'Sustainability awareness day' },
  { date: '2026-06-17', title: 'Al-Hijra', type: 'festival', note: 'Islamic New Year' },
  { date: '2026-06-21', title: 'International Yoga Day', type: 'event', note: 'Global wellness event' },
  { date: '2026-06-21', title: 'Father\'s Day', type: 'event', note: 'Family observance' },
  { date: '2026-06-25', title: 'Nirjala Ekadashi', type: 'festival', note: 'Festival / vrat' },
  { date: '2026-06-26', title: 'Muharram / Ashura', type: 'holiday', note: 'West Bengal holiday' },
];

export function getCalendarMonthData(value) {
  const year = value.getFullYear();
  const monthIndex = value.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthEvents = calendarEvents
    .filter((event) => event.date.startsWith(monthPrefix))
    .sort((left, right) => left.date.localeCompare(right.date));
  const eventsByDate = monthEvents.reduce((groups, event) => {
    groups[event.date] = [...(groups[event.date] || []), event];
    return groups;
  }, {});

  return {
    days: Array.from({ length: firstDay + daysInMonth }, (_, index) => {
      const day = index - firstDay + 1;

      if (day < 1) {
        return null;
      }

      const dateKey = toCalendarKey(year, monthIndex, day);
      return {
        day,
        dateKey,
        events: eventsByDate[dateKey] || [],
      };
    }),
    monthEvents,
  };
}

export function formatMediaTime(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export const infrastructureVideo = '/assets/infrastructure/Our_esteemed_director_Mr._Ashish_Beriwala_made_a_mark_at_Visionaries_of_Viksit_Bharat_SRMB_1080P.mp4';
export const corporateVideo = '/assets/corporate video/srmb corp film.mp4';
export const brandAmbassadorImage = '/assets/brand/brand-ambassador-optimized.webp';
export const corporateOfficeMapsUrl = 'https://www.google.com/maps/place/SRMB+House+(Newtown+Corporate+Office)/@22.581785,88.480767,17z/data=!3m1!4b1!4m6!3m5!1s0x3a020bd0368c8fd7:0xd91766f14522e2ad!8m2!3d22.581785!4d88.480767!16s%2Fg%2F11krywvtlt?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D';
export const corporateOfficeEmbedUrl = 'https://www.google.com/maps?q=SRMB%20House%20Newtown%20Corporate%20Office%2022.581785%2C88.480767&z=17&output=embed';

// Themes map user-facing labels to the CSS variable sets in shared.css.
export const themes = [
  { id: 'black', label: 'Dark Black', colors: ['#050507', '#f0c65f'] },
  { id: 'steel', label: 'Steel', colors: ['#414b5f', '#e9c76d'] },
  { id: 'mono', label: 'B & W', colors: ['#ffffff', '#111111'] },
  { id: 'ivory', label: 'Ivory', colors: ['#f6efe2', '#c99554'] },
  { id: 'mint', label: 'Mint', colors: ['#eaf7ef', '#299b62'] },
  { id: 'sky', label: 'Sky', colors: ['#edf5ff', '#357abd'] },
  { id: 'rose', label: 'Rose', colors: ['#fff1f3', '#c85c73'] },
];

export const themeIds = new Set(themes.map((theme) => theme.id));
export const defaultTheme = 'black';

// Page content is kept outside components so UI files stay focused on interaction and layout.
export const aboutPhotos = [
  '/assets/aboutus/6_1-optimized.webp',
  '/assets/aboutus/8_1-optimized.webp',
  '/assets/aboutus/9_1-optimized.webp',
  '/assets/aboutus/10_1-optimized.webp',
  '/assets/aboutus/11-optimized.webp',
];

export const boardDirectorSlides = [
  {
    name: 'B.M. Beriwala',
    role: 'Chairman',
    title: 'Message from Chairman Sir',
    image: '/assets/Boards%20of%20director%20corner/Mohan%20Ji-optimized.webp',
    message: [
      'Dear Stakeholders,',
      'Over the past seven decades, SRMB Srijan Private Limited has grown from a modest beginning into a trusted name in the Indian steel industry. This journey has been guided by a clear vision, strong values, and an unwavering commitment to quality, innovation, and responsibility. Our growth reflects not only the strength of our manufacturing capabilities but also the trust placed in us by our customers, stakeholders, and partners across the country. From supplying steel for essential infrastructure to contributing to projects of national importance, we take pride in being part of India\'s development story.',
      'As we look ahead, our mission is focused on expansion with responsibility. We are continuously strengthening our integrated manufacturing facilities, adopting advanced refining and quality control technologies, and enhancing our product portfolio to meet the evolving requirements of modern infrastructure. Our objective is not only to increase capacity but also to improve efficiency, consistency, and sustainability in every stage of production.',
      'At SRMB, growth has always been aligned with our commitment to society. Through our Corporate Social Responsibility initiatives, we actively support programs in education, healthcare, community development, and employee welfare. We believe that true progress is achieved when industrial development goes hand in hand with social upliftment, and we remain dedicated to contributing positively to the communities around us.',
      'Sustainability remains a key pillar of our long-term vision. We are steadily adopting environmentally responsible practices, improving energy efficiency, reducing emissions, and promoting the use of certified green steel. Our efforts in sustainable manufacturing, resource optimization, and responsible governance reflect our determination to build a future-ready organization that meets global standards while protecting the environment for the next generation.',
      'On behalf of the management, I extend my sincere gratitude to all our stakeholders - customers, employees, partners, and well-wishers - for their continued support and confidence. With the same spirit of dedication that has guided us for the last seventy years, we remain committed to building a stronger, more sustainable, and more progressive future together.',
      '- B.M. Beriwala',
    ],
  },
  {
    name: 'Ashish Beriwala',
    role: 'Director',
    title: 'Message from Shri Ashish Beriwala',
    image: '/assets/Boards%20of%20director%20corner/Ashish%20Ji%20Pic_page-0001-optimized.webp',
    message: [
      'Dear Stakeholders,',
      'Over the years, SRMB Srijan Private Limited has witnessed steady and consistent growth driven by the collective efforts of our employees, channel partners, customers, and institutional associates. From a strong manufacturing foundation, we have expanded our presence across diverse markets through a well-structured marketing network, a dedicated channel partner ecosystem, and a growing institutional business segment. Today, our products are trusted in major infrastructure, industrial, and construction projects across the country, reflecting the confidence that stakeholders have placed in our quality, reliability, and service commitment.',
      'Our marketing strength has been built through a wide distribution network supported by committed dealers, distributors, and business partners who have played a vital role in taking our products to every corner of the market. Alongside channel sales, our institutional sales division has expanded significantly, enabling us to participate in large-scale government, PSU, metro, railway, power, and infrastructure projects. This balanced growth in both retail and institutional segments has strengthened our position as a dependable and responsible steel producer.',
      'In parallel with business expansion, we have invested in modern IT infrastructure to enhance efficiency, transparency, and responsiveness across all operations. Implementation of advanced digital systems in supply chain management, quality monitoring, customer coordination, and internal communication has enabled faster decision-making and improved service delivery to our stakeholders. We believe that strong technological support is essential for sustainable growth in today\'s competitive and quality-driven environment.',
      'Sustainability remains an integral part of our long-term vision. We are continuously working towards improving energy efficiency, reducing environmental impact, and adopting responsible manufacturing practices in line with national and global standards. Our focus on green manufacturing, responsible sourcing, and certified sustainable products reflects our commitment to building a future-ready organization that balances industrial growth with environmental and social responsibility.',
      'I sincerely thank all our stakeholders - our valued customers, channel partners, institutional clients, employees, and well-wishers - for their continued trust and support. With the same dedication and forward-looking approach, SRMB Srijan Private Limited will continue to grow, innovate, and contribute to the nation\'s infrastructure and sustainable development in the years ahead.',
      '- Ashish Beriwala',
    ],
  },
  {
    name: 'Navin Bhuwalka',
    role: 'Director',
    title: 'Message from Shri Navin Bhuwalka',
    image: '/assets/Boards%20of%20director%20corner/Navin%20ji-optimized.webp',
    message: [
      'Dear Stakeholders,',
      'Over the years, SRMB Srijan Private Limited has achieved steady and purposeful growth, driven by our commitment to quality, strong market presence, and the confidence reposed in us by our stakeholders. What began as a modest operation has evolved into a widely recognized steel manufacturer with a strong footprint across retail, institutional, and infrastructure sectors. Our progress reflects the collective efforts of our marketing teams, institutional sales division, channel partners, and technical personnel who have consistently worked towards expanding our reach while maintaining the highest standards of product reliability.',
      'Our marketing network has grown significantly over the years, supported by a robust distribution system and dedicated channel partners across multiple regions. Through this well-structured network, we have been able to ensure timely availability of our products, strengthen customer relationships, and build a brand that stands for consistency and trust. At the same time, our institutional sales division has expanded its presence in large-scale projects, enabling us to supply reinforcement steel to major infrastructure, power, metro, railway, road, and industrial projects across the country.',
      'One of the key milestones in our growth has been securing approvals from various Government departments, Public Sector Undertakings, and reputed infrastructure organizations. Our products are approved and used in projects executed by national agencies and state departments, reflecting our capability to meet stringent technical specifications, quality requirements, and documentation standards. These approvals have strengthened our position as a dependable primary steel producer capable of supporting critical and large-scale construction works.',
      'Our continued participation in projects of national importance has further reinforced our focus on process discipline, quality assurance, and traceability. We remain committed to maintaining the technical standards, manufacturing consistency, and supply reliability required for institutional and government projects, while also strengthening our marketing reach in the general construction sector.',
      'I would like to express my sincere appreciation to all our stakeholders - our valued customers, institutional clients, consultants, channel partners, and employees - for their continued trust and cooperation. With the same dedication and forward-looking approach, SRMB Srijan Private Limited will continue to expand its presence, strengthen its capabilities, and contribute to the development of modern infrastructure across the country.',
      '- Navin Bhuwalka',
    ],
  },
  {
    name: 'Nikunj Beriwala',
    role: 'Director',
    title: 'Message from Shri Nikunj Beriwala',
    image: '/assets/Boards%20of%20director%20corner/Nikunj%20Ji-optimized.webp',
    message: [
      'Dear Stakeholders,',
      'At SRMB Srijan Private Limited, our journey has always been guided by a strong commitment to quality, responsibility, and continuous improvement. As we move forward in an increasingly quality-conscious and sustainability-driven industrial environment, we remain focused on strengthening our manufacturing practices, ensuring consistent product performance, and maintaining the highest standards of governance across all operations. The trust placed in us by our stakeholders has been the driving force behind our efforts to build a manufacturing system that is reliable, transparent, and future-ready.',
      'Sustainable manufacturing is one of the core pillars of our organizational philosophy. We continuously strive to optimize resource utilization, improve energy efficiency, and reduce environmental impact through the adoption of modern technologies and responsible production processes. Our focus is not only on meeting current requirements but also on ensuring that our manufacturing practices remain aligned with evolving environmental standards and national priorities for green and responsible steel production.',
      'Product quality remains the foundation of our credibility. Every stage of our production process, from raw material selection to final dispatch, is governed by strict quality control procedures designed to ensure uniformity, strength, and reliability of our steel products. Our manufacturing facilities are supported by an in-house laboratory accredited to ISO/IEC 17025 under NABL, which enables precise chemical and mechanical testing using calibrated and validated equipment. This accreditation ensures that our test results are accurate, traceable, and in full compliance with applicable Indian Standards and project-specific requirements.',
      'To maintain consistency in performance, SRMB operates under an Integrated Management System certified to ISO 9001 for Quality Management, ISO 14001 for Environmental Management, and ISO 45001 for Occupational Health & Safety. These systems provide a structured framework for process control, risk management, environmental protection, and workplace safety. Regular internal audits, external assessments, and continual improvement initiatives help us maintain discipline in operations and reinforce confidence among our customers and institutional stakeholders.',
      'We believe that long-term growth can only be achieved through responsible manufacturing, dependable quality, and transparent systems. On behalf of the management, I extend my sincere gratitude to all our stakeholders - customers, partners, consultants, employees, and well-wishers - for their continued support and trust. We remain committed to delivering products that meet the highest standards of performance while contributing to a safer, more sustainable, and stronger infrastructure for the nation.',
      '- Nikunj Beriwala',
    ],
  },
];

// All internal pages reuse the same navigation definition as the home cards.
export const navItems = sections;

export const contactDetails = [
  { title: 'Office Number / Reception', value: '(033)6600-6600' },
  { title: 'Toll Free No For - Quote / order', value: '1800 890 2868' },
  { title: 'Support', value: 'info@srmb.com' },
  { title: 'HR', value: 'recruitment@srmb.com' },
  {
    title: 'Address',
    value: 'Premise No. 16-360, DH 6/9, Action Area-1D, New Town, Barasat Sadar, North 24 Parganas, WB 700156, INDIA.',
  },
  { title: 'Working Days', value: 'Monday To Saturday' },
  { title: 'Office Hours', value: '10.30 AM - 6.30 PM' },
];

export const galleryVideos = [
  '/assets/gallery/SRMB_ke_Saath_Banaye_Naya_Hindustan_Anthem_ft._Shaan_Music_by_Joy_Sarkar_Official_Launch_1080P.mp4',
  '/assets/gallery/SRMB_TMT_Bars_The_Strength_Behind_Every_Champion_Dream_1080P.mp4',
  '/assets/gallery/Three_World_Cup-winning_captains._One_unbeatable_choice._1080P.mp4',
  '/assets/gallery/Pakad_Mazboot_Honi_Chahiye_TVC_SRMB_Steel_TMT_Bar_Wingrip_MS_Dhoni_Rohit_Sharma_1080p.mp4',
  '/assets/gallery/Our_esteemed_director_Mr._Ashish_Beriwala_made_a_mark_at_Visionaries_of_Viksit_Bharat_SRMB_1080P.mp4',
  '/assets/gallery/SRMB_RealFabrica_The_Real_Hero_Behind_Every_Construction_1080P.mp4',
];

export function testimonyAssetPath(fileName) {
  return `/assets/testiminoals/${encodeURIComponent(fileName)}`;
}

export function testimonyPosterPath(fileName) {
  return `/assets/testiminoals/posters/${encodeURIComponent(fileName)}`;
}

export const testimonyVideos = [
  { title: 'Amit Kandoi', src: testimonyAssetPath('AMIT_KANDOI_V_1.mp4'), poster: testimonyPosterPath('AMIT_KANDOI_V_1.jpg') },
  { title: 'Arijit Chatterjee', src: testimonyAssetPath('Arijit Chatterjee.mp4'), poster: testimonyPosterPath('Arijit Chatterjee.jpg') },
  { title: 'Ashok Roychowdhury', src: testimonyAssetPath('Ashok_Roychowdhury.mp4'), poster: testimonyPosterPath('Ashok_Roychowdhury.jpg') },
  { title: 'Atanu Maji', src: testimonyAssetPath('ATANU_MAJI.mp4'), poster: testimonyPosterPath('ATANU_MAJI.jpg') },
  { title: 'Biplab Saha', src: testimonyAssetPath('Biplab Saha.mp4'), poster: testimonyPosterPath('Biplab Saha.jpg') },
  { title: 'Biswajit Sarkar', src: testimonyAssetPath('Biswajit Sarkar.mp4'), poster: testimonyPosterPath('Biswajit Sarkar.jpg') },
  { title: 'Datta Patil', src: testimonyAssetPath('DATTA_PATIL.mp4'), poster: testimonyPosterPath('DATTA_PATIL.jpg') },
  { title: 'Dinesh Agarwal', src: testimonyAssetPath('DINESH_AGARWAL.mp4'), poster: testimonyPosterPath('DINESH_AGARWAL.jpg') },
  { title: 'Humayun Kabir', src: testimonyAssetPath('HUMAYUN_KABIR.mp4'), poster: testimonyPosterPath('HUMAYUN_KABIR.jpg') },
  { title: 'Jalaluddin Ahmed', src: testimonyAssetPath('JALALUDDIN_AHMED (1).mp4'), poster: testimonyPosterPath('JALALUDDIN_AHMED (1).jpg') },
  { title: 'Jayaanta Mandal', src: testimonyAssetPath('JAYAANTA_MANDAL.mp4'), poster: testimonyPosterPath('JAYAANTA_MANDAL.jpg') },
  { title: 'Pranab Kr. Maity', src: testimonyAssetPath('Pranab Kr. Maity.mp4'), poster: testimonyPosterPath('Pranab Kr. Maity.jpg') },
  { title: 'Pranay Pal', src: testimonyAssetPath('PRANAY_PAL.mp4'), poster: testimonyPosterPath('PRANAY_PAL.jpg') },
  { title: 'Pushpendu Jana', src: testimonyAssetPath('PUSHPENDU_JANA.mp4'), poster: testimonyPosterPath('PUSHPENDU_JANA.jpg') },
  { title: 'Raju Dutta', src: testimonyAssetPath('RAJU_DUTTA.mp4'), poster: testimonyPosterPath('RAJU_DUTTA.jpg') },
  { title: 'Sabyasachi Rai', src: testimonyAssetPath('SABYASACHI_RAI.mp4'), poster: testimonyPosterPath('SABYASACHI_RAI.jpg') },
  { title: 'Sayndip Bhowmik', src: testimonyAssetPath('SAYNDIP_BHOWMIK.mp4'), poster: testimonyPosterPath('SAYNDIP_BHOWMIK.jpg') },
  { title: 'Satyajit Saha', src: testimonyAssetPath('Satyajit_Saha.mp4'), poster: testimonyPosterPath('Satyajit_Saha.jpg') },
  { title: 'Siddique Hardware', src: testimonyAssetPath('Siddique Hardware.mp4'), poster: testimonyPosterPath('Siddique Hardware.jpg') },
  { title: 'Somnath Nashkar', src: testimonyAssetPath('Somnath Nashkar.mp4'), poster: testimonyPosterPath('Somnath Nashkar.jpg') },
  { title: 'Souvik Ghosh', src: testimonyAssetPath('Souvik Ghosh.mp4'), poster: testimonyPosterPath('Souvik Ghosh.jpg') },
  { title: 'Subha Karmakar', src: testimonyAssetPath('SUBHA_KARMAKAR.mp4'), poster: testimonyPosterPath('SUBHA_KARMAKAR.jpg') },
  { title: 'Tanishq Rathi', src: testimonyAssetPath('Tanishq Rathi.mp4'), poster: testimonyPosterPath('Tanishq Rathi.jpg') },
];

export const testimonyVideosPerSlide = 5;

export function productBrochurePage(pageNumber) {
  return {
    number: pageNumber,
    image: `/assets/Products/brochure-pages/page-${String(pageNumber).padStart(2, '0')}.jpg`,
  };
}

export function productBrochurePages(pageNumbers) {
  return pageNumbers.map(productBrochurePage);
}

// Product categories point to the brochure pages shown by ProductsPage.
export const productSlides = [
  { label: 'SRMB TMT BARS', pages: productBrochurePages([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 20]) },
  { label: 'SRMB REALNAIL', pages: productBrochurePages([12]) },
  { label: 'SRMB REALRING', pages: productBrochurePages([12]) },
  { label: 'SRMB REALWIRE', pages: productBrochurePages([12]) },
  { label: 'SRMB REALEDGE', pages: productBrochurePages([16]) },
  { label: 'SRMB REALFABRICA', pages: productBrochurePages([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20]) },
];

export const realnailSlides = [
  '/assets/srmbRealnails/cropped/N0.jpg',
  '/assets/srmbRealnails/cropped/N1.jpg',
  '/assets/srmbRealnails/cropped/N2.jpg',
  '/assets/srmbRealnails/cropped/N3.jpg',
  '/assets/srmbRealnails/cropped/N4.jpg',
];

export const projectSlides = [
  '/assets/projects/R1.jpg',
  '/assets/projects/R2.jpg',
  '/assets/projects/R3.jpg',
  '/assets/projects/r4.jpg',
  '/assets/projects/r5.jpg',
  '/assets/projects/r6.jpg',
  '/assets/projects/r7.jpg',
  '/assets/projects/r8.jpg',
  '/assets/projects/r9.jpg',
  '/assets/projects/r10.jpg',
  '/assets/projects/r11.jpg',
];

export const certificateSlides = [
  '/assets/Certificate/ic_certificate_bis_1786_frame.png',
  '/assets/Certificate/ic_certificate_bis_2062_frame.png',
  '/assets/Certificate/ic_certificate_cll_green_product_frame.png',
  '/assets/Certificate/ic_certificate_enviromental_frame.png',
  '/assets/Certificate/ic_certificate_jpc_frame.png',
  '/assets/Certificate/ic_certificate_nabl_frame.png',
  '/assets/Certificate/ic_certificate_occupational_health_frame.png',
  '/assets/Certificate/ic_certificate_quality_management_frame.png',
];

export const awardSlides = [
  '/assets/Awards/awd1_frame.png',
  '/assets/Awards/awd2_frame.png',
  '/assets/Awards/awd3_frame.png',
  '/assets/Awards/awd4_frame.png',
  '/assets/Awards/awd5_frame.png',
  '/assets/Awards/awd6_frame.png',
  '/assets/Awards/awd7_frame.png',
  '/assets/Awards/awd8_frame.png',
  '/assets/Awards/awd9_frame.png',
];

export function mediaAssetPath(...segments) {
  return `/assets/Media%20Corner/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

export function mediaPosterPath(fileName) {
  // WebP posters avoid opening large video files merely to render a thumbnail.
  return mediaAssetPath('posters', fileName.replace(/\.png$/i, '.webp'));
}

// Media groups define the menu, metadata, videos, and posters used by MediaCornerPage.
export const mediaCornerSections = [
  {
    id: 'new-tvc',
    title: 'New TVC',
    kicker: 'Brand Campaign',
    description: 'Latest SRMB commercial and campaign film.',
    icon: Clapperboard,
    accent: 'gold',
    videos: [
      {
        title: 'SRMB TMT Launch AV',
        meta: 'Launch Video',
        src: mediaAssetPath('New TVC', 'FINAL LAUNCH AV SRMB TMT.mp4'),
        poster: mediaPosterPath('launch-av.png'),
      },
      {
        title: 'SRMB Kai Po Che 35Sec Hindi',
        meta: 'New TVC',
        src: mediaAssetPath('New TVC', 'SRMB KAI PO CHE 35Sec_HINDI_HD.mp4'),
        poster: mediaPosterPath('kai-po-che.png'),
      },
      {
        title: 'SRMB BTS',
        meta: 'Behind The Scenes',
        src: mediaAssetPath('New TVC', 'MASTER_SRMB_BTS_190325 (1).mp4'),
        poster: mediaPosterPath('bts.png'),
      },
      {
        title: 'SRMB Audition 35Sec Hindi',
        meta: 'New TVC',
        src: mediaAssetPath('New TVC', 'SRMB AUDITION 35Sec HINDI.mp4'),
        poster: mediaPosterPath('audition.png'),
      },
    ],
  },
  {
    id: 'press-released',
    title: 'Press Released',
    kicker: 'News Feature',
    description: 'Press coverage and featured media conversations.',
    icon: Newspaper,
    accent: 'blue',
    videos: [
      {
        title: 'Driving India Steel & Infrastructure Growth',
        meta: 'NEWS9 Live',
        src: mediaAssetPath('Press Released', 'press-release-news9.mp4'),
        poster: mediaPosterPath('press-released.png'),
      },
    ],
  },
  {
    id: 'talk-show',
    title: 'Talk Show',
    kicker: 'Conversation',
    description: 'Long-format SRMB talks and hosted video sessions.',
    icon: Mic2,
    accent: 'green',
    videos: [
      {
        title: 'SRMB Talk Show',
        meta: 'Talk Show',
        src: mediaAssetPath('Talk Show', 'SRMB FINAL_14112022_New CC.mp4'),
        poster: mediaPosterPath('talk-show.png'),
      },
    ],
  },
];

export const sectionDetails = {
  'media-corner': {
    title: 'MEDIA CORNER',
    eyebrow: 'Latest brand moments, launches, and press highlights.',
  },
  'customer-testimony': {
    title: 'CUSTOMER TESTIMONY',
    eyebrow: 'Stories and experiences shared by SRMB customers.',
  },
  sustainability: {
    title: 'SUSTAINABILITY',
    eyebrow: 'Responsible steel practices for stronger, cleaner growth.',
  },
  csr: {
    title: 'SRMB WE CARE',
    eyebrow: 'CSR activities and community initiatives from SRMB.',
  },
  'game-corner': {
    title: 'GAME CORNER',
    eyebrow: 'Interactive activities and engagement experiences.',
  },
  'group-companies': {
    title: 'GROUP OF COMPANIES',
    eyebrow: 'Explore the wider SRMB business family.',
  },
};

export const feedbackRatings = [
  { label: 'Poor', icon: '😡' },
  { label: 'Fair', icon: '😞' },
  { label: 'Okay', icon: '😐' },
  { label: 'Good', icon: '😊' },
  { label: 'Excellent', icon: '😍' },
];

export const feedbackMoodOptions = [
  { label: 'Poor', icon: '\u{1F625}' },
  { label: 'Fair', icon: '\u{1F614}' },
  { label: 'Medium', icon: '\u{1F610}' },
  { label: 'Good', icon: '\u{1F642}' },
  { label: 'Excellent', icon: '\u{1F970}' },
];
