import React, { PropsWithChildren } from "react";
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
    img: "/preview/uexport.jpg",
    tag: ["优学院", "题库", "导出"],
    new: false,
    developing: false,
  },
  {
    name: "优学院学习记录转换助手",
    desc: "转换学习目录为failureRecord",
    url: "tools/ulearning/fakeRecord",
    img: "/preview/fakeRecord.jpg",
    tag: ["优学院", "学习记录", "转换"],
    new: true,
    developing: true,
  },
];

export default function Home() {
  return (
    <article className={"flex flex-col md:flex-wrap gap-4 py-24 px-4"}>
      {toolbox.map((item) => (
        <Link href={item.url} className="no-underline" key={item.name}>
          <div className="card md:w-96 bg-base-100 card-bordered hover:shadow-md transition-shadow">
          <figure>
            <Image
              src={item.img}
              alt="preview"
              sizes="100vw"
              layout="responsive"
              width={500}
              height={300}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {item.name}
              { item.new && <div className="badge badge-primary">NEW</div> }
              { item.developing && <div className="badge badge-secondary">Developing</div> }
            </h2>
            <p>{item.desc}</p>
            <div className="card-actions justify-end">
              {/* <div className="badge badge-outline">Fashion</div> 
            <div className="badge badge-outline">Products</div> */}
              {item.tag.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div></Link>
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