export interface CodeFile {
  name: string;
  language: string;
  code: string;
}

export interface Code {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: string;
  language: string;
  views: number;
  likes: number;
  featured: boolean;
  bannerImage?: string;
  fullDescription?: string;
  files?: CodeFile[];
  technologies?: string[];
  features?: string[];
  accessCode?: string;
  filelink?: string;
}

export interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  subcategories: {
    id: string;
    label: string;
    count: number;
  }[];
}

export const categories: CategoryGroup[] = [
  {
    id: 'discord-bot',
    label: 'Discord Bot',
    icon: '🤖',
    subcategories: [
      { id: 'discord-moderation', label: 'Moderation', count: 0 },
      { id: 'discord-security', label: 'Security', count: 0 },
      { id: 'discord-music', label: 'Music', count: 1 },
      { id: 'discord-utility', label: 'Utility', count: 0 },
      { id: 'discord-economy', label: 'Economy', count: 0 },
      { id: 'discord-fun', label: 'Fun', count: 0 },
    ],
  },
  {
    id: 'portfolio-websites',
    label: 'Portfolio Websites',
    icon: '💼',
    subcategories: [
      { id: 'portfolio-nextjs', label: 'Next.js Portfolio', count: 0 },
      { id: 'portfolio-react', label: 'React Portfolio', count: 0 },
      { id: 'portfolio-landing', label: 'Landing Pages', count: 0 },
      { id: 'portfolio-components', label: 'Components', count: 0 },
    ],
  },
  {
    id: 'web-apps',
    label: 'Web Applications',
    icon: '💻',
    subcategories: [
      { id: 'webapp-ecommerce', label: 'E-Commerce', count: 0 },
      { id: 'webapp-dashboard', label: 'Dashboard', count: 0 },
      { id: 'webapp-saas', label: 'SaaS', count: 0 },
      { id: 'webapp-realtime', label: 'Real-time Apps', count: 0 },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities & Tools',
    icon: '🔧',
    subcategories: [
      { id: 'util-cli', label: 'CLI Tools', count: 0 },
      { id: 'util-libraries', label: 'Libraries', count: 0 },
      { id: 'util-automation', label: 'Automation', count: 0 },
      { id: 'util-scripts', label: 'Scripts', count: 0 },
    ],
  },
  {
    id: 'mobile-apps',
    label: 'Mobile Apps',
    icon: '📱',
    subcategories: [
      { id: 'mobile-react-native', label: 'React Native', count: 0 },
      { id: 'mobile-flutter', label: 'Flutter', count: 0 },
      { id: 'mobile-components', label: 'Components', count: 0 },
    ],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    icon: '🔒',
    subcategories: [
      { id: 'cyber-pentest', label: 'Penetration Testing', count: 0 },
      { id: 'cyber-web-security', label: 'Web Security', count: 0 },
      { id: 'cyber-network', label: 'Network Security', count: 0 },
      { id: 'cyber-malware', label: 'Malware Analysis', count: 0 },
      { id: 'cyber-ctf', label: 'CTF Challenges', count: 0 },
      { id: 'cyber-crypto', label: 'Cryptography', count: 0 },
      { id: 'cyber-forensics', label: 'Digital Forensics', count: 0 },
      { id: 'cyber-osint', label: 'OSINT', count: 0 },
    ],
  },
];

export const stats = [
  { value: '1', label: 'Code Snippets', description: 'Ready to use' },
  { value: '17,582', label: 'Total Views', description: 'On our channel' },
  { value: '0', label: 'Community', description: 'Subscribers' },
  { value: '0', label: 'Tutorials', description: 'On YouTube' },
];

export const codes: Code[] = [
  {
    id: 2,
    title: 'Discord Moderation Bot Commands',
    description: 'A comprehensive moderation bot with ban, kick, mute, and warn commands for Discord servers.',
    category: 'discord-bot',
    subcategory: 'discord-moderation',
    difficulty: 'Intermediate',
    language: 'JavaScript',
    views: 2450,
    likes: 187,
    featured: true,
    bannerImage: '/banners/discord-moderation.jpg',
    fullDescription: 'Build a complete Discord moderation bot with commands for managing server safety.',
    files: [],
    technologies: ['Discord.js', 'JavaScript', 'Node.js'],
    features: ['Ban Command', 'Kick Command', 'Timeout System', 'Reason Logging', 'User Checks'],
    accessCode: 'DISCORD-MOD-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 1,
    title: 'Tsukina - Discord Music Bot',
    description: 'Feature-rich music bot with queue management, skip, pause, and YouTube integration.',
    category: 'discord-bot',
    subcategory: 'discord-music',
    difficulty: 'Advanced',
    language: 'JavaScript',
    views: 3120,
    likes: 245,
    featured: true,
    bannerImage: '/banners/Tsukina.webp',
    fullDescription: 'Create a powerful Discord music bot with full queue management.',
    files: [],
    technologies: ['Discord.js', 'Play-dl', 'Node.js', 'Lavalink'],
    features: ['Queue System', 'Skip Command', 'Pause/Resume', 'YouTube Support', 'Volume Control'],
    accessCode: 'Music#001',
    filelink: 'https://mega.nz/file/98kAWYBR#hez_moN2BwJrh1JLXiN9NROrvBNlgUDFYLrJmirPsfU',
  },
  {
    id: 3,
    title: 'Next.js Portfolio with Dark Mode',
    description: 'Modern portfolio website built with Next.js featuring dark mode toggle and smooth animations.',
    category: 'portfolio-websites',
    subcategory: 'portfolio-nextjs',
    difficulty: 'Intermediate',
    language: 'TypeScript',
    views: 1890,
    likes: 156,
    featured: true,
    bannerImage: '/banners/portfolio-nextjs.jpg',
    fullDescription: 'Build a stunning portfolio website with Next.js and Tailwind CSS.',
    files: [],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    features: ['Dark Mode', 'Responsive Design', 'Animations', 'SEO Optimized', 'Fast Performance'],
    accessCode: 'PORTFOLIO-NEXTJS-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 4,
    title: 'Discord Utility Bot Helper',
    description: 'Utility commands for Discord bots including settings management and user info.',
    category: 'discord-bot',
    subcategory: 'discord-utility',
    difficulty: 'Beginner',
    language: 'JavaScript',
    views: 1560,
    likes: 98,
    featured: false,
    bannerImage: '/banners/discord-utility.jpg',
    fullDescription: 'Add useful utility commands to your Discord bot.',
    files: [],
    technologies: ['Discord.js', 'JavaScript'],
    features: ['User Info', 'Server Stats', 'Embeds', 'Options'],
    accessCode: 'DISCORD-UTIL-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 5,
    title: 'React Landing Page Component',
    description: 'Beautiful landing page component with hero section, features, and CTA buttons.',
    category: 'portfolio-websites',
    subcategory: 'portfolio-landing',
    difficulty: 'Beginner',
    language: 'TypeScript',
    views: 2340,
    likes: 189,
    featured: false,
    bannerImage: '/banners/landing-page.jpg',
    fullDescription: 'Create a stunning landing page with React and Tailwind CSS.',
    files: [],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    features: ['Hero Section', 'Feature Grid', 'Animations', 'Responsive', 'Modern Design'],
    accessCode: 'LANDING-PAGE-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 6,
    title: 'Discord Security & Antispam',
    description: 'Anti-spam and security system for Discord bots with rate limiting.',
    category: 'discord-bot',
    subcategory: 'discord-security',
    difficulty: 'Advanced',
    language: 'JavaScript',
    views: 1245,
    likes: 78,
    featured: false,
    bannerImage: '/banners/discord-security.jpg',
    fullDescription: 'Implement comprehensive security features in your Discord bot.',
    files: [],
    technologies: ['Discord.js', 'JavaScript', 'Node.js'],
    features: ['Spam Detection', 'Rate Limiting', 'Auto Moderation', 'User Tracking'],
    accessCode: 'DISCORD-SEC-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 7,
    title: 'Admin Dashboard with Charts',
    description: 'React dashboard with interactive charts, tables, and real-time analytics.',
    category: 'web-apps',
    subcategory: 'webapp-dashboard',
    difficulty: 'Intermediate',
    language: 'TypeScript',
    views: 1987,
    likes: 156,
    featured: true,
    bannerImage: '/banners/dashboard.jpg',
    fullDescription: 'Build a comprehensive admin dashboard with React and Recharts.',
    files: [],
    technologies: ['React', 'Recharts', 'TypeScript'],
    features: ['Charts', 'Analytics', 'Real-time Data', 'Responsive Tables', 'Exports'],
    accessCode: 'DASHBOARD-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 8,
    title: 'Discord Economy System',
    description: 'Complete economy system for Discord bots with currency, shops, and leaderboards.',
    category: 'discord-bot',
    subcategory: 'discord-economy',
    difficulty: 'Advanced',
    language: 'JavaScript',
    views: 2156,
    likes: 145,
    featured: false,
    bannerImage: '/banners/discord-economy.jpg',
    fullDescription: 'Create an engaging economy system in your Discord bot.',
    files: [],
    technologies: ['Discord.js', 'JavaScript', 'Database'],
    features: ['Currency System', 'Shop', 'Leaderboard', 'Persistence', 'Trading'],
    accessCode: 'DISCORD-ECON-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
  {
    id: 9,
    title: 'Fun Discord Bot Commands',
    description: 'Collection of fun and entertaining commands for Discord bots.',
    category: 'discord-bot',
    subcategory: 'discord-fun',
    difficulty: 'Beginner',
    language: 'JavaScript',
    views: 1834,
    likes: 167,
    featured: false,
    bannerImage: '/banners/discord-fun.jpg',
    fullDescription: 'Add entertainment to your Discord server with fun commands.',
    files: [],
    technologies: ['Discord.js', 'JavaScript'],
    features: ['Jokes', 'Games', 'Random Events', 'Emojis', 'Reactions'],
    accessCode: 'DISCORD-FUN-001',
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
];
