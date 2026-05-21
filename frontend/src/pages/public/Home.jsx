import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mic, Search, MessageSquare } from 'lucide-react';
import { serviceCatalog } from '../../config/serviceCatalog';
import AIChatbox from '../../components/AIChatbox';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsRecording(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsRecording(false);
        // Automatically search after voice input
        navigate(`/search?q=${transcript}`);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => setIsRecording(false);
      
      recognition.start();
    } else {
      alert("Your browser doesn't support speech recognition.");
    }
  };

  const categories = serviceCatalog.map((s) => ({ id: s.id, icon: s.icon, label: s.label }));



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 pt-20">
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            {t('welcome')}
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Instant access to verified professionals for all your home service needs. Book instantly or use our AI assistant.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto flex items-center bg-white rounded-full shadow-lg p-2 transition-all hover:shadow-xl border border-gray-100">
          <div className="pl-4 text-gray-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('search_placeholder')} 
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 text-lg"
          />
          <button 
            onClick={startVoiceSearch}
            className={`p-3 rounded-full mr-2 transition-colors ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={t('voice_search')}
          >
            <Mic size={24} />
          </button>
          <button 
            onClick={handleSearch}
            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/search?category=${cat.id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 flex flex-col items-center justify-center gap-3 hover:-translate-y-1"
            >
              <div className="text-4xl">{cat.icon}</div>
              <span className="font-semibold text-gray-700">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbox />
    </div>
  );
};

export default Home;
