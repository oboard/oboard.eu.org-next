import type React from 'react';
import { type ReactNode } from 'react';

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  actionDropdown?: ReactNode;
  showHint?: boolean;
  hintText?: string;
}

const defaultProps = {
  placeholder: '输入消息...',
  maxLength: 10000,
  disabled: false,
  showHint: true,
  hintText: '按 Enter 发送，Shift + Enter 换行'
};

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  isLoading,
  placeholder = defaultProps.placeholder,
  maxLength = defaultProps.maxLength,
  disabled = defaultProps.disabled,
  actionDropdown,
  showHint = defaultProps.showHint,
  hintText = defaultProps.hintText
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSendMessage();
    } else if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
      // Allow line break
    }
    
    // Auto-resize
    const target = e.target as HTMLTextAreaElement;
    setTimeout(() => {
      target.style.height = 'auto';
      target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  const canSend = input.trim() && !isLoading && input.length <= maxLength && !disabled;

  return (
    <div className="flex-shrink-0 bg-base-100/90 backdrop-blur-md border-t border-base-300 p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            rows={1}
            className="textarea textarea-bordered w-full resize-none min-h-[2.5rem] max-h-32 pr-12 focus:border-primary transition-colors duration-200"
            value={input}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2">
          {!input && actionDropdown}

          <button
            type="button"
            className={`btn btn-circle transition-all duration-200 ${
              canSend
                ? 'btn-primary shadow-lg hover:shadow-xl'
                : 'btn-disabled'
            }`}
            disabled={!canSend}
            onClick={onSendMessage}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <i className="i-tabler-send text-lg" />
            )}
          </button>
        </div>
      </div>

      {showHint && (
        <div className="text-center mt-2">
          <p className="text-xs text-base-content/40">
            {hintText}
          </p>
        </div>
      )}
    </div>
  );
}