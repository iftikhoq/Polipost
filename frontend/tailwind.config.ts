import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          soft: 'var(--color-primary-soft)',
          subtle: 'var(--color-primary-subtle)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          on: 'var(--color-on-accent)',
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
          soft: 'var(--color-gold-soft)',
          subtle: 'var(--color-gold-subtle)',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          subtle: 'var(--color-surface-subtle)',
          sunk: 'var(--color-surface-sunk)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
          info: 'var(--color-info)',
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
        bangla: ['Hind Siliguri', 'sans-serif'],
        serifBangla: ['Tiro Bangla', 'serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        spring: 'var(--ease-spring)',
      },
    },
  },
  plugins: [],
};

export default config;
