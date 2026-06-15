import { useState, useEffect, useRef } from 'react'
import { chatAPI } from './api'
import { ChatMessage } from './ChatMessage'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef(null)

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const isHealthy = await chatAPI.checkHealth()
      setConnected(isHealthy)
    }
    checkConnection()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || !connected) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage(userMessage)
      setMessages(prev => [...prev, { text: response, isUser: false }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}`, 
        isUser: false 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>GenAI Chat</h1>
          <span className="author">by Ojas Adhikari</span>
        </div>
        <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>Welcome to GenAI Chat!</h2>
            <p>Ask me anything and I'll help you.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
        ))}
        {loading && (
          <div className="message bot-message">
            <div className="message-content">🤖 AI: Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          disabled={loading || !connected}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={loading || !connected || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default App
