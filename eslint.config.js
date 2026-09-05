import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [...nextVitals, { ignores: ['.next/**', 'out/**', 'dist/**', 'build/**'] }];

export default config;