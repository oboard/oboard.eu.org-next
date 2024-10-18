/* eslint-disable @next/next/no-img-element */
"use client";
import type React from "react";
import type { PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Colors {
  [key: string]: string;
}

const Tag: React.FC<PropsWithChildren> = (props) => {
  const colors: Colors = {
    图床: "bg-red",
    P2P: "bg-blue",
    聊天: "bg-blue-500",
    加密: "bg-yellow-500",
    爬虫: "bg-yellow-500",
    转换: "bg-indigo-500",
    微信公众号: "bg-green-500",
    文章解析: "bg-purple-500",
    小红书: "bg-red-500",
    青年大学习: "bg-red-500",
  };

  return (
    // <span className="inline-block rounded border bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 text-xs leading-none">
    <span className="flex rounded-full border text-[12px] px-1 flex-row gap-1 items-center">
      {props.children}
      {/* 圆圈 */}
      <div
        className={`w-2 h-2 rounded-full ${colors[props.children?.toString() ?? ""]
          }`}
      />
    </span>
  );
};

const toolbox = [
  // {
  //   name: "优学院题库导出助手",
  //   desc: "导出优学院题库到 Word",
  //   url: "https://uexport.oboard.eu.org/",
  //   img: "/preview/uexport.jpg",
  //   tag: ["优学院", "题库"],
  //   avalible: true,
  // },
  // {
  //   name: "优学院学习记录转换助手",
  //   desc: "转换学习目录为failureRecord",
  //   url: "tools/ulearning/fakeRecord",
  //   img: "/preview/fakeRecord.jpg",
  //   tag: ["优学院", "学习记录", "转换"],
  //   avalible: true,
  // },
  // {
  //   name: "优学院试卷导出助手",
  //   desc: "导出考试试题",
  //   url: "tools/ulearning/exam",
  //   img: "/preview/ulearningExam.jpg",
  //   tag: ["优学院", "转换"],
  //   avalible: true,
  // },
  {
    name: "微信公众号文章解析助手",
    desc: "解析文章的封面、标题、简介，支持秀米！",
    url: "tools/wemedia/weixin/article",
    img: "/preview/weixin_article.png",
    tag: ["微信公众号", "文章解析"],
    avalible: true,
  },
  {
    name: "小红书文章解析助手",
    desc: "解析小红书文章的封面、标题、简介",
    url: "tools/wemedia/xhs/article",
    img: "/preview/xhs_article.png",
    tag: ["小红书", "文章解析"],
    avalible: true,
  },
  {
    name: "P2P聊天",
    desc: "通过PeerJS实现P2P聊天",
    url: "chat/peer",
    img: "/preview/peer.png",
    tag: ["P2P", "聊天"],
    avalible: true,
  },
  {
    name: "优图床",
    desc: "使用ulearning的obs储存图片",
    url: "https://pan.oboard.eu.org/pic ",
    img: "/preview/upic.png",
    tag: ["图床"],
    avalible: true,
  },
  {
    name: "站点扫描工具",
    desc: "根据网站链接发生链式反应，形成sitemap",
    url: "https://site.oboard.eu.org/ ",
    img: "/preview/sitemap.jpg",
    tag: ["爬虫"],
    avalible: true,
  },
  {
    name: "base16384",
    desc: "base16384加密解密工具",
    url: "tools/base16384",
    img: "/preview/base16384.jpg",
    tag: ["加密"],
    avalible: true,
  },
  // {
  //   name: "青年大学习参学率报告生成器",
  //   desc: "生成青年大学习参学率报告",
  //   url: "https://young.oboard.eu.org/",
  //   img: "/preview/young_maker.png",
  //   tag: ["青年大学习"],
  //   avalible: true,
  // }
];

export default function Home() {
  return (
    <article
      className={
        "flex flex-wrap justify-center items-center gap-4 py-24 px-4 w-full"
      }
    >
      {toolbox.map((item, index) => (
        <Link href={item.url} key={item.name}>
          <motion.div
            className="no-underline w-full max-w-96 sm:w-96 flex flex-row items-center justify-center"
            initial={{ scale: 0, y: "100%", filter: "blur(20px)" }}
            animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 17,
              delay: index / 10,
            }}
          >
            <motion.div
              className="rounded-xl bg-base-100 overflow-clip relative h-full w-full flex flex-col justify-between cursor-pointer border border-base-300 hover:scale-[1.02] hover:shadow-xl transition-ease transition-duration-300"
            >
              {/* <div className="card relative w-full sm:h-70 bg-base-100 ring-1 ring-primary hover:scale-102 active:scale-90 ease-out duration-300 transition-all"> */}
              <figure className="sm:h-40">
                <img
                  src={item.img}
                  alt="preview"
                  width={500}
                  height={300}
                />
              </figure>
              <div className="card-body px-4 pt-4 pb-4">
                <div className="card-title font-normal text-primary">
                  {item.name}
                  {item.avalible && (
                    <i className="i-tabler-circle-check text-green-500" />
                  )}
                  {!item.avalible && (
                    <i className="i-tabler-circle-x text-red-500" />
                  )}
                </div>
                <p>{item.desc}</p>
                <div className="card-actions justify-end">
                  {/* <div className="badge badge-outline">Fashion</div> 
            <div className="badge badge-outline">Products</div> */}
                  {item.tag.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
              {/* </div> */}
            </motion.div>
          </motion.div>
        </Link>
        // <div className="card w-96 bg-base-100 shadow-xl image-full">
        //   <figure>
        //     <Image
        //       src={item.img}
        //       alt="preview"
        //       sizes="100vw"
        //       layout="responsive"
        //       width={500}
        //       height={300}
        //     />
        //   </figure>
        //   <div className="card-body">
        //     <h2 className="card-title">{item.name}</h2>
        //     <p>{item.desc}</p>
        //     <div className="card-actions justify-end">
        //       {/* <button className="btn btn-primary">Buy Now</button> */}
        //       <Link href={item.url} className="btn no-underline">
        //         使用
        //       </Link>
        //     </div>
        //   </div>
        // </div>
        // <div className="card bordered shadow-lg bg-base-100" key={item.name}>
        //   <div className="card-body">
        //     <h2 className="card-title">{item.name}</h2>
        //     <p>{item.desc}</p>
        //   </div>
        //   <div className="card-footer">
        //     <Link href={item.url} className="btn no-underline">
        //       使用
        //     </Link>
        //   </div>
        // </div>
      ))}
    </article>
  );
}
