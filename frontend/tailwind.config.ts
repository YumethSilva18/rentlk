import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'navy-blue': '#001F3F',
        gold: '#D4AF37',
        'light-grey': '#F7F7F7',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#001F3F',
          hover: '#003366',
          foreground: '#FFFFFF',
          50: '#E6EBF0',
          100: '#CCD7E0',
          200: '#99AFC1',
          300: '#6687A2',
          400: '#335F83',
          500: '#001F3F',
          600: '#001932',
          700: '#001326',
          800: '#000C19',
          900: '#00060D',
        },
        accent: {
          DEFAULT: '#D4AF37',
          foreground: '#1A1A1A',
          50: '#FAF7ED',
          100: '#F5EFDB',
          200: '#EBDFB7',
          300: '#E1CF93',
          400: '#D7BF6F',
          500: '#D4AF37',
          600: '#B89520',
          700: '#8A7018',
          800: '#5C4A10',
          900: '#2E2508',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: '#FF4136',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#2ECC40',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#FF851B',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        button: '0.75rem',
        card: '1rem',
        modal: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        button: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
