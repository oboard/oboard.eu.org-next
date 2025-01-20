"use client";

import { useEffect } from "react";

export default function useLive2D() {
	useEffect(() => {
		if (document.getElementById("oml2d-canvas")) {
			return;
		}

		// 动态导入 oh-my-live2d
		import("oh-my-live2d").then(({ loadOml2d }) => {
			const oml2d = loadOml2d({
				dockedPosition: "right",
				sayHello: false,
				menus: {
					disable: true,
					items: [],
				},
				// statusBar: {
				//   disable: true,
				// },
				models: [
					// {
					//   path: "https://model.oml2d.com/HK416-1-normal/model.json",
					//   position: [0, 60],
					//   scale: 0.08,
					//   stageStyle: {
					//     height: 450,
					//   },
					// },
					{
						path: "/Resources/三月七/三月七.model3.json",
						scale: 0.08,
						position: [0, 120],
						stageStyle: {
							height: 450,
						},
					},
				],
			});
			// 点击之后消失
			oml2d.onLoad((status) => {
				switch (status) {
					case "success":
						console.log("加载成功");
						const canvas = document.getElementById("oml2d-canvas");
						if (canvas) {
							canvas.addEventListener("click", () => {
								oml2d.stageSlideOut();
								oml2d.statusBarOpen("显示看板娘");
								oml2d.clearTips();
								oml2d.setStatusBarClickEvent(() => {
									oml2d.stageSlideIn();
									oml2d.statusBarClose();
								});
							});
						}
						break;
					case "fail":
						console.log("加载失败");
						break;
					case "loading":
						console.log("正在加载中");
						break;
				}
			});
		});
	}, []); // 空依赖数组确保效果只运行一次
}
