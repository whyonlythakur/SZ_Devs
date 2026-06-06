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
      { id: 'discord-moderation', label: 'Moderation', count: 2 },
      { id: 'discord-security', label: 'Security', count: 1 },
      { id: 'discord-music', label: 'Music', count: 2 },
      { id: 'discord-utility', label: 'Utility', count: 2 },
      { id: 'discord-economy', label: 'Economy', count: 1 },
      { id: 'discord-fun', label: 'Fun', count: 1 },
    ],
  },
  {
    id: 'portfolio-websites',
    label: 'Portfolio Websites',
    icon: '💼',
    subcategories: [
      { id: 'portfolio-nextjs', label: 'Next.js Portfolio', count: 2 },
      { id: 'portfolio-react', label: 'React Portfolio', count: 1 },
      { id: 'portfolio-landing', label: 'Landing Pages', count: 2 },
      { id: 'portfolio-components', label: 'Components', count: 1 },
    ],
  },
  {
    id: 'web-apps',
    label: 'Web Applications',
    icon: '💻',
    subcategories: [
      { id: 'webapp-ecommerce', label: 'E-Commerce', count: 1 },
      { id: 'webapp-dashboard', label: 'Dashboard', count: 2 },
      { id: 'webapp-saas', label: 'SaaS', count: 1 },
      { id: 'webapp-realtime', label: 'Real-time Apps', count: 1 },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities & Tools',
    icon: '🔧',
    subcategories: [
      { id: 'util-cli', label: 'CLI Tools', count: 1 },
      { id: 'util-libraries', label: 'Libraries', count: 2 },
      { id: 'util-automation', label: 'Automation', count: 1 },
      { id: 'util-scripts', label: 'Scripts', count: 1 },
    ],
  },
  {
  id: 'cybersecurity',
  label: 'Cybersecurity',
  icon: '🔐',
  subcategories: [
    { id: 'cyber-pentesting', label: 'Penetration Testing', count: 2 },
    { id: 'cyber-network-security', label: 'Network Security', count: 2 },
    { id: 'cyber-web-security', label: 'Web Security', count: 2 },
    { id: 'cyber-malware-analysis', label: 'Malware Analysis', count: 1 },
    { id: 'cyber-digital-forensics', label: 'Digital Forensics', count: 1 },
    { id: 'cyber-threat-intelligence', label: 'Threat Intelligence', count: 1 },
    { id: 'cyber-incident-response', label: 'Incident Response', count: 1 },
    { id: 'cyber-osint', label: 'OSINT', count: 1 },
  ],
},
  {
    id: 'mobile-apps',
    label: 'Mobile Apps',
    icon: '📱',
    subcategories: [
      { id: 'mobile-react-native', label: 'React Native', count: 1 },
      { id: 'mobile-flutter', label: 'Flutter', count: 1 },
      { id: 'mobile-components', label: 'Components', count: 1 },
    ],
  },
];

export const codes: Code[] = [
  {
    id: 1,
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
    fullDescription: 'Build a complete Discord moderation bot with commands for managing server safety. Includes ban, kick, timeout, and warning systems with persistent storage. Perfect for keeping your Discord server organized and safe.',
    files: [
      {
        name: 'moderation.js',
        language: 'javascript',
        code: `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option => 
      option.setName('user').setDescription('User to ban').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Ban reason')
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    try {
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply({ 
        content: \`\${user.tag} has been banned. Reason: \${reason}\`,
        ephemeral: true 
      });
    } catch (error) {
      await interaction.reply({ 
        content: 'Failed to ban user',
        ephemeral: true 
      });
    }
  }
};`,
      },
    ],
    technologies: ['Discord.js', 'JavaScript', 'Node.js'],
    features: ['Ban Command', 'Kick Command', 'Timeout System', 'Reason Logging', 'User Checks'],
    accessCode: 'DISCORD-MOD-001',
    filelink: 'https://drive.google.com/file/d/example-1/view',
  },
  {
    id: 2,
    title: 'Music Bot Queue System',
    description: 'Feature-rich music bot with queue management, skip, pause, and YouTube integration.',
    category: 'discord-bot',
    subcategory: 'discord-music',
    difficulty: 'Advanced',
    language: 'JavaScript',
    views: 3120,
    likes: 245,
    featured: true,
    bannerImage: '/banners/discord-music.jpg',
    fullDescription: 'Create a powerful Discord music bot with full queue management. Play songs from YouTube, control playback, skip tracks, and manage a queue. Includes voice channel management and error handling.',
    files: [
      {
        name: 'musicBot.js',
        language: 'javascript',
        code: `const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const play = require('play-dl');

const queue = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
      option.setName('song').setDescription('Song to play').setRequired(true)
    ),
  
  async execute(interaction) {
    const song = interaction.options.getString('song');
    const voiceChannel = interaction.member.voice.channel;
    
    if (!voiceChannel) {
      return interaction.reply('Join a voice channel first!');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = await play.stream(song);
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    connection.subscribe(player);
    player.play(stream);
    
    interaction.reply(\`Now playing: \${song}\`);
  }
};`,
      },
    ],
    technologies: ['Discord.js', 'Play-dl', 'Node.js'],
    features: ['Queue System', 'Skip Command', 'Pause/Resume', 'YouTube Support', 'Volume Control'],
    accessCode: 'DISCORD-MUSIC-001',
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
    fullDescription: 'Build a stunning portfolio website with Next.js and Tailwind CSS. Includes dark mode toggle, smooth page transitions, responsive design, and optimized performance. Perfect for showcasing your projects and skills.',
    files: [
      {
        name: 'portfolio.tsx',
        language: 'typescript',
        code: `import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? 'dark' : ''}>
      <nav className="flex justify-between items-center p-6 bg-white dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button onClick={() => setIsDark(!isDark)} className="p-2">
          {isDark ? <Sun /> : <Moon />}
        </button>
      </nav>
      
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Hello, I'm a Developer</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Building amazing web experiences</p>
        </div>
      </section>
    </div>
  );
}`,
      },
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    features: ['Dark Mode', 'Responsive Design', 'Animations', 'SEO Optimized', 'Fast Performance'],
    accessCode: 'PORTFOLIO-NEXTJS-001',
    filelink: 'https://drive.google.com/file/d/example-3/view',
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
    fullDescription: 'Add useful utility commands to your Discord bot. Get user information, server stats, and manage bot settings with this easy-to-integrate code.',
    files: [
      {
        name: 'userinfo.js',
        language: 'javascript',
        code: `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get user information')
    .addUserOption(option =>
      option.setName('user').setDescription('User to get info')
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(\`User Info: \${user.username}\`)
      .addFields(
        { name: 'ID', value: user.id },
        { name: 'Created At', value: user.createdAt.toDateString() }
      );
    
    interaction.reply({ embeds: [embed] });
  }
};`,
      },
    ],
    technologies: ['Discord.js', 'JavaScript'],
    features: ['User Info', 'Server Stats', 'Embeds', 'Options'],
    accessCode: 'DISCORD-UTIL-001',
    filelink: 'https://drive.google.com/file/d/example-4/view',
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
    fullDescription: 'Create a stunning landing page with React and Tailwind CSS. Includes animated hero section, feature grid, testimonials, and call-to-action buttons. Perfect for showcasing your products or services.',
    files: [
      {
        name: 'LandingPage.tsx',
        language: 'typescript',
        code: `export default function LandingPage() {
  return (
    <main>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl mb-8">Create amazing experiences with us</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:scale-105 transition">
            Get Started
          </button>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2">Feature 1</h3>
            <p>Description of feature</p>
          </div>
        </div>
      </section>
    </main>
  );
}`,
      },
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    features: ['Hero Section', 'Feature Grid', 'Animations', 'Responsive', 'Modern Design'],
    accessCode: 'LANDING-PAGE-001',
    filelink: 'https://drive.google.com/file/d/example-5/view',
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
    fullDescription: 'Implement comprehensive security features in your Discord bot. Includes spam detection, rate limiting, automod capabilities, and threat prevention.',
    files: [
      {
        name: 'antispam.js',
        language: 'javascript',
        code: `const userMessages = new Map();
const SPAM_THRESHOLD = 5;
const TIME_WINDOW = 5000; // 5 seconds

function checkSpam(userId) {
  const now = Date.now();
  const userSpam = userMessages.get(userId) || [];
  
  const recentMessages = userSpam.filter(timestamp => now - timestamp < TIME_WINDOW);
  
  if (recentMessages.length >= SPAM_THRESHOLD) {
    return true; // Spam detected
  }
  
  recentMessages.push(now);
  userMessages.set(userId, recentMessages);
  return false;
}

module.exports = { checkSpam };`,
      },
    ],
    technologies: ['Discord.js', 'JavaScript', 'Node.js'],
    features: ['Spam Detection', 'Rate Limiting', 'Auto Moderation', 'User Tracking'],
    accessCode: 'DISCORD-SEC-001',
    filelink: 'https://drive.google.com/file/d/example-6/view',
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
    fullDescription: 'Build a comprehensive admin dashboard with React and Recharts. Display analytics, user data, real-time metrics, and interactive charts for business intelligence.',
    files: [
      {
        name: 'Dashboard.tsx',
        language: 'typescript',
        code: `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Apr', users: 278, revenue: 3908 },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <LineChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}`,
      },
    ],
    technologies: ['React', 'Recharts', 'TypeScript'],
    features: ['Charts', 'Analytics', 'Real-time Data', 'Responsive Tables', 'Exports'],
    accessCode: 'DASHBOARD-001',
    filelink: 'https://drive.google.com/file/d/example-7/view',
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
    fullDescription: 'Create an engaging economy system in your Discord bot. Users can earn currency, shop for items, and compete on leaderboards with persistent data storage.',
    files: [
      {
        name: 'economy.js',
        language: 'javascript',
        code: `const fs = require('fs');

class Economy {
  constructor() {
    this.wallets = new Map();
  }

  addBalance(userId, amount) {
    const current = this.wallets.get(userId) || 0;
    this.wallets.set(userId, current + amount);
  }

  getBalance(userId) {
    return this.wallets.get(userId) || 0;
  }

  getLeaderboard(limit = 10) {
    return Array.from(this.wallets.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }
}

module.exports = Economy;`,
      },
    ],
    technologies: ['Discord.js', 'JavaScript', 'Database'],
    features: ['Currency System', 'Shop', 'Leaderboard', 'Persistence', 'Trading'],
    accessCode: 'DISCORD-ECON-001',
    filelink: 'https://drive.google.com/file/d/example-8/view',
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
    fullDescription: 'Add entertainment to your Discord server with fun commands. Includes jokes, games, memes, and interactive games to keep your community engaged.',
    files: [
      {
        name: 'funCommands.js',
        language: 'javascript',
        code: `const { SlashCommandBuilder } = require('discord.js');

const jokes = [
  'Why did the scarecrow win an award? Because he was outstanding in his field!',
  'What do you call a fake noodle? An impasta!'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),
  
  execute(interaction) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    interaction.reply(joke);
  }
};`,
      },
    ],
    technologies: ['Discord.js', 'JavaScript'],
    features: ['Jokes', 'Games', 'Random Events', 'Emojis', 'Reactions'],
    accessCode: 'DISCORD-FUN-001',
    filelink: 'https://drive.google.com/file/d/example-9/view',
  },
];
