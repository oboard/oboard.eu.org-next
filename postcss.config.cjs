module.exports = {
  plugins: {
    '@unocss/postcss': {
      // Optional
      content: ['**/*.{html,js,ts,jsx,tsx}'],
    },
    '@tailwindcss/postcss': {},
    '@csstools/postcss-oklab-function': {
      // Remove original oklch()/oklab() to only emit compatible colors
      preserve: false,
      subFeatures: {
        // Disable display-p3; emit only rgb/rgba fallbacks
        displayP3: false,
      },
    },
  },
};
