'use client';

import dynamic from 'next/dynamic';

const Live2DWrapper = dynamic(() => import('./Live2DWrapperInner'), { ssr: false });

export default Live2DWrapper;