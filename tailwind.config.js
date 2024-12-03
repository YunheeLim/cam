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
        primary: {
          DEFAULT: '#5856D6',
          hover: '#6A69E8',
          1: 'rgba(88, 86, 214, 0.05)',
          2: '#7E47EB',
        },
        secondary: { DEFAULT: '#C74E5B', hover: '#D85F6C' },
        white: { DEFAULT: '#FAF9F6', hover: '#EAE9E4' },
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
      },
      screens: {
        xs: '360px',
      },
      height: {
        650: '650px',
        'video-container': 'calc(100vh - 182px)',
      },
      maxHeight: {
        650: '650px',
        'video-container': 'calc(100vh - 182px)',
      },
      maxWidth: {
        344: '344px',
        515: '515px',
      },
      inset: {
        '1/20': '5%',
      },
      padding: {
        '1/20': '5%',
        '1/10': '10%',
        '3/20': '15%',
        '2/10': '20%',
        '16by9': '23%', // 16:9 aspect ratio (9 / 16 * 100)
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
