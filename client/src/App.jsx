import { useState } from 'react';
import { useChat } from './hooks/useChat.js';
import { useTheme } from './hooks/useTheme.js';
import LearnPage from './pages/LearnPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ContentPage from './pages/ContentPage.jsx';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const chat = useChat();
  const [page, setPage] = useState('learn'); // 'learn', 'chat', or a content pageId

  if (page === 'learn') {
    return (
      <LearnPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenChat={() => setPage('chat')}
        onNavigate={(pageId) => setPage(pageId)}
      />
    );
  }

  if (page === 'chat') {
    return (
      <ChatPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onBack={() => setPage('learn')}
        chat={chat}
      />
    );
  }

  return (
    <ContentPage
      pageId={page}
      theme={theme}
      onToggleTheme={toggleTheme}
      onBack={() => setPage('learn')}
      onOpenChat={() => setPage('chat')}
      onNavigate={(pageId) => setPage(pageId)}
    />
  );
}
