import { Navbar } from '@/components/navbar';
import { Github, Twitter, Youtube } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            About Snap-Z Development
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn more about our mission to create quality web development content
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Mission */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Snap-Z Development, we believe in the power of accessible, high-quality coding tutorials.
              Our mission is to help developers of all skill levels master modern web technologies through
              clear, practical examples and best practices. We focus on React, Next.js, TypeScript, and
              the entire modern JavaScript ecosystem.
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground">What We Offer</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Code Snippets',
                  description: 'Handpicked, production-ready code examples you can use in your projects.',
                },
                {
                  title: 'Video Tutorials',
                  description: 'In-depth video explanations of concepts and implementations on YouTube.',
                },
                {
                  title: 'Best Practices',
                  description: 'Learn industry standards and patterns used by professional developers.',
                },
                {
                  title: 'Community Support',
                  description: 'Join our Discord community and connect with other developers.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="animate-fadeInUp rounded-lg border border-border bg-card p-6 transition-smooth hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Meet the Team</h2>
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-6 flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-foreground">
                  Z
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Snap-Z</h3>
                  <p className="text-primary">Creator & Full-Stack Developer</p>
                </div>
              </div>

              <p className="mb-4 text-muted-foreground leading-relaxed">
                With over 3 years of experience in web development, Snap-Z is passionate about creating
                educational content that empowers developers. Specializing in React, Next.js, and modern
                JavaScript tooling, Snap-Z has helped thousands of developers level up their skills.
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </a>
              </div>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Our Values</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Quality',
                  description: 'We prioritize clear, well-explained code that follows best practices.',
                },
                {
                  title: 'Accessibility',
                  description: 'Making web development knowledge available to developers at all levels.',
                },
                {
                  title: 'Community',
                  description: 'Building a supportive community where developers can learn together.',
                },
                {
                  title: 'Innovation',
                  description: 'Staying current with the latest technologies and frameworks.',
                },
              ].map((value, index) => (
                <div key={index} className="animate-fadeInUp flex gap-4" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold transition-smooth hover:scale-110">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
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
