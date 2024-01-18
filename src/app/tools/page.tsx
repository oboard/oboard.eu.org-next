import React, {PropsWithChildren} from "react";
import Link from "next/link";
import Image from "next/image";

interface Colors {
  [key: string]: string;
}

const Tag: React.FC<PropsWithChildren> = (props) => {

  const colors: Colors = {
    '优学院': 'bg-red',
    '题库': 'bg-blue-500',
    '学习记录': 'bg-yellow-500',
    '转换': 'bg-indigo-500',
    '微信公众号': 'bg-green-500',
    '文章解析': 'bg-purple-500',
    '小红书': 'bg-red-500',
    '青年大学习': 'bg-red-500',
  }


  return (
    // <span className="inline-block rounded border bg-amber-500/10 text-amber-900 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 text-xs leading-none">
    <span className="inline-block rounded-full border text-[12px] px-1 flex flex-row gap-1 items-center">
      {props.children}
      {/* 圆圈 */}
      <div className={`w-2 h-2 rounded-full ${colors[props.children?.toString()??'']}`}></div>

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
    desc: "解析微信公众号文章的封面、标题、简介，支持秀米！",
    url: "tools/wemedia/weixin/article",
    img: "/preview/weixin_article.jpg",
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
    name: "青年大学习参学率报告生成器",
    desc: "生成青年大学习参学率报告",
    url: "https://young.oboard.eu.org/",
    img: "/preview/young_maker.png",
    tag: ["青年大学习"],
    avalible: true,
  }
];

export default function Home() {
  return (
    <article className={"flex flex-wrap justify-center items-center gap-4 py-24 px-4 w-full"}>
      {toolbox.map((item) => (
        <Link href={item.url} className="no-underline w-full sm:w-96 flex flex-row items-center justify-center" key={item.name}>
          <div className="card relative w-full h-80 bg-base-100 shadow-xl hover:scale-102 active:scale-90 ease-out duration-300 transition-all">
          <figure className="h-40">
            <Image
              src={item.img}
              alt="preview"
              sizes="100vw"
              layout="responsive"
              width={500}
              height={300}
            />
          </figure>
          <div className="card-body px-4 pt-8 pb-4">
            <h2 className="card-title font-normal text-primary">
              {item.name}
              { item.avalible && <i className="i-tabler-circle-check text-green-500"></i>}
              { !item.avalible && <i className="i-tabler-circle-x text-red-500"></i>}
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
