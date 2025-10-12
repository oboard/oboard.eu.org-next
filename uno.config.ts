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
      },
    }),
  ],
});
