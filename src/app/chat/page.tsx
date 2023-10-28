/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Key, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
// import SyntaxHighlighter from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { MessageInfo, MessageStatus } from "../../models/chat/message";
import NoSSR from "@/components/NoSSR";
import useLocalStorage from "@/hooks/useLocalStorage";
import toast from "react-hot-toast";

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

const upload = async (file: File) => {
  // Uint8Array
  let arrayBuffer = await file.arrayBuffer();

  let res = await fetch("/api/chat/file", {
    method: "POST",
    body: arrayBuffer,
  });
  let data = await res.json();
  return data.url;
};

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

// 用于防吞信息
const sendedList: MessageInfo[] = [];

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function toBottom(quick?: boolean) {
    if (!following) return;
    const chatbox = document?.querySelector("html");
    chatbox?.scrollTo({
      top: chatbox?.scrollHeight,
      behavior: quick ? "auto" : "smooth",
    });
  }

  // 检查userId是否可用
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function checkUserIdAvalible() {
    if (userId == undefined || userId == null || userId.length < 5) {
      setUserId(genUuid());
      // 刷新页面
      if (typeof window !== "undefined") {
        window.location.reload();
        return false;
      }
    }
    return true;
  }

  // 设置定时拉去信息
  useEffect(() => {
    let first = true;
    let timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkUserIdAvalible();

      try {
        fetch(`/api/chat?startTime=${messages[messages.length - 1]?.time ?? 0}`)
          .then((res) => res.json())
          .then((data) => {
            let temp = [...messages];
            // 如果data不是空的
            if (data !== undefined && data !== null) {
              // data中去除掉自己的
              // let data2 = data.filter((item: MessageInfo) => item.userId !== userId);
              temp = [...data, ...temp];
              // 去重
              temp = temp.filter(
                (item, index, array) =>
                  array.findIndex((item2) => item.id === item2.id) === index
              );

              sendedList.forEach((item: MessageInfo) => {
                // 如果信息里没有正准备发的信息，就加入，并发送
                if (temp.findIndex((item2) => item.id === item2.id) === -1) {
                  temp.push(item);
                  // 发送信息
                  fetch("/api/chat", {
                    method: "POST",
                    body: JSON.stringify([item]),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }).then(() => {
                    // 发送成功
                    item.status = MessageStatus.Sent;
                    setMessages([...messages, item]);
                  });
                }
              });

              // 过滤掉空信息
              temp = temp.filter((item) => {
                if (item.content == undefined || item.content == null) {
                  return false;
                }
                return item.content.trim() !== "";
              });

              temp.forEach((item) => {
                if (item.time == undefined) {
                  // 时间戳
                  item.time = new Date().getTime();
                }
              });

              // 按照时间戳排序
              temp.sort((a, b) => {
                return (a.time ?? 0) - (b.time ?? 0);
              });

              // 筛选出服务器没有但本地有的信息
              // let syncMessages = temp.filter((item) => {
              //   return (
              //     data.findIndex((item2: { id: string }) => {
              //       return item.id === item2.id;
              //     }) === -1
              //   );
              // });
              // // 如果超过一百条只发送后面100条
              // if (syncMessages.length > 100) {
              //   syncMessages = syncMessages.slice(-100);
              // }
              // // 如果有，就发送给服务器
              // if (syncMessages.length > 0) {
              //   fetch("/api/chat", {
              //     method: "POST",
              //     body: JSON.stringify(syncMessages),
              //     headers: {
              //       "Content-Type": "application/json",
              //     },
              //   });
              // }
            }

            setMessages(temp);
            if (first) {
              // 等待页面更新后，页面自动滚动到底部
              // toBottom(true);
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
  }, [checkUserIdAvalible, messages, setMessages, userId]);

  // 发送图片
  const sendPicture = () => {
    // 读取图片
    let input = document?.createElement("input");
    input.type = "file";

    input.onchange = () => {
      if (input.files == null || input.files.length == 0) return;

      if (!checkUserIdAvalible()) return;

      let file = input.files[0];

      const isImage = file.type.startsWith("image");

      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        upload(file).then((url) => {
          let msg: MessageInfo = {
            id: genUuid(),
            userId: userId,
            content: isImage
              ? `![${file.name}](${url})`
              : `[${file.name}](${url})`,
            time: undefined,
            type: isImage ? "image" : "file",
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
        });
      };
    };
    input.click();
  };

  // 发送信息
  let sendMessage = () => {
    if (input.length == 0 || input.trim().length == 0) {
      toast.error("请输入内容");
      return;
    }

    if (!checkUserIdAvalible()) return;

    // let time = new Date().toLocaleString();
    let msg: MessageInfo = {
      id: genUuid(),
      userId: userId,
      content: input,
      status: MessageStatus.Sending,
    };
    // 直接插入到数组中
    setMessages([...messages, msg]);
    sendedList.push(msg);
    // 发送信息
    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify([msg]),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      // 发送成功
      msg.status = MessageStatus.Sent;
      setMessages([...messages, msg]);
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
    const chatbox = document?.querySelector("html");
    if (typeof window !== "undefined") {
      window?.addEventListener("scroll", (e) => {
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
    }

    toBottom();

    return () => {
      chatbox?.removeEventListener("scroll", (e) => {});
      clearTimeout(scrollTimer.current);
    };
  }, [toBottom]);

  // 页面启动的时候，滚动到底部

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
    if (time == undefined) return "发送中";
    let now = new Date().getTime();
    let diff = now - time;
    if (diff < 1000 * 60) {
      // return `${Math.floor(diff / 1000)}秒前`;
      return "刚刚";
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
            "btn rounded-full btn-accent flex items-center justify-center"
          }
          onClick={() => {
            const chatbox = document?.querySelector("html");
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
          <span className="hidden md:ml-2 md:inline-block">返回底部</span>
        </button>
      </div>
      <div className="flex flex-col w-full">
        {/* 底部需要空出一些距离 */}
        <div className="flex-grow flex flex-col w-full">
          <div className="chatbox w-full flex-grow flex flex-col p-4 pb-48">
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
                    <time className="text-xs opacity-50">
                      {getTime(item.time)}
                    </time>
                  </div>
                  <div
                    className={
                      "animate-duration-500 animate-ease-out chat-bubble " +
                      genColor(item.userId) +
                      (item.userId === userId
                        ? " animate-fade-in-right"
                        : " animate-fade-in-left") + 
                      (item.type === 'image'
                        ? "  max-w-sm"
                        : "")
                    }
                  >
                    <ReactMarkdown
                      // 图片可以点击放大
                      components={{
                        img: ({ node, ...props }) => (
                          <img
                            className="min-w-8 min-h-8 w-full my-2 rounded hover:shadow-xl cursor-pointer transition-all scale-100 hover:scale-110 hover:rounded-xl"
                            src={props.src}
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                window.open(props.src);
                              }
                            }}
                          />
                        ),
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }) => {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <CodeBlock language={match[1]}>
                              {String(children).replace(/\n$/, "")}
                            </CodeBlock>
                          ) 
                          : (
                            <CodeBlock language={"js"}>
                              {String(children).replace(/\n$/, "")}
                            </CodeBlock>
                          );
                        },
                        a: ({
                          node,
                          // inline,
                          className,
                          children,
                          ...props
                        }) => {
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
                                // 下载
                                download={
                                  item.content.indexOf("api/chat/file") > 0 &&
                                  children
                                }
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
                  {/* <div className="chat-footer opacity-50">
                    {(() => {
                      switch (item.status) {
                        case MessageStatus.Sending:
                          return "发送中";
                        case MessageStatus.Sent:
                          return "";
                        // case MessageStatus.Seen:
                        //   return "已读";
                        default:
                          return "";
                      }
                    })()}
                  </div> */}
                </div>
              )
            )}
          </div>
        </div>
        <div className="px-4 py-2 bg-base-200 fixed bottom-16 md:bottom-0 left-0 right-0 flex flex-row items-center pr-2 gap-2 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-base-100">
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
              className="btn btn-circle btn-primary"
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
            <details className="dropdown dropdown-end dropdown-top">
              <summary className="btn btn-circle">
                <i className="i-tabler-plus text-xl" />
              </summary>
              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <li>
                  <a
                    onClick={() =>
                      (
                        document?.getElementById(
                          "my_modal_1"
                        ) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    长文本
                  </a>
                </li>
                <li>
                  <a onClick={sendPicture}>图片/文件</a>
                </li>
              </ul>
            </details>
          )}
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">输入长信息</h3>
          <textarea
            className="w-full h-96 textarea textarea-bordered my-2"
            placeholder="输入信息"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                <button className="btn" onClick={sendMessage}>
                  发送
                </button>
                <button className="btn">取消</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </NoSSR>
  );
}
