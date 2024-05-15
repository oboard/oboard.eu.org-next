"use client";

import {useEffect, useState} from "react";
import "./EmojiJumper.css";

function generateRandomEmoji(emojiList: any[]) {
  //   // 开始的 Emoji 编码
  //   var emojiStart = 0x1f600;
  //   var emojiStart2 = 0x1f900;
  //   // 结束的 Emoji 编码
  //   var emojiEnd = 0x1f64f;
  //   var emojiEnd2 = 0x1f9ff;

  //   var randomCode =
  //     Math.random() > 0.5
  //       ? Math.floor(Math.random() * (emojiEnd - emojiStart + 1)) + emojiStart
  //       : Math.floor(Math.random() * (emojiEnd2 - emojiStart2 + 1)) + emojiStart2;
  //   var emoji = String.fromCodePoint(randomCode);

  //   const emojiList = ["🤣", "🥲", "😊", "😇", "🙂"];
  const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

  return emoji;
}
export default function EmojiJumper({
  className,
  emojiList,
}: {
  className?: string;
  emojiList: any[];
}) {
  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    // const emoji = document.querySelectorAll(".g-emoji")[0] as HTMLElement;
    // const body = document.querySelectorAll("body")[0];
    // const container = document.querySelectorAll(".g-container")[0];

    let curTranslate = 0;
    let lastTranslate = 0;
    let diff = 0;

    function aniFun() {
      const element = document.querySelectorAll(".g-emoji")[0];
      if (typeof element === "undefined") return;
      curTranslate =
        Number(
          window
            ?.getComputedStyle(element as HTMLElement, null)
            ?.getPropertyValue("translate")
            ?.split(" ")[1]
            .slice(0, -2)
        ) - 0;

      // 翻转
      if (diff > 0 && curTranslate - lastTranslate < 0) {
        setEmoji(generateRandomEmoji(emojiList));
      }

      window.requestAnimationFrame(aniFun);
      diff = curTranslate - lastTranslate;
      lastTranslate = curTranslate;
    }

    window.requestAnimationFrame(aniFun);
  }, [emojiList]);

  return (
    <div className={`g-container fall ${className}`}>
      <div className="g-emoji">
        <div className="g-foo-a">{emoji}</div>
        <div className="g-foo">{emoji}</div>
        <div className="g-foo-b">{emoji}</div>
        <div className="g-bar-a">{emoji}</div>
        <div className="g-bar">{emoji}</div>
        <div className="g-bar-b">{emoji}</div>
        <div className="g-baz-a">{emoji}</div>
        <div className="g-baz">{emoji}</div>
        <div className="g-baz-b">{emoji}</div>
      </div>
    </div>
  );
}
