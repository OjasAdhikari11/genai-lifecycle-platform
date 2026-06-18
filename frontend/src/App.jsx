import { useState, useEffect, useRef } from 'react'
import { chatAPI } from './api'
import { ChatMessage } from './ChatMessage'
import { Login } from './Login'
import { Signup } from './Signup'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'signup', 'chat'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [token, setToken] = useState(null)
  const messagesEndRef = useRef(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      setToken(storedToken)
      setCurrentPage('chat')
      checkConnection(storedToken)
    } else {
      setCurrentPage('login')
    }
  }, [])

  // Check API connection
  const checkConnection = async (authToken) => {
    const isHealthy = await chatAPI.checkHealth()
    setConnected(isHealthy)
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLoginSuccess = () => {
    const storedToken = localStorage.getItem('access_token')
    setToken(storedToken)
    setCurrentPage('chat')
    checkConnection(storedToken)
  }

  const handleSignupSuccess = () => {
    const storedToken = localStorage.getItem('access_token')
    setToken(storedToken)
    setCurrentPage('chat')
    checkConnection(storedToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    setToken(null)
    setMessages([])
    setCurrentPage('login')
  }

  const handleSwitchToSignup = () => {
    setCurrentPage('signup')
  }

  const handleSwitchToLogin = () => {
    setCurrentPage('login')
  }

  useEffect(() => {
    window.addEventListener('switchToSignup', handleSwitchToSignup)
    window.addEventListener('switchToLogin', handleSwitchToLogin)

    return () => {
      window.removeEventListener('switchToSignup', handleSwitchToSignup)
      window.removeEventListener('switchToLogin', handleSwitchToLogin)
    }
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!input.trim() || !connected || !token) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }])
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage(userMessage, token)
      setMessages((prev) => [...prev, { text: response, isUser: false }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: ${error.message}`,
          isUser: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Render Login Page
  if (currentPage === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Render Signup Page
  if (currentPage === 'signup') {
    return <Signup onSignupSuccess={handleSignupSuccess} />
  }

  // Render Chat Page
  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>GenAI Chat</h1>
          <span className="author">by Ojas Adhikari</span>
        </div>
        <div className="header-right">
          <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
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
