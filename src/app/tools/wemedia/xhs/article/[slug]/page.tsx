/* eslint-disable @next/next/no-img-element */
import { JSDOM } from "jsdom";
import Image from "next/image";
import ShareLinkBox from "./shareLinkBox";
import DownloadButton from "@/components/DownloadButton";
import CopyButton from "@/components/CopyButton";

async function getPosts(link: string) {
  if (decodeURIComponent(link).indexOf("://") < 0) return undefined;
  const res = await fetch(decodeURIComponent(link), {
    method: "GET",
    mode: "cors",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "Cache-Control": "no-cache",
      Cookie:
        "xhsTrackerId=dce20a5f-0d69-4166-a0be-750dc6162f4c; xhsTrackerId.sig=2fK0z_q0teMcEpSE_mL4nK4LDo6GXH4BtQv43oJUSJg; a1=186546c40abxxkxzffthtu0w45fb2w7khl6w7flhf30000286050; webId=769d75a19ae6fdceb5af2ebd21080217; web_session=030037a4dff28ef07339b6e094244a8ccbc817; abRequestId=769d75a19ae6fdceb5af2ebd21080217; gid=yY0qyi0jf4xSyYK24KS481i10DCCTCuii9x9Kxi78E42iEq8DJEWTW888JYK8288DyiKWSqj; xsecappid=xhs-pc-web; webBuild=3.7.3; cache_feeds=[]; websectiga=16f444b9ff5e3d7e258b5f7674489196303a0b160e16647c6c2b4dcb609f4134; sec_poison_id=44f0a768-171a-4f38-9b4e-2a63b90ba76f",
      Dnt: "1",
      Pragma: "no-cache",
      "Sec-Ch-Ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    },
  });

  const template = await res.text();
  //   <!doctype html>
  {
    /* <html data-head-attrs="">

<head>
	<meta charset="utf-8">
	<meta name="theme-color" content="rgb(255, 255, 255)">
	<meta name="server-rendered" content="true">
	<meta name="og:description" content="2 亿人的生活经验，都在小红书">
	<meta name="keywords" content="iPad, 平板, ipad配件, 壁纸, 全屏壁纸, ipadmini6, apple, iphone布局">
	<meta name="description" content="苹果总部基地太帅了！        ">
	<meta name="og:type" content="article">
	<meta name="og:site_name" content="小红书">
	<meta name="og:title" content="Apple park 壁纸">
	<meta name="og:image" content="https://sns-img-qc.xhscdn.com/e89e2efe-3035-6905-dfcb-a9689b4ffe75">
	<meta name="og:url" content="https://www.xiaohongshu.com/explore/64fa99c7000000002000299f"></meta> */
  }
  // 解析html

  // meta转换为json，使用jsdom

  const dom = new JSDOM(template).window.document;
  const metas = dom.getElementsByTagName("meta");
  const meta = {} as any;
  for (let i = 0; i < metas.length; i++) {
    const name = metas[i].getAttribute("name");
    const content = metas[i].getAttribute("content");
    if (name && content) {
      meta[name] = content;
    }
  }
  console.log(meta);

  // 获取包含在 swiperWrapper 内的所有带有 background-image 的元素
  const imageElements = dom.querySelectorAll(
    ".swiper-wrapper :not(.swiper-slide-duplicate)"
  );

  // 创建一个数组来存储所有图片链接
  const imageLinks: string[] = [];

  // 遍历每个带有 background-image 的元素
  imageElements.forEach((element: any) => {
    // 从元素的 style 属性中提取 background-image 属性的值
    const backgroundImageStyle = element.style.backgroundImage;

    // 使用正则表达式匹配 URL
    const matches = backgroundImageStyle.match(/url\(['"]?(.*?)['"]?\)/);

    // 如果匹配成功，将 URL 添加到 imageLinks 数组中
    if (matches && matches.length > 1) {
      const imageUrl = matches[1];
      imageLinks.push(imageUrl);
    }
  });

  // 现在 imageLinks 数组包含了所有图片链接
  meta["imageLinks"] = imageLinks;

  return meta;
}

export default async function XHSArticle({
  params,
}: {
  params?: { slug: string };
}) {
  //   if (params.slug) {
  let data: any = {};
  // 判断是否是url
  if (params?.slug) {
    data = await getPosts(params.slug);
  } else {
    data = undefined;
  }
  //   }

  return (
    <>
      <main className="py-24 px-4 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-4xl font-bold">小红书</h1>

        <ShareLinkBox shareText={params?.slug} />

        {/* 展示数据
        description: '苹果总部基地太帅了！        ',
        'og:type': 'article',
  'og:site_name': '小红书',
  'og:title': 'Apple park 壁纸',
  'og:image': 'https://sns-img-hw.xhscdn.net/e89e2efe-3035-6905-dfcb-a9689b4ffe75'
  keywords: 'iPad, 平板, ipad配件, 壁纸, 全屏壁纸, ipadmini6, apple, iphone布局',
   */}
        {data && (
          <>
            <div className="card sm:w-96 bg-base-100 shadow-xl">
              <figure>
                {data["og:image"] && (
                  <img src={data["og:image"]} alt={data["og:title"]} />
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">{data["og:title"]}</h2>
                <p>{data["description"]}</p>
                {/* 展示关键词 */}
                <p>{data["keywords"]}</p>
                <div className="card-actions justify-end">
                  <CopyButton body={data["og:title"]}>复制标题</CopyButton>
                  <CopyButton body={data["og:title"]}>复制文案</CopyButton>
                  <CopyButton body={data["keywords"]}>复制关键词</CopyButton>
                  <CopyButton body={data["og:url"]}>复制链接</CopyButton>
                </div>
              </div>
            </div>

            {/* 展示来自imageLinks的图片 */}

            {data["imageLinks"].map((link: string, index: number) => (
              <div
                className="rounded shadow-md hover:shadow-2xl transition-all"
                key={link}
              >
                <Image
                  src={link}
                  alt={data["og:title"]}
                  layout="responsive"
                  sizes="100vw"
                  width={100}
                  height={100}
                />
                {/* 下载按钮 */}
                <DownloadButton
                  link={link}
                  name={`${index + 1}-${data["og:title"]}`}
                />
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}
