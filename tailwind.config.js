/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A9D8F',
        background: '#F5F7FA',
        card: '#FFFFFF',
        foreground: '#1A1D24',
        muted: '#E2E8F0',
        success: '#22C55E',
        warning: '#EAB308',
        destructive: '#EF4444',
        border: '#E2E8F0',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
        'chip': '9999px',
      },
      fontFamily: {
        geist: ['Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
