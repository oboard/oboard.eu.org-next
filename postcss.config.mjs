/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@unocss/postcss': {
      content: ['**/*.{html,js,ts,jsx,tsx}'],
    },
    '@tailwindcss/postcss': {},
    '@csstools/postcss-oklab-function': {
      preserve: false,
      subFeatures: {
        displayP3: false,
      },
    },
  },
};

export default config;