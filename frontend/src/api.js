// API configuration and helper functions
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const chatAPI = {
  async sendMessage(question, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get response from API');
      }

      const data = await response.json();
      return data.answer;
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
