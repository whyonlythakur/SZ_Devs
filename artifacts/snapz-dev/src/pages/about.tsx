import { Navbar } from '@/components/navbar';
import { Github, Twitter, Youtube } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="border-b border-[#1E3A5F]/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            About <span className="text-[#5BB8F5]">Snap-Z Development</span>
          </h1>
          <p className="text-gray-400">Learn more about our mission to create quality web development content</p>
        </div>
      </section>

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              At Snap-Z Development, we believe in the power of accessible, high-quality coding tutorials.
              Our mission is to help developers of all skill levels master modern web technologies through
              clear, practical examples and best practices. We focus on React, Next.js, TypeScript, and
              the entire modern JavaScript ecosystem.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">What We Offer</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: 'Code Snippets', description: 'Handpicked, production-ready code examples you can use in your projects.' },
                { title: 'Video Tutorials', description: 'In-depth video explanations of concepts and implementations on YouTube.' },
                { title: 'Best Practices', description: 'Learn industry standards and patterns used by professional developers.' },
                { title: 'Community Support', description: 'Join our Discord community and connect with other developers.' },
              ].map((item, i) => (
                <div key={i}
                  className="animate-fadeInUp rounded-lg border border-[#1E3A5F]/50 bg-[#111] p-6 transition-all duration-300 hover:border-[#3A8FD4]/50 hover:shadow-[0_0_20px_rgba(58,143,212,0.12)] hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.1}s`, borderLeft: '3px solid #3A8FD4' }}>
                  <h3 className="mb-2 font-bold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">Meet the Team</h2>
            <div className="rounded-lg border border-[#1E3A5F]/50 bg-[#111] p-8"
              style={{ boxShadow: '0 0 20px rgba(58,143,212,0.08)' }}>
              <div className="mb-6 flex items-center gap-6">
                <img src="/logo.png" alt="Snapz" className="h-20 w-20 rounded-full object-contain border border-[#1E3A5F]"
                  style={{ boxShadow: '0 0 16px rgba(58,143,212,0.3)' }} />
                <div>
                  <h3 className="text-xl font-bold text-white">Snap-Z</h3>
                  <p className="text-[#5BB8F5]">Creator &amp; Full-Stack Developer</p>
                </div>
              </div>
              <p className="mb-4 text-gray-400 leading-relaxed">
                With over 3 years of experience in web development, Snap-Z is passionate about creating
                educational content that empowers developers. Specializing in React, Next.js, and modern
                JavaScript tooling, Snap-Z has helped thousands of developers level up their skills.
              </p>
              <div className="mt-6 flex gap-4">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Github, label: 'GitHub' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a key={label} href="#"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1E3A5F] bg-[#1E3A5F]/20 px-4 py-2 text-[#5BB8F5] transition-all hover:border-[#3A8FD4]/60 hover:shadow-[0_0_10px_rgba(58,143,212,0.25)]">
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">Our Values</h2>
            <div className="space-y-4">
              {[
                { title: 'Quality', description: 'We prioritize clear, well-explained code that follows best practices.' },
                { title: 'Accessibility', description: 'Making web development knowledge available to developers at all levels.' },
                { title: 'Community', description: 'Building a supportive community where developers can learn together.' },
                { title: 'Innovation', description: 'Staying current with the latest technologies and frameworks.' },
              ].map((v, i) => (
                <div key={i} className="animate-fadeInUp flex gap-4" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#3A8FD4]/50 bg-[#1E3A5F]/40 font-bold text-[#5BB8F5] text-sm"
                    style={{ boxShadow: '0 0 8px rgba(58,143,212,0.3)' }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{v.title}</h3>
                    <p className="text-gray-400">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
