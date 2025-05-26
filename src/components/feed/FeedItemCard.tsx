"use client";
import React from "react";
import Image from "next/image";
import type { FeedItemInfo } from '@/models/feed'

export default function FeedItemCard({ item }: { item: FeedItemInfo }) {
  const { title, summary, url, date_published, tags, author, image } = item;

  const summaryShort =
    summary.length > 40 ? `${summary.slice(0, 40)}...` : summary;

  const renderTags = tags.filter((tag) => tag !== "post");

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
      // return `${Math.round(interval / 24 / 3600 / 365)}年前`;
      return new Date(dateString).toLocaleDateString();
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

    <a
      href={url}
      className="rounded-xl bg-base-100 overflow-clip relative h-full w-full flex flex-col justify-between cursor-pointer border border-base-300 hover:scale-[1.02] hover:shadow-xl transition-ease transition-duration-300"
    >
      {
        <Image
          width={900}
          height={383}
          src={getCrossbellImageUrl(image)}
          alt={title}
          className="w-full object-cover aspect-900/383"
        />
      }
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-xl leading-7 font-semibold text-ellipsis overflow-hidden w-full inline-block text-nowrap whitespace-nowrap">
          {title}
        </h3>

        <p className="flex-1 text-sm leading-6 text-left">
          {summaryShort}
        </p>

        {renderTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {renderTags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-primary-content text-primary"
              >
                <i className="i-tabler-tag" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex-shrink-0 flex flex-row gap-2 items-center text-sm leading-5">

          <span className="inline-flex items-center gap-2 rounded-full font-medium">
            <Image
              src="https://obscloud.ulearning.cn/resources/web/1748237070466.png"
              alt={"Head"}
              className="rounded-full overflow-clip"
              width={16}
              height={16}
            />
            {author}
          </span>
          <span>·</span>
          <time
            dateTime={date_published}
            className="overflow-hidden text-ellipsis"
          >
            {formatDate(date_published)}
          </time>
        </div>
      </div>
    </a>
  );
}
