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
        primary: { DEFAULT: '#5856D6', 1: 'rgba(88, 86, 214, 0.05)', 2: '#7E47EB' },
        secondary: { DEFAULT: '#C74E5B' }
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
      },
      screens: {
        xs: '360px',
      },
      height: {
        '650': '650px',
      },
      maxHeight: {
        '650': '650px',
      },
      maxWidth: {
        '344': '344px',
        '515': '515px'
      }
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'),],
};
