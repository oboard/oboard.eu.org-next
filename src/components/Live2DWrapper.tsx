"use client";

import useLive2D from "@/hooks/Live2D";

export default function Live2DWrapper() {
  useLive2D();
  return null; // 这个组件不需要渲染任何内容
} 