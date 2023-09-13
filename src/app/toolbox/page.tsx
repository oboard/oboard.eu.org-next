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

const toolbox = [
  {
    name: "优学院题库导出助手",
    desc: "导出优学院题库到 Word",
    url: "https://uexport.oboard.eu.org/",
  },
];

export default function Home() {
  return (
    <article className={"text-base prose py-24 px-4"}>
      {toolbox.map((item) => (
        <Link key={item.url} href={item.url}>
          {item.name}
        </Link>
      ))}
    </article>
  );
}
