import { memo } from 'react';

export const ScrollToBottomBtn = memo(({ onClick, visible }) => (
  <button onClick={onClick}
    className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-200
      bg-white border border-outline-variant text-on-surface-variant rounded-full w-9 h-9
      flex items-center justify-center cursor-pointer shadow-lg
      hover:bg-surface-container-high hover:text-primary
      ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
  </button>
));
ScrollToBottomBtn.displayName = 'ScrollToBottomBtn';
