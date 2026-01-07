import unocss from '@unocss/postcss';
import tailwindcss from '@tailwindcss/postcss';
import csstools from '@csstools/postcss-oklab-function';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    unocss({
      content: ['**/*.{html,js,ts,jsx,tsx}'],
    }),
    tailwindcss(),
    csstools({
      preserve: false,
      subFeatures: {
        displayP3: false,
      },
    }),
  ],
};