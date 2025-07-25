import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Chatbot = () => {
  const { token, backendurl, userdata } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Append user's message
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = input;
    setInput('');
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(
        `${backendurl}/api/investment/chat`,
        { query: currentQuery, profile: userdata },
        config
      );
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = {
        sender: 'bot',
        text: 'Sorry, there was an error processing your request.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Investment Advisor</h1>
      <div
        className="w-full max-w-md bg-white p-4 rounded shadow mb-4 overflow-y-auto"
        style={{ height: '400px' }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded ${
                msg.sender === 'user' ? 'bg-blue-200' : 'bg-green-200'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500">Typing...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="w-full max-w-md flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;