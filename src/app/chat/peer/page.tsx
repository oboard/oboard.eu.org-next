"use client";

import React, { Component, Key, useEffect, useRef, useState } from "react";
import type Peer from "peerjs";
import NoSSR from "@/components/NoSSR";
import useLocalStorage from "@/hooks/useLocalStorage";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MessageInfo, MessageStatus } from "@/models/chat/message";
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

function Chat() {
  const [myId, setMyId] = useState("");
  const myIdRef = useRef(myId);
  const [userId, setUserId] = useLocalStorage("userId", genUuid());
  const [userList, setUserList] = useState<string[]>([]);
  const [peer, setPeer] = useState({} as Peer);
  const [mesType, setMesType] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [messageFile, setMessageFile] = useState<File | ArrayBuffer>();
  const [messages, setMessages] = useLocalStorage("peer_messages", []) as [
    MessageInfo[],
    React.Dispatch<React.SetStateAction<MessageInfo[]>>
  ];

  useEffect(() => {
    setMessageFile(new File([], ""));
  }, []);

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

  // 检查peer是否连接
  function checkPeer() {
    if (
      peer == undefined ||
      peer == null ||
      myIdRef.current == undefined ||
      myIdRef.current == null ||
      myIdRef.current === ""
    ) {
      init();
      return false;
    }
    return true;
  }

  // 设置定时拉去信息
  useEffect(() => {
    checkPeer();
    checkUserIdAvalible();
    let timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkPeer();
      checkUserIdAvalible();

      try {
        fetch("/api/chat/peer", {
          // Post
          method: "post",
          body: myIdRef.current,
        }).then((res) => {
          res.json().then((data) => {
            setUserList(data);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [checkUserIdAvalible, userId]);

  function init() {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer("");
      peer.on("open", (id) => {
        setMyId(id);
        myIdRef.current = id;
        setPeer(peer);
        console.log("My ID: " + id);
      });
      peer.on("connection", (conn) => {
        conn.on("data", (data: any) => {
          let temp = [...messages];
          // 如果data不是空的
          if (data !== undefined && data !== null) {
            // data中去除掉自己的
            // let data2 = data.filter((item: MessageInfo) => item.userId !== userId);
            temp = [data, ...temp];
            // 去重
            temp = temp.filter(
              (item, index, array) =>
                array.findIndex((item2) => item.id === item2.id) === index
            );

            // sendedList.forEach((item: MessageInfo) => {
            //   // 如果信息里没有正准备发的信息，就加入，并发送
            //   if (temp.findIndex((item2) => item.id === item2.id) === -1) {
            //     temp.push(item);
            //     // 发送信息
            //     fetch("/api/chat", {
            //       method: "POST",
            //       body: JSON.stringify([item]),
            //       headers: {
            //         "Content-Type": "application/json",
            //       },
            //     }).then(() => {
            //       // 发送成功
            //       item.status = MessageStatus.Sent;
            //       setMessages([...messages, item]);
            //     });
            //   }
            // });

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
          // console.log(data);
          // setTestMes([...testMes, data]);
        });
      });
    });
  }
  // init();

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

  const send = () => {
    function _send(friendId: string) {
      const conn = peer.connect(friendId);

      conn.on("open", () => {
        if (message.length == 0 || message.trim().length == 0) {
          toast.error("请输入内容");
          return;
        }

        if (!checkUserIdAvalible()) return;

        // let time = new Date().toLocaleString();
        let msg: MessageInfo = {
          id: genUuid(),
          userId: userId,
          content: message,
          status: MessageStatus.Sending,
        };
        // const msgObj = {
        //   sender: myId,
        //   message:
        //     mesType === 0
        //       ? {
        //           type: 0,
        //           content: message,
        //         }
        //       : { type: 1, content: messageFile },
        // };

        setMessages([...messages, msg]);
        conn.send(msg);
        msg.status = MessageStatus.Sent;
        setMessages([...messages, msg]);
        setMesType(0);
        setMessage("");
        setMessageFile(new File([], ""));
      });
    }

    userList.forEach((friendId) => {
      _send(friendId);
    });
  };

  // const sendTest = () => {
  //   const conn = peer.connect(friendId);
  //   conn.on("open", () => {
  //     const msgObj = {
  //       sender: myId,
  //       message: testF,
  //     };
  //     conn.send(msgObj);
  //     setTestMes([...testMes, msgObj]);
  //     setTestF(new File([], ""));
  //   });
  // };

  return (
    <>
      <div className="flex md:flex-row w-full flex-col pt-24">
        <div className="flex-1">
          <h1>My ID: {myId}</h1>

          <label>Friend List:</label>
          <ul className="list">
            {userList.map((user, i) => (
              <li key={i}>{user}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          {/* <button onClick={sendTest}>Send Test</button> */}
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
                      key={item.id}
                    >
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
                          (item.type === "image" ? "  max-w-sm" : "")
                        }
                      >
                        <ReactMarkdown
                          // 图片可以点击放大
                          components={{
                            img: ({ node, ...props }) => (
                              <div
                                className="gap-1 flex flex-row items-center link link-hover"
                                onClick={() => {
                                  if (typeof window !== "undefined") {
                                    window.open(props.src);
                                  }
                                }}
                              >
                                <i className="i-tabler-photo" />
                                查看图片
                              </div>
                              // <img
                              //   className="min-w-8 min-h-8 w-full my-2 rounded hover:shadow-xl cursor-pointer transition-all scale-100 hover:scale-110 hover:rounded-xl"
                              //   src={props.src}
                              //   onClick={() => {
                              //     if (typeof window !== "undefined") {
                              //       window.open(props.src);
                              //     }
                              //   }}
                              // />
                            ),
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <CodeBlock language={match[1]}>
                                  {String(children).replace(/\n$/, "")}
                                </CodeBlock>
                              ) : (
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
                                      item.content.indexOf("api/chat/file") >
                                        0 && children
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
          </div>
          {/* {messages.map((message, i) => {
            let fu;
            if (message.message.type === 1) {
              fu = URL.createObjectURL(
                new Blob([message.message.content as unknown as ArrayBuffer], {
                  type: "arraybuffer",
                })
              );
            }
            return (
              <div key={i}>
                <h3>
                  {message.sender}:({message.message.type})
                </h3>
                <p>
                  {message.message.type === 0 &&
                  typeof message.message.content === "string"
                    ? message.message.content
                    : fu}
                </p>
              </div>
            );
          })} */}
        </div>
        {/* {testMes.map((message, i) => {
          console.log(message);
          const fu = URL.createObjectURL(
            new Blob([message.message as unknown as ArrayBuffer], {
              type: "arraybuffer",
            })
          );
          return (
            <div key={i}>
              <h3>{message.sender}:</h3>
              <p>
                {message.message.name}:{fu}
              </p>
            </div>
          );
        })} */}
      </div>
      <div className="fixed bottom-48 px-8 gap-2 w-full flex flex-row">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMesType(0);
            setMessage(e.target.value);
          }}
          className="input focus:outline-0 flex-1 input-bordered"
        />
        {/* <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              setMesType(1);
              setMessageFile(file);
            }
          }}
          className="file-input file-input-bordered w-full max-w-xs"
        /> */}
        <button
          className="btn btn-circle btn-primary"
          // 字数限制10000字
          disabled={message.length > 10000}
          onClick={() => {
            send();
          }}
        >
          <i className="i-tabler-send text-xl" />
        </button>
      </div>
    </>
  );
}

export default Chat;
