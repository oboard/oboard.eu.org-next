import type React from "react";
import type { PropsWithChildren } from "react";
// import clsx from 'clsx'
import Link from "next/link";
import InterestingAvatar from "@/components/InterestingAvatar";
import FeedItemCard, {
  type FeedBodyInfo,
  FeedItemInfo,
} from "@/components/feed/FeedItemCard";

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
];

const links = [
  {
    name: "资源导航",
    children: [
      {
        name: "Android x86 下载",
        url: "https://www.android-x86.org/download",
      },
      {
        name: "Windows 下载",
        url: "https://msdn.itellyou.cn/",
      },
      {
        name: "Manjaro 下载",
        url: "https://manjaro.org/download/",
      },
    ],
  },
  {
    name: "友谊链接",
    children: [
      {
        name: "XRZ",
        url: "https://www.xrzyun.top",
      },
      {
        name: "Opacity",
        url: "https://opacity.ink",
      },
      {
        name: "XXS",
        url: "https://xxs2.cn",
      },
      {
        name: "Songyuli",
        url: "https://lsyxiaopang.github.io",
      },
    ],
  },
];

export default async function Home() {
  const blogJson = (await (
    await fetch("https://oboard.xlog.app/feed?format=json")
  ).json()) as FeedBodyInfo;
  return (
    <article className={"py-24 px-4 md:max-w-5xl"}>
      <div className="flex flex-col">
        {/* 左侧 */}
        <div className="flex flex-row items-start gap-4 text-base prose ">
          <InterestingAvatar />
          {/* <EmojiJumper
            emojiList={[
              <div key={1} className="rounded-full overflow-clip">
                <Image
                  src="https://upload.jianshu.io/users/upload_avatars/8761709/3101d25e-1917-47dd-bdee-58bbda3352ac.png?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/300/format/webp"
                  alt={"Head"}
                  width={256}
                  height={256}
                />
              </div>,
            ]}
          /> */}
          <div>
            <h1 className="w-fit text-3xl font-medium sm:block flex flex-col items-start gap-1">
              <span>Hello，这里是</span>
              <span className=" text-primary bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                一块小板子
              </span>
              <span>的主页</span>
            </h1>
            <div>
              <div className="flex justify-between">
                计算机专业大二在读 (全栈开发)
                {/* <EmojiJumper emojiList={["🤣", "🥲", "😊", "😇", "🙂"]} /> */}
              </div>
              {/* {JSON.stringify(blogJson)} */}
              {/* 下面是我的能力👇 */}
              {/* {ability.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <h2 className="text-xl font-medium">{item.name}</h2>
                    <EmojiJumper
                      className="hidden sm:block"
                      emojiList={item.children.map((v) => (
                        <i key={v.name} className={v.icon} />
                      ))}
                    />
                  </div>
                  <p>{item.description}</p>
                  <div className="flex flex-row flex-wrap gap-2">
                    {item.children.map((child) => (
                      <div
                        key={child.name}
                        className="flex flex-row items-center gap-2"
                      >
                        <i className={child.icon} />
                        <span>{child.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* blog */}
        <div className="w-full py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogJson.items.map((item) => (
            <FeedItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* 底部 */}
        <div className="flex flex-col sm:flex-row gap-16 justify-start py-8 px-2">
          {links.map((category) => (
            <div
              key={category.name}
              className="flex flex-col gap-2 line-height-1.5rem"
            >
              <h2 className="text-xl font-medium">{category.name}</h2>
              <div className="flex flex-col gap-2">
                {category.children.map((item) => (
                  <Link
                    href={item.url}
                    key={item.name}
                    className="link link-primary link-hover flex flex-row items-center gap-1"
                  >
                    <i className="i-tabler-link" />
                    <span>
                      {item.name}
                      {/* {item.url} */}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-500 dark:text-gray-400">
        © 2024 oboard. All Rights Reserved.
      </p>
    </article>
  );
}
