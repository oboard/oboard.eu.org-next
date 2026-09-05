"use client";

import { useEffect } from "react";

export default function useLive2D() {
	useEffect(() => {
		if (document.getElementById("oml2d-canvas")) {
			return;
		}

		// 动态加载 Live2D：直接通过 script 标签注入，避免 Turbopack/Webpack 把 oh-my-live2d 中的 node `fs` fallback 解析进客户端 bundle。
		const script = document.createElement("script");
		script.type = "module";
		script.src = "/live2d-loader.js";
		script.dataset.once = "true";
		document.body.appendChild(script);
	}, []);
}