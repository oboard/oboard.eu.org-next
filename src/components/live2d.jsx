"use client";
import { loadOml2d } from "oh-my-live2d";
import { useEffect } from "react";
export default function Live2D() {
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			!document.getElementById("oml2d-canvas")
		) {
			const oml2d = loadOml2d({
				dockedPosition: "right",
				sayHello: false,
				menus: {
					disable: true,
					items: [],
				},
				// statusBar: {
				// 	disable: true,
				// },
				models: [
					// {
					// 	path: "https://model.oml2d.com/HK416-1-normal/model.json",
					// 	position: [0, 60],
					// 	scale: 0.08,
					// 	stageStyle: {
					// 		height: 450,
					// 	},
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

						document
							.getElementById("oml2d-canvas")
							.addEventListener("click", () => {
								oml2d.stageSlideOut();
								oml2d.statusBarOpen("显示看板娘");
								oml2d.clearTips();
								oml2d.setStatusBarClickEvent(() => {
									oml2d.stageSlideIn();
									oml2d.statusBarClose();
								});
							});
						break;
					case "fail":
						console.log("加载失败");
						break;
					case "loading":
						console.log("正在加载中");
						break;
				}
			});
		}
	}, []);

	return <></>;
}
