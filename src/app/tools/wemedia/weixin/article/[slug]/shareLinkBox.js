"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ShareLinkBox(props) {
  const [shareText, setShareText] = useState(props.shareText?decodeURIComponent(props.shareText) : "");
  const router = useRouter();

  //   const [searchText, setSearchText] = useState("");

  // 解析函数
  function extractLink(text) {
    // 1. 提取链接，只要符合http://xxxx.xxx/xxxxx的链接
    try {
      const link = text.match(/http:\/\/\S+/)[0];
      return link;
    } catch (_) {
      return text;
    }
  }

  const share = () => {
    const link = encodeURIComponent(extractLink(shareText));
    // 路由到搜索结果页面
    router.push(`/tools/wemedia/weixin/article/${link}`);
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
          placeholder="粘贴微信图文链接"
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
          <button className="btn join-item" onClick={share}>
            获取
          </button>
        </div>
      </div>
    </>
  );
}
