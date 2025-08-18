import type React from 'react';

export interface ActionItem {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export interface ActionDropdownProps {
  actions: ActionItem[];
  disabled?: boolean;
  buttonClassName?: string;
  dropdownClassName?: string;
}
export default function ActionDropdown({
  actions,
  disabled = false,
  buttonClassName = '',
  dropdownClassName = ''
}: ActionDropdownProps) {
  if (actions.length === 0) return null;

  return (
    <div className="dropdown dropdown-end dropdown-top">
      <button
        tabIndex={0}
        role="button"
        className={`btn btn-circle btn-ghost ${buttonClassName}`}
        aria-disabled={disabled}
      >
        <i className="i-tabler-plus text-lg" />
      </button>
      <ul
        tabIndex={0}
        className={`dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 ${dropdownClassName}`}
      >
        {actions.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 ${action.className || ''}`}
            >
              <i className={action.icon} />
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
// 预定义的常用操作
export const createClearAction = (onClear: () => void): ActionItem => ({
  id: 'clear',
  label: '清空聊天',
  icon: 'i-tabler-trash',
  onClick: onClear,
  className: 'text-error'
});

export const createFileUploadAction = (onUpload: () => void, disabled = false): ActionItem => ({
  id: 'upload',
  label: '图片/文件',
  icon: 'i-tabler-photo',
  onClick: onUpload,
  disabled
});

export const createLongTextAction = (onLongText: () => void): ActionItem => ({
  id: 'longtext',
  label: '长文本输入',
  icon: 'i-tabler-file-text',
  onClick: onLongText
});