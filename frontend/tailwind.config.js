/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        flux: {
          navy: '#0F172A',
          blue: '#0066FF',
          green: '#00C853',
          darkgray: '#475569',
          lightgray: '#F1F5F9',
        },
        brand: {
          500: '#0066FF',
          600: '#0052cc',
        },
      },
      backgroundImage: {
        'home-bg': "url('/Home-Bg.jpg')",
        'submit-idea-bg': "url('/Submit-Your-Idea-bg.jpeg')",
        'auth-bg': "url('/about-MindNest.png')",
        'app-bg': "url('/background.jpg')",
      },
    },
  },
  plugins: [],
};
