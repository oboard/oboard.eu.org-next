import React, { PropsWithChildren } from "react";
import style from "./styles.module.scss";
// import clsx from 'clsx'
import Link from "next/link";
import { ability } from "../page";

const Tag: React.FC<PropsWithChildren> = (props) => {
  return (
    <span className="inline-block rounded border bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 text-xs leading-none">
      {props.children}
    </span>
  );
};

export default function About() {
  return (
    <article className={"text-base prose py-24 px-4"}>
      <h2>🎨 关于本站</h2>
      <p>
        存一些文章或者日记 + 小工具， 本站技术栈为 Next.js、UnoCSS、TypeScript
      </p>

      <h2>😯 关于我</h2>
      <p>一个随便写写代码的人，我的技能 👇🏻</p>
      <div className="flex items-start flex-wrap gap-2">
        {
          ability.map((item) => (
            item.children.map((item1) => (
              <div className="grid grid-flow-col gap-2 items-center" key={item1.name}>
                <i className={item1.icon}></i>
                <span>{item1.name}</span>
              </div>
            ))
          ))
        }
        ...
      </div>

      <h2>📮 找到我</h2>
      <ul>
        <li>
          Email -{" "}
          <Link href="mailto:oboard@outlook.com">oboard@outlook.com</Link>
        </li>
        <li>
          Github -{" "}
          <Link href="https://github.com/oboard">
            https://github.com/oboard
          </Link>
        </li>
      </ul>
    </article>
  );
}
