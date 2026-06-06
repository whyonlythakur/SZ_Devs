import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Contact &amp; Support</h1>
            <p className="text-muted-foreground mb-8">
              Need help or want to request a new bot code? Reach out via Discord.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-border bg-card p-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-[hsl(235,86%,65%)]/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-[hsl(235,86%,65%)]" />
            </div>

            <h2 className="text-xl font-semibold mb-2">Discord Support</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Open a ticket in our Discord support channel for help, requests,
              or collaboration inquiries. Our team is ready to assist you.
            </p>

            <a
              href="https://discord.gg/YNtKFx3S88"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(235,86%,65%)] px-6 py-3 text-sm font-semibold text-white hover:bg-[hsl(235,86%,60%)] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Join Our Discord Server
            </a>

            <p className="text-xs text-muted-foreground mt-4">
              After joining, navigate to the support channel and create a ticket.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
