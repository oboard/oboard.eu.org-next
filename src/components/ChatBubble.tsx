'use client';
import { type MessageInfo } from '@/models/chat/message';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useCrossbellCharacter } from '@/hooks/useCrossbellCharacter';
import Image from 'next/image';
import { getCrossbellImageUrl } from '@/utils/crossbell';

const CodeBlock = ({
  language,
  children,
}: {
  language: string | undefined;
  children: string;
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

// uuid作为种子，生成随机数，然后取1-7数字，作为颜色
function genColor(uuid: string) {
  if (uuid === undefined || uuid === null || uuid.length < 5) {
    return '';
  }
  const seed = Number.parseInt(uuid.replace(/-/g, '').slice(0, 8), 16);
  const colors = [
    'chat-bubble-primary',
    'chat-bubble-secondary',
    'chat-bubble-neutral',
    'chat-bubble-success',
    'chat-bubble-warning',
    'chat-bubble-error',
  ];
  const color = colors[seed % 7];
  return color;
}

// 通过时间戳获取时间，如果时间不是很久，就显示多久之前，否则显示具体时间
function getTime(time: number | undefined) {
  if (time === undefined) return '发送中';
  const now = new Date().getTime();
  const diff = now - time;
  if (diff < 1000 * 60) {
    return '刚刚';
  }
  if (diff < 1000 * 60 * 60) {
    return `${Math.floor(diff / (1000 * 60))}分钟前`;
  }
  if (diff < 1000 * 60 * 60 * 24) {
    return `${Math.floor(diff / (1000 * 60 * 60))}小时前`;
  }
  return new Date(time).toLocaleString();
}

interface ChatBubbleProps {
  message: MessageInfo;
  isCurrentUser: boolean;
}

export default function ChatBubble({ message, isCurrentUser }: ChatBubbleProps) {
  const character = useCrossbellCharacter(message.userId);

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      {character && (
        <Image
          className="chat-image w-10 avatar rounded-full"
          src={getCrossbellImageUrl(character?.metadata?.content?.avatars?.[0])}
          alt="avatar"
          width={40}
          height={40}
        />
      )}
      <div className="chat-header">
        <time className="text-xs opacity-50 ml-2">{getTime(message.time)}</time>
        {character?.metadata?.content?.name ?? ''}
      </div>
      <div
        className={`animate-duration-500 animate-ease-out chat-bubble ${genColor(
          message.userId
        )} animate-fade-in-${isCurrentUser ? 'right' : 'left'}${
          message.type === 'image' ? ' max-w-sm' : ''
        }`}
      >
        <ReactMarkdown
          components={{
            img: ({ node, ...props }) => (
              <button
                type="button"
                className="gap-1 flex flex-row items-center link link-hover"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(props.src);
                  }
                }}
              >
                <i className="i-tabler-photo" />
                查看图片
              </button>
            ),
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
              ) : (
                <CodeBlock language={'js'}>{String(children).replace(/\n$/, '')}</CodeBlock>
              );
            },
            a: ({ node, className, children, ...props }) => {
              return (
                <div className="flex flex-row gap-1 items-center">
                  <svg
                    role="img"
                    aria-label="链接"
                    className={`${
                      isCurrentUser ? 'text-primary-content' : 'text-base-content'
                    } fill-current`}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path d="M573.44 640a187.68 187.68 0 0 1-132.8-55.36L416 560l45.28-45.28 24.64 24.64a124.32 124.32 0 0 0 170.08 5.76l1.44-1.28a49.44 49.44 0 0 0 4-3.84l101.28-101.28a124.16 124.16 0 0 0 0-176l-1.92-1.92a124.16 124.16 0 0 0-176 0l-51.68 51.68a49.44 49.44 0 0 0-3.84 4l-20 24.96-49.92-40L480 276.32a108.16 108.16 0 0 1 8.64-9.28l51.68-51.68a188.16 188.16 0 0 1 266.72 0l1.92 1.92a188.16 188.16 0 0 1 0 266.72l-101.28 101.28a112 112 0 0 1-8.48 7.84 190.24 190.24 0 0 1-125.28 48z" />
                    <path d="M350.72 864a187.36 187.36 0 0 1-133.28-55.36l-1.92-1.92a188.16 188.16 0 0 1 0-266.72l101.28-101.28a112 112 0 0 1 8.48-7.84 188.32 188.32 0 0 1 258.08 7.84L608 464l-45.28 45.28-24.64-24.64A124.32 124.32 0 0 0 368 478.88l-1.44 1.28a49.44 49.44 0 0 0-4 3.84l-101.28 101.28a124.16 124.16 0 0 0 0 176l1.92 1.92a124.16 124.16 0 0 0 176 0l51.68-51.68a49.44 49.44 0 0 0 3.84-4l20-24.96 50.08 40-20.8 25.12a108.16 108.16 0 0 1-8.64 9.28l-51.68 51.68A187.36 187.36 0 0 1 350.72 864z" />
                  </svg>
                  <a
                    className="link-hover"
                    target="_blank"
                    download={message.content.indexOf('api/chat/file') > 0 && children}
                    {...props}
                  >
                    {children}
                  </a>
                </div>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
