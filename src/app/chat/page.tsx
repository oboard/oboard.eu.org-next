/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import type React from 'react';
import { type Key, useEffect, useRef, useState, useCallback } from 'react';
import { type MessageInfo, MessageStatus } from '../../models/chat/message';
import useLocalStorage from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { v7 as uuidv7 } from 'uuid';
import { useUserId } from '@/hooks/useUserId';
import ChatBubble from '@/components/ChatBubble';

const upload = async (file: File) => {
  // Uint8Array
  const arrayBuffer = await file.arrayBuffer();

  const res = await fetch('/api/chat/file', {
    method: 'POST',
    body: arrayBuffer,
  });
  const data = await res.json();
  return data.url;
};

// 用于防吞信息
const sendedList: MessageInfo[] = [];

// 上面是api的代码，下面是页面的代码
export default function ChatPage() {
  const { userId, checkUserIdAvalible } = useUserId();
  // 使用daisyUI和tailwindcss
  const [messages, setMessages] = useLocalStorage('messages', []) as [
    MessageInfo[],
    React.Dispatch<React.SetStateAction<MessageInfo[]>>,
  ];
  const [input, setInput] = useLocalStorage('input', '');
  const [following, setFollowing] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toBottom = useCallback(
    (quick?: boolean) => {
      if (!following) return;
      bottomRef.current?.scrollIntoView({ behavior: quick ? 'auto' : 'smooth' });
    },
    [following]
  );

  // 设置定时拉去信息
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkUserIdAvalible();

      try {
        fetch(`/api/chat?from=${messages[messages.length - 1]?.time ?? 0}`)
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
                (item, index, array) => array.findIndex((item2) => item.id === item2.id) === index
              );
              for (const item of sendedList) {
                // 如果信息里没有正准备发的信息，就加入，并发送
                if (temp.findIndex((item2) => item.id === item2.id) === -1) {
                  temp.push(item);
                  // 发送信息
                  fetch('/api/chat', {
                    method: 'POST',
                    body: JSON.stringify([item]),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }).then(() => {
                    // 发送成功
                    item.status = MessageStatus.Sent;
                    setMessages([...messages, item]);
                  });
                }
              }

              // 过滤掉空信息
              temp = temp.filter((item) => {
                if (item.content === undefined || item.content == null) {
                  return false;
                }
                return item.content.trim() !== '';
              });

              for (let i = 0; i < temp.length; i++) {
                if (temp[i].time === undefined) {
                  // 时间戳
                  temp[i].time = new Date().getTime();
                }
              }

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
          });
      } catch (error) {
        console.log(error);
      }

      if (following) {
        toBottom();
      }
    }, 1000); // 添加 1000ms 的时间间隔
    return () => {
      clearInterval(timer);
    };
  }, [checkUserIdAvalible, messages, setMessages, userId, following, toBottom]);

  // 定期检查用户ID
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkUserIdAvalible();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [checkUserIdAvalible, userId]);

  // 发送图片
  const sendPicture = () => {
    // 读取图片
    const input = document?.createElement('input');
    input.type = 'file';

    input.onchange = () => {
      if (input.files == null || input.files.length === 0) return;

      if (!checkUserIdAvalible()) return;

      const file = input.files[0];

      const isImage = file.type.startsWith('image');

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        upload(file).then((url) => {
          const msg: MessageInfo = {
            id: uuidv7(),
            userId: userId,
            content: isImage ? `![${file.name}](${url})` : `[${file.name}](${url})`,
            time: undefined,
            type: isImage ? 'image' : 'file',
            status: MessageStatus.Sending,
          };
          // 直接插入到数组中
          setMessages([...messages, msg]);
          // 发送信息
          fetch('https://www.oboard.eu.org/api/chat', {
            method: 'POST',
            body: JSON.stringify([msg]),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        });
      };
    };
    input.click();
  };

  // 发送信息
  const sendMessage = () => {
    if (input.length === 0 || input.trim().length === 0) {
      toast.error('请输入内容');
      return;
    }

    if (!checkUserIdAvalible()) return;

    // let time = new Date().toLocaleString();
    const msg: MessageInfo = {
      id: uuidv7(),
      userId: userId,
      content: input,
      status: MessageStatus.Sending,
    };
    // 直接插入到数组中
    setMessages([...messages, msg]);
    sendedList.push(msg);
    // 发送信息
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify([msg]),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      // 发送成功
      msg.status = MessageStatus.Sent;
      setMessages([...messages, msg]);
    });
    // 清空输入框
    setInput('');

    // 等待页面更新后，页面自动滚动到底部
    setTimeout(() => {
      toBottom();
    }, 0);
  };

  // 信息的结构
  // {
  //     id: "uuid",
  //     userId: "uuid",
  //     content: "message",
  //     time: "time",
  // }

  // 监听chatbox的滚动事件，如果滑动到底部，就设置following为true，否则为false
  useEffect(() => {
    const chatbox = document?.querySelector('html');
    if (typeof window !== 'undefined') {
      window?.addEventListener('scroll', (e) => {
        // 如果滑动到底部或者超过底部，就设置following为true，否则为false
        if (
          (chatbox?.scrollHeight ?? 0) - (chatbox?.scrollTop ?? 0) <=
          (chatbox?.clientHeight ?? 0) + 100
        ) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }

    toBottom();

    return () => {
      chatbox?.removeEventListener('scroll', (e) => {});
    };
  }, [toBottom]);

  // 页面启动的时候，滚动到底部

  return (
    <>
      {/* 连接状态指示器 */}
      {/* {!isConnected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-base-100/50">
          <div className="badge badge-error badge-lg">连接中...</div>
        </div>
      )} */}

      {/* 一个用于滚动到底部对悬浮按钮，如果following为false则显示 */}
      {/* 底部剧中 */}
      <div
        className="fixed bottom-32 z-40 left-1/2 transform -translate-x-1/2"
        style={{
          display: following ? 'none' : 'block',
        }}
      >
        <button
          type="button"
          className={'btn rounded-full btn-accent flex items-center justify-center'}
          onClick={() => {
            const chatbox = document?.querySelector('html');
            chatbox?.scrollTo({
              top: chatbox?.scrollHeight,
              behavior: 'smooth',
            });
          }}
        >
          <svg
            role="img"
            aria-label="返回底部"
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
            />
            <path
              d="M892.561322 875.531353c0 17.664722-14.303454 32.00086-31.99914 32.00086L156.562183 907.532213c-17.664722 0-32.00086-14.334417-32.00086-31.99914 0-17.664722 14.336138-32.00086 32.00086-32.00086l704 0C878.257869 843.532213 892.561322 857.866631 892.561322 875.531353z"
              p-id="5074"
            />
          </svg>
          <span className="hidden md:ml-2 md:inline-block">返回底部</span>
        </button>
      </div>
      <div className="flex flex-col w-full">
        {/* 底部需要空出一些距离 */}
        <div className="flex-grow flex flex-col w-full items-center">
          <div className="chatbox w-full max-w-4xl flex-grow flex flex-col p-4 py-48">
            {messages.map((item: MessageInfo, index: Key | null | undefined) => (
              <ChatBubble key={item.id} message={item} isCurrentUser={item.userId === userId} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--fallback-b2,oklch(var(--b3) / var(--un-bg-opacity)))',
          }}
          className="px-4 py-2 fixed bottom-16 md:bottom-0 left-0 right-0 flex justify-center backdrop-filter backdrop-blur-lg bg-opacity-30"
        >
          <div className="w-full max-w-4xl flex flex-row items-center gap-2">
            <textarea
              rows={1}
              className="textarea textarea-bordered flex-grow focus:outline-0 transition-all duration-200 min-h-[3rem] max-h-32 resize-none"
              value={input}
              placeholder="输入消息..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                  setInput(`${input}\n`);
                } else if (e.key === 'Enter') {
                  sendMessage();
                  e.preventDefault();
                }
                // 自动调整高度
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
              onChange={(e) => {
                setInput(e.target.value);
                // 自动调整高度
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />

            {/* 发送按钮 */}
            {input && (
              <button
                type="button"
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
                    <button type="button" onClick={sendPicture}>
                      图片/文件
                    </button>
                  </li>
                </ul>
              </details>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
