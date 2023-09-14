import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
} from 'unocss'


import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

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
                tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default as any),
                logos: () => import('@iconify-json/logos/icons.json').then(i => i.default),
            },
        }),
    ], transformers: [
        transformerAttributifyJsx(),
    ],
})
