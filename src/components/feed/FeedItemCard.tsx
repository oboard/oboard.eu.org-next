"use client";
import React from "react";
import { motion } from "framer-motion";

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
  summary: string;
  content_html: string;
  date_published: string;
  tags: string[];
  author: string;
}

export default function FeedItemCard({ item }: { item: FeedItemInfo }) {
  const { title, summary, url, date_published, tags, author } = item;
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
        className="card relative w-full sm:h-70 bg-base-100 ring-1 ring-primary flex flex-col p-6 justify-between cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 300,
        }}
      >
        <p className="text-sm leading-5 opacity-80 text-base-content">
          <time dateTime={date_published}>
            {new Date(date_published).toLocaleString()}
          </time>
        </p>

        <h3 className="mt-2 text-xl leading-7 font-semibold text-primary">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-ellipsis h-0 flex-1 overflow-hidden text-left">
          {summary}
        </p>

        <div className="mt-3 flex-shrink-0">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-success text-success-content">
            {tags.join(", ")}
          </span>

          <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-base-300 text-base-content">
            {author}
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}
