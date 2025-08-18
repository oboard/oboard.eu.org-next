'use client';

import ChatContainer from '@/components/ChatContainer';
import ActionDropdown, { createClearAction, createFileUploadAction } from '@/components/ActionDropdown';
import { useChatLogic } from '@/hooks/useChatLogic';
import toast from 'react-hot-toast';
import { v7 as uuidv7 } from 'uuid';
import { MessageStatus } from '@/models/chat/message';

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
  const chatLogic = useChatLogic({
    storageKey: 'messages',
    apiEndpoint: '/api/chat',
    enableFileUpload: true,
  });

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,*/*';

    input.onchange = async () => {
      if (!input.files?.length || !chatLogic.checkUserIdAvalible()) return;

      const file = input.files[0];
      const isImage = file.type.startsWith('image');

      chatLogic.setIsLoading(true);
      try {
        const url = await upload(file);
        const msg = {
          id: uuidv7(),
          userId: chatLogic.userId,
          content: isImage ? `![${file.name}](${url})` : `[${file.name}](${url})`,
          time: new Date().getTime(),
          type: isImage ? 'image' : 'file',
          status: MessageStatus.Sending,
        };

        const newMessages = [...chatLogic.messages, msg];
        chatLogic.updateMessages(newMessages);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            userId: chatLogic.userId,
          }),
        });

        if (!response.ok) {
          throw new Error('发送失败');
        }

        const result = await response.json();
        if (result.messages) {
          chatLogic.updateMessages(result.messages);
        }
      } catch (error) {
        console.error('File upload error:', error);
        toast.error('文件上传失败');
      } finally {
        chatLogic.setIsLoading(false);
      }
    };

    input.click();
  };

  const actionDropdown = (
    <ActionDropdown
      actions={[
        createFileUploadAction(handleFileUpload),
        createClearAction(() => {
          chatLogic.clearMessages();
        })
      ]}
    />
  );

  return (
    <ChatContainer
      chatLogic={chatLogic}
      actionDropdown={actionDropdown}
      messageListProps={{
        emptyStateConfig: {
          title: '欢迎来到聊天室',
          description: '这里是一个实时聊天空间，您可以与其他用户进行交流，分享图片和文件。开始您的第一条消息吧！'
        },
        loadingConfig: {
          text: '发送中...',
          position: 'center'
        }
      }}
      chatInputProps={{
        placeholder: '输入消息...'
      }}
    />
  );
}
