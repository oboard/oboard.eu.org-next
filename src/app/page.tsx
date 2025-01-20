import type React from "react";
import Link from "next/link";
import InterestingAvatar from "@/components/InterestingAvatar";
import FeedItemCard, {
  type FeedBodyInfo,
} from "@/components/feed/FeedItemCard";

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
        name: "Rinne",
        url: "https://www.rinne.in/",
      },
      {
        name: "Opacity",
        url: "https://opacity.ink",
      },
      {
        name: "Yorkin",
        url: "https://yoorkin.github.io/",
      },
      {
        name: "9BIE",
        url: "https://9bie.org/",
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
    await fetch("https://oboard.xlog.app/feed?format=json", { next: { revalidate: 60 } })
  ).json()) as FeedBodyInfo;
  return (
    <article className={"py-24 px-4 md:max-w-5xl"}>
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="5f4911ab-c548-457f-9b3e-d1ed01fb29c0"
      />
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
              <span className="">Hello，这里是</span>
              <span className=" text-primary bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                一块小板子
              </span>
              <span>的主页</span>
            </h1>
            <div>
              <div className="flex justify-between">
                计算机专业大三在读 (全栈开发)
              </div>
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
