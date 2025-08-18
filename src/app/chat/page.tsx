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
  const arrayBuffer = await file.arrayBuffer();
  const res = await fetch('/api/chat/file', {
    method: 'POST',
    body: arrayBuffer,
  });
  const data = await res.json();
  return data.url;
};

export default function ChatPage() {
  const { userId, checkUserIdAvalible } = useUserId();
  const [messages, setMessages] = useLocalStorage<MessageInfo[]>('messages', []);
  const [input, setInput] = useLocalStorage('input', '');
  const [following, setFollowing] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toBottom = useCallback(
    (quick?: boolean) => {
      if (!following) return;
      bottomRef.current?.scrollIntoView({ behavior: quick ? 'auto' : 'smooth' });
    },
    [following]
  );

  const updateMessages = useCallback((newMessages: MessageInfo[]) => {
    const uniqueMessages = newMessages
      .filter((item, index, array) =>
        array.findIndex((item2) => item.id === item2.id) === index
      )
      .filter((item) => item.content?.trim())
      .sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
    setMessages(uniqueMessages);
  }, [setMessages]);

  // 简化的消息同步逻辑
  useEffect(() => {
    const timer = setInterval(async () => {
      if (!checkUserIdAvalible()) return;

      try {
        setIsConnected(true);
        const res = await fetch(`/api/chat?from=${messages[messages.length - 1]?.time ?? 0}`);
        const data = await res.json();

        if (data && Array.isArray(data)) {
          const newMessages = [...data, ...messages]
            .map(item => ({
              ...item,
              time: item.time ?? new Date().getTime()
            }));
          updateMessages(newMessages);
        }
      } catch (error) {
        console.error('同步消息失败:', error);
        setIsConnected(false);
      }

      if (following) {
        toBottom();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [checkUserIdAvalible, messages, following, toBottom, updateMessages]);

  // 定期检查用户ID
  useEffect(() => {
    const timer = setInterval(() => {
      checkUserIdAvalible();
    }, 5000);
    return () => clearInterval(timer);
  }, [checkUserIdAvalible]);

  const sendPicture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,*/*';

    input.onchange = async () => {
      if (!input.files?.length || !checkUserIdAvalible()) return;

      const file = input.files[0];
      const isImage = file.type.startsWith('image');

      setIsLoading(true);
      try {
        const url = await upload(file);
        const msg: MessageInfo = {
          id: uuidv7(),
          userId: userId,
          content: isImage ? `![${file.name}](${url})` : `[${file.name}](${url})`,
          time: new Date().getTime(),
          type: isImage ? 'image' : 'file',
          status: MessageStatus.Sending,
        };

        const newMessages = [...messages, msg];
        updateMessages(newMessages);

        await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify([msg]),
          headers: { 'Content-Type': 'application/json' },
        });

        msg.status = MessageStatus.Sent;
        updateMessages([...messages, msg]);
        toast.success('文件发送成功');
      } catch (error) {
        console.error('文件上传失败:', error);
        toast.error('文件发送失败');
      } finally {
        setIsLoading(false);
      }
    };
    input.click();
  }, [checkUserIdAvalible, userId, messages, updateMessages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !checkUserIdAvalible() || isLoading) {
      if (!input.trim()) toast.error('请输入内容');
      return;
    }

    setIsLoading(true);
    const msg: MessageInfo = {
      id: uuidv7(),
      userId: userId,
      content: input,
      time: new Date().getTime(),
      status: MessageStatus.Sending,
    };

    const currentInput = input;
    setInput('');

    const newMessages = [...messages, msg];
    updateMessages(newMessages);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify([msg]),
        headers: { 'Content-Type': 'application/json' },
      });

      msg.status = MessageStatus.Sent;
      updateMessages([...messages, msg]);
    } catch (error) {
      console.error('发送失败:', error);
      toast.error('发送失败，请重试');
      setInput(currentInput);
    } finally {
      setIsLoading(false);
      setTimeout(() => toBottom(), 100);
    }
  }, [input, checkUserIdAvalible, isLoading, userId, messages, updateMessages, setInput, toBottom]);

  // 监听滚动事件
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
      chatbox?.removeEventListener('scroll', (e) => { });
    };
  }, [toBottom]);

  // 页面启动的时候，滚动到底部

  return (
    <div className="flex flex-col h-screen w-full md:max-w-xl">
      {/* Messages Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="i-tabler-message-circle text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">欢迎来到聊天室</h3>
                <p className="text-base-content/60 max-w-md">
                  这里是一个实时聊天空间，您可以与其他用户进行交流，分享图片和文件。开始您的第一条消息吧！
                </p>
              </div>
            ) : (
              messages.map((item: MessageInfo) => (
                <ChatBubble key={item.id} message={item} isCurrentUser={item.userId === userId} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-base-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    <span className="text-sm text-base-content/60">发送中...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
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
      <div className="flex-shrink-0 bg-base-100/90 backdrop-blur-md border-t border-base-300 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              className="textarea textarea-bordered w-full resize-none min-h-[2.5rem] max-h-32 pr-12 focus:border-primary transition-colors duration-200"
              value={input}
              placeholder="输入消息..."
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  sendMessage();
                } else if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
                  // Allow line break
                }
                // Auto-resize
                const target = e.target as HTMLTextAreaElement;
                setTimeout(() => {
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }, 0);
              }}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
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
                      onClick={sendPicture}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <i className="i-tabler-photo" />
                      图片/文件
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMessages([]);
                        toast.success('聊天记录已清空');
                      }}
                      className="flex items-center gap-2 text-error"
                    >
                      <i className="i-tabler-trash" />
                      清空聊天
                    </button>
                  </li>
                </ul>
              </details>
            )}

            <button
              type="button"
              className={`btn btn-circle transition-all duration-200 ${input.trim() && !isLoading && input.length <= 10000
                ? 'btn-primary shadow-lg hover:shadow-xl'
                : 'btn-disabled'
                }`}
              disabled={!input.trim() || isLoading || input.length > 10000}
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
    </div>
  );
}
