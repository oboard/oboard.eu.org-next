import React, { PropsWithChildren } from "react";
import style from "./styles.module.scss";
// import clsx from 'clsx'
import Link from "next/link";
import Image from "next/image";

const Tag: React.FC<PropsWithChildren> = (props) => {
  return (
    <span className="inline-block rounded border bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 text-xs leading-none">
      {props.children}
    </span>
  );
};

export default function Home() {
  return (
    <article className={"text-base prose py-24 px-4"}>
      <div className="flex flex-row items-center gap-4">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img
              src="https://upload.jianshu.io/users/upload_avatars/8761709/3101d25e-1917-47dd-bdee-58bbda3352ac.png?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/300/format/webp"
              alt={"Head"}
              className="avatar avatar-circle"
            />
          </div>
        </div>
        <div>
          <h1 className="w-fit text-3xl font-medium text-primary bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            一块小板子
          </h1>
          <p>
            计算机专业大二在读 (全栈开发)
            Mainly use React/Vue Next/Nuxt.js + TypeScript + UnoCSS + ...
          </p>
        </div>
      </div>


    </article>
  );
}