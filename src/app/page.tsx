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

export const ability = [
  {
    name: "Web",
    description: "Web 前端开发",
    children: [
      {
        icon: "i-logos-react",
        name: "React",
      },
      {
        icon: "i-logos-vue",
        name: "Vue",
      },
      {
        icon: "i-logos-nextjs-icon",
        name: "Next.js",
      },
      {
        icon: "i-logos-nuxt-icon",
        name: "Nuxt.js",
      },
      {
        icon: "i-logos-typescript-icon",
        name: "TypeScript",
      },
      {
        icon: "i-logos-javascript",
        name: "JavaScript",
      },
      {
        icon: "i-logos-tailwindcss-icon",
        name: "Tailwind CSS",
      },
      {
        icon: "i-logos-unocss",
        name: "UnoCSS",
      },
    
    ],
  },
  {
    name: "App",
    description: "App 开发",
    children: [
      {
        icon: "i-logos-flutter",
        name: "Flutter",
      },
      {
        icon: "i-logos-dart",
        name: "Dart",
      },
      {
        icon: "i-logos-android-icon",
        name: "Android",
      },
      {
        icon: "i-logos-kotlin-icon",
        name: "Kotlin",
      },
      {
        icon: "i-logos-java",
        name: "Java",
      },
      {
        icon: "i-logos-ios",
        name: "iOS",
      },
      {
        icon: "i-logos-swift",
        name: "Swift",
      },
    ],
  },
  {
    name: "AI",
    description: "人工智能",
    children: [
      {
        icon: "i-logos-python",
        name: "Python",
      },
      {
        icon: "i-logos-tensorflow",
        name: "TensorFlow",
      },
      {
        icon: "i-logos-pytorch-icon",
        name: "PyTorch",
      },
    ],
  },
  {
    name: "Design",
    description: "设计",
    children: [
      {
        icon: "i-logos-blender",
        name: "Blender",
      },
      {
        icon: "i-logos-adobe-photoshop",
        name: "Photoshop",
      },
      {
        icon: "i-logos-adobe-premiere",
        name: "Premiere Pro",
      },
      {
        icon: "i-logos-adobe-after-effects",
        name: "After Effects",
      },
      {
        icon: "i-logos-adobe-illustrator",
        name: "Illustrator",
      },
    ],
  },

]

export default function Home() {
  return (
    <article className={"text-base prose py-24 px-4"}>
      <div className="flex flex-row items-start gap-4">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <Image
              src="https://upload.jianshu.io/users/upload_avatars/8761709/3101d25e-1917-47dd-bdee-58bbda3352ac.png?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/300/format/webp"
              alt={"Head"}
              className="avatar avatar-circle"
              width={256}
              height={256}
            />
          </div>
        </div>
        <div>
          <h1 className="w-fit text-3xl font-medium text-primary bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            一块小板子
          </h1>
          <p>
            计算机专业大二在读 (全栈开发)
            <br />
            下面是我的能力👇
           {
            ability.map((item) => (
              <div key={item.name} className="flex flex-col gap-2">
                <h2 className="text-xl font-medium">{item.name}</h2>
                <p>{item.description}</p>
                <div className="flex flex-row flex-wrap gap-2">
                  {item.children.map((child) => (
                    <div key={child.name} className="flex flex-row items-center gap-2">
                      <i className={child.icon}></i>
                      <span>{child.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
           }
          </p>
        </div>
      </div>

      <p className="text-center text-gray-500 dark:text-gray-400">
        © 2023 oboard. All Rights Reserved.
      </p>


    </article>
  );
}
