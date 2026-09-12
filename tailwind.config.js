/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        'farm-sky': '#9fd6f0',
        'farm-sky-light': '#c6ebfa',
        'farm-sky-pale': '#e7f7fd',
        'farm-orange': '#e65c38',
        'farm-orange-hover': '#cf4927',
        'farm-gold': '#f5c842',
        'farm-gold-deep': '#e2b325',
        'farm-green': '#4f9b46',
        'farm-green-dark': '#31732a',
        'farm-green-mint': '#7bc975',
        'farm-earth': '#3c2415',
        'farm-earth-dark': '#29170c',
        'farm-earth-loam': '#4a2e1b',
        'farm-night': '#15243b',
        'farm-night-dark': '#0d1829',
        'farm-cream': '#fbf8f1',
      },
    },
  },
  plugins: [],
}
