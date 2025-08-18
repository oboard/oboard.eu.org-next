import type React from 'react';
import { type ReactNode } from 'react';
import MessageList, { type MessageListProps } from '@/components/MessageList';
import ChatInput, { type ChatInputProps } from '@/components/ChatInput';
import { type UseChatLogicReturn } from '@/hooks/useChatLogic';

export interface ChatContainerProps {
  chatLogic: UseChatLogicReturn;
  className?: string;
  messageListProps?: Partial<MessageListProps>;
  chatInputProps?: Partial<ChatInputProps>;
  actionDropdown?: ReactNode;
  additionalContent?: ReactNode;
}

export default function ChatContainer({
  chatLogic,
  className = '',
  messageListProps = {},
  chatInputProps = {},
  actionDropdown,
  additionalContent
}: ChatContainerProps) {
  const {
    messages,
    input,
    following,
    isLoading,
    messagesContainerRef,
    setInput,
    setFollowing,
    sendMessage,
    toBottom,
    userId
  } = chatLogic;

  const defaultClassName = 'flex flex-col w-full h-screen bg-gradient-to-br from-base-100 to-base-200';
  const containerClassName = className || defaultClassName;

  return (
    <div className={containerClassName}>
      <MessageList
        messages={messages}
        userId={userId}
        isLoading={isLoading}
        following={following}
        messagesContainerRef={messagesContainerRef}
        onScrollToBottom={toBottom}
        setFollowing={setFollowing}
        {...messageListProps}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        actionDropdown={actionDropdown}
        {...chatInputProps}
      />

      {additionalContent}
    </div>
  );
}