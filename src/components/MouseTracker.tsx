"use client";

import { useState } from "react";

let hoverList: any[] = [];

export default function MouseTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverProps, setHoverProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    borderRadius: "1rem",
  });

  if(typeof window !== 'undefined') {
    window.addEventListener("mousemove", (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    });
  }

  if (typeof document !== "undefined") {
  const elements = document.querySelectorAll(".hoverable");

  elements?.forEach((element) => {
    const rect = element.getBoundingClientRect();
    element.addEventListener("mouseover", () => {
      element.classList.add("hovered");
      // 写入宽高
      setHoverProps({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        // 写入圆角
        borderRadius: window.getComputedStyle(element).borderRadius,
      });

      // 记录hover的元素
      hoverList.push(element);
    });

    element.addEventListener("mouseout", () => {
      element.classList.remove("hovered");

      // 移除hover的元素
      hoverList = hoverList.filter((item) => item !== element);

      if (hoverList.length === 0) {
        setHoverProps({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          borderRadius: "4rem",
        });
      }
    });
  });
  }
  return (
    <div
      className="fixed z-100 rounded-full pointer-events-none bg-blue bg-opacity-10 filter-blur transform -translate-x-1/2 -translate-y-1/2"
      style={{
        // top:
        //   hoverProps.y != 0 ? hoverProps.y + hoverProps.height / 2 : mousePos.y,
        // left:
        //   hoverProps.x != 0 ? hoverProps.x + hoverProps.width / 2 : mousePos.x,
        top: (hoverProps.y != 0)? (hoverProps.y + hoverProps.height/2 + mousePos.y) /2 : mousePos.y,
        left: (hoverProps.x != 0)? (hoverProps.x + hoverProps.width/2 + mousePos.x) /2 : mousePos.x,
        width: hoverProps.width,
        height: hoverProps.height,
        borderRadius: hoverProps.borderRadius,
        transition: "all 0.1s ease",
      }}
    ></div>
  );
}
