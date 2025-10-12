"use client";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { ability } from "@/config";
import Footer from "@/components/Footer";

const Tag: React.FC<PropsWithChildren> = (props) => {
  return (
    <span className="inline-block rounded border bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 text-xs leading-none">
      {props.children}
    </span>
  );
};

export default function About() {
  return (
    <>
      <article className={"text-base prose py-24 px-4"}>
        <h2>💻 关于本站 About This Site</h2>
        <p>
          Next.js、TailwindCSS、TypeScript
        </p>

        <h2>😯 关于我 About Me</h2>
        <p>I&apos;m a passionate software developer working with various programming languages and frameworks. I enjoy building applications for different platforms and exploring new technologies. My projects focus on text, images, and calculations, bringing creative ideas to life through code.</p>
        <div className="flex items-start flex-wrap gap-2">
          {
            ability.map((item) => (
              item.children.map((item1) => (
                <div className="grid grid-flow-col gap-2 items-center" key={item1.name}>
                  <i className={item1.icon} />
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
      <Footer />
    </>
  );
}
