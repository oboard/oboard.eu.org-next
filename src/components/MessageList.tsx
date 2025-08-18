import type React from 'react';
import { type MessageInfo } from '@/models/chat/message';
import ChatBubble from '@/components/ChatBubble';

export interface MessageListProps {
  messages: MessageInfo[];
  userId: string;
  isLoading: boolean;
  following: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  onScrollToBottom: () => void;
  setFollowing: (value: boolean) => void;
  emptyStateConfig?: {
    icon?: string;
    title?: string;
    description?: string;
  };
  loadingConfig?: {
    text?: string;
    position?: 'center' | 'start';
  };
}

const defaultEmptyState = {
  icon: 'i-tabler-message-circle',
  title: '开始对话',
  description: '发送您的第一条消息开始对话吧！'
};

const defaultLoadingConfig = {
  text: '发送中...',
  position: 'center' as const
};

export default function MessageList({
  messages,
  userId,
  isLoading,
  following,
  messagesContainerRef,
  onScrollToBottom,
  setFollowing,
  emptyStateConfig = defaultEmptyState,
  loadingConfig = defaultLoadingConfig
}: MessageListProps) {
  const emptyState = { ...defaultEmptyState, ...emptyStateConfig };
  const loading = { ...defaultLoadingConfig, ...loadingConfig };

  return (
    <div className="flex-1 overflow-hidden relative">
      <div ref={messagesContainerRef} className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                <i className={`${emptyState.icon} text-2xl text-primary`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{emptyState.title}</h3>
              <p className="text-base-content/60 max-w-md">
                {emptyState.description}
              </p>
            </div>
          ) : (
            messages.map((item: MessageInfo) => (
              <ChatBubble key={item.id} message={item} isCurrentUser={item.userId === userId} />
            ))
          )}
          {isLoading && (
            <div className={`flex ${loading.position === 'center' ? 'justify-center' : 'justify-start'}`}>
              <div className="bg-base-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  {loading.position === 'start' ? (
                    <>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-base-content/60">AI正在思考...</span>
                    </>
                  ) : (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      <span className="text-sm text-base-content/60">{loading.text}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {!following && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            type="button"
            className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => {
              setFollowing(true);
              onScrollToBottom();
            }}
          >
            <i className="i-tabler-arrow-down text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}