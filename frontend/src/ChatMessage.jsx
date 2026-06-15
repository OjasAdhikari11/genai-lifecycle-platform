export function ChatMessage({ message, isUser }) {
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {isUser ? '👤 You:' : '🤖 AI:'} {message}
      </div>
    </div>
  );
}
