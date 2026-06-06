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
];

// Default static stats for initial render (will be replaced with live data on client)
export const stats = [
  {
    value: '1',
    label: 'Code Snippets',
    description: 'Ready to use'
  },
  {
    value: '17,582',
    label: 'Total Views',
    description: 'On our channel'
  },
  {
    value: '0',
    label: 'Community',
    description: 'Subscribers'
  },
  {
    value: '0',
    label: 'Tutorials',
    description: 'On YouTube'
  },
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
    fullDescription: 'Create a powerful Discord music bot with full queue management. Play songs from YouTube, control playback, skip tracks, and manage a queue. Includes voice channel management and error handling.',
    files: [
      {
        name: 'src/index.js',
        language: 'javascript',
        code: `// Tsukina V1 - Main Entry Point
const { Client, GatewayIntentBits } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { ready } = require('./handlers/ready');
const { messageCreate } = require('./handlers/messageCreate');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', ready);
client.on('messageCreate', messageCreate);

// Load commands
loadCommands(client);

client.login(process.env.DISCORD_TOKEN);`,
      },
      {
        name: 'src/bot.js',
        language: 'javascript',
        code: `// Bot bootstrap and client setup
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.queue = new Map();

module.exports = client;`,
      },
      {
        name: 'src/commands/play.js',
        language: 'javascript',
        code: `const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
  name: 'play',
  description: 'Play a song from YouTube',
  async execute(message, args) {
    const query = args.join(' ');
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel) {
      return message.reply('Please join a voice channel first!');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const stream = await play.stream(query);
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    connection.subscribe(player);
    player.play(stream.stream);
    
    message.reply(\`Now playing: \${query}\`);
  }
};`,
      },
      {
        name: 'src/commands/skip.js',
        language: 'javascript',
        code: `module.exports = {
  name: 'skip',
  description: 'Skip the current song',
  async execute(message, args, client) {
    const queue = client.queue.get(message.guild.id);
    
    if (!queue || !queue.songs.length) {
      return message.reply('Nothing is playing!');
    }

    queue.songs.shift();
    
    if (queue.songs.length > 0) {
      // Play next song
      queue.playing = true;
      // ... play next song logic
      message.reply('Skipped to next song!');
    } else {
      queue.playing = false;
      message.reply('Queue is empty!');
    }
  }
};`,
      },
      {
        name: 'src/commands/pause.js',
        language: 'javascript',
        code: `module.exports = {
  name: 'pause',
  description: 'Pause the current song',
  async execute(message, args, client) {
    const queue = client.queue.get(message.guild.id);
    
    if (!queue || !queue.playing) {
      return message.reply('Nothing is playing!');
    }

    queue.player.pause();
    queue.playing = false;
    message.reply('Paused the current song!');
  }
};`,
      },
      {
        name: 'src/commands/queue.js',
        language: 'javascript',
        code: `const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Show the current queue',
  async execute(message, args, client) {
    const queue = client.queue.get(message.guild.id);
    
    if (!queue || !queue.songs.length) {
      return message.reply('Queue is empty!');
    }

    const embed = new EmbedBuilder()
      .setTitle('🎵 Music Queue')
      .setColor('#0099ff');

    queue.songs.forEach((song, index) => {
      embed.addFields({ name: \`\${index + 1}. \${song.title}\`, value: ' ' });
    });

    message.reply({ embeds: [embed] });
  }
};`,
      },
      {
        name: 'src/commands/volume.js',
        language: 'javascript',
        code: `module.exports = {
  name: 'volume',
  description: 'Set the volume (0-100)',
  async execute(message, args, client) {
    const volume = parseInt(args[0]);
    
    if (isNaN(volume) || volume < 0 || volume > 100) {
      return message.reply('Please provide a volume between 0 and 100!');
    }

    const queue = client.queue.get(message.guild.id);
    
    if (!queue || !queue.player) {
      return message.reply('Nothing is playing!');
    }

    queue.player.state.resource.volume.setVolume(volume / 100);
    message.reply(\`Volume set to \${volume}%\`);
  }
};`,
      },
      {
        name: 'src/music/manager.js',
        language: 'javascript',
        code: `// Music core - Queue Manager
class MusicManager {
  constructor() {
    this.queues = new Map();
  }

  getQueue(guildId) {
    if (!this.queues.has(guildId)) {
      this.queues.set(guildId, {
        songs: [],
        playing: false,
        current: null,
        volume: 1,
      });
    }
    return this.queues.get(guildId);
  }

  addSong(guildId, song) {
    const queue = this.getQueue(guildId);
    queue.songs.push(song);
    return queue;
  }

  nextSong(guildId) {
    const queue = this.getQueue(guildId);
    queue.songs.shift();
    return queue.songs[0] || null;
  }
}

module.exports = new MusicManager();`,
      },
      {
        name: 'src/config/index.js',
        language: 'javascript',
        code: `// Bot configuration
module.exports = {
  token: process.env.DISCORD_TOKEN || 'your-token-here',
  prefix: '!',
  embedColor: '#0099ff',
  
  lavalink: {
    host: 'localhost',
    port: 2333,
    password: 'youshallnotpass',
  },
  
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
};`,
      },
      {
        name: 'package.json',
        language: 'json',
        code: `{
  "name": "tsukina-music-bot",
  "version": "1.0.0",
  "description": "Advanced Discord Music Bot",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node src/index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.0",
    "@discordjs/voice": "^0.18.0",
    "play-dl": "^1.9.7",
    "dotenv": "^16.3.1",
    "lavacord": "^0.2.0",
    "spotify-web-api-node": "^5.0.2"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}`,
      },
    ],
    technologies: ['Discord.js', 'Play-dl', 'Node.js', 'Lavalink'],
    features: ['Queue System', 'Skip Command', 'Pause/Resume', 'YouTube Support', 'Volume Control', 'Spotify Integration', 'Voice Channels'],
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
    filelink: 'https://drive.google.com/drive/folders/1aLdimd1QFSOhbXHlDP7F7iJuBan9eJnU',
  },
];
