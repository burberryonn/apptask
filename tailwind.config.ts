import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        accent: 'hsl(var(--accent))',
        primary: 'hsl(var(--primary))',
        muted: 'hsl(var(--muted))',
        ring: 'hsl(var(--ring))'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(20, 24, 35, 0.08)'
      }
    }
  }
};

export default config;
