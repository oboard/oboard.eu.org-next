"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function ShareLinkBox(props) {
  const [shareText, setShareText] = useState(props.shareText?decodeURIComponent(props.shareText) : "");
  const router = useRouter();

  //   const [searchText, setSearchText] = useState("");

  // 解析函数
  function extractLink(text) {
    // text like: 37 4027发布了一篇小红书笔记，快来看吧！ 😆 7Cn4GTmcQDkRFri 😆 http://xhslink.com/dIrhou，复制本条信息，打开【小红书】App查看精彩内容！

    // 1. 提取链接
    try {
      const link = text.match(/http:\/\/xhslink.com\/\w+/)[0];
      return link;
    } catch (_) {
      return text;
    }
  }

  const share = () => {
    const link = encodeURIComponent(extractLink(shareText));
    // 路由到搜索结果页面
    // window.location.href = `/tools/wemedia/xhs/article/${link}`;
    router.push(`/tools/wemedia/xhs/article/${link}`);
  };

//   useEffect(() => {
//     // 读取window.location.href
//     const url = window.location.href;
//     // 从url中提取分享链接
//     const link = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
//     // 设置分享链接
//     setShareText(link);
//   }, []);

  return (
    <>
      {/* copy_xhs.jpg */}
      {/* <Image src="/copy_xhs.jpg" alt="小红书" width={100} height={100} /> */}
      <div className="w-full join">
        <input
          className="input input-bordered join-item flex-1"
          placeholder="粘贴小红书分享链接"
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              share();
            }
          }}
        />
        <div className="indicator">
          {/* <span className="indicator-item badge badge-secondary">
                  new
                </span> */}
          <button type="button" className="btn join-item" onClick={share}>
            获取
          </button>
        </div>
      </div>
    </>
  );
}
