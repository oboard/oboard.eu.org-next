import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import tabler from '@iconify-json/tabler'
import logos from '@iconify-json/logos'

export default defineConfig({
    presets: [
        presetUno({
            dark: 'media',
        }),
        presetAttributify(),
        presetTypography(),
        presetIcons({
            // cdn: 'https://esm.sh/',
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
            collections: {
                tabler: () => tabler.icons,
                logos: () => logos.icons,
            },
        }),
    ], transformers: [
        transformerAttributifyJsx(),
    ],
})
