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
    <nav className="sticky top-0 z-50 border-b border-orange-900/30" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a0800 40%, #2d0e00 70%, #ff6e00 150%)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="font-bold text-primary-foreground">Z</span>
            </div>
            <span className="hidden font-bold text-foreground sm:inline">
              Snap-Z Dev
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="animate-slideInFromLeft border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {links.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
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
