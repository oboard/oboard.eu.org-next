"use client";

import { Key, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { MessageInfo } from "../models/chat/message";
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
              temp = temp.filter((item, index) => {
                return (
                  temp.findIndex((item2) => {
                    return item.id === item2.id;
                  }) === index
                );
              });

              // 过滤掉空信息
              temp = temp.filter((item) => {
                return item.content !== "";
              });

              temp.forEach((item) => {
                if (typeof item.time === "string" || item.time == undefined) {
                  // 时间戳
                  item.time = new Date().getTime();
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

    if(!checkUserIdAvalible()) return;

    // let time = new Date().toLocaleString();
    let msg: MessageInfo = {
      id: genUuid(),
      userId: userId,
      content: input,
      time: undefined,
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
                  key={index}
                  className={
                    "flex flex-col gap-1 px-2 py-1" +
                    (item.userId === userId ? " items-end" : " items-start")
                  }
                >
                  <div
                    className={
                      "flex flex-col gap-1" +
                      (item.userId === userId ? " items-end" : " items-start")
                    }
                  >
                    <div
                      className={
                        "rounded-md p-2 max-w-md" +
                        (item.userId === userId
                          ? " bg-primary text-primary-content"
                          : " bg-base-200 text-base-content")
                      }
                    >
                      {/* 以markdown展示 */}
                      <ReactMarkdown
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <CodeBlock language={match[1]}>
                                {String(children).replace(/\n$/, "")}
                              </CodeBlock>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          // 链接
                          a({ node, className, children, ...props }) {
                            return (
                              <div className="flex flex-row gap-1 items-center">
                                {/* 链接图标 */}
                                <svg
                                  // 颜色
                                  className={
                                    (item.userId === userId
                                      ? "text-primary-content"
                                      : "text-base-content") + " fill-current"
                                  }
                                  viewBox="0 0 1024 1024"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                >
                                  <path d="M573.44 640a187.68 187.68 0 0 1-132.8-55.36L416 560l45.28-45.28 24.64 24.64a124.32 124.32 0 0 0 170.08 5.76l1.44-1.28a49.44 49.44 0 0 0 4-3.84l101.28-101.28a124.16 124.16 0 0 0 0-176l-1.92-1.92a124.16 124.16 0 0 0-176 0l-51.68 51.68a49.44 49.44 0 0 0-3.84 4l-20 24.96-49.92-40L480 276.32a108.16 108.16 0 0 1 8.64-9.28l51.68-51.68a188.16 188.16 0 0 1 266.72 0l1.92 1.92a188.16 188.16 0 0 1 0 266.72l-101.28 101.28a112 112 0 0 1-8.48 7.84 190.24 190.24 0 0 1-125.28 48z"></path>
                                  <path
                                    d="M350.72 864a187.36 187.36 0 0 1-133.28-55.36l-1.92-1.92a188.16 188.16 0 0 1 0-266.72l101.28-101.28a112 112 0 0 1 8.48-7.84 188.32 188.32 0 0 1 258.08 7.84L608 464l-45.28 45.28-24.64-24.64A124.32 124.32 0 0 0 368 478.88l-1.44 1.28a49.44 49.44 0 0 0-4 3.84l-101.28 101.28a124.16 124.16 0 0 0 0 176l1.92 1.92a124.16 124.16 0 0 0 176 0l51.68-51.68a49.44 49.44 0 0 0 3.84-4l20-24.96 50.08 40-20.8 25.12a108.16 108.16 0 0 1-8.64 9.28l-51.68 51.68A187.36 187.36 0 0 1 350.72 864z"
                                    p-id="4051"
                                  ></path>
                                </svg>
                                <a
                                  className="link-hover"
                                  target="_blank"
                                  {...props}
                                >
                                  {children}
                                </a>
                              </div>
                            );
                          },
                        }}
                      >
                        {item.content}
                      </ReactMarkdown>
                      {/* {item.content} */}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {
                        // item.time是时间戳，转换为可读的时间字符串
                        new Date(
                          item.time || new Date().getTime()
                        ).toLocaleString()
                      }
                    </div>
                  </div>
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
                sendMessage();
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
