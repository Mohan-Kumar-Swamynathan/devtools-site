import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import type { Tool, Category } from '@/lib/tools';

interface Props {
  tools: Tool[];
  categories: Category[];
}

export default function MobileMenu({ tools, categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Trap focus when menu is open
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden btn-icon touch-target"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Menu Panel */}
          <div
            ref={menuRef}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] animate-slide-in-right overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-primary)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Menu
              </span>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="btn-icon touch-target"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Categories */}
            <nav className="p-4">
              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    {category.icon} {category.name}
                  </h3>
                  <ul className="space-y-1">
                    {tools
                      .filter((t) => t.category.id === category.id)
                      .slice(0, 5)
                      .map((tool) => (
                        <li key={tool.id}>
                          <a
                            href={`/${tool.slug}`}
                            className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
                            style={{ color: 'var(--text-secondary)' }}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="flex items-center gap-3">
                              <span>{tool.icon}</span>
                              <span>{tool.name}</span>
                            </span>
                            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              
              {/* Footer Links */}
              <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--border-primary)' }}>
                <a
                  href="/about"
                  className="block py-2 px-3 rounded-lg hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </a>
                <a
                  href="/privacy"
                  className="block py-2 px-3 rounded-lg hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsOpen(false)}
                >
                  Privacy Policy
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}


