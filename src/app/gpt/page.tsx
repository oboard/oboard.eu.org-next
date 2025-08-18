'use client';

import { type Key, useCallback, useEffect, useRef, useState } from 'react';
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

export default function GPTChatPage() {
  const isFirst = useRef(true);
  const { userId, checkUserIdAvalible } = useUserId();
  const [messages, setMessages] = useLocalStorage<MessageInfo[]>('gpt_messages', []);
  const [input, setInput] = useLocalStorage<string>('input', '');
  const [following, setFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const updateMessages = useCallback((newMessages: MessageInfo[]) => {
    const uniqueMessages = newMessages
      .filter((item, index, array) =>
        array.findIndex((item2) => item.id === item2.id) === index
      )
      .sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
    setMessages(uniqueMessages);
  }, [setMessages]);

  const sendMessage = useCallback(() => {
    if (input.length === 0 || input.trim().length === 0) {
      toast.error('请输入内容');
      return;
    }

    if (!checkUserIdAvalible()) return;
    if (isLoading) return;

    setIsLoading(true);
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
      content: '',
      status: MessageStatus.Sending,
      time: new Date().getTime(),
    };

    const newMessages = [...messages, msg, robot_msg];
    updateMessages(newMessages);

    const currentInput = input;
    setInput('');

    fetch(`/api/gpt?prompt=${encodeURIComponent(currentInput)}&userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error('无法获取响应流');
        }

        let data = '';
        const decoder = new TextDecoder();

        function processResult(result: any): any {
          if (result.value) {
            data += decoder.decode(result.value, { stream: true });
            robot_msg.content = data;
            updateMessages([...messages, msg, robot_msg]);
          }

          if (result.done) {
            robot_msg.status = MessageStatus.Sent;
            updateMessages([...messages, msg, robot_msg]);
            setIsLoading(false);
            return;
          }
          return reader?.read().then(processResult);
        }
        return reader?.read().then(processResult);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('发送失败，请重试');
        robot_msg.content = '发送失败，请重试';
        robot_msg.status = MessageStatus.Sent;
        updateMessages([...messages, msg, robot_msg]);
        setIsLoading(false);
      });

    setTimeout(() => {
      toBottom();
    }, 100);
  }, [input, checkUserIdAvalible, isLoading, userId, messages, updateMessages, toBottom, setInput]);

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
      chatbox?.removeEventListener('scroll', (e) => { });
      clearTimeout(scrollTimer.current);
    };
  }, [toBottom]);

  // 页面启动的时候，滚动到底部

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-base-100 to-base-200">

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                <i className="i-tabler-message-circle text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">开始对话</h3>
              <p className="text-base-content/60 max-w-md">
                我是您的AI助手，可以帮您解答问题、提供建议或进行创意讨论。请输入您的问题开始对话。
              </p>
            </div>
          ) : (
            messages.map((item: MessageInfo) => (
              <ChatBubble key={item.id} message={item} isCurrentUser={item.userId === userId} />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-base-200 rounded-2xl px-4 py-3 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-base-content/60">AI正在思考...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {!following && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <button
              type="button"
              className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                const chatbox = document?.querySelector('html');
                chatbox?.scrollTo({
                  top: chatbox?.scrollHeight,
                  behavior: 'smooth',
                });
              }}
            >
              <i className="i-tabler-arrow-down text-lg" />
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-base-100/80 backdrop-blur-md border-t border-base-300 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              className="textarea textarea-bordered w-full resize-none min-h-[2.5rem] max-h-32 pr-12 focus:border-primary transition-colors duration-200"
              placeholder="输入您的问题..."
              value={input}
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  sendMessage();
                } else if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
                  // Allow line break
                }
              }}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
            />
          </div>

          <div className="flex gap-2">
            {!input && (
              <details className="dropdown dropdown-end dropdown-top">
                <summary className="btn btn-circle btn-ghost">
                  <i className="i-tabler-plus text-lg" />
                </summary>
                <ul className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        (document?.getElementById('long_text_modal') as HTMLDialogElement)?.showModal()
                      }
                      className="flex items-center gap-2"
                    >
                      <i className="i-tabler-file-text" />
                      长文本输入
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMessages([]);
                        toast.success('对话已清空');
                      }}
                      className="flex items-center gap-2 text-error"
                    >
                      <i className="i-tabler-trash" />
                      清空对话
                    </button>
                  </li>
                </ul>
              </details>
            )}

            <button
              type="button"
              className={`btn btn-circle transition-all duration-200 ${input.trim() && !isLoading
                ? 'btn-primary shadow-lg hover:shadow-xl'
                : 'btn-disabled'
                }`}
              disabled={!input.trim() || isLoading}
              onClick={sendMessage}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <i className="i-tabler-send text-lg" />
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs text-base-content/40">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>

      {/* Long Text Modal */}
      <dialog id="long_text_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <i className="i-tabler-file-text" />
            长文本输入
          </h3>
          <textarea
            className="textarea textarea-bordered w-full h-64 resize-none"
            placeholder="在这里输入长文本内容..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!input.trim()}
                onClick={() => {
                  sendMessage();
                  (document?.getElementById('long_text_modal') as HTMLDialogElement)?.close();
                }}
              >
                <i className="i-tabler-send" />
                发送
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => (document?.getElementById('long_text_modal') as HTMLDialogElement)?.close()}
              >
                取消
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => (document?.getElementById('long_text_modal') as HTMLDialogElement)?.close()}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
}
