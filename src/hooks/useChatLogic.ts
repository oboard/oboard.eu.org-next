import { useCallback, useEffect, useRef, useState } from 'react';
import { type MessageInfo, MessageStatus } from '@/models/chat/message';
import useLocalStorage from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { v7 as uuidv7 } from 'uuid';
import { useUserId } from '@/hooks/useUserId';

export interface UseChatLogicOptions {
  storageKey: string;
  apiEndpoint?: string;
  enableFileUpload?: boolean;
  enableStreaming?: boolean;
}

export interface UseChatLogicReturn {
  // State
  messages: MessageInfo[];
  input: string;
  following: boolean;
  isLoading: boolean;
  isConnected?: boolean;

  // Refs
  messagesContainerRef: React.RefObject<HTMLDivElement>;

  // Actions
  setInput: (value: string) => void;
  setFollowing: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  sendMessage: () => Promise<void>;
  clearMessages: () => void;
  toBottom: (quick?: boolean) => void;

  // Utils
  updateMessages: (newMessages: MessageInfo[]) => void;
  userId: string;
  checkUserIdAvalible: () => boolean;
}

export function useChatLogic(options: UseChatLogicOptions): UseChatLogicReturn {
  const { storageKey, apiEndpoint, enableFileUpload = false, enableStreaming = false } = options;

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { userId, checkUserIdAvalible } = useUserId();
  const [messages, setMessages] = useLocalStorage<MessageInfo[]>(storageKey, []);
  const [input, setInput] = useLocalStorage<string>('input', '');
  const [following, setFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const toBottom = useCallback(
    (quick?: boolean) => {
      if (!messagesContainerRef.current) return;
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: quick ? 'auto' : 'smooth',
      });
    },
    []
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

  const clearMessages = useCallback(() => {
    setMessages([]);
    toast.success('聊天记录已清空');
  }, [setMessages]);

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

    try {
      if (enableStreaming && apiEndpoint?.includes('gpt')) {
        // GPT streaming logic
        const robot_msg: MessageInfo = {
          id: uuidv7(),
          userId: 'robot',
          content: '',
          status: MessageStatus.Sending,
          time: new Date().getTime(),
        };

        const newMessages = [...messages, msg, robot_msg];
        updateMessages(newMessages);

        const res = await fetch(`${apiEndpoint}?prompt=${encodeURIComponent(currentInput)}&userId=${userId}`);
        const reader = res.body?.getReader();

        if (!reader) {
          throw new Error('无法获取响应流');
        }

        let data = '';
        const decoder = new TextDecoder();

        const processResult = (result: any): any => {
          if (result.value) {
            data += decoder.decode(result.value, { stream: true });
            robot_msg.content = data;
            updateMessages([...messages, msg, robot_msg]);
          }

          if (result.done) {
            robot_msg.status = MessageStatus.Sent;
            updateMessages([...messages, msg, robot_msg]);
            return;
          }
          return reader?.read().then(processResult);
        };

        await reader?.read().then(processResult);
      } else {
        // Regular chat logic
        const newMessages = [...messages, msg];
        updateMessages(newMessages);

        if (apiEndpoint) {
          await fetch(apiEndpoint, {
            method: 'POST',
            body: JSON.stringify([msg]),
            headers: { 'Content-Type': 'application/json' },
          });
        }

        msg.status = MessageStatus.Sent;
        updateMessages([...messages, msg]);
      }
    } catch (error) {
      console.error('发送失败:', error);
      toast.error('发送失败，请重试');
      setInput(currentInput);

      if (enableStreaming) {
        const robot_msg: MessageInfo = {
          id: uuidv7(),
          userId: 'robot',
          content: '发送失败，请重试',
          status: MessageStatus.Sent,
          time: new Date().getTime(),
        };
        updateMessages([...messages, msg, robot_msg]);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => toBottom(), 100);
    }
  }, [input, checkUserIdAvalible, isLoading, userId, messages, updateMessages, setInput, toBottom, apiEndpoint, enableStreaming]);

  // 监听消息容器的滚动事件
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setFollowing(isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);

    // 初始化时滚动到底部
    setTimeout(() => toBottom(true), 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [toBottom]);

  // 如果正在跟随，自动滚动到底部
  useEffect(() => {
    if (following) {
      setTimeout(() => toBottom(), 100);
    }
  }, [following, toBottom]);

  // 当消息更新时，如果正在跟随，自动滚动到底部
  useEffect(() => {
    if (following && messages.length > 0) {
      toBottom();
    }
  }, [toBottom, following, messages.length]);

  // 定期检查用户ID
  useEffect(() => {
    const timer = setInterval(() => {
      checkUserIdAvalible();
    }, 5000);
    return () => clearInterval(timer);
  }, [checkUserIdAvalible]);

  // 消息同步逻辑
  useEffect(() => {
    if (!apiEndpoint?.includes('gpt')) {
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
    }
  }, [checkUserIdAvalible, messages, following, toBottom, updateMessages, apiEndpoint?.includes]);

  return {
    // State
    messages,
    input,
    following,
    isLoading,
    isConnected,

    // Refs
    messagesContainerRef,

    // Actions
    setInput,
    setFollowing,
    setIsLoading,
    sendMessage,
    clearMessages,
    toBottom,

    // Utils
    updateMessages,
    userId,
    checkUserIdAvalible,
  };
}