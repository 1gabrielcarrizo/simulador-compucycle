/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        scada: {
          blue: '#1e40af',
          green: '#16a34a',
          red: '#dc2626',
          orange: '#ea580c',
          yellow: '#ca8a04',
          panel: '#f8fafc',
          border: '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
};
