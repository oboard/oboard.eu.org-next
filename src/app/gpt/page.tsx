'use client';

import ChatContainer from '@/components/ChatContainer';
import ActionDropdown, { createClearAction, createLongTextAction } from '@/components/ActionDropdown';
import { useChatLogic } from '@/hooks/useChatLogic';

export default function GPTChatPage() {
  const chatLogic = useChatLogic({
    storageKey: 'gpt_messages',
    apiEndpoint: '/api/gpt',
    enableStreaming: true
  });

  const { setInput } = chatLogic;

  const handleLongTextModal = () => {
    (document?.getElementById('long_text_modal') as HTMLDialogElement)?.showModal();
  };

  const actionDropdown = (
    <ActionDropdown
      actions={[
        createLongTextAction(handleLongTextModal),
        createClearAction(chatLogic.clearMessages)
      ]}
    />
  );

  return (
    <>
      <ChatContainer
        chatLogic={chatLogic}
        actionDropdown={actionDropdown}
        messageListProps={{
          emptyStateConfig: {
            title: '开始对话',
            description: '我是您的AI助手，可以帮您解答问题、提供建议或进行创意讨论。请输入您的问题开始对话。'
          },
          loadingConfig: {
            text: 'AI正在思考...',
            position: 'start'
          }
        }}
        chatInputProps={{
          placeholder: '输入您的问题...'
        }}
      />

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
            value={chatLogic.input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!chatLogic.input.trim()}
                onClick={() => {
                  chatLogic.sendMessage();
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
    </>
  );
}
