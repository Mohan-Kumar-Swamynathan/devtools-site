/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      colors: {
        // Material Design 3 Semantic Colors
        primary: {
          DEFAULT: 'var(--md-sys-color-primary)',
          container: 'var(--md-sys-color-primary-container)',
          on: 'var(--md-sys-color-on-primary)',
          'on-container': 'var(--md-sys-color-on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--md-sys-color-secondary)',
          container: 'var(--md-sys-color-secondary-container)',
          on: 'var(--md-sys-color-on-secondary)',
          'on-container': 'var(--md-sys-color-on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--md-sys-color-tertiary)',
          container: 'var(--md-sys-color-tertiary-container)',
          on: 'var(--md-sys-color-on-tertiary)',
          'on-container': 'var(--md-sys-color-on-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--md-sys-color-error)',
          container: 'var(--md-sys-color-error-container)',
          on: 'var(--md-sys-color-on-error)',
          'on-container': 'var(--md-sys-color-on-error-container)',
        },
        background: {
          DEFAULT: 'var(--md-sys-color-background)',
          on: 'var(--md-sys-color-on-background)',
        },
        surface: {
          DEFAULT: 'var(--md-sys-color-surface)',
          on: 'var(--md-sys-color-on-surface)',
          variant: 'var(--md-sys-color-surface-variant)',
          'on-variant': 'var(--md-sys-color-on-surface-variant)',
          container: 'var(--md-sys-color-surface-container)',
        },
        outline: {
          DEFAULT: 'var(--md-sys-color-outline)',
          variant: 'var(--md-sys-color-outline-variant)',
        },
        // Valid legacy colors for compatibility (mapped to M3)
        brand: {
          50: 'var(--md-sys-color-surface)',
          100: 'var(--md-sys-color-surface-container)',
          200: 'var(--md-sys-color-primary-container)',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: 'var(--md-sys-color-primary)',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: 'var(--md-sys-color-primary)'
        }
      },
      screens: {
        'xs': '475px'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'mouth': 'mouth 0.3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        mouth: {
          '0%, 100%': { ry: '4' },
          '50%': { ry: '8' }
        }
      }
    }
  },
  plugins: []
};


