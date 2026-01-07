import { defineConfig, presetIcons } from 'unocss';
import tabler from '@iconify-json/tabler';
import logos from '@iconify-json/logos';

export default defineConfig({
  presets: [
    presetIcons({
      // cdn: 'https://esm.sh/',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        tabler: () => tabler.icons,
        logos: () => logos.icons,
        custom: {
          moonbit: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z",
        }
      },
    }),
  ],
});
