/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface FeedBodyInfo {
  version: string;
  title: string;
  description: string;
  icon: string;
  home_page_url: string;
  feed_url: string;
  items: FeedItemInfo[];
}

export interface FeedItemInfo {
  id: string;
  url: string;
  title: string;
  image: string;
  summary: string;
  content_html: string;
  date_published: string;
  tags: string[];
  author: string;
}

export default function FeedItemCard({ item }: { item: FeedItemInfo }) {
  const { title, summary, url, date_published, tags, author, image } = item;

  const summaryShort =
    summary.length > 40 ? `${summary.slice(0, 40)}...` : summary;

  function getCrossbellImageUrl(imageUrl: string) {
    return imageUrl.replace("ipfs://", "https://ipfs.crossbell.io/ipfs/");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString).getTime(); //获得当前时间，转化时间戳
    const newTime = new Date().getTime(); //获得当前时间，转化时间戳
    const interval = (newTime - date) / 1000;
    if (interval < 0) {
      return "刚刚";
    }
    if (interval > 24 * 3600 * 365) {
      return `${Math.round(interval / 24 / 3600 / 365)}年前`;
    }
    if (interval > 24 * 3600 * 30) {
      return `${Math.round(interval / 24 / 3600 / 30)}月前`;
    }
    if (interval > 24 * 3600 * 7) {
      return `${Math.round(interval / 24 / 3600 / 7)}周前`;
    }
    if (interval > 24 * 3600) {
      return `${Math.round(interval / 24 / 3600)}天前`;
    }
    if (interval > 3600) {
      return `${Math.round(interval / 3600)}小时前`;
    }
    if (interval > 60) {
      return `${Math.round(interval / 60)}分钟前`;
    }

    return "刚刚";
  }
  return (
    <motion.div
      initial={{ scale: 0, y: "100%", filter: "blur(20px)" }}
      animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 17,
      }}
      className="w-full"
    >
      <motion.a
        href={url}
        className="rounded-xl bg-base-100 hover:bg-base-200 overflow-clip relative w-full sm:h-72 ring-1 ring-primary flex flex-col justify-between cursor-pointer"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        transition={{
          type: "spring",
          stiffness: 100,
        }}
      >
        {
          <img
            src={getCrossbellImageUrl(image)}
            alt={title}
            className="w-full object-cover aspect-16/9 max-h-32"
          />
        }
        {/* <p className="text-sm leading-5 opacity-80 text-base-content">
          <time dateTime={date_published}>
            {new Date(date_published).toLocaleString()}
          </time>
        </p> */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-xl leading-7 font-semibold">{title}</h3>

          <p className="flex-1 text-sm leading-6 text-ellipsis overflow-hidden text-left max-h-14">
            {summaryShort}
          </p>

          <div className="flex-shrink-0 flex flex-row gap-2 items-center text-sm font-medium leading-5">
            {/* <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-success text-success-content">
    {tags.join(", ")}
  </span> */}
            <span className="inline-flex items-center gap-2 rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://obscloud.ulearning.cn/resources/web/1715838718885.png"
                alt={"Head"}
                className="rounded-full overflow-clip"
                width={16}
                height={16}
              />
              {author}
            </span>
            <span>·</span>
            <time dateTime={date_published}>{formatDate(date_published)}</time>
            {tags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-primary-content text-primary"
              >
                <i className="i-tabler-tag" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}
