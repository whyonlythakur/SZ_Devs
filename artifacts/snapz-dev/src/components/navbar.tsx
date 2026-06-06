import { Link } from 'wouter';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/codes', label: 'Codes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/dashboard/login', label: 'Staff Login' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1E3A5F]/60 bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Snapz Development"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="hidden font-bold text-white sm:inline tracking-wide">
              Snap-Z <span className="text-[#5BB8F5]">Dev</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-400 transition-all duration-200 hover:text-[#5BB8F5] relative group"
                style={{ textShadow: 'none' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.textShadow = '0 0 8px rgba(91,184,245,0.6)'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.textShadow = 'none'; }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#3A8FD4] transition-all duration-300 group-hover:w-full shadow-[0_0_6px_rgba(58,143,212,0.8)]" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-[#5BB8F5] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="animate-slideInFromLeft border-t border-[#1E3A5F]/40 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-400 hover:text-[#5BB8F5] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
