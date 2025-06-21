/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { type Key, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
// import SyntaxHighlighter from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { type MessageInfo, MessageStatus } from '@/models/chat/message';
import useLocalStorage from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { v7 as uuidv7 } from 'uuid';
import { useUserId } from '@/hooks/useUserId';
import ChatBubble from '@/components/ChatBubble';

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

// 上面是api的代码，下面是页面的代码
export default function GPTChatPage() {
  const isFirst = useRef(true);
  const { userId, checkUserIdAvalible } = useUserId();
  // 使用daisyUI和tailwindcss
  const [messages, setMessages] = useLocalStorage('gpt_messages', []) as [
    MessageInfo[],
    React.Dispatch<React.SetStateAction<MessageInfo[]>>,
  ];
  const [input, setInput] = useLocalStorage('input', '');
  const [following, setFollowing] = useState(true);

  const toBottom = useCallback(
    (quick?: boolean) => {
      if (!following) return;
      const chatbox = document?.querySelector('html');
      chatbox?.scrollTo({
        top: chatbox?.scrollHeight,
        behavior: quick ? 'auto' : 'smooth',
      });
    },
    [following]
  );

  // 设置定时拉去信息
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkUserIdAvalible();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [userId, checkUserIdAvalible]);

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
      status: MessageStatus.Sent,
      time: new Date().getTime(),
    };
    const robot_msg: MessageInfo = {
      id: uuidv7(),
      userId: 'robot',
      content: '...',
      status: MessageStatus.Sending,
      time: new Date().getTime(),
    };
    // 直接插入到数组中
    setMessages([...messages, msg, robot_msg]);

    // 发送信息
    fetch(`/api/gpt?prompt=${input}&userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        const reader = res.body?.getReader();
        if (reader === null || reader === undefined) return;
        let data = '';
        const decoder = new TextDecoder();
        robot_msg.time = new Date().getTime();
        function processResult(result: any): any {
          data += decoder.decode(result.value, { stream: true });
          console.log(data);
          robot_msg.content = `${data}...`;
          setMessages(
            [...messages, robot_msg, msg]
              .filter(
                (item, index, array) => array.findIndex((item2) => item.id === item2.id) === index
              )
              .sort((a, b) => {
                return (a.time ?? 0) - (b.time ?? 0);
              })
          );

          if (result.done) {
            robot_msg.content = data;
            // robot_msg.time = new Date().getTime();
            robot_msg.status = MessageStatus.Sent;
            // 发送成功
            setMessages(
              [...messages, robot_msg, msg]
                .filter(
                  (item, index, array) => array.findIndex((item2) => item.id === item2.id) === index
                )
                .sort((a, b) => {
                  return (a.time ?? 0) - (b.time ?? 0);
                })
            );
            return;
          }
          return reader?.read().then(processResult);
        }
        return reader.read().then(processResult);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // 清空输入框
    setInput('');

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

  const scrollTimer = useRef<NodeJS.Timeout | undefined>();

  // 监听chatbox的滚动事件，如果滑动到底部，就设置following为true，否则为false
  useEffect(() => {
    const chatbox = document?.querySelector('html');
    if (typeof window !== 'undefined') {
      window?.addEventListener('scroll', (e) => {
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

    if (isFirst.current) {
      toBottom(true);
      isFirst.current = false;
    } else {
      toBottom();
    }

    return () => {
      chatbox?.removeEventListener('scroll', (e) => {});
      clearTimeout(scrollTimer.current);
    };
  }, [toBottom]);

  // 页面启动的时候，滚动到底部

  return (
    <>
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
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5072"
            width="24"
            height="24"
            // 颜色
            fill="currentColor"
            aria-label="返回底部"
          >
            <title>返回底部</title>
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
        <div className="flex-grow flex flex-col w-full">
          <div className="chatbox w-full flex-grow flex flex-col p-4 pb-48">
            {messages.map((item: MessageInfo, index: Key | null | undefined) => (
              <ChatBubble key={item.id} message={item} isCurrentUser={item.userId === userId} />
            ))}
          </div>
        </div>
        <div className="px-4 py-2 fixed bottom-16 md:bottom-0 left-0 right-0 flex flex-row items-center pr-2 gap-2 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-base-300">
          {/* // 要支持多行输入，按Shift+Enter 或者Ctrl+Enter换行 */}
          <input
            type="text"
            className="input flex-grow focus:outline-0 transition-all duration-200"
            value={input}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                setInput(`${input}\n`);
              } else if (e.key === 'Enter') {
                sendMessage();
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setInput(e.target.value);
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
                  <button
                    type="button"
                    onClick={() =>
                      (document?.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()
                    }
                  >
                    长文本
                  </button>
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
          />
          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                <button type="button" className="btn" onClick={sendMessage}>
                  发送
                </button>
                <button type="button" className="btn">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
