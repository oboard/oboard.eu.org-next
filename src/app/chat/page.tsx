"use client";

import { Key, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { MessageInfo, MessageStatus } from "../models/chat/message";
import NoSSR from "@/components/NoSSR";

const CodeBlock = ({
  language,
  children,
}: {
  language: string | undefined;
  children: any;
}) => {
  return (
    <SyntaxHighlighter
      showLineNumbers={true}
      wrapLines={true}
      PreTag="div"
      language={language}
      style={darcula}
    >
      {children}
    </SyntaxHighlighter>
  );
};
const useLocalStorage = (
  storageKey: string,
  fallbackState: string | never[]
) => {
  const [value, setValue] = useState(
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem(storageKey) ?? "[]")) ||
      fallbackState
  );

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  if (typeof window == "undefined") return [fallbackState, () => {}];

  return [value, setValue];

  // If there is no window (e.g., server-side rendering), provide a fallback.
  // return [fallbackState, () => {}]; // Return a dummy setState function.
};
// export let messages = [];

// export default function handler(req, res) {
//   // 如果是get
//   if (req.method === "GET") {
//     // 返回数据
//     res
//       .status(200)
//       .setHeader("Access-Control-Allow-Origin", "*")
//       .json({ message: "success", data: messages });
//     return;
//   } else if (req.method === "POST") {
//     // 如果是post
//     // 把信息存入内存
//     if (req.body !== undefined || req.body !== null) messages.push(req.body);

//     // 返回成功
//     res
//       .status(200)
//       .setHeader("Access-Control-Allow-Origin", "*")
//       .json({ message: "success" });
//   }
// }

// 生成uuid
const genUuid = () => {
  let s: any[] = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  // bits 12-15 of the time_hi_and_version field to 0010
  s[14] = "4";
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid;
};

// 上面是api的代码，下面是页面的代码
export default function Chat() {
  // 使用daisyUI和tailwindcss
  const [messages, setMessages] = useLocalStorage("messages", []) as [
    MessageInfo[],
    React.Dispatch<React.SetStateAction<MessageInfo[]>>
  ];
  const [showMenu, setShowMenu] = useState(false);
  const [input, setInput] = useLocalStorage("input", "");
  const [userId, setUserId] = useLocalStorage("userId", genUuid());
  const [following, setFollowing] = useState(true);
  let first = true;

  function toBottom() {
    const chatBox = document.querySelector(".chatbox");
    chatBox?.scrollTo({
      top: chatBox?.scrollHeight,
      behavior: "smooth",
    });
  }

  // 检查userId是否可用
  function checkUserIdAvalible() {
    if (userId == undefined || userId == null || userId.length < 5) {
      setUserId(genUuid());
      // 刷新页面
      if (window) {
        window.location.reload();
        return false;
      }
    }
    return true;
  }

  // 设置定时拉去信息
  useEffect(() => {
    let timer = setInterval(() => {
      console.log(`userId: ${userId}`);

      checkUserIdAvalible();

      try {
        fetch("/api/chat")
          .then((res) => res.json())
          .then((data) => {
            let temp = [...messages];
            // 如果data不是空的
            if (data !== undefined && data !== null) {
              temp = [...data, ...temp];
              // 去重
              temp = temp.filter(
                (item, index, array) =>
                  array.findIndex((item2) => item.id === item2.id) === index
              );

              // 过滤掉空信息
              temp = temp.filter((item) => {
                if (item.content == undefined || item.content == null) {
                  return false;
                }
                return item.content.trim() !== "";
              });

              temp.forEach((item) => {
                if (typeof item.time === "string" || item.time == undefined) {
                  // 时间戳
                  item.time = new Date().getTime();

                  if(item.status == MessageStatus.Sent && item.userId == userId){
                    item.status = MessageStatus.Seen;
                  }
                }
              });
              // 按照时间戳排序
              temp.sort((a, b) => {
                return (a.time ?? 0) - (b.time ?? 0);
              });

              // 筛选出服务器没有但本地有的信息
              let syncMessages = temp.filter((item) => {
                return (
                  data.findIndex((item2: { id: string }) => {
                    return item.id === item2.id;
                  }) === -1
                );
              });
              // 如果超过一百条只发送后面100条
              if (syncMessages.length > 100) {
                syncMessages = syncMessages.slice(-100);
              }
              // 如果有，就发送给服务器
              if (syncMessages.length > 0) {
                fetch("/api/chat", {
                  method: "POST",
                  body: JSON.stringify(syncMessages),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              }
            }

            setMessages(temp);
            if (first) {
              // 等待页面更新后，页面自动滚动到底部
              toBottom();
              first = false;
            }
          });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 发送信息
  let sendMessage = () => {
    if (input.length == 0) return;

    if (!checkUserIdAvalible()) return;

    // let time = new Date().toLocaleString();
    let msg: MessageInfo = {
      id: genUuid(),
      userId: userId,
      content: input,
      time: undefined,
      status: MessageStatus.Sending,
    };
    // 直接插入到数组中
    setMessages([...messages, msg]);
    // 发送信息
    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify([msg]),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 清空输入框
    setInput("");

    // 等待页面更新后，页面自动滚动到底部
    setTimeout(() => {
      toBottom();
    });
  };

  // 信息的结构
  // {
  //     id: "uuid",
  //     userId: "uuid",
  //     content: "message",
  //     time: "time",
  // }

  let scrollTimer = useRef<NodeJS.Timeout | undefined>();

  // 监听chatbox的滚动事件，如果滑动到底部，就设置following为true，否则为false
  useEffect(() => {
    let chatbox = document.querySelector(".chatbox");
    chatbox?.addEventListener("scroll", (e) => {
      // 如果滑动到底部或者超过底部，就设置following为true，否则为false
      if (
        (chatbox?.scrollHeight ?? 0) - (chatbox?.scrollTop ?? 0) <=
        (chatbox?.clientHeight ?? 0)
      ) {
        setFollowing(true);
        // 定时滚动到底部
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        scrollTimer.current = setInterval(() => {
          toBottom();
        }, 500);
      } else {
        setFollowing(false);
        // 取消定时
        clearTimeout(scrollTimer.current);
      }
    });

    return () => {
      chatbox?.removeEventListener("scroll", (e) => {});
      clearTimeout(scrollTimer.current);
    };
  }, []);

  // uuid作为种子，生成随机数，然后取1-7数字，作为颜色
  function genColor(uuid: string) {
    if (uuid == undefined || uuid == null || uuid.length < 5) {
      return "";
    }
    let seed = parseInt(uuid.replace(/-/g, "").slice(0, 8), 16);
    const colors = [
      "chat-bubble-primary",
      "chat-bubble-secondary",
      "chat-bubble-accent",
      "chat-bubble-neutral",
      "chat-bubble-success",
      "chat-bubble-warning",
      "chat-bubble-error",
    ];
    let color = colors[seed % 7];
    return color;
  }

  // 通过时间戳获取时间，如果时间不是很久，就显示多久之前，否则显示具体时间
  function getTime(time: number | undefined) {
    if (time == undefined) return "";
    let now = new Date().getTime();
    let diff = now - time;
    if (diff < 1000 * 60) {
      return `${Math.floor(diff / 1000)}秒前`;
    } else if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}分钟前`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}小时前`;
    // } else if (diff < 1000 * 60 * 60 * 24 * 30) {
    //   return `${Math.floor(diff / (1000 * 60 * 60 * 24))}天前`;
    } else {
      return new Date(time).toLocaleString();
    }
  }

  return (
    <NoSSR>
      {/* 一个用于滚动到底部对悬浮按钮，如果following为false则显示 */}
      {/* 底部剧中 */}
      <div
        className="fixed bottom-32 z-40 left-1/2 transform -translate-x-1/2"
        style={{
          display: following ? "none" : "block",
        }}
      >
        <button
          className={
            "btn btn-circle btn-accent flex items-center justify-center"
          }
          onClick={() => {
            const chatbox = document.querySelector(".chatbox");
            chatbox?.scrollTo({
              top: chatbox?.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5072"
            width="24"
            height="24"
            // 颜色
            fill="currentColor"
          >
            <path
              d="M792.855154 465.805779c-6.240882-6.208198-14.368821-9.311437-22.560409-9.311437s-16.446822 3.168606-22.687703 9.440452L539.696922 673.674614 539.696922 108.393173c0-17.695686-14.336138-31.99914-32.00086-31.99914s-32.00086 14.303454-32.00086 31.99914l0 563.712619L269.455396 465.941675c-6.271845-6.208198-14.432469-9.34412-22.624056-9.34412-8.224271 0-16.417578 3.135923-22.65674 9.407768-12.511007 12.512727-12.480043 32.768069 0.032684 45.248112l259.328585 259.125601c3.264938 3.263217 7.104421 5.599247 11.136568 7.135385 3.999462 1.792447 8.351566 2.879613 13.023626 2.879613 1.119849 0 2.07972-0.543583 3.19957-0.639914 8.287918 0.063647 16.60852-3.008628 22.976697-9.407768L792.982449 511.053891C805.462492 498.542884 805.429808 478.254858 792.855154 465.805779z"
              p-id="5073"
            ></path>
            <path
              d="M892.561322 875.531353c0 17.664722-14.303454 32.00086-31.99914 32.00086L156.562183 907.532213c-17.664722 0-32.00086-14.334417-32.00086-31.99914 0-17.664722 14.336138-32.00086 32.00086-32.00086l704 0C878.257869 843.532213 892.561322 857.866631 892.561322 875.531353z"
              p-id="5074"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex flex-col w-full">
        {/* 底部需要空出一些距离 */}
        <div className="flex-grow flex flex-col h-screen w-full">
          <div className="chatbox w-full flex-grow flex overflow-y-scroll flex-col p-4 pb-32">
            {messages.map(
              (item: MessageInfo, index: Key | null | undefined) => (
                // 模仿微信的样式,有气泡的感觉，要显示时间
                // 要根据uuid判断是否是自己发的，如果是自己发的靠右，别人发的靠左

                <div
                  className={
                    "chat " +
                    (item.userId === userId ? " chat-end" : "chat-start")
                  }
                  key={index}
                >
                  {/* <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div> */}
                  <div className="chat-header">
                    {/* Obi-Wan Kenobi */}
                    <time className="text-xs opacity-50">{getTime(item.time)}</time>
                  </div>
                  <div
                    className={
                      "chat-bubble " +
                      genColor(item.userId)
                    }
                  >
                    {item.content}
                  </div>
                  <div className="chat-footer opacity-50">{(()=>{
                    switch(item.status) {
                      case MessageStatus.Sending:
                        return "发送中";
                      case MessageStatus.Sent:
                        return "已发送";
                      case MessageStatus.Seen:
                        return "已读";
                      default:
                        return "";
                    }
                  })()}</div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="border border-secondary-content m-4 overflow-hidden rounded-full fixed bottom-16 md:bottom-0 left-0 right-0 flex flex-row items-center pr-2 gap-2 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-base-100">
          {/* // 要支持多行输入，按Shift+Enter 或者Ctrl+Enter换行 */}
          <input
            className="input flex-grow focus:outline-0 transition-all duration-200"
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
                setInput(input + "\n");
              } else if (e.key === "Enter") {
                sendMessage();
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></input>

          {/* 发送按钮 */}
          {input && (
            <button
              className="btn btn-circle btn-primary btn-sm"
              // 字数限制10000字
              disabled={input.length > 10000}
              onClick={() => {
                sendMessage();
              }}
            >
              <i className="i-tabler-send text-xl" />
            </button>
          )}

          {/* 更多 */}
          {!input && (
            <button
              className="btn btn-circle btn-sm"
              onClick={() => {
                // 弹出菜单
                setShowMenu(!showMenu);
              }}
            >
              <i className="i-tabler-plus text-xl" />
            </button>
          )}
        </div>
      </div>
    </NoSSR>
  );
}
