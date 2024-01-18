import {JSDOM} from "jsdom";
import Image from "next/image";
import ShareLinkBox from "./shareLinkBox";
import DownloadButton from "@/components/DownloadButton";
import Copyer from "@/components/Copyer";
import OpenableImage from "./openableImage";

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
  let isXiumi = false;

  const template = await res.text();
  // 解析html

  // meta转换为json，使用jsdom

  const dom = new JSDOM(template).window.document;
  const metas = dom.head.getElementsByTagName("meta");
  const meta = {} as any;
  for (let i = 0; i < metas.length; i++) {
    const key = metas[i].getAttribute("property") || metas[i].getAttribute("name") ||  metas[i].getAttribute("itemprop");
    const value = metas[i].getAttribute("content");
    if (key && value) {
      meta[key] = value;
    }
  }
  if(meta['image']) {
    meta['og:image'] = meta['image']
  }
  if(meta['description']) {
    meta['og:description'] = meta['description']
  }
  if(meta['name']) {
    meta['og:title'] = meta['name']
    isXiumi = true;
  }
  console.log(meta);
  // {
  //   'og:title': '开学季|关于面试，你值得拥有的心理小技巧！',
  //   'og:url': 'http://mp.weixin.qq.com/s?__biz=MzU3OTUwMTk3Mg==&mid=2247502215&idx=1&sn=b6e7677dcdd9a7ea7c4f100104af2969&chksm=fd67a37cca102a6a065b1c0884e062bd63f5cae6cd577d5e8519fcda6ee276dc27c012799503#rd',
  //   'og:image': 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/yTQGVX5Nm2B0zgAtqviaGZZVuqHkD3kHNttOK07LZTN07OwVAsIBGrd3ibtSEHXN6jTUY4ibEK9chHWxjpgSZyweg/0?wx_fmt=jpeg',
  //   'og:description': '面试无从下手？心理学支招来帮助你！',
  //   'og:site_name': 'Weixin Official Accounts Platform',
  //   'og:type': 'article',
  //   'og:article:author': '莞工心理',
  //   'twitter:card': 'summary',
  //   'twitter:image': 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/yTQGVX5Nm2B0zgAtqviaGZZVuqHkD3kHNttOK07LZTN07OwVAsIBGrd3ibtSEHXN6jTUY4ibEK9chHWxjpgSZyweg/0?wx_fmt=jpeg',
  //   'twitter:title': '开学季|关于面试，你值得拥有的心理小技巧！',
  //   'twitter:creator': '莞工心理',
  //   'twitter:site': 'Weixin Official Accounts Platform',
  //   'twitter:description': '面试无从下手？心理学支招来帮助你！'
  // }

  if(isXiumi) {
    const dataUrl = 'https://' + dom.head.outerHTML.split("show_data_url%22%3A%22%2F%2F")[1].split('%22%2C%22show_url')[0];
    const res = await fetch(decodeURIComponent(dataUrl), {
      method: "GET",
      mode: "cors",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
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
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });
    const template = await res.text();
    // 匹配template中的<img src=\"//img.xiumi.us/xmi/ua/4rI8R/i/56954313b2edfd3aeb64880d793e3c2b-sz_7503622.jpg?x-oss-process=style/xmwebp\" 中的图片链接不一定是jpg，可能是gif等
    // 有多处匹配
    let imageRegs = template.match(/(\/\/|\/\/)[^\s]+\"/g);
    let imageLinks = imageRegs?.map(link => {
      // \\"//
      return "https://" + link.replace(/\\\\\"\/\//g, '').replace(/\\\"\/\//g, '').replace(/\\\\\"\/\//g, '')
    }) ?? [];
    meta["imageLinks"] = imageLinks;
  }  else {

  // 获取图片
  const imageElements = dom.querySelectorAll("img");

  // 创建一个数组来存储所有图片链接
  const imageLinks: string[] = [];

  imageElements.forEach((element: any) => {
    const src = element.getAttribute("data-src") || element.getAttribute("src");

    // 如果匹配成功，将 URL 添加到 imageLinks 数组中
    if (src && src.length > 1) {
      const imageUrl = src;
      imageLinks.push(imageUrl);
    }
  });

  // 现在 imageLinks 数组包含了所有图片链接
  meta["imageLinks"] = imageLinks;
}

  return meta;
}

export default async function WeixinArticle({ params }: any) {
  //   if (params.slug) {
  let data: any = {};
  // 判断是否是url
  if (params && params.slug) {
    data = await getPosts(params.slug);
  } else {
    data = undefined;
  }
  //   }

  return (
    <>
      <main className="py-24 px-4 flex flex-col gap-4 justify-center items-center">
        <h1 className="text-4xl font-bold">微信公众号解析助手</h1>
        <p className="text-lg text-opacity-50">同时支持秀米</p>

        <ShareLinkBox shareText={params && params.slug} />

        {/* 展示数据
        'og:title': '开学季|关于面试，你值得拥有的心理小技巧！',
  'og:url': 'http://mp.weixin.qq.com/s?__biz=MzU3OTUwMTk3Mg==&mid=2247502215&idx=1&sn=b6e7677dcdd9a7ea7c4f100104af2969&chksm=fd67a37cca102a6a065b1c0884e062bd63f5cae6cd577d5e8519fcda6ee276dc27c012799503#rd',
  'og:image': 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/yTQGVX5Nm2B0zgAtqviaGZZVuqHkD3kHNttOK07LZTN07OwVAsIBGrd3ibtSEHXN6jTUY4ibEK9chHWxjpgSZyweg/0?wx_fmt=jpeg',
  'og:description': '面试无从下手？心理学支招来帮助你！',
  'og:site_name': 'Weixin Official Accounts Platform',
  'og:type': 'article',
  'og:article:author': '莞工心理',
   */}
        {data && (
          <>
            <div className="card sm:w-96 bg-base-100 shadow-xl">
              <figure>
                {data["og:image"] && (
                  <Image
                    src={data["og:image"]}
                    alt={data["og:title"]}
                    layout="responsive"
                    sizes="100vw"
                    width={100}
                    height={100}
                  />
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">{data["og:title"]}</h2>
                <p>{data["description"]}</p>
                <p className="text-sm text-opacity-50">{data["og:article:author"]}</p>
                <a className="link text-blue" href={data["og:url"]}>
                  原文链接
                </a>
                
                <div className="card-actions justify-end">
                  {/* 复制按钮 */}
                  {data["og:description"] && <Copyer body={data["og:description"]}>复制标题</Copyer>}
                  {data["og:article:author"] && <Copyer body={data["og:article:author"]}>复制作者</Copyer>}
                  {data["og:url"] && <Copyer body={data["og:url"]}>复制链接</Copyer>}
                  {data["og:image"] && <><Copyer body={data["og:image"]}>复制图片链接</Copyer>
                  <DownloadButton
                    link={data["og:image"]}
                    name={data["og:title"]}
                  />
                  </>}
                </div>
              </div>
            </div>

            {/* 展示来自imageLinks的图片 */}

            <div
              className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mt-8`}
            >
              {data["imageLinks"].map((link: string, index: number) => (
                <div className="cursor-pointer flex flex-col items-center" key={link}>
                  <div className="flex flex-col justify-center flex-1">
                    <OpenableImage src={link} data={data} />
                  </div>
                  {/* 下载按钮 */}
                  <DownloadButton
                    className="w-32 my-4"
                    link={link}
                    name={index + 1 + "-" + data["og:title"]}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
