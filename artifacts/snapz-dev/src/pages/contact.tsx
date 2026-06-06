import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="border-b border-[#1E3A5F]/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-white mb-2">
              Contact &amp; <span className="text-[#5BB8F5]">Support</span>
            </h1>
            <p className="text-gray-400">Need help or want to request a new bot code? Reach out via Discord.</p>
          </motion.div>
        </div>
      </section>

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-[#1E3A5F] bg-[#111] p-8 text-center"
            style={{ boxShadow: '0 0 30px rgba(58,143,212,0.1)' }}
          >
            <div className="h-16 w-16 rounded-full border border-[#1E3A5F] bg-[#1E3A5F]/30 flex items-center justify-center mx-auto mb-4"
              style={{ boxShadow: '0 0 16px rgba(58,143,212,0.3)' }}>
              <MessageCircle className="h-8 w-8 text-[#5BB8F5]" />
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">Discord Support</h2>
            <p className="text-sm text-gray-400 mb-6">
              Open a ticket in our Discord support channel for help, requests, or collaboration inquiries.
            </p>

            <a
              href="https://discord.gg/YNtKFx3S88"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#5865F2]/60 bg-[#5865F2]/10 px-6 py-3 text-sm font-semibold text-[#7289DA] transition-all hover:bg-[#5865F2]/20 hover:shadow-[0_0_16px_rgba(88,101,242,0.35)]"
            >
              <ExternalLink className="h-4 w-4" />
              Join Our Discord Server
            </a>

            <p className="text-xs text-gray-600 mt-4">
              After joining, navigate to the support channel and create a ticket.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
