import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Mic, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Hello! I'm your AI Diagnosis Assistant. 🛠️\nDescribe your home maintenance issue in voice or text (e.g., 'my kitchen sink is leaking').\nI'll diagnose the exact service, give pricing ranges, and find workers!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      
      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const originalInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/diagnose', {
        message: originalInput,
        history: messages
      });

      const data = response.data;

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.responseText,
        workers: data.suggestedWorkers || [],
        category: data.service,
        bookingCreated: data.bookingCreated,
        bookingDetails: data.bookingDetails
      }]);
    } catch (error) {
      console.error('AI Diagnosis Chat Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I failed to complete the diagnostic lookup. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all z-50 flex items-center justify-center border border-white/20 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden" style={{ height: '520px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-wide">AI Problem Diagnosis</h3>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Voice Enabled</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-sm ${
              msg.role === 'user' ? 'bg-primary text-white rounded-br-none shadow-md shadow-blue-100' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            
            {/* Suggested Workers UI */}
            {msg.workers && msg.workers.length > 0 && (
              <div className="mt-3 w-full max-w-[85%] space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">Top Matches Nearby</p>
                {msg.workers.map((worker) => (
                  <div key={worker._id} className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex justify-between items-center gap-3">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">{worker.userId?.name || 'Worker'}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Rating: {worker.rating || 4.7} ★ • ₹{worker.pricing?.amount || 500}/{worker.pricing?.type}</p>
                    </div>
                    <Link 
                      to="/book"
                      state={{ 
                        workerId: worker._id, 
                        workerName: worker.userId?.name || 'Verified Professional', 
                        price: worker.pricing?.amount || 500, 
                        category: msg.category || 'maid' 
                      }}
                      className="px-3 py-1.5 bg-primary text-white text-[10px] font-black rounded-lg shadow-md shadow-blue-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            )}
            
            {/* Booking Created UI */}
            {msg.bookingCreated && (
              <div className="mt-3 w-full max-w-[85%] bg-green-50 border border-green-200 p-3 rounded-2xl shadow-sm text-green-800">
                <p className="text-xs font-bold mb-1">✓ Booking Confirmed!</p>
                <p className="text-[10px]">Service: {msg.bookingDetails?.type}</p>
                <p className="text-[10px]">Date: {msg.bookingDetails?.date}</p>
                <p className="text-[10px]">Time: {msg.bookingDetails?.time}</p>
                <Link to="/dashboard" className="text-[10px] font-bold underline mt-1 block">View in Dashboard</Link>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
              <Loader className="animate-spin text-primary" size={18} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
        <button 
          type="button"
          onClick={startVoiceRecording}
          className={`p-2.5 rounded-xl border transition-colors ${
            isRecording ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
          }`}
          title="Voice Diagnosis"
        >
          <Mic size={18} />
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? "Listening..." : "Describe the problem..."}
          className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-primary focus:bg-white transition-all text-xs font-semibold"
          disabled={isLoading}
        />
        
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`p-2.5 rounded-xl transition-all ${
            input.trim() && !isLoading ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-md shadow-blue-100' : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

const Loader = ({ className, size }) => (
  <svg 
    className={`animate-spin ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default AIChatbox;
