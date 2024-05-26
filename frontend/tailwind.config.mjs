/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF0FF',
          100: '#E0E4FF',
          200: '#C7CCFE',
          300: '#A6ACFB',
          400: '#8482F7',
          500: '#7367F0',
          600: '#6147E4',
          700: '#5439C9',
          800: '#4431A2',
          900: '#3B2F80',
          950: '#231B4B',
        },
      },
    },
  },
  plugins: [],
};
