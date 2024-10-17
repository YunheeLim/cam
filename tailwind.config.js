/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // `src` directory를 사용한다면
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#5856D6', 1: 'rgba(88, 86, 214, 0.05)' },
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
