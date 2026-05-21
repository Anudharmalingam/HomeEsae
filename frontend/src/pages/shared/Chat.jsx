import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId, content: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 bg-primary text-white flex justify-between items-center">
        <div>
          <h2 className="font-bold text-xl">Chat</h2>
          <p className="text-xs opacity-80">Booking #{bookingId.slice(-6)}</p>
        </div>
        <button onClick={() => navigate(-1)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
           ✕
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet. Send a greeting!</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`flex flex-col ${msg.sender?._id === user.id ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                  msg.sender?._id === user.id 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1 uppercase font-bold tracking-tighter">
                {msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..." 
          className="flex-1 px-6 py-3 bg-gray-50 rounded-full border-none outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
        />
        <button 
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
